'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ImageUploader } from '@/components/admin/ImageUploader'

export default function AdminAboutPage() {
  const [data, setData] = useState({ title: '', content: '', image_url: '' })
  const [id, setId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/about_section', { credentials: 'include' })
      .then(res => res.json())
      .then((arr: { id: number; title: string; content: string; image_url?: string }[]) => {
        const a = arr[0]
        if (a) {
          setId(a.id)
          setData({ title: a.title || '', content: a.content || '', image_url: a.image_url || '' })
        }
      })
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = id ? [{ ...data, id }] : [data]
      const res = await fetch('/api/content/about_section', {
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

  return (
    <AdminLayout title="编辑关于我们">
      <div className="bg-white border border-ink-200 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">标题</label>
          <input
            value={data.title}
            onChange={e => setData(d => ({ ...d, title: e.target.value }))}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <ImageUploader value={data.image_url} onChange={url => setData(d => ({ ...d, image_url: url }))} label="配图（可选）" />
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">内容（支持换行）</label>
          <textarea
            value={data.content}
            onChange={e => setData(d => ({ ...d, content: e.target.value }))}
            rows={10}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        {msg && <p className={msg.includes('成功') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
        <button onClick={save} disabled={saving} className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </AdminLayout>
  )
}
