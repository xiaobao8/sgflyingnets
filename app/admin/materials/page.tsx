'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Upload, Eye, Pencil, Trash2, Download } from 'lucide-react'

const PROXY = '/api/ai/proxy'

const SCENES = [
  { value: 'product_consult', label: '产品咨询' },
  { value: 'partner_coop', label: '代理合作' },
  { value: 'general', label: '通用' },
]

type MaterialItem = {
  id: number
  file_name: string
  file_path: string
  scene: string
  upload_time: string
  call_count: number
}

export default function AdminMaterialsPage() {
  const [list, setList] = useState<MaterialItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [scene, setScene] = useState('product_consult')
  const [msg, setMsg] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingScene, setEditingScene] = useState('')
  const [previewId, setPreviewId] = useState<number | null>(null)

  const load = () => {
    fetch(`${PROXY}?path=${encodeURIComponent('/api/admin/material-library')}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setList(Array.isArray(d) ? d : []))
  }
  useEffect(() => { load() }, [])

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const ext = (f.name.split('.').pop() || '').toLowerCase()
    if (ext !== 'pdf') {
      setMsg('仅支持 PDF 格式，请重新上传')
      return
    }
    setUploading(true)
    setMsg('')
    const fd = new FormData()
    fd.append('file', f)
    fd.append('scene', scene)
    try {
      const r = await fetch(`${PROXY}?path=${encodeURIComponent('/api/admin/material-library/upload')}`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      const d = await r.json()
      if (r.ok) {
        setMsg('上传成功')
        load()
      } else {
        setMsg(d.detail || d.error || '上传失败')
      }
    } catch {
      setMsg('上传失败')
    } finally {
      setUploading(false)
    }
    e.target.value = ''
  }

  const updateScene = async (id: number, newScene: string) => {
    try {
      await fetch(`${PROXY}?path=${encodeURIComponent(`/api/admin/material-library/${id}`)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ scene: newScene }),
      })
      setEditingId(null)
      load()
    } catch {
      setMsg('更新失败')
    }
  }

  const del = async (id: number) => {
    if (!confirm('确定删除？')) return
    try {
      await fetch(`${PROXY}?path=${encodeURIComponent(`/api/admin/material-library/${id}`)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      load()
    } catch {}
  }

  const previewUrl = previewId ? `/api/admin/material-preview?id=${previewId}` : null

  const sceneLabel = (v: string) => SCENES.find(s => s.value === v)?.label || v

  const downloadUrl = (id: number) => `/api/admin/material-download?id=${id}`

  return (
    <AdminLayout title="材料库管理">
      <p className="text-ink-500 text-sm mb-6">
        仅 PDF 格式。邮件发送接口仅可调用材料库 PDF 作为附件。每次调用 call_count +1，支持后台查看统计。
      </p>
      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <select value={scene} onChange={e => setScene(e.target.value)} className="px-4 py-2 border rounded-lg">
            {SCENES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-white rounded-lg cursor-pointer">
            <Upload size={18} />
            {uploading ? '上传中...' : '上传 PDF'}
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={onUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-ink-50">
              <th className="text-left py-3 px-4 font-medium">文件名</th>
              <th className="text-left py-3 px-4 font-medium">适用场景</th>
              <th className="text-left py-3 px-4 font-medium">上传时间</th>
              <th className="text-left py-3 px-4 font-medium">调用次数</th>
              <th className="text-left py-3 px-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map(x => (
              <tr key={x.id} className="border-b hover:bg-ink-50/50">
                <td className="py-3 px-4">{x.file_name}</td>
                <td className="py-3 px-4">
                  {editingId === x.id ? (
                    <select
                      value={editingScene}
                      onChange={e => setEditingScene(e.target.value)}
                      onBlur={() => { updateScene(x.id, editingScene); setEditingId(null) }}
                      onKeyDown={e => e.key === 'Enter' && (updateScene(x.id, editingScene), setEditingId(null))}
                      autoFocus
                      className="px-2 py-1 border rounded text-sm"
                    >
                      {SCENES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  ) : (
                    <span>{sceneLabel(x.scene)}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-ink-500 text-sm">{x.upload_time?.slice(0, 19) || '-'}</td>
                <td className="py-3 px-4">{x.call_count ?? 0}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={downloadUrl(x.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-ink-600 hover:bg-ink-100 rounded"
                      title="下载"
                    >
                      <Download size={18} />
                    </a>
                    <button
                      onClick={() => setPreviewId(x.id)}
                      className="p-2 text-ink-600 hover:bg-ink-100 rounded"
                      title="预览"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => { setEditingId(x.id); setEditingScene(x.scene) }}
                      className="p-2 text-ink-600 hover:bg-ink-100 rounded"
                      title="编辑场景"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => del(x.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="删除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <p className="text-ink-500 py-8 text-center">暂无文件</p>}
      {msg && <p className={`mt-4 ${msg.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}

      {/* 预览弹窗 */}
      {previewId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setPreviewId(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-medium">PDF 预览</span>
              <button onClick={() => setPreviewId(null)} className="text-ink-500 hover:text-ink-700">关闭</button>
            </div>
            <iframe
              src={previewUrl || ''}
              className="flex-1 w-full min-h-[70vh]"
              title="PDF 预览"
            />
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
