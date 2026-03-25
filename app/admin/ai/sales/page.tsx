'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Plus, Trash2 } from 'lucide-react'

const PROXY = '/api/ai/proxy'

const SCENARIOS = [
  { value: '', label: '默认' },
  { value: 'product_consult', label: '产品咨询' },
  { value: 'partner_coop', label: '代理合作' },
]

type SalesItem = { id: number; email: string; name: string; scenario?: string; is_active?: boolean }

export default function AdminAISalesPage() {
  const [list, setList] = useState<SalesItem[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [scenario, setScenario] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => {
    fetch(`${PROXY}?path=${encodeURIComponent('/api/admin/sales-emails')}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setList(Array.isArray(d) ? d : []))
  }
  useEffect(() => { load() }, [])

  const add = async () => {
    if (!email?.includes('@')) {
      setMsg('请输入有效邮箱')
      return
    }
    setSaving(true)
    setMsg('')
    try {
      await fetch(`${PROXY}?path=${encodeURIComponent('/api/admin/sales-emails')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, name, scenario }),
      })
      setMsg('已添加')
      setEmail('')
      setName('')
      setScenario('')
      load()
    } catch {
      setMsg('添加失败')
    } finally {
      setSaving(false)
    }
  }

  const updateScenario = async (id: number, newScenario: string) => {
    try {
      await fetch(`${PROXY}?path=${encodeURIComponent(`/api/admin/sales-emails/${id}`)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ scenario: newScenario, is_active: true }),
      })
      load()
    } catch {}
  }

  const del = async (id: number) => {
    if (!confirm('确定删除？')) return
    try {
      await fetch(`${PROXY}?path=${encodeURIComponent(`/api/admin/sales-emails/${id}`)}`, { method: 'DELETE', credentials: 'include' })
      load()
    } catch {}
  }

  return (
    <AdminLayout title="内部销售邮箱">
      <div className="bg-ink-50 border border-ink-200 rounded-xl p-4 text-sm mb-6">
        <p className="font-medium text-ink-800 mb-2">发送规则</p>
        <ul className="text-ink-600 space-y-1 list-disc list-inside">
          <li>客户在悬浮球聊天中表达同意会议意向时，系统自动发送<strong>会议意向邮件</strong>至下方邮箱</li>
          <li>按场景分配：<strong>产品咨询</strong>→ 匹配 product_consult；<strong>代理合作</strong>→ 匹配 partner_coop；其他→ <strong>默认</strong></li>
          <li>发件邮箱由 <Link href="/admin/ai/config" className="text-gold-600 hover:underline">AI 设定</Link> 中的 SMTP 配置</li>
        </ul>
      </div>
      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="邮箱" className="px-4 py-2 border rounded-lg w-48" />
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="姓名（可选）" className="px-4 py-2 border rounded-lg w-32" />
          <select value={scenario} onChange={e => setScenario(e.target.value)} className="px-4 py-2 border rounded-lg w-28">
            {SCENARIOS.map(s => <option key={s.value || 'def'} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={add} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-white rounded-lg disabled:opacity-50">
            <Plus size={18} /> 添加
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {list.map(x => (
          <div key={x.id} className="flex items-center justify-between p-4 border rounded-lg">
            <span>{x.email} {x.name && `(${x.name})`}</span>
            <div className="flex items-center gap-2">
              <select
                value={x.scenario ?? ''}
                onChange={e => updateScenario(x.id, e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                {SCENARIOS.map(s => <option key={s.value || 'd'} value={s.value}>{s.label}</option>)}
              </select>
              <button onClick={() => del(x.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-ink-500 py-8 text-center">暂无</p>}
      </div>
      {msg && <p className={`mt-4 ${msg.includes('已') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
    </AdminLayout>
  )
}
