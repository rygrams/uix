import { fr } from './locales/fr'

export const LOCALES = ['fr', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'fr'

/** French is the source of truth; every other locale must match its shape. */
export type Translations = typeof fr

/** Dot-notation union of every leaf key, e.g. `"auth.welcomeBack"`. */
export type TranslationKey = Leaves<Translations>

type Leaves<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : `${K}.${Leaves<T[K]>}`
}[keyof T & string]

export type TranslateParams = Record<string, string | number>
