import { BadRequestException, Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() body: { userName: string }
  ) {
    if (!body.userName) {
      throw new BadRequestException("userName is required")
    }

    const token = await this.appService.login(body)

    return { token }
  }

  @Post("register-device")
  @HttpCode(200)
  registerDevice(
    @Body() body: { userName: string, token: string, platform: string }
  ) {
    if (!body.userName || !body.token || !body.platform) {
      throw new BadRequestException("userName, token, and platform are required")
    }

    return this.appService.registerDevice(body)
  }
}
