'use client'

import { useLocale } from '@/components/LocaleProvider'
import { contentEn, contentJa } from './contentTranslations'
/**
 * 根据当前 locale 返回本地化内容。
 * zh: 使用 content.json 的原始数据（由调用方传入）
 * en/ja: 使用 contentTranslations 中的翻译
 */
export function useLocalizedContent() {
  const { locale } = useLocale()
  const content = locale === 'en' ? contentEn : locale === 'ja' ? contentJa : null
  return { locale, content, isLocalized: locale !== 'zh' }
}
