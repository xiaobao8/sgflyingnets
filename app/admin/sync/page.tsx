'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react'

type SyncStatus = {
  content?: { version: number; source: string; cacheTtlSec: number }
  ai?: { reachable: boolean; configSource: string; note: string }
  sync?: { sseEndpoint: string; versionEndpoint: string; pollIntervalSec: number }
  ts?: number
}

export default function AdminSyncPage() {
  const [status, setStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/sync/status', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setStatus(d))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <AdminLayout title="同步状态">
      <p className="text-slate-500 text-sm mb-6">
        各模块数据同步状态与延迟阈值。后台保存后，前端应在 ≤5 秒内感知变更。
      </p>
      <div className="flex justify-end mb-4">
        <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium disabled:opacity-50 transition-colors">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          刷新
        </button>
      </div>
      {status ? (
        <div className="space-y-6">
          <div className="admin-card bg-white border border-slate-200/80 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">网站内容</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-slate-500">版本号</dt>
              <dd className="text-slate-900">{status.content?.version ?? '-'}</dd>
              <dt className="text-slate-500">数据源</dt>
              <dd className="text-slate-900">{status.content?.source ?? '-'}</dd>
              <dt className="text-slate-500">缓存 TTL</dt>
              <dd className="text-slate-900">{status.content?.cacheTtlSec ?? '-'} 秒</dd>
            </dl>
          </div>
          <div className="admin-card bg-white border border-slate-200/80 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">AI 助手</h3>
            <div className="flex items-center gap-2 mb-2">
              {status.ai?.reachable ? <CheckCircle className="text-emerald-600" size={20} /> : <XCircle className="text-red-500" size={20} />}
              <span className="font-medium">{status.ai?.reachable ? '可连接' : '不可连接'}</span>
            </div>
            <p className="text-slate-500 text-sm">{status.ai?.note}</p>
          </div>
          <div className="admin-card bg-white border border-slate-200/80 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">同步机制</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-slate-500">SSE 端点</dt>
              <dd className="text-slate-900">{status.sync?.sseEndpoint ?? '-'}</dd>
              <dt className="text-slate-500">版本端点</dt>
              <dd className="text-slate-900">{status.sync?.versionEndpoint ?? '-'}</dd>
              <dt className="text-slate-500">轮询间隔</dt>
              <dd className="text-slate-900">{status.sync?.pollIntervalSec ?? '-'} 秒</dd>
            </dl>
          </div>
          {status.ts && <p className="text-slate-400 text-xs">最后更新：{new Date(status.ts).toLocaleString()}</p>}
        </div>
      ) : (
        <p className="text-slate-500">加载失败</p>
      )}
    </AdminLayout>
  )
}
