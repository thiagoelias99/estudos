import { Injectable } from '@nestjs/common'
import { PrismaService } from "./prisma/prisma.service"

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  login({ userName }: { userName: string }): string {

    const user = this.prisma.user.findUnique({
      where: { userName }
    })

    if (!user) {
      this.prisma.user.create({
        data: { userName }
      })
    }

    // Criar um token JWT para o usuário somente para fins de demonstração, sem segurança real
    const token = Buffer.from(userName).toString('base64')
    return token
  }

  async registerDevice({ userName, token, platform }: { userName: string, token: string, platform: string }): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { userName }
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Verificar se o dispositivo já está registrado para o usuário
    const existingDevice = await this.prisma.devices.findUnique({
      where: { token }
    })

    if (existingDevice) {
      return "Device already registered"
    }

    await this.prisma.devices.create({
      data: {
        userId: user.id,
        token,
        platform
      }
    })

    return "Device registered successfully"
  }
}
