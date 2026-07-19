import type { AppSetting } from '@app/database'
import type { SettingView } from '../types/setting.types'

export function toSettingView(setting: AppSetting): SettingView {
  const isSet = setting.value !== ''

  return {
    category: setting.category,
    key: setting.key,
    secret: setting.secret,
    pattern: setting.pattern,
    isSet,
    value: setting.secret ? '' : setting.value,
  }
}
