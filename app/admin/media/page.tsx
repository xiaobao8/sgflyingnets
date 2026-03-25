'use client'

import { useEffect, useState, useRef } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function AdminMediaPage() {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const refresh = () => {
    setLoading(true)
    fetch('/api/upload', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => refresh(), [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: formData })
      if (!res.ok) throw new Error('上传失败')
      refresh()
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  return (
    <AdminLayout title="媒体库">
      <div className="bg-white border border-ink-200 rounded-lg p-6">
        <div className="mb-6">
          <h3 className="font-medium text-ink-900 mb-2">上传新图片</h3>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 border border-ink-300 rounded hover:bg-ink-50 disabled:opacity-50"
          >
            {uploading ? '上传中...' : '选择图片上传'}
          </button>
        </div>
        <h3 className="font-medium text-ink-900 mb-4">已上传图片</h3>
        {loading ? (
          <p className="text-ink-500">加载中...</p>
        ) : files.length === 0 ? (
          <p className="text-ink-500">暂无图片</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map(f => (
              <div key={f.name} className="border rounded overflow-hidden group">
                <div className="aspect-video bg-ink-100">
                  <img src={f.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-2 text-xs text-ink-600 truncate" title={f.url}>
                  {f.name}
                </div>
                <button
                  type="button"
                  onClick={() => copyUrl(f.url)}
                  className="w-full py-1 text-xs bg-ink-100 hover:bg-ink-200 text-ink-700"
                >
                  复制 URL
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
