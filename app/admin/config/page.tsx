'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function AdminConfigPage() {
  const [data, setData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/content/site_config', { credentials: 'include' })
      .then(res => res.json())
      .then(d => setData({ ...d }))
  }, [])

  const save = async () => {
    setSaving(true)
    setMsg('')
    try {
      const toSend = { ...data }
      const res = await fetch('/api/content/site_config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(toSend),
      })
      if (!res.ok) throw new Error('保存失败')
      setMsg('保存成功')
    } catch {
      setMsg('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const keys = ['company_name', 'tagline', 'copyright', 'seo_title', 'seo_description', 'primary_color', 'hero_layout', 'note_rss_url']
  const labels: Record<string, string> = {
    company_name: '公司名称',
    tagline: '标语',
    copyright: '版权信息',
    seo_title: 'SEO 标题',
    seo_description: 'SEO 描述',
    primary_color: '主题色（如 #b8954a）',
    hero_layout: '首屏布局（center / left / right）',
    note_rss_url: '博客 RSS 地址',
  }

  return (
    <AdminLayout title="网站配置">
      <div className="space-y-8">
        <div className="bg-white border border-ink-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-ink-900 border-b pb-2">基本配置</h3>
          {keys.map(k => (
            <div key={k}>
              <label className="block text-sm font-medium text-ink-700 mb-1">{labels[k] || k}</label>
              <input
                value={data[k] || ''}
                onChange={e => setData(d => ({ ...d, [k]: e.target.value }))}
                className="w-full px-4 py-2 border border-ink-200 rounded-lg"
              />
            </div>
          ))}
        </div>

        <p className="text-ink-500 text-sm">表单邮件、SMTP、AI 助手等配置已移至「AI 助手管理」。</p>

        {msg && <p className={msg.includes('成功') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
        <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-ink-900 text-white rounded-lg hover:bg-ink-800 disabled:opacity-50 font-medium">
          {saving ? '保存中...' : '保存配置'}
        </button>
      </div>
    </AdminLayout>
  )
}
