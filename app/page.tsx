import { readStore } from '@/lib/store'
import { HomeClient } from '@/components/HomeClient'

export default function Home() {
  const store = readStore()
  const hero = store.hero_section.sort((a, b) => a.sort_order - b.sort_order)[0] || null
  const stats = store.stats.filter(s => s.section === 'hero').sort((a, b) => a.sort_order - b.sort_order)

  const content = {
    config: store.site_config,
    layoutConfig: store.layout_config || [],
    hero,
    stats,
    about: store.about_section.sort((a, b) => a.sort_order - b.sort_order),
    services: store.services.sort((a, b) => a.sort_order - b.sort_order),
    products: store.products.sort((a, b) => a.sort_order - b.sort_order),
    certifications: store.certifications.sort((a, b) => a.sort_order - b.sort_order),
    successStories: store.success_stories.sort((a, b) => a.sort_order - b.sort_order),
    partnerships: store.partnerships.sort((a, b) => a.sort_order - b.sort_order),
    offices: store.offices.sort((a, b) => a.sort_order - b.sort_order),
    contactInfo: store.contact_info.sort((a, b) => a.sort_order - b.sort_order),
  }

  return <HomeClient content={content} />
}
