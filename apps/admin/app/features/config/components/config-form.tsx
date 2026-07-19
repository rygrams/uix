import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, Spinner } from '@heroui/react'
import { useTranslation } from '@app/i18n'
import { SettingField } from './setting-field'
import { ActionButton } from '../../../shared/components/action-button'
import type { SettingGroupView } from '../config.types'

type Props = {
  groups: SettingGroupView[]
  isSaving: boolean
  savedAt: number | null
  error: string | null
  onSave: (updates: { key: string; value: string }[]) => void
}

function initValues(groups: SettingGroupView[]): Record<string, string> {
  const values: Record<string, string> = {}
  for (const group of groups) {
    for (const field of group.fields) {
      if (field.secret) {
        values[field.key] = ''
      } else if (field.kind === 'boolean') {
        values[field.key] = field.value || 'false'
      } else {
        values[field.key] = field.value
      }
    }
  }
  return values
}

export function ConfigForm({ groups, isSaving, savedAt, error, onSave }: Props) {
  const { t } = useTranslation()
  const initial = useMemo(() => initValues(groups), [groups])
  const [values, setValues] = useState<Record<string, string>>(initial)

  useEffect(() => setValues(initial), [initial])

  function onChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const updates = groups.flatMap((group) =>
      group.fields.map((field) => ({
        key: field.key,
        value: values[field.key] ?? '',
      })),
    )
    onSave(updates)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {error ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      {savedAt ? (
        <Alert status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{t('config.saved')}</Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}

      {groups.map((group) => (
        <Card key={group.category}>
          <Card.Header>
            <Card.Title>{t(`config.categories.${group.category}`)}</Card.Title>
            <Card.Description>{t('config.encryptionNote')}</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-5">
            {group.fields.map((field) => (
              <SettingField
                key={field.key}
                field={field}
                value={values[field.key] ?? ''}
                onChange={onChange}
              />
            ))}
          </Card.Content>
        </Card>
      ))}

      <div className="flex justify-end">
        <ActionButton type="submit" isPending={isSaving}>
          {isSaving ? <Spinner color="current" size="sm" /> : null}
          {t('common.save')}
        </ActionButton>
      </div>
    </form>
  )
}
