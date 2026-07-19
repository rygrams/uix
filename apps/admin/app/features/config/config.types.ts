export type SettingCategory = 'MAIL' | 'STORAGE' | 'LLM' | 'VECTOR'

export type SettingDto = {
  category: SettingCategory
  key: string
  secret: boolean
  pattern: string | null
  value: string
  isSet: boolean
}

export type SettingFieldKind = 'text' | 'password' | 'boolean'

export type SettingFieldView = {
  key: string
  label: string
  kind: SettingFieldKind
  value: string
  isSet: boolean
  secret: boolean
  pattern: string | null
}

export type SettingGroupView = {
  category: SettingCategory
  fields: SettingFieldView[]
}
