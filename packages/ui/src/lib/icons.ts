/**
 * Ré-export de lucide-react comme source unique d'icônes du design system.
 * Importer ses icônes via `@app/ui/lib/icons` plutôt que `lucide-react` en direct :
 * une seule version (catalog), et le tree-shaking ne garde que celles utilisées.
 *
 *   import { Rocket, type LucideIcon } from '@app/ui/lib/icons'
 */
export * from 'lucide-react'
