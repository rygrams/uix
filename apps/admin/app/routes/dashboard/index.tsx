import { metaTitle } from '../../lib/i18n-meta'
import type { Route } from './+types/index'

export function meta({ matches }: Route.MetaArgs) {
  return [{ title: metaTitle(matches, 'meta.dashboard') }]
}

export default function DashboardIndex() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl border border-border bg-surface" />
        <div className="aspect-video rounded-xl border border-border bg-surface" />
        <div className="aspect-video rounded-xl border border-border bg-surface" />
      </div>
      <div className="min-h-64 flex-1 rounded-xl border border-border bg-surface" />
    </div>
  )
}
