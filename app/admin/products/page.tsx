'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Plus, Trash2 } from 'lucide-react'

type Product = {
  id?: number
  name: string
  tagline: string
  description: string
  features: string[] | string
  highlights: string[] | string
  image_url?: string
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/products', { credentials: 'include' })
      .then(res => res.json())
      .then((arr: Product[]) => setItems(arr.map(p => ({
        ...p,
        features: Array.isArray(p.features) ? p.features.join('\n') : (p.features || ''),
        highlights: Array.isArray(p.highlights) ? p.highlights.join('\n') : (p.highlights || ''),
      }))))
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = items.map((it, i) => ({
        ...it,
        features: typeof it.features === 'string' ? it.features.split('\n').filter(Boolean) : it.features,
        highlights: typeof it.highlights === 'string' ? it.highlights.split('\n').filter(Boolean) : it.highlights,
        sort_order: i,
      }))
      const res = await fetch('/api/content/products', {
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

  const add = () => setItems([...items, { name: '', tagline: '', description: '', features: '', highlights: '', image_url: '' }])
  const remove = (i: number) => setItems(items.filter((_, j) => j !== i))
  const update = (i: number, f: Partial<Product>) => setItems(items.map((it, j) => j === i ? { ...it, ...f } : it))

  return (
    <AdminLayout title="编辑产品">
      <div className="space-y-6">
        {items.map((it, i) => (
          <div key={i} className="bg-white border rounded-lg p-6 space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">产品 {i + 1}</span>
              <button onClick={() => remove(i)} className="text-red-600"><Trash2 size={18} /></button>
            </div>
            <div className="grid gap-2">
              <input placeholder="名称" value={it.name} onChange={e => update(i, { name: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="标语" value={it.tagline} onChange={e => update(i, { tagline: e.target.value })} className="px-3 py-2 border rounded" />
              <textarea placeholder="描述" value={it.description} onChange={e => update(i, { description: e.target.value })} rows={3} className="px-3 py-2 border rounded" />
              <textarea placeholder="特性（每行一个）" value={typeof it.features === 'string' ? it.features : (Array.isArray(it.features) ? it.features.join('\n') : '')} onChange={e => update(i, { features: e.target.value })} rows={2} className="px-3 py-2 border rounded" />
              <textarea placeholder="亮点（每行一个）" value={typeof it.highlights === 'string' ? it.highlights : (Array.isArray(it.highlights) ? it.highlights.join('\n') : '')} onChange={e => update(i, { highlights: e.target.value })} rows={2} className="px-3 py-2 border rounded" />
              <ImageUploader value={it.image_url} onChange={url => update(i, { image_url: url })} label="产品图" />
            </div>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 text-gold-600"><Plus size={18} /> 添加产品</button>
        {msg && <p className={msg.includes('成功') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
        <button onClick={save} disabled={saving} className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </AdminLayout>
  )
}
