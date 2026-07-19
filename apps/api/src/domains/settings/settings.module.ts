import { Module } from '@nestjs/common'
import { SettingRepository } from './repository/setting.repository'
import { ListSettingsUseCase } from './use-cases/list-settings.use-case'
import { UpdateSettingsUseCase } from './use-cases/update-settings.use-case'
import { PrismaSettingRepository } from '@/infrastructure/database/prisma-setting.repository'
import { SettingsController } from '@/presentations/admin/settings.controller'

@Module({
  controllers: [SettingsController],
  providers: [
    { provide: SettingRepository, useClass: PrismaSettingRepository },
    ListSettingsUseCase,
    UpdateSettingsUseCase,
  ],
})
export class SettingsModule {}
