import type { Metadata } from 'next'
import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { ProductsContent } from '@/components/ProductsContent'

export const metadata: Metadata = {
  alternates: { canonical: '/products' },
}

export default function ProductsPage() {
  const store = readStore()
  const config = store.site_config
  const products = store.products.sort((a, b) => a.sort_order - b.sort_order)

  return (
    <PageLayout config={config} pageId="products">
      <ProductsContent products={products} />
    </PageLayout>
  )
}
