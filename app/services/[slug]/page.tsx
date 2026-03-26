import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { ServiceDetailContent } from '@/components/ServiceDetailContent'

const SLUG_TO_SERVICE: Record<string, number> = {
  cloud: 0,
  security: 1,
  ai: 2,
  microsoft: 3,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (SLUG_TO_SERVICE[slug] === undefined) return {}
  return { alternates: { canonical: `/services/${slug}` } }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const idx = SLUG_TO_SERVICE[slug]
  if (idx === undefined) notFound()

  const store = readStore()
  const config = store.site_config
  const services = [...store.services].sort((a, b) => a.sort_order - b.sort_order)
  const service = services[idx]
  if (!service) notFound()

  return (
    <PageLayout config={config} title={service.title} subtitle={service.subtitle} serviceSlug={slug}>
      <ServiceDetailContent
        service={{
          title: service.title,
          subtitle: service.subtitle,
          description: service.description,
          features: Array.isArray(service.features) ? service.features : [],
          image_url: service.image_url,
          detail_sections: (service as { detail_sections?: { title: string; content: string }[] }).detail_sections || [],
        }}
        slug={slug}
      />
    </PageLayout>
  )
}
