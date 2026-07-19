import type { AppSetting } from '@app/database'

export abstract class SettingRepository {
  abstract findAll(): Promise<AppSetting[]>
  abstract findByKeys(keys: string[]): Promise<AppSetting[]>
  abstract updateValue(key: string, value: string): Promise<void>
}
