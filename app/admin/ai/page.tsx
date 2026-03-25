'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { MessageSquare, Mail, Cpu, Database, FileText, Users } from 'lucide-react'

const AI_BASE = process.env.NEXT_PUBLIC_AI_ASSISTANT_API || 'http://localhost:8000'

function useAiFetch(path: string) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetch(`/api/ai/proxy?path=${encodeURIComponent(path)}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d); setError(null) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [path])
  return { data, loading, error }
}

export default function AdminAIPage() {
  const { data: tokenData } = useAiFetch('/api/token-usage')

  return (
    <AdminLayout title="AI 助手管理">
      <p className="text-ink-500 text-sm mb-6">所有表单统一由 AI 助手分析、汇总，并由 AI 邮箱统一回复。各表单独立邮箱已移除。</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/ai/config" className="p-6 border rounded-xl hover:border-gold-500/50 flex items-center gap-4">
          <MessageSquare className="w-10 h-10 text-gold-600" />
          <div>
            <h3 className="font-semibold">AI 设定</h3>
            <p className="text-sm text-ink-500">提示词、LLM、邮箱</p>
          </div>
        </Link>
        <Link href="/admin/ai/prompts" className="p-6 border rounded-xl hover:border-gold-500/50 flex items-center gap-4">
          <Mail className="w-10 h-10 text-gold-600" />
          <div>
            <h3 className="font-semibold">提示词</h3>
            <p className="text-sm text-ink-500">聊天/邮件场景</p>
          </div>
        </Link>
        <Link href="/admin/ai/knowledge" className="p-6 border rounded-xl hover:border-gold-500/50 flex items-center gap-4">
          <Database className="w-10 h-10 text-gold-600" />
          <div>
            <h3 className="font-semibold">知识库</h3>
            <p className="text-sm text-ink-500">仅参考，不可外发</p>
          </div>
        </Link>
        <Link href="/admin/materials" className="p-6 border rounded-xl hover:border-gold-500/50 flex items-center gap-4">
          <FileText className="w-10 h-10 text-gold-600" />
          <div>
            <h3 className="font-semibold">材料库管理</h3>
            <p className="text-sm text-ink-500">仅 PDF，AI 邮件附件</p>
          </div>
        </Link>
        <Link href="/admin/ai/sales" className="p-6 border rounded-xl hover:border-gold-500/50 flex items-center gap-4">
          <Users className="w-10 h-10 text-gold-600" />
          <div>
            <h3 className="font-semibold">内部销售邮箱</h3>
            <p className="text-sm text-ink-500">客户同意会议后发送</p>
          </div>
        </Link>
        <Link href="/admin/ai/data" className="p-6 border rounded-xl hover:border-gold-500/50 flex items-center gap-4">
          <Cpu className="w-10 h-10 text-gold-600" />
          <div>
            <h3 className="font-semibold">数据与报表</h3>
            <p className="text-sm text-ink-500">表单、邮件、Token</p>
          </div>
        </Link>
      </div>
      {tokenData && typeof tokenData === 'object' && 'daily' in tokenData ? (
        <div className="p-4 bg-ink-50 rounded-lg">
          <h4 className="font-medium mb-2">Token 消耗</h4>
          <p className="text-sm text-ink-600">今日 {(tokenData as { daily?: number }).daily ?? 0} / 本月 {(tokenData as { monthly?: number }).monthly ?? 0}</p>
        </div>
      ) : null}
    </AdminLayout>
  )
}
