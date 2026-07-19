import { Injectable } from '@nestjs/common'
import { SettingRepository } from '../repository/setting.repository'
import { toSettingView } from '../mappers/setting.mapper'
import type { SettingView } from '../types/setting.types'

@Injectable()
export class ListSettingsUseCase {
  constructor(private readonly settings: SettingRepository) {}

  async execute(): Promise<SettingView[]> {
    const settings = await this.settings.findAll()
    return settings.map(toSettingView)
  }
}
