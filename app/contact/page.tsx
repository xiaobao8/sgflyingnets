import type { Metadata } from 'next'
import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { ContactContent } from '@/components/ContactContent'

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  const store = readStore()
  const config = store.site_config
  const about = store.about_section[0]
  const offices = store.offices.sort((a, b) => a.sort_order - b.sort_order)
  const contactInfo = store.contact_info.sort((a, b) => a.sort_order - b.sort_order)
  const products = store.products.sort((a, b) => a.sort_order - b.sort_order)

  return (
    <PageLayout config={config} pageId="contact">
      <ContactContent about={about} offices={offices} contactInfo={contactInfo} products={products} />
    </PageLayout>
  )
}
