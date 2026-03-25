'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Plus, Trash2 } from 'lucide-react'

type Contact = { id?: number; type: string; label: string; value: string }

export default function AdminContactPage() {
  const [items, setItems] = useState<Contact[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/contact_info', { credentials: 'include' }).then(res => res.json()).then(setItems)
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = items.map((it, i) => ({ ...it, sort_order: i }))
      const res = await fetch('/api/content/contact_info', {
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

  const add = () => setItems([...items, { type: 'phone', label: '', value: '' }])
  const remove = (i: number) => setItems(items.filter((_, j) => j !== i))
  const update = (i: number, f: Partial<Contact>) => setItems(items.map((it, j) => j === i ? { ...it, ...f } : it))

  return (
    <AdminLayout title="编辑联系信息">
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="bg-white border rounded-lg p-4 flex gap-4">
            <select value={it.type} onChange={e => update(i, { type: e.target.value })} className="px-3 py-2 border rounded w-28">
              <option value="phone">电话</option>
              <option value="email">邮箱</option>
              <option value="website">网站</option>
            </select>
            <input placeholder="标签" value={it.label} onChange={e => update(i, { label: e.target.value })} className="px-3 py-2 border rounded flex-1" />
            <input placeholder="值" value={it.value} onChange={e => update(i, { value: e.target.value })} className="px-3 py-2 border rounded flex-1" />
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
