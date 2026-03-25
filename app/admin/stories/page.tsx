'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Plus, Trash2 } from 'lucide-react'

type Story = {
  id?: number
  client_name: string
  industry: string
  service_type: string
  requirements: string
  solution: string
  results: string[] | string
  image_url?: string
}

export default function AdminStoriesPage() {
  const [items, setItems] = useState<Story[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/success_stories', { credentials: 'include' })
      .then(res => res.json())
      .then((arr: Story[]) => setItems(arr.map(s => ({
        ...s,
        results: Array.isArray(s.results) ? s.results.join('\n') : (s.results || ''),
      }))))
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = items.map((it, i) => ({
        ...it,
        results: typeof it.results === 'string' ? it.results.split('\n').filter(Boolean) : it.results,
        sort_order: i,
      }))
      const res = await fetch('/api/content/success_stories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('保存失败')
      setMsg('保存成功')
    } catch {
      setMsg('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const add = () => setItems([...items, { client_name: '', industry: '', service_type: '', requirements: '', solution: '', results: '' }])
  const remove = (i: number) => setItems(items.filter((_, j) => j !== i))
  const update = (i: number, f: Partial<Story>) => setItems(items.map((it, j) => j === i ? { ...it, ...f } : it))

  return (
    <AdminLayout title="编辑成功案例">
      <div className="space-y-6">
        {items.map((it, i) => (
          <div key={i} className="bg-white border rounded-lg p-6 space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">案例 {i + 1}</span>
              <button onClick={() => remove(i)} className="text-red-600"><Trash2 size={18} /></button>
            </div>
            <div className="grid gap-2">
              <input placeholder="客户名称" value={it.client_name} onChange={e => update(i, { client_name: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="行业" value={it.industry} onChange={e => update(i, { industry: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="服务类型" value={it.service_type} onChange={e => update(i, { service_type: e.target.value })} className="px-3 py-2 border rounded" />
              <textarea placeholder="需求" value={it.requirements} onChange={e => update(i, { requirements: e.target.value })} rows={2} className="px-3 py-2 border rounded" />
              <textarea placeholder="解决方案" value={it.solution} onChange={e => update(i, { solution: e.target.value })} rows={2} className="px-3 py-2 border rounded" />
              <textarea placeholder="成果（每行一个）" value={typeof it.results === 'string' ? it.results : (Array.isArray(it.results) ? it.results.join('\n') : '')} onChange={e => update(i, { results: e.target.value })} rows={2} className="px-3 py-2 border rounded" />
              <ImageUploader value={it.image_url} onChange={url => update(i, { image_url: url })} label="配图" />
            </div>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 text-gold-600"><Plus size={18} /> 添加案例</button>
        {msg && <p className={msg.includes('成功') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
        <button onClick={save} disabled={saving} className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </AdminLayout>
  )
}
