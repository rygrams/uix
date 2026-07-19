import { Navigate } from 'react-router'
import { Alert, Spinner } from '@heroui/react'
import { useTranslation } from '@app/i18n'
import { isAdmin, useSession } from '../../../lib/auth-client'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const { data, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!data) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin(data.user.role)) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <Alert status="danger" className="max-w-md">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{t('forbidden.title')}</Alert.Title>
            <Alert.Description>{t('forbidden.description')}</Alert.Description>
          </Alert.Content>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
