'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'

const PROXY = '/api/ai/proxy'

const PROMPTS = [
  { key: 'prompt_chat_zh', label: '聊天提示词（中文）', hint: '中文站 / 界面为中文时使用；与网页语言一致' },
  { key: 'prompt_chat_en', label: 'Chat prompt (English)', hint: '英文界面时使用' },
  { key: 'prompt_chat_ja', label: 'チャット用プロンプト（日本語）', hint: '日本語インターフェース時' },
  {
    key: 'prompt_chat_base',
    label: '聊天提示词（兼容回退）',
    hint: '可选：若某语言未单独填写，或未迁移分语言配置时，作为该语言的回退',
  },
  { key: 'prompt_email_product', label: '产品咨询邮件提示词', hint: '联系表单提交后，生成回复邮件的话术规则' },
  { key: 'prompt_email_partner', label: '代理合作邮件提示词', hint: '合作登记提交后，生成回复邮件的话术规则' },
]

export default function AdminAIPromptsPage() {
  const [data, setData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`${PROXY}?path=${encodeURIComponent('/api/admin/prompts')}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setData(d))
  }, [])

  const save = async (key: string, value: string) => {
    setSaving(true)
    setMsg('')
    try {
      await fetch(`${PROXY}?path=${encodeURIComponent('/api/admin/prompts')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key, value }),
      })
      setMsg('已保存')
    } catch {
      setMsg('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="提示词设置">
      <p className="text-ink-500 text-sm mb-6">
        以销售身份沟通，自然引导会议，不强制预约。AI 服务首次启动时会自动写入三语默认提示词（仅当数据库中尚无对应项时）；若你曾只配置过「兼容回退」，启动后会用其作为中文提示词，英日使用内置默认。你可在此直接改文案并保存。
      </p>
      <div className="space-y-6">
        {PROMPTS.map(({ key, label, hint }) => (
          <div key={key} className="bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-1">{label}</h3>
            <p className="text-ink-500 text-sm mb-3">{hint}</p>
            <textarea
              value={data[key] || ''}
              onChange={e => setData(x => ({ ...x, [key]: e.target.value }))}
              rows={8}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
            />
            <button onClick={() => save(key, data[key] || '')} disabled={saving} className="mt-3 px-6 py-2 bg-ink-900 text-white rounded-lg disabled:opacity-50">保存</button>
          </div>
        ))}
        {msg && <p className={msg.includes('已') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
      </div>
    </AdminLayout>
  )
}
