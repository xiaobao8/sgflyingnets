'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAIMaterialsPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/materials')
  }, [router])
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <p className="text-ink-500">跳转至材料库管理...</p>
    </div>
  )
}
