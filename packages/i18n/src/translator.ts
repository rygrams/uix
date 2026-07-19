import { fr } from './locales/fr'
import { en } from './locales/en'
import type {
  Locale,
  TranslateParams,
  TranslationKey,
  Translations,
} from './types'

const DICTIONARIES: Record<Locale, Translations> = { fr, en }

function interpolate(template: string, params?: TranslateParams): string {
  if (!params) return template
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: TranslateParams,
): string {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, DICTIONARIES[locale])

  return typeof value === 'string' ? interpolate(value, params) : key
}

export type Translator = (key: TranslationKey, params?: TranslateParams) => string

export function createTranslator(locale: Locale): Translator {
  return (key, params) => translate(locale, key, params)
}
