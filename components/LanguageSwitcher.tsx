'use client'

import { useLocale } from './LocaleProvider'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { locales, localeNames } from '@/lib/i18n/translations'
import { Globe } from 'lucide-react'

export function LanguageSwitcher({ variant = 'dark' }: { variant?: 'light' | 'dark' }) {
  const { locale, setLocale } = useLocale()
  const t = useTranslations()
  const colorClass = variant === 'light'
    ? 'text-ink-300 hover:text-gold-400'
    : 'text-ink-600 hover:text-gold-600'

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${colorClass}`}
        aria-label={t.common.switchLanguage}
      >
        <Globe size={16} />
        <span>{localeNames[locale]}</span>
      </button>
      <div className="absolute right-0 top-full mt-1 py-1 bg-white border border-ink-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[100px]">
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-ink-50 transition-colors ${locale === l ? 'text-gold-600 font-medium' : 'text-ink-700'}`}
          >
            {localeNames[l]}
          </button>
        ))}
      </div>
    </div>
  )
}
