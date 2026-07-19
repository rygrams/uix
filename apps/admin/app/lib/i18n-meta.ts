import {
  DEFAULT_LOCALE,
  translate,
  type Locale,
  type TranslationKey,
} from '@app/i18n'

type RouteMatch = { id: string; loaderData: unknown } | undefined

function rootLocale(matches: readonly RouteMatch[]): Locale {
  const data = matches.find((match) => match?.id === 'root')?.loaderData
  if (data && typeof data === 'object' && 'locale' in data) {
    const locale = (data as { locale: unknown }).locale
    if (locale === 'fr' || locale === 'en') return locale
  }
  return DEFAULT_LOCALE
}

/** Translate a title key using the locale resolved by the root loader. */
export function metaTitle(
  matches: readonly RouteMatch[],
  key: TranslationKey,
): string {
  return translate(rootLocale(matches), key)
}
