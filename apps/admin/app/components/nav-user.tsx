import { useNavigate } from 'react-router'
import { Button } from '@heroui/react'
import { useTranslation } from '@app/i18n'
import { LogOut } from '@app/ui/lib/icons'
import { signOut } from '../lib/auth-client'

type User = {
  name: string
  email: string
}

export function NavUser({ user }: { user: User }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  async function logout() {
    await signOut()
    await navigate('/login')
  }

  return (
    <div className="flex items-center gap-3 border-t border-border p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
        {user.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
        <p className="truncate text-xs text-muted">{user.email}</p>
      </div>
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        aria-label={t('nav.signOut')}
        onPress={() => void logout()}
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}
