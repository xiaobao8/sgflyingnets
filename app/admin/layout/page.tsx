'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { GripVertical, Eye, EyeOff } from 'lucide-react'

type Section = { id: string; label: string; visible: boolean; sort_order: number }

export default function AdminLayoutPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/layout', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSections(data)
        else setSections([
          { id: 'hero', label: '首屏', visible: true, sort_order: 0 },
          { id: 'about', label: '关于我们', visible: true, sort_order: 1 },
          { id: 'services', label: '服务', visible: true, sort_order: 2 },
          { id: 'products', label: '产品', visible: true, sort_order: 3 },
          { id: 'certifications', label: '资质', visible: true, sort_order: 4 },
          { id: 'stories', label: '案例', visible: true, sort_order: 5 },
          { id: 'partnership', label: '合作', visible: true, sort_order: 6 },
          { id: 'contact', label: '联系', visible: true, sort_order: 7 },
        ])
      })
  }, [])

  const move = (index: number, dir: 'up' | 'down') => {
    const next = [...sections]
    const j = dir === 'up' ? index - 1 : index + 1
    if (j < 0 || j >= next.length) return
    ;[next[index], next[j]] = [next[j], next[index]]
    setSections(next.map((s, i) => ({ ...s, sort_order: i })))
  }

  const toggle = (id: string) => {
    setSections(s => s.map(x => (x.id === id ? { ...x, visible: !x.visible } : x)))
  }

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const ordered = sections.map((s, i) => ({ ...s, sort_order: i }))
      const res = await fetch('/api/admin/layout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(ordered),
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
    <AdminLayout title="布局管理">
      <div className="bg-white border border-ink-200 rounded-lg p-6">
        <p className="text-ink-600 text-sm mb-4">拖拽调整顺序，点击眼睛图标切换显示/隐藏。</p>
        <ul className="space-y-2">
          {sections.map((s, i) => (
            <li
              key={s.id}
              className="flex items-center gap-3 p-3 border border-ink-200 rounded bg-ink-50"
            >
              <div className="flex flex-col gap-0">
                <button
                  type="button"
                  onClick={() => move(i, 'up')}
                  disabled={i === 0}
                  className="p-0.5 text-ink-400 hover:text-ink-700 disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 'down')}
                  disabled={i === sections.length - 1}
                  className="p-0.5 text-ink-400 hover:text-ink-700 disabled:opacity-30"
                >
                  ▼
                </button>
              </div>
              <GripVertical size={18} className="text-ink-400" />
              <span className="flex-1 font-medium">{s.label}</span>
              <button
                type="button"
                onClick={() => toggle(s.id)}
                className={`p-2 rounded ${s.visible ? 'text-green-600 bg-green-50' : 'text-ink-400 bg-ink-100'}`}
                title={s.visible ? '隐藏' : '显示'}
              >
                {s.visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </li>
          ))}
        </ul>
        {msg && <p className={`mt-4 ${msg.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
        <button
          onClick={save}
          disabled={saving}
          className="mt-6 px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </AdminLayout>
  )
}
