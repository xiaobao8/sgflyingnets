import type { Metadata } from 'next'
import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { ServicesContent } from '@/components/ServicesContent'

export const metadata: Metadata = {
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  const store = readStore()
  const config = store.site_config
  const services = store.services.sort((a, b) => a.sort_order - b.sort_order)

  return (
    <PageLayout config={config} pageId="services">
      <ServicesContent services={services} />
    </PageLayout>
  )
}
