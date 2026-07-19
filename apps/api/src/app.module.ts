import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { validateEnv } from './shared/config/env'
import { PrismaModule } from './infrastructure/database/prisma.module'
import { MailModule } from './infrastructure/mail/mail.module'
import { AuthModule } from './infrastructure/auth/auth.module'
import { StorageModule } from './infrastructure/storage/storage.module'
import { SettingsModule } from './domains/settings/settings.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    StorageModule,
    PrismaModule,
    MailModule,
    AuthModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
