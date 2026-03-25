'use client'

import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

type PageId = 'services' | 'products' | 'cert' | 'cases' | 'contact' | 'partnership' | 'blog'

const SLUG_TO_SERVICE_IDX: Record<string, number> = { cloud: 0, security: 1, ai: 2 }
const SLUG_TO_PRODUCT_IDX: Record<string, number> = { 'all-soc': 0, 'synergy-ai': 1, assa: 2 }

export function PageLayout({
  children,
  config,
  title,
  subtitle,
  pageId,
  serviceSlug,
  productSlug,
}: {
  children: React.ReactNode
  config: Record<string, string>
  title?: string
  subtitle?: string
  pageId?: PageId
  serviceSlug?: string
  productSlug?: string
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  let displayTitle = pageId ? t.pages[pageId].title : title
  let displaySubtitle = pageId ? t.pages[pageId].subtitle : subtitle
  if (content && serviceSlug) {
    const idx = SLUG_TO_SERVICE_IDX[serviceSlug]
    if (idx !== undefined && content.services[idx]) {
      displayTitle = content.services[idx].title
      displaySubtitle = content.services[idx].subtitle
    }
  }
  if (content && productSlug) {
    const idx = SLUG_TO_PRODUCT_IDX[productSlug]
    if (idx !== undefined && content.products[idx]) {
      displayTitle = content.products[idx].name
      displaySubtitle = content.products[idx].tagline
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation config={config} />
      {displayTitle && (
        <section className="pt-32 pb-20 bg-ink-950 text-cream">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight">{displayTitle}</h1>
            {displaySubtitle && <p className="mt-6 text-ink-400 text-base tracking-wide">{displaySubtitle}</p>}
          </div>
        </section>
      )}
      <div className="flex-1">{children}</div>
      <Footer config={config} />
    </main>
  )
}
