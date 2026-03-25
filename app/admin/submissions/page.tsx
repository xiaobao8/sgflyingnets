'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Mail, Briefcase, Trash2, Download } from 'lucide-react'

type Submission = {
  type: string
  company: string
  contact: string
  phone: string
  email: string
  product_interest?: string
  coop_type?: string
  region?: string
  message?: string
  created_at: string
}

function toCSV(list: Submission[]) {
  const headers = ['类型', '公司', '联系人', '电话', '邮箱', '产品/服务', '合作类型', '区域', '留言', '提交时间']
  const rows = list.map(s => [
    s.type === 'contact' ? '联系表单' : '合作登记',
    s.company,
    s.contact,
    s.phone,
    s.email,
    s.product_interest || '',
    s.coop_type || '',
    s.region || '',
    (s.message || '').replace(/"/g, '""'),
    s.created_at,
  ].map(c => `"${String(c)}"`).join(','))
  return '\uFEFF' + headers.join(',') + '\n' + rows.join('\n')
}

export default function AdminSubmissionsPage() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')
  const [list, setList] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'contact' | 'partnership'>(
    typeParam === 'contact' || typeParam === 'partnership' ? typeParam : 'all'
  )

  useEffect(() => {
    if (typeParam === 'contact' || typeParam === 'partnership') setFilter(typeParam)
  }, [typeParam])

  const load = () => {
    fetch('/api/submissions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setList(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const deleteItem = async (index: number) => {
    if (!confirm('确定删除此条记录？')) return
    const res = await fetch(`/api/submissions?index=${index}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) load()
  }

  const exportCSV = () => {
    const filtered = filter === 'all' ? list : list.filter(s => s.type === filter)
    const blob = new Blob([toCSV(filtered)], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `表单提交_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const filtered = filter === 'all' ? list : list.filter(s => s.type === filter)
  const contactList = list.filter(s => s.type === 'contact')
  const partnerList = list.filter(s => s.type === 'partnership')

  return (
    <AdminLayout title="表单提交">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded text-sm font-medium ${filter === 'all' ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'}`}
            >
              全部 ({list.length})
            </button>
            <button
              onClick={() => setFilter('contact')}
              className={`px-4 py-2 rounded text-sm font-medium ${filter === 'contact' ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'}`}
            >
              联系表单 ({contactList.length})
            </button>
            <button
              onClick={() => setFilter('partnership')}
              className={`px-4 py-2 rounded text-sm font-medium ${filter === 'partnership' ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-700 hover:bg-ink-200'}`}
            >
              合作登记 ({partnerList.length})
            </button>
          </div>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded hover:bg-gold-600 disabled:opacity-50 text-sm"
          >
            <Download size={16} /> 导出 CSV
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-ink-500">加载中...</div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-ink-500 py-8 text-center">暂无提交</p>
            ) : (
              filtered.map((s, i) => {
                const globalIndex = list.indexOf(s)
                return (
                  <div key={globalIndex} className="border border-ink-200 rounded-lg p-6 bg-white flex justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-ink-100 text-ink-600">
                          {s.type === 'contact' ? '联系表单' : '合作登记'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span><strong>公司：</strong>{s.company}</span>
                        <span><strong>联系人：</strong>{s.contact}</span>
                        <span><strong>电话：</strong>{s.phone}</span>
                        <span><strong>邮箱：</strong><a href={`mailto:${s.email}`} className="text-gold-600 hover:underline">{s.email}</a></span>
                        {s.product_interest && <span><strong>产品：</strong>{s.product_interest}</span>}
                        {s.coop_type && <span><strong>类型：</strong>{s.coop_type}</span>}
                        {s.region && <span><strong>区域：</strong>{s.region}</span>}
                      </div>
                      {s.message && <p className="mt-3 text-ink-600 text-sm">{s.message}</p>}
                      <p className="mt-2 text-ink-400 text-xs">{s.created_at}</p>
                    </div>
                    <button
                      onClick={() => deleteItem(globalIndex)}
                      className="shrink-0 p-2 text-red-600 hover:bg-red-50 rounded"
                      title="删除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
