import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { CertificationsContent } from '@/components/CertificationsContent'

export default function CertificationsPage() {
  const store = readStore()
  const config = store.site_config
  const certs = store.certifications.sort((a, b) => a.sort_order - b.sort_order)

  return (
    <PageLayout config={config} pageId="cert">
      <CertificationsContent certs={certs} />
    </PageLayout>
  )
}
