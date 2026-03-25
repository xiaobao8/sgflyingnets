import { NextResponse } from 'next/server'
import { readStore } from '@/lib/store'
import { getCachedContent, setCachedContent, getContentVersion } from '@/lib/sync'

function buildContent() {
  const store = readStore()
  const hero = store.hero_section.sort((a, b) => a.sort_order - b.sort_order)[0] || null
  const stats = store.stats.filter(s => s.section === 'hero').sort((a, b) => a.sort_order - b.sort_order)
  return {
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
}

export async function GET() {
  try {
    const cached = getCachedContent<ReturnType<typeof buildContent>>()
    const data = cached ?? (() => {
      const c = buildContent()
      setCachedContent(c)
      return c
    })()
    const res = NextResponse.json(data)
    res.headers.set('X-Content-Version', String(getContentVersion()))
    res.headers.set('Cache-Control', 'no-store, max-age=0')
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}
