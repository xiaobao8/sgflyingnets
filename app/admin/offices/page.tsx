'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Plus, Trash2 } from 'lucide-react'

type Office = { id?: number; city: string; country: string; is_24_7: number }

export default function AdminOfficesPage() {
  const [items, setItems] = useState<Office[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/offices', { credentials: 'include' }).then(res => res.json()).then(setItems)
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = items.map((it, i) => ({ ...it, sort_order: i }))
      const res = await fetch('/api/content/offices', {
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

  const add = () => setItems([...items, { city: '', country: '', is_24_7: 0 }])
  const remove = (i: number) => setItems(items.filter((_, j) => j !== i))
  const update = (i: number, f: Partial<Office>) => setItems(items.map((it, j) => j === i ? { ...it, ...f } : it))

  return (
    <AdminLayout title="编辑办公室">
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="bg-white border rounded-lg p-4 flex gap-4 items-center">
            <input placeholder="城市" value={it.city} onChange={e => update(i, { city: e.target.value })} className="px-3 py-2 border rounded flex-1" />
            <input placeholder="国家" value={it.country} onChange={e => update(i, { country: e.target.value })} className="px-3 py-2 border rounded flex-1" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!it.is_24_7} onChange={e => update(i, { is_24_7: e.target.checked ? 1 : 0 })} />
              7×24
            </label>
            <button onClick={() => remove(i)} className="text-red-600"><Trash2 size={18} /></button>
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
