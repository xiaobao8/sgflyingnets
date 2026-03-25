'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Upload, AlertCircle } from 'lucide-react'

const PROXY = '/api/ai/proxy'

export default function AdminAIKnowledgePage() {
  const [list, setList] = useState<{ id: number; filename: string; file_type: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () => {
    fetch(`${PROXY}?path=${encodeURIComponent('/api/admin/knowledge')}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setList(Array.isArray(d) ? d : []))
  }
  useEffect(() => { load() }, [])

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'pptx', 'xlsx', 'docx'].includes(ext || '')) {
      setMsg('仅支持 PDF / PPT / Excel / Word')
      return
    }
    setUploading(true)
    setMsg('')
    const fd = new FormData()
    fd.append('file', f)
    try {
      const r = await fetch(`${PROXY}?path=${encodeURIComponent('/api/knowledge/upload')}`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      const d = await r.json()
      if (r.ok) {
        setMsg('上传成功，仅作 AI 参考，不可外发')
        load()
      } else {
        setMsg(d.error || '上传失败')
      }
    } catch {
      setMsg('上传失败')
    } finally {
      setUploading(false)
    }
    e.target.value = ''
  }

  return (
    <AdminLayout title="知识库">
      <div className="flex flex-col gap-1 p-3 bg-amber-50 text-amber-800 rounded-lg mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">仅内部参考，不可外发</span>
        </div>
        <p className="text-xs text-amber-700/90 pl-6">支持 PDF/PPT/Excel/Word 解析，文本存入向量库供 AI 读取。无下载、附件发送功能。</p>
      </div>
      <div className="bg-white border rounded-xl p-6 mb-6">
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-white rounded-lg cursor-pointer">
          <Upload size={18} />
          {uploading ? '上传中...' : '上传 PDF / PPT / Excel / Word'}
          <input type="file" accept=".pdf,.pptx,.xlsx,.docx" onChange={onUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
      <div className="space-y-2">
        {list.map(x => (
          <div key={x.id} className="flex items-center justify-between p-4 border rounded-lg">
            <span>{x.filename}</span>
            <span className="text-ink-500 text-sm">{x.file_type}</span>
          </div>
        ))}
        {list.length === 0 && <p className="text-ink-500 py-8 text-center">暂无文件</p>}
      </div>
      {msg && <p className={`mt-4 ${msg.includes('成功') ? 'text-green-600' : 'text-amber-600'}`}>{msg}</p>}
    </AdminLayout>
  )
}
