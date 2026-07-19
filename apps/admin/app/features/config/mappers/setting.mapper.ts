import { BOOLEAN_PATTERN, CATEGORY_ORDER } from '../config.const'
import type {
  SettingDto,
  SettingFieldKind,
  SettingFieldView,
  SettingGroupView,
} from '../config.types'

function fieldKind(setting: SettingDto): SettingFieldKind {
  if (setting.secret) return 'password'
  if (setting.pattern === BOOLEAN_PATTERN) return 'boolean'
  return 'text'
}

function fieldLabel(key: string): string {
  return key
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}

function toFieldView(setting: SettingDto): SettingFieldView {
  return {
    key: setting.key,
    label: fieldLabel(setting.key),
    kind: fieldKind(setting),
    value: setting.value,
    isSet: setting.isSet,
    secret: setting.secret,
    pattern: setting.pattern,
  }
}

export function toSettingGroups(settings: SettingDto[]): SettingGroupView[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    fields: settings
      .filter((setting) => setting.category === category)
      .map(toFieldView),
  })).filter((group) => group.fields.length > 0)
}
