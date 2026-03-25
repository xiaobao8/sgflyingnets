'use client'

import { useEffect, useState } from 'react'

export function MediaPicker({
  onSelect,
  current,
}: {
  onSelect: (url: string) => void
  current?: string
}) {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/upload', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setFiles(data.files || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-ink-500 text-sm">加载中...</p>

  return (
    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
      {files.map(f => (
        <button
          key={f.name}
          type="button"
          onClick={() => onSelect(f.url)}
          className={`aspect-video rounded border-2 overflow-hidden ${
            current === f.url ? 'border-gold-500' : 'border-ink-200 hover:border-ink-400'
          }`}
        >
          <img src={f.url} alt="" className="w-full h-full object-cover" />
        </button>
      ))}
      {files.length === 0 && (
        <p className="col-span-4 text-ink-500 text-sm">暂无图片，请先上传</p>
      )}
    </div>
  )
}
