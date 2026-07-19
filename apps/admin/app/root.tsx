import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router'
import { ThemeProvider } from 'next-themes'
import {
  DEFAULT_LOCALE,
  detectLocale,
  I18nProvider,
  useTranslation,
  type Locale,
} from '@app/i18n'

import type { Route } from './+types/root'
import './app.css'

export function loader({ request }: Route.LoaderArgs) {
  const locale = detectLocale({
    cookie: request.headers.get('cookie'),
    acceptLanguage: request.headers.get('accept-language'),
  })
  return { locale }
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root')
  const locale: Locale = data?.locale ?? DEFAULT_LOCALE

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider
          attribute={['class', 'data-theme']}
          defaultTheme="system"
          enableSystem
        >
          <I18nProvider locale={locale}>{children}</I18nProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation()
  let message = t('errors.oops')
  let details = t('errors.unexpected')
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? t('errors.notFoundTitle') : t('errors.errorTitle')
    details =
      error.status === 404
        ? t('errors.notFoundDesc')
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
