import { Outlet, Link } from 'react-router'
import { ThemeToggle } from '../components/theme-toggle'

export default function AuthLayout() {
  return (
    <div className="bg-muted/40 flex min-h-svh flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold">
            B
          </span>
          UIX
        </Link>
        <ThemeToggle />
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} UIX. Tous droits réservés.
        </p>
      </footer>
    </div>
  )
}
