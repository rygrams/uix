import { ConfigPage } from '../../features/config'
import { metaTitle } from '../../lib/i18n-meta'
import type { Route } from './+types/index'

export function meta({ matches }: Route.MetaArgs) {
  return [{ title: metaTitle(matches, 'meta.config') }]
}

export default function Config() {
  return <ConfigPage />
}
