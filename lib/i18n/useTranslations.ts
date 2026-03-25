'use client'

import { useLocale } from '@/components/LocaleProvider'
import { translations } from './translations'

export function useTranslations() {
  const { locale } = useLocale()
  return translations[locale]
}
