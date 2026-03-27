'use client'

import type { Content } from '@/lib/content'
import { HeroSection } from '@/components/HeroSection'
import { HomeTrustSection } from '@/components/HomeTrustSection'
import { HomeServicesSection } from '@/components/HomeServicesSection'
import { HomeProductsSection } from '@/components/HomeProductsSection'
import { HomeCertificationsSection } from '@/components/HomeCertificationsSection'
import { HomeStoriesSection } from '@/components/HomeStoriesSection'
import { HomePartnershipSection } from '@/components/HomePartnershipSection'
import { HomeContactSection } from '@/components/HomeContactSection'
import { Navigation } from '@/components/Navigation'

export function HomeClient({ content }: { content: Content }) {
  const defaultOrder = ['hero', 'about', 'services', 'products', 'certifications', 'stories', 'partnership', 'contact']
  let layout = content.layoutConfig?.length
    ? [...content.layoutConfig].sort((a, b) => a.sort_order - b.sort_order)
    : defaultOrder.map((id, i) => ({ id, label: id, visible: true, sort_order: i }))

  return (
    <main className="relative">
      <Navigation config={content.config} />
      {layout
        .filter(s => s.visible)
        .map(s => {
          if (s.id === 'hero') return <HeroSection key={s.id} hero={content.hero} stats={content.stats} config={content.config} />
          if (s.id === 'about') return <HomeTrustSection key={s.id} stats={content.stats} about={content.about} />
          if (s.id === 'services') return <HomeServicesSection key={s.id} services={content.services} />
          if (s.id === 'products') return <HomeProductsSection key={s.id} products={content.products} />
          if (s.id === 'certifications') return <HomeCertificationsSection key={s.id} certifications={content.certifications} />
          if (s.id === 'stories') return <HomeStoriesSection key={s.id} stories={content.successStories} />
          if (s.id === 'partnership') return <HomePartnershipSection key={s.id} />
          if (s.id === 'contact') return <HomeContactSection key={s.id} config={content.config} />
          return null
        })}
    </main>
  )
}
