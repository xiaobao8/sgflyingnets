'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Plus, Trash2 } from 'lucide-react'

type Cert = { id?: number; name: string; description: string; badge_text?: string; logo_url?: string; image_url?: string }

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<Cert[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/certifications', { credentials: 'include' }).then(res => res.json()).then(setItems)
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = items.map((it, i) => ({ ...it, sort_order: i }))
      const res = await fetch('/api/content/certifications', {
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

  const add = () => setItems([...items, { name: '', description: '', badge_text: '', logo_url: '' }])
  const remove = (i: number) => setItems(items.filter((_, j) => j !== i))
  const update = (i: number, f: Partial<Cert>) => setItems(items.map((it, j) => j === i ? { ...it, ...f } : it))

  return (
    <AdminLayout title="编辑资质认证">
      <div className="space-y-6">
        {items.map((it, i) => (
          <div key={i} className="bg-white border rounded-lg p-6 flex gap-4">
            <div className="flex-1 grid gap-2">
              <input placeholder="名称" value={it.name} onChange={e => update(i, { name: e.target.value })} className="px-3 py-2 border rounded" />
              <input placeholder="徽章文字" value={it.badge_text || ''} onChange={e => update(i, { badge_text: e.target.value })} className="px-3 py-2 border rounded" />
              <textarea placeholder="描述" value={it.description} onChange={e => update(i, { description: e.target.value })} rows={2} className="px-3 py-2 border rounded" />
              <ImageUploader value={it.image_url || it.logo_url} onChange={url => update(i, { image_url: url, logo_url: url })} label="配图" />
            </div>
            <button onClick={() => remove(i)} className="text-red-600 h-fit"><Trash2 size={18} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 text-gold-600"><Plus size={18} /> 添加</button>
        {msg && <p className={msg.includes('成功') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
        <button onClick={save} disabled={saving} className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </AdminLayout>
  )
}
