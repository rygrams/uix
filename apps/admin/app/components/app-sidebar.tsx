import { NavLink } from 'react-router'
import { useTranslation, type TranslationKey } from '@app/i18n'
import { LayoutDashboard, Settings2, type LucideIcon } from '@app/ui/lib/icons'
import { NavUser } from './nav-user'
import { Logo } from './logo'
import { useSession } from '../lib/auth-client'

const NAV_ITEMS: { labelKey: TranslationKey; to: string; icon: LucideIcon }[] = [
  { labelKey: 'nav.dashboard', to: '/dashboard', icon: LayoutDashboard },
  { labelKey: 'nav.configuration', to: '/config', icon: Settings2 },
]

export function AppSidebar() {
  const { t } = useTranslation()
  const { data } = useSession()
  const user = {
    name: data?.user.name ?? t('nav.defaultUser'),
    email: data?.user.email ?? '',
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <Logo className="size-8 rounded-lg" />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">
            {t('common.appName')}
          </p>
          <p className="text-xs text-muted">{t('nav.admin')}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-soft text-accent-soft-foreground'
                  : 'text-foreground hover:bg-surface-secondary'
              }`
            }
          >
            <item.icon className="size-4" />
            {t(item.labelKey)}
          </NavLink>
        ))}
      </nav>

      <NavUser user={user} />
    </aside>
  )
}
