import { Injectable } from '@nestjs/common'
import { encryptSecret } from '@app/database'
import { SettingRepository } from '../repository/setting.repository'
import {
  InvalidSettingValueError,
  UnknownSettingError,
} from '../errors/setting.errors'
import { updateSettingsSchema } from '../validators/settings.validator'
import type { SettingUpdate } from '../types/setting.types'

@Injectable()
export class UpdateSettingsUseCase {
  constructor(private readonly settings: SettingRepository) {}

  async execute(input: unknown): Promise<void> {
    const { updates } = updateSettingsSchema.parse(input)

    const existing = await this.settings.findByKeys(updates.map((u) => u.key))
    const byKey = new Map(existing.map((setting) => [setting.key, setting]))

    const unknown = updates.filter((u) => !byKey.has(u.key)).map((u) => u.key)
    if (unknown.length > 0) {
      throw new UnknownSettingError(unknown)
    }

    const toPersist: SettingUpdate[] = []

    for (const update of updates) {
      const setting = byKey.get(update.key)!

      // A blank secret means "keep the stored value unchanged" (the UI masks it).
      if (setting.secret && update.value === '') {
        continue
      }

      if (
        setting.pattern &&
        update.value !== '' &&
        !new RegExp(setting.pattern).test(update.value)
      ) {
        throw new InvalidSettingValueError(update.key, setting.pattern)
      }

      const value =
        setting.secret && update.value !== ''
          ? encryptSecret(update.value)
          : update.value

      toPersist.push({ key: update.key, value })
    }

    for (const { key, value } of toPersist) {
      await this.settings.updateValue(key, value)
    }
  }
}
