import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { ConfigService } from "@nestjs/config"
import * as admin from 'firebase-admin'
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class NotificationsService implements OnModuleInit {

  private readonly logger = new Logger(NotificationsService.name)
  private readonly serviceAccount: string

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.serviceAccount = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_B64') || ''
  }

  onModuleInit() {
    const serviceAccount = JSON.parse(
      Buffer.from(this.serviceAccount, 'base64').toString('utf8'),
    )

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }

  // 🔔 envio unitário com tratamento
  async sendPush(token: string, title: string, body: string) {
    try {
      const response = await admin.messaging().send({
        token,
        notification: { title, body },
        data: { test: '123' },
      })

      return { success: true, response }

    } catch (error: any) {
      this.logger.error(`Erro ao enviar push: ${error.code}`)

      // 🔥 remove token inválido
      if (this.isInvalidToken(error.code)) {
        await this.removeToken(token)
      }

      return { success: false }
    }
  }

  // 📢 broadcast
  async broadcastPush(title: string, body: string) {
    const allDevices = await this.prisma.devices.findMany({
      select: { token: true }
    })

    const tokens = allDevices.map(d => d.token)

    const chunks = this.chunkArray(tokens, 500) // 🔥 limite FCM

    for (const chunk of chunks) {
      const response = await admin.messaging().sendEachForMulticast({
        tokens: chunk,
        notification: { title, body },
        data: { test: '123' },
      })

      await this.handleErrors(chunk, response)
    }
  }

  // 🧠 tratamento de erros em lote
  private async handleErrors(tokens: string[], response: admin.messaging.BatchResponse) {
    const tokensToRemove: string[] = []

    response.responses.forEach((resp, index) => {
      if (!resp.success) {
        const error = resp.error

        this.logger.error(
          `Erro token ${tokens[index]}: ${error?.code}`
        )

        if (this.isInvalidToken(error?.code)) {
          tokensToRemove.push(tokens[index])
        }
      }
    })

    if (tokensToRemove.length) {
      this.logger.warn(`Removendo ${tokensToRemove.length} tokens inválidos`)

      await this.prisma.devices.deleteMany({
        where: {
          token: {
            in: tokensToRemove,
          },
        },
      })
    }
  }

  // 🔍 centraliza validação de erro
  private isInvalidToken(code?: string) {
    return (
      code === 'messaging/registration-token-not-registered' ||
      code === 'messaging/invalid-registration-token'
    )
  }

  private async removeToken(token: string) {
    await this.prisma.devices.deleteMany({
      where: { token }
    })
  }

  private chunkArray(array: string[], size: number) {
    const result: string[][] = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }
}