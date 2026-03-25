'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Plus, Trash2 } from 'lucide-react'

type Stat = { id?: number; label: string; value: string; suffix?: string }

export default function AdminStatsPage() {
  const [items, setItems] = useState<Stat[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/stats', { credentials: 'include' })
      .then(res => res.json())
      .then(setItems)
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/content/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(items.map((it, i) => ({ ...it, sort_order: i }))),
      })
      if (!res.ok) throw new Error('保存失败')
      setMsg('保存成功')
    } catch {
      setMsg('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const add = () => setItems([...items, { label: '', value: '' }])
  const remove = (i: number) => setItems(items.filter((_, j) => j !== i))
  const update = (i: number, f: Partial<Stat>) => setItems(items.map((it, j) => j === i ? { ...it, ...f } : it))

  return (
    <AdminLayout title="编辑核心数据">
      <div className="bg-white border border-ink-200 rounded-lg p-6 space-y-4">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-start p-4 border rounded">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                placeholder="数值"
                value={it.value}
                onChange={e => update(i, { value: e.target.value })}
                className="px-3 py-2 border rounded"
              />
              <input
                placeholder="标签"
                value={it.label}
                onChange={e => update(i, { label: e.target.value })}
                className="px-3 py-2 border rounded"
              />
            </div>
            <button onClick={() => remove(i)} className="p-2 text-red-600"><Trash2 size={18} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-2 text-gold-600">
          <Plus size={18} /> 添加
        </button>
        {msg && <p className={msg.includes('成功') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
        <button onClick={save} disabled={saving} className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </AdminLayout>
  )
}
