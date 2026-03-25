import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { PartnershipContent } from '@/components/PartnershipContent'

export default function PartnershipPage() {
  const store = readStore()
  const config = store.site_config
  const products = store.products.sort((a, b) => a.sort_order - b.sort_order)

  return (
    <PageLayout config={config} pageId="partnership">
      <PartnershipContent products={products} />
    </PageLayout>
  )
}
