import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from "@nestjs/config"
import * as admin from 'firebase-admin'

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.serviceAccount = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_B64') || ''
  }

  private readonly serviceAccount: string

  onModuleInit() {
    const serviceAccount: string = JSON.parse(
      Buffer.from(
        this.serviceAccount,
        'base64',
      ).toString('utf8'),
    )

    console.log('serviceAccount', serviceAccount)

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }

  async sendPush(token: string, title: string, body: string) {
    const response = await admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
      data: {
        test: '123',
      },
    })

    console.log('Push notification response', response)
    return { success: true }
  }
}