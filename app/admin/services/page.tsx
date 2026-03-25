'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Plus, Trash2 } from 'lucide-react'

type Service = {
  id?: number
  title: string
  subtitle: string
  description: string
  features: string[] | string
  icon: string
  image_url?: string
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/services', { credentials: 'include' })
      .then(res => res.json())
      .then((arr: Service[]) => setItems(arr.map(s => ({
        ...s,
        features: Array.isArray(s.features) ? s.features.join('\n') : (s.features || ''),
      }))))
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = items.map((it, i) => ({
        ...it,
        features: typeof it.features === 'string' ? it.features.split('\n').filter(Boolean) : it.features,
        sort_order: i,
      }))
      const res = await fetch('/api/content/services', {
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

  const add = () => setItems([...items, { title: '', subtitle: '', description: '', features: '', icon: 'cloud' }])
  const remove = (i: number) => setItems(items.filter((_, j) => j !== i))
  const update = (i: number, f: Partial<Service>) => setItems(items.map((it, j) => j === i ? { ...it, ...f } : it))

  return (
    <AdminLayout title="编辑服务内容">
      <div className="space-y-6">
        {items.map((it, i) => (
          <div key={i} className="bg-white border rounded-lg p-6 space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">服务 {i + 1}</span>
              <button onClick={() => remove(i)} className="text-red-600"><Trash2 size={18} /></button>
            </div>
            <div className="grid gap-2">
              <input placeholder="标题" value={it.title} onChange={e => update(i, { title: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="副标题" value={it.subtitle} onChange={e => update(i, { subtitle: e.target.value })} className="px-3 py-2 border rounded" />
              <textarea placeholder="描述" value={it.description} onChange={e => update(i, { description: e.target.value })} rows={3} className="px-3 py-2 border rounded" />
              <input placeholder="图标 cloud/shield/settings" value={it.icon} onChange={e => update(i, { icon: e.target.value })} className="px-3 py-2 border rounded" />
              <ImageUploader value={it.image_url} onChange={url => update(i, { image_url: url })} label="配图" />
              <textarea placeholder="特性（每行一个）" value={typeof it.features === 'string' ? it.features : (Array.isArray(it.features) ? it.features.join('\n') : '')} onChange={e => update(i, { features: e.target.value })} rows={3} className="px-3 py-2 border rounded" />
            </div>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 text-gold-600"><Plus size={18} /> 添加服务</button>
        {msg && <p className={msg.includes('成功') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
        <button onClick={save} disabled={saving} className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </AdminLayout>
  )
}
