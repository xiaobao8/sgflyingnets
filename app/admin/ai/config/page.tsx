'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'

const PROXY = '/api/ai/proxy'

async function aiGet(path: string) {
  const r = await fetch(`${PROXY}?path=${encodeURIComponent(path)}`, { credentials: 'include' })
  return r.json()
}

async function aiPut(path: string, body: object) {
  const r = await fetch(`${PROXY}?path=${encodeURIComponent(path)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  return r.json()
}

export default function AdminAIConfigPage() {
  const [email, setEmail] = useState({ smtp_host: '', smtp_port: '587', smtp_user: '', smtp_pass: '', smtp_from_name: 'Flyingnets' })
  const [llm, setLlm] = useState({ provider: 'openai', api_key: '', base_url: '', model: 'gpt-3.5-turbo', token_daily_limit: 100000, token_monthly_limit: 2000000 })
  const [testTo, setTestTo] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    aiGet('/api/admin/email-config').then(d => setEmail(e => ({ ...e, ...d, smtp_pass: '' })))
    aiGet('/api/admin/llm-config').then(d => setLlm(l => ({ ...l, ...d, api_key: '' })))
  }, [])

  const saveEmail = async () => {
    setSaving(true)
    setMsg('')
    try {
      await aiPut('/api/admin/email-config', email)
      setMsg('邮箱配置已保存')
    } catch {
      setMsg('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const testEmail = async () => {
    if (!testTo?.includes('@')) { setMsg('请输入收件邮箱'); return }
    setSaving(true)
    setMsg('')
    try {
      const r = await fetch(`${PROXY}?path=${encodeURIComponent('/api/admin/email-config/test')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ to: testTo }),
      })
      const d = await r.json()
      if (r.ok) setMsg('测试邮件已发送')
      else setMsg(d.detail || d.error || '发送失败')
    } catch {
      setMsg('请求失败')
    } finally {
      setSaving(false)
    }
  }

  const saveLlm = async () => {
    setSaving(true)
    setMsg('')
    try {
      await aiPut('/api/admin/llm-config', llm)
      setMsg('LLM 配置已保存')
    } catch {
      setMsg('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="AI 设定">
      <div className="space-y-8">
        <div className="admin-card bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-sm">
          <p className="font-semibold text-slate-800 mb-2">邮箱与发送规则</p>
          <ul className="text-slate-600 space-y-1 list-disc list-inside">
            <li><strong>AI 发件邮箱</strong>（本页 SMTP）：表单回复客户、会议意向通知销售，均由此邮箱发出</li>
            <li><strong>内部销售邮箱</strong>：<Link href="/admin/ai/sales" className="text-slate-700 hover:text-slate-900 font-medium underline underline-offset-2">在此配置</Link>，客户同意会议后系统将意向邮件发送至对应场景邮箱</li>
          </ul>
        </div>
        <div className="admin-card bg-white border border-slate-200/80 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">AI 统一发件邮箱（SMTP）</h3>
          <p className="text-slate-500 text-sm mb-4">所有表单回复、内部分配邮件均由此邮箱发送。</p>
          <div className="space-y-3">
            {['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from_name'].map(k => (
              <div key={k}>
                <label className="block text-sm font-medium mb-1">
                  {k === 'smtp_host' ? 'SMTP 服务器' : k === 'smtp_port' ? '端口' : k === 'smtp_user' ? '发件邮箱' : k === 'smtp_pass' ? '密码（留空不修改）' : '发件人显示名'}
                </label>
                <input
                  type={k === 'smtp_pass' ? 'password' : 'text'}
                  value={(email as Record<string, string>)[k] || ''}
                  onChange={e => setEmail(x => ({ ...x, [k]: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={saveEmail} disabled={saving} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-slate-800 transition-colors">保存</button>
            <input type="email" value={testTo} onChange={e => setTestTo(e.target.value)} placeholder="测试收件邮箱" className="px-4 py-2.5 border border-slate-200 rounded-xl w-48 focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none" />
            <button onClick={testEmail} disabled={saving} className="px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium transition-colors">发送测试</button>
          </div>
        </div>

        <div className="admin-card bg-white border border-slate-200/80 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">LLM 配置</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <input
                type="password"
                value={llm.api_key}
                onChange={e => setLlm(x => ({ ...x, api_key: e.target.value }))}
                placeholder="留空不修改"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Base URL（可选，国内代理）</label>
              <input value={llm.base_url} onChange={e => setLlm(x => ({ ...x, base_url: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">模型</label>
              <input value={llm.model} onChange={e => setLlm(x => ({ ...x, model: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">日 Token 上限</label>
                <input type="number" value={llm.token_daily_limit} onChange={e => setLlm(x => ({ ...x, token_daily_limit: +e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">月 Token 上限</label>
                <input type="number" value={llm.token_monthly_limit} onChange={e => setLlm(x => ({ ...x, token_monthly_limit: +e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none" />
              </div>
            </div>
          </div>
          <button onClick={saveLlm} disabled={saving} className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-slate-800 transition-colors">保存</button>
        </div>

        {msg && <p className={`font-medium ${msg.includes('已') ? 'text-emerald-600' : 'text-red-600'}`}>{msg}</p>}
      </div>
    </AdminLayout>
  )
}
