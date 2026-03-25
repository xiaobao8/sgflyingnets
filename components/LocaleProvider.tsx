'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Locale } from '@/lib/i18n/translations'
import { locales } from '@/lib/i18n/translations'

const COOKIE_NAME = 'NEXT_LOCALE'

function getLocaleFromCookie(): Locale {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`))
  const v = match?.[2] as Locale
  return locales.includes(v) ? v : 'en'
}

function setLocaleCookie(locale: Locale) {
  document.cookie = `${COOKIE_NAME}=${locale};path=/;max-age=31536000`
}

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (l: Locale) => void
} | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocaleState(getLocaleFromCookie())
    setMounted(true)
  }, [])

  const setLocale = useCallback((l: Locale) => {
    if (typeof document === 'undefined') return
    setLocaleCookie(l)
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : l === 'ja' ? 'ja' : 'en'
    document.documentElement.classList.remove('lang-zh', 'lang-en', 'lang-ja')
    document.documentElement.classList.add(`lang-${l}`)
    setLocaleState(l)
    // 强制刷新页面，使悬浮球等依赖系统语言的组件重新初始化
    window.location.reload()
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja' : 'en'
      document.documentElement.classList.remove('lang-zh', 'lang-en', 'lang-ja')
      document.documentElement.classList.add(`lang-${locale}`)
    }
  }, [locale, mounted])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
