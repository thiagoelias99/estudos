import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) { }

  @Post('send')
  @HttpCode(200)
  async send(@Body() body: any) {
    const { token, title, message } = body

    console.log('Sending notification', { token, title, message })

    return this.service.sendPush(token, title, message)
  }

  @Post('save-token')
  @HttpCode(200)
  saveToken(@Body() body: any) {
    console.log('Saving token', body)

    return { success: true }
  }

  @Post('broadcast')
  @HttpCode(200)
  async broadcast(@Body() body: any) {
    const { title, message } = body

    console.log('Broadcasting notification', { title, message })

    return this.service.broadcastPush(title, message)
  }
}