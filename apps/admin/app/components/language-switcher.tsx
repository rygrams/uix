import { Button, Dropdown } from '@heroui/react'
import { LOCALE_COOKIE, LOCALES, useTranslation, type Locale } from '@app/i18n'
import { Check, Globe } from '@app/ui/lib/icons'

const LABELS: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

export function LanguageSwitcher() {
  const { locale, t } = useTranslation()

  function switchTo(target: Locale) {
    if (target === locale) return
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`
    window.location.reload()
  }

  return (
    <Dropdown>
      <Button variant="ghost" size="sm" aria-label={t('nav.switchLanguage')}>
        <Globe className="size-4" />
        {locale.toUpperCase()}
      </Button>
      <Dropdown.Popover className="min-w-40">
        <Dropdown.Menu
          onAction={(key) => {
            if (key === 'fr' || key === 'en') switchTo(key)
          }}
        >
          {LOCALES.map((code) => (
            <Dropdown.Item key={code} id={code} textValue={LABELS[code]}>
              <span className="flex-1">{LABELS[code]}</span>
              {code === locale ? <Check className="size-4" /> : null}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
