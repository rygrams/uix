import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@heroui/react'
import { useTranslation } from '@app/i18n'
import { Moon, Sun } from '@app/ui/lib/icons'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="size-9" />

  return (
    <Button
      isIconOnly
      variant="ghost"
      aria-label={t('nav.toggleTheme')}
      onPress={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}
