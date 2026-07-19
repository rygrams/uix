import { DomainError } from '@/shared/errors/domain.error'

export class UnknownSettingError extends DomainError {
  readonly code = 'SETTING_UNKNOWN'

  constructor(keys: string[]) {
    super(`Unknown setting key(s): ${keys.join(', ')}`)
  }
}

export class InvalidSettingValueError extends DomainError {
  readonly code = 'SETTING_INVALID_VALUE'

  constructor(key: string, pattern: string) {
    super(`Invalid value for "${key}" (expected ${pattern})`)
  }
}
