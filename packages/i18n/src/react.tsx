import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { createTranslator, type Translator } from './translator'
import { DEFAULT_LOCALE, type Locale } from './types'

type I18nContextValue = {
  locale: Locale
  t: Translator
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: createTranslator(DEFAULT_LOCALE),
})

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: createTranslator(locale) }),
    [locale],
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation(): I18nContextValue {
  return useContext(I18nContext)
}
