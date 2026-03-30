import { Body, Controller, Post } from '@nestjs/common'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) { }

  @Post('send')
  async send(@Body() body: any) {
    const { token, title, message } = body

    console.log('Sending notification', { token, title, message })

    return this.service.sendPush(token, title, message)
  }

  @Post('save-token')
  saveToken(@Body() body: any) {
    console.log('Saving token', body)

    return { success: true }
  }
}