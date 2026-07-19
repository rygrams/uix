import { LoginForm } from '../../features/auth/components/login-form'
import { metaTitle } from '../../lib/i18n-meta'
import type { Route } from './+types/login'

export function meta({ matches }: Route.MetaArgs) {
  return [{ title: metaTitle(matches, 'meta.login') }]
}

export default function Login() {
  return <LoginForm />
}
