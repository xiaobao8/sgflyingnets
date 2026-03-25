import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { CasesContent } from '@/components/CasesContent'

export default function CasesPage() {
  const store = readStore()
  const config = store.site_config
  const stories = store.success_stories.sort((a, b) => a.sort_order - b.sort_order)

  return (
    <PageLayout config={config} pageId="cases">
      <CasesContent stories={stories} />
    </PageLayout>
  )
}
