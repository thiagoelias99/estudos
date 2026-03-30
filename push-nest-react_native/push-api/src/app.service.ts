import { Injectable } from '@nestjs/common'
import { PrismaService } from "./prisma/prisma.service"

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  async login({ userName }: { userName: string }): Promise<string> {

    console.log("Login attempt for user:", userName)

    const user = await this.prisma.user.findUnique({
      where: { userName }
    })

    console.log("User found in database:", user)

    if (!user) {
      console.log("User not found, creating new user:", userName)
      await this.prisma.user.create({
        data: { userName }
      })
    }

    // Criar um token JWT para o usuário somente para fins de demonstração, sem segurança real
    const token = Buffer.from(userName).toString('base64')

    console.log("Generated token for user:", token)

    return token
  }

  async registerDevice({ userName, token, platform }: { userName: string, token: string, platform: string }): Promise<string> {
    console.log("Registering device for user:", userName, "with token:", token, "and platform:", platform)

    // username precisa ser decodificado do token para encontrar o usuário correto
    const decodedUserName = Buffer.from(userName, 'base64').toString('utf-8')

    const user = await this.prisma.user.findUnique({
      where: { userName: decodedUserName }
    })

    if (!user) {
      throw new Error("User not found")
    }

    const existingToken = await this.prisma.devices.findUnique({
      where: { token }
    })

    if (existingToken) {
      // Atualiza usuário e plataforma do token existente
      await this.prisma.devices.update({
        where: { token },
        data: {
          userId: user.id,
          platform
        }
      })

      console.log("Device token updated for user:", decodedUserName)
      return "Device token updated successfully"
    }

    await this.prisma.devices.create({
      data: {
        userId: user.id,
        token,
        platform
      }
    })

    console.log("Device registered successfully for user:", decodedUserName)

    return "Device registered successfully"
  }

  async getUserDevices(userId: string) {
    return this.prisma.devices.findMany({
      where: { userId }
    })
  }

  async removeDevice(token: string) {
    await this.prisma.devices.delete({
      where: { token }
    })

    console.log("Device removed successfully for token:", token)

    return "Device removed successfully"
  }
}
