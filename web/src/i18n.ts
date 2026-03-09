// i18n configuration for JetlagRx
const translations = {
    en: { appName: 'JetlagRx', description: 'Timeline-based jet lag recovery protocol' },
    de: { appName: 'JetlagRx', description: 'Timeline-based jet lag recovery protocol (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
