export class MailSendFailedError extends Error {
  constructor(cause: unknown) {
    super('Failed to send email.')
    this.name = 'MailSendFailedError'
    this.cause = cause
  }
}
