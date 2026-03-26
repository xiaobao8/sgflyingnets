import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { ProductDetailContent } from '@/components/ProductDetailContent'

const SLUG_MAP: Record<string, number> = {
  'synergy-ai': 1,
  'all-soc': 0,
  assa: 2,
}

function resolveProduct(slug: string) {
  const store = readStore()
  const products = store.products.sort((a, b) => a.sort_order - b.sort_order)
  const idx = SLUG_MAP[slug]
  const product =
    typeof idx === 'number' ? products[idx] : products.find(p => p.name.toLowerCase().includes(slug.replace(/-/g, ' ')))
  if (!product) return null
  const imageIndex =
    typeof idx === 'number' ? idx : Math.max(0, products.findIndex(p => p === product))
  return { product, slug, imageIndex }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!resolveProduct(slug)) return {}
  return { alternates: { canonical: `/products/${slug}` } }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const store = readStore()
  const config = store.site_config

  const resolved = resolveProduct(slug)
  if (!resolved) notFound()
  const { product, imageIndex } = resolved

  const productImages: Record<number, string> = {
    0: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    1: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
    2: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
  }
  const imgUrl = product.image_url || productImages[imageIndex]
  const detailSections = (product as { detail_sections?: { title: string; content: string }[] }).detail_sections || []

  return (
    <PageLayout config={config} title={product.name} subtitle={product.tagline} productSlug={slug}>
      <ProductDetailContent
        product={{
          name: product.name,
          tagline: product.tagline,
          description: product.description,
          features: Array.isArray(product.features) ? product.features : [],
          highlights: Array.isArray(product.highlights) ? product.highlights : [],
          detail_sections: detailSections,
        }}
        imgUrl={imgUrl}
        slug={slug}
      />
    </PageLayout>
  )
}
