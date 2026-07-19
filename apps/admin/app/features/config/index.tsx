import { Alert, Button, Spinner } from '@heroui/react'
import { useTranslation } from '@app/i18n'
import { ConfigForm } from './components/config-form'
import { useConfig } from './hooks/use-config'

export function ConfigPage() {
  const { t } = useTranslation()
  const { groups, status, error, isSaving, savedAt, save, reload } = useConfig()

  if (status === 'loading') {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{t('config.loadError')}</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Content>
        <Button variant="outline" size="sm" onPress={() => void reload()}>
          {t('common.retry')}
        </Button>
      </Alert>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('config.title')}</h1>
        <p className="text-sm text-foreground/70">{t('config.subtitle')}</p>
      </div>

      <ConfigForm
        groups={groups}
        isSaving={isSaving}
        savedAt={savedAt}
        error={error}
        onSave={save}
      />
    </div>
  )
}
