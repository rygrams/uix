import { DEFAULT_LOCALE, LOCALES, type Locale } from './types'

export const LOCALE_COOKIE = 'locale'

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

function fromCookie(cookieHeader: string): Locale | undefined {
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
  if (!match) return undefined
  const value = decodeURIComponent(match.slice(LOCALE_COOKIE.length + 1))
  return isLocale(value) ? value : undefined
}

function fromAcceptLanguage(header: string): Locale | undefined {
  for (const part of header.split(',')) {
    const tag = part.split(';')[0]?.trim().slice(0, 2).toLowerCase()
    if (tag && isLocale(tag)) return tag
  }
  return undefined
}

/** Resolve the active locale from a request's cookie / Accept-Language header. */
export function detectLocale(input: {
  cookie?: string | null
  acceptLanguage?: string | null
}): Locale {
  return (
    (input.cookie ? fromCookie(input.cookie) : undefined) ??
    (input.acceptLanguage ? fromAcceptLanguage(input.acceptLanguage) : undefined) ??
    DEFAULT_LOCALE
  )
}
