'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        返回管理
      </Link>
      <h1 className="admin-section-title text-slate-900 text-2xl mb-8 tracking-tight">{title}</h1>
      {children}
    </div>
  )
}
