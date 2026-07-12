import { Module } from '@nestjs/common'
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth'
import { createAuth, type AuthMailer } from '@app/auth'
import { WelcomeEmail, ResetPasswordEmail, renderEmail } from '@app/email-templates'
import { PrismaService } from '@/infrastructure/database/prisma.service'
import { MailService } from '@/infrastructure/mail/mail.service'

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      isGlobal: true,
      inject: [PrismaService, MailService],
      useFactory: (prisma: PrismaService, mailService: MailService) => {
        const mailer: AuthMailer = {
          sendVerificationEmail: async ({ email, name, url }) => {
            const { html, text } = await renderEmail(WelcomeEmail, {
              name,
              verifyUrl: url,
            })
            await mailService.send({
              to: email,
              subject: 'Confirmez votre adresse e-mail',
              html,
              text,
            })
          },
          sendResetPassword: async ({ email, name, url }) => {
            const { html, text } = await renderEmail(ResetPasswordEmail, {
              name,
              resetUrl: url,
            })
            await mailService.send({
              to: email,
              subject: 'Réinitialisez votre mot de passe',
              html,
              text,
            })
          },
        }

        return { auth: createAuth(prisma, mailer) }
      },
    }),
  ],
})
export class AuthModule {}
