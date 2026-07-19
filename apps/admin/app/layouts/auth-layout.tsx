import { Outlet, Link } from 'react-router'
import { useTranslation } from '@app/i18n'
import { ThemeToggle } from '../components/theme-toggle'
import { LanguageSwitcher } from '../components/language-switcher'
import { Logo } from '../components/logo'

export default function AuthLayout() {
  const { t } = useTranslation()

  return (
    <div className="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      {/* Left — form column */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <Logo className="size-6 rounded-md" />
            {t('common.appName')}
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </main>

        <footer className="px-6 py-5">
          <p className="text-xs text-muted">
            {t('authLayout.copyright', { year: new Date().getFullYear() })}
          </p>
        </footer>
      </div>

      {/* Right — decorative panel */}
      <div className="relative hidden overflow-hidden lg:block">
        {/* Gradient fallback (shown until the cover image is added). */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700" />
        {/* Cover image — drop /public/login-cover.png; falls back to the gradient. */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/login-cover.png')" }}
        />
        {/* Legibility overlay for the caption. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="relative flex h-full flex-col justify-end gap-3 p-12 text-white">
          <p className="text-3xl font-semibold leading-tight">
            {t('authLayout.tagline')}
          </p>
          <p className="max-w-md text-sm text-white/70">
            {t('authLayout.taglineDesc')}
          </p>
        </div>
      </div>
    </div>
  )
}
