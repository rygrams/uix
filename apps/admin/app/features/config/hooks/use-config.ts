import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from '@app/i18n'
import { ApiError } from '../../../lib/api'
import { getSettings, updateSettings } from '../servers/config.service'
import { toSettingGroups } from '../mappers/setting.mapper'
import type { SettingGroupView } from '../config.types'

type Status = 'idle' | 'loading' | 'ready' | 'error'

export function useConfig() {
  const { t } = useTranslation()
  const [groups, setGroups] = useState<SettingGroupView[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      setGroups(toSettingGroups(await getSettings()))
      setStatus('ready')
    } catch {
      setError(t('config.loadError'))
      setStatus('error')
    }
  }, [t])

  useEffect(() => {
    void load()
  }, [load])

  const save = useCallback(async (updates: { key: string; value: string }[]) => {
    setIsSaving(true)
    setError(null)
    try {
      setGroups(toSettingGroups(await updateSettings(updates)))
      setSavedAt(Date.now())
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('config.saveError'))
    } finally {
      setIsSaving(false)
    }
  }, [t])

  return { groups, status, error, isSaving, savedAt, save, reload: load }
}
