'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Plus, Trash2 } from 'lucide-react'

type Partnership = {
  id?: number
  title: string
  partner_profile: string
  cooperation_content?: string | null
  options?: { name: string; desc: string }[] | null
  support: string[] | string
}

export default function AdminPartnershipsPage() {
  const [items, setItems] = useState<Partnership[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/partnerships', { credentials: 'include' })
      .then(res => res.json())
      .then((arr: Partnership[]) => setItems(arr.map(p => ({
        ...p,
        support: Array.isArray(p.support) ? p.support.join('\n') : (p.support || ''),
        options: p.options || [],
      }))))
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = items.map((it, i) => ({
        ...it,
        support: typeof it.support === 'string' ? it.support.split('\n').filter(Boolean) : it.support,
        sort_order: i,
      }))
      const res = await fetch('/api/content/partnerships', {
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

  const add = () => setItems([...items, { title: '', partner_profile: '', cooperation_content: '', support: '' }])
  const remove = (i: number) => setItems(items.filter((_, j) => j !== i))
  const update = (i: number, f: Partial<Partnership>) => setItems(items.map((it, j) => j === i ? { ...it, ...f } : it))

  return (
    <AdminLayout title="编辑合作模式">
      <div className="space-y-6">
        {items.map((it, i) => (
          <div key={i} className="bg-white border rounded-lg p-6 space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">合作 {i + 1}</span>
              <button onClick={() => remove(i)} className="text-red-600"><Trash2 size={18} /></button>
            </div>
            <div className="grid gap-2">
              <input placeholder="标题" value={it.title} onChange={e => update(i, { title: e.target.value })} className="px-3 py-2 border rounded" />
              <textarea placeholder="合作方画像" value={it.partner_profile} onChange={e => update(i, { partner_profile: e.target.value })} rows={2} className="px-3 py-2 border rounded" />
              <textarea placeholder="合作内容" value={it.cooperation_content || ''} onChange={e => update(i, { cooperation_content: e.target.value })} rows={2} className="px-3 py-2 border rounded" />
              <textarea placeholder="支持项（每行一个）" value={typeof it.support === 'string' ? it.support : (Array.isArray(it.support) ? it.support.join('\n') : '')} onChange={e => update(i, { support: e.target.value })} rows={3} className="px-3 py-2 border rounded" />
            </div>
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
