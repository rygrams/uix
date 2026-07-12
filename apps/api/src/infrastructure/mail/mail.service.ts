import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport, type Transporter } from 'nodemailer'
import { MailSendFailedError } from './mail.errors'
import type { SendMailPayload } from './mail.types'
import type { Env } from '@/shared/config/env'

@Injectable()
export class MailService {
  private readonly transporter: Transporter
  private readonly fromAddress: string

  constructor(private readonly config: ConfigService<Env, true>) {
    const host = config.get('MAIL_HOST', { infer: true })
    const port = config.get('MAIL_PORT', { infer: true })
    const secure = config.get('MAIL_SECURE', { infer: true })
    const user = config.get('MAIL_USER', { infer: true })
    const pass = config.get('MAIL_PASSWORD', { infer: true })
    const fromName = config.get('MAIL_FROM_NAME', { infer: true })
    const fromEmail = config.get('MAIL_FROM_EMAIL', { infer: true })

    const auth = user && pass ? { user, pass } : undefined
    this.transporter = createTransport({ host, port, secure, auth })
    this.fromAddress = `"${fromName}" <${fromEmail}>`
  }

  async send(payload: SendMailPayload): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      })
    } catch (error) {
      throw new MailSendFailedError(error)
    }
  }
}
