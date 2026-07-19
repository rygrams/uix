import { apiFetch } from '../../../lib/api'
import type { SettingDto } from '../config.types'

type SettingsResponse = { settings: SettingDto[] }

export function getSettings(): Promise<SettingDto[]> {
  return apiFetch<SettingsResponse>('/admin/settings').then((r) => r.settings)
}

export function updateSettings(
  updates: { key: string; value: string }[],
): Promise<SettingDto[]> {
  return apiFetch<SettingsResponse>('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify({ updates }),
  }).then((r) => r.settings)
}
