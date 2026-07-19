import type { SettingCategory } from './config.types'

export const BOOLEAN_PATTERN = '^(true|false)$'

export const CATEGORY_ORDER: SettingCategory[] = [
  'MAIL',
  'STORAGE',
  'LLM',
  'VECTOR',
]
