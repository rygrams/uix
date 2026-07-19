import type { SettingCategory } from '@app/database'

export type SettingView = {
  category: SettingCategory
  key: string
  secret: boolean
  pattern: string | null
  value: string
  isSet: boolean
}

export type SettingUpdate = {
  key: string
  value: string
}
