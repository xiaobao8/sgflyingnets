'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ImageUploader } from '@/components/admin/ImageUploader'

export default function AdminHeroPage() {
  const [data, setData] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    cta_text: '',
    cta_link: '',
    background_image: '',
  })
  const [id, setId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/hero_section', { credentials: 'include' })
      .then(res => res.json())
      .then(arr => {
        const h = Array.isArray(arr) ? arr[0] : arr
        if (h) {
          setId(h.id)
          setData({
            title: h.title || '',
            subtitle: h.subtitle || '',
            tagline: h.tagline || '',
            cta_text: h.cta_text || '',
            cta_link: h.cta_link || '',
            background_image: h.background_image || '',
          })
        }
      })
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = id ? [{ ...data, id }] : [data]
      const res = await fetch('/api/content/hero_section', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('保存失败')
      setMsg('保存成功')
    } catch (e) {
      setMsg('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="编辑首屏 Hero">
      <div className="bg-white border border-ink-200 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">主标题</label>
          <input
            value={data.title}
            onChange={e => setData(d => ({ ...d, title: e.target.value }))}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">副标题</label>
          <input
            value={data.subtitle}
            onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">标语</label>
          <input
            value={data.tagline}
            onChange={e => setData(d => ({ ...d, tagline: e.target.value }))}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">按钮文字</label>
          <input
            value={data.cta_text}
            onChange={e => setData(d => ({ ...d, cta_text: e.target.value }))}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">按钮链接</label>
          <input
            value={data.cta_link}
            onChange={e => setData(d => ({ ...d, cta_link: e.target.value }))}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <ImageUploader
          value={data.background_image}
          onChange={url => setData(d => ({ ...d, background_image: url }))}
          label="背景图（可选）"
        />
        {msg && <p className={msg.includes('成功') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
        <button onClick={save} disabled={saving} className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </AdminLayout>
  )
}
