import { Outlet, useLocation } from 'react-router'
import { useTranslation, type TranslationKey } from '@app/i18n'
import { AppSidebar } from '../components/app-sidebar'
import { ThemeToggle } from '../components/theme-toggle'
import { LanguageSwitcher } from '../components/language-switcher'
import { RequireAdmin } from '../features/auth/components/require-admin'

const TITLE_KEYS: Record<string, TranslationKey> = {
  '/dashboard': 'nav.dashboard',
  '/config': 'nav.configuration',
}

export default function DashboardLayout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const title = t(TITLE_KEYS[pathname] ?? 'nav.admin')

  return (
    <RequireAdmin>
      <div className="flex min-h-svh bg-background text-foreground">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center gap-3 border-b border-border px-6">
            <h1 className="text-sm font-medium">{title}</h1>
            <div className="ml-auto flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </RequireAdmin>
  )
}
