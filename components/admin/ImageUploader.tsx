'use client'

import { useState, useRef } from 'react'
import { MediaPicker } from './MediaPicker'

export function ImageUploader({
  value,
  onChange,
  label = '图片',
}: {
  value?: string
  onChange: (url: string) => void
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '上传失败')
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-2">{label}</label>
      <div className="flex gap-4 items-start">
        {value && (
          <div className="w-32 h-20 rounded border overflow-hidden bg-ink-100 flex-shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 border border-ink-300 rounded text-sm hover:bg-ink-50 disabled:opacity-50"
          >
            {uploading ? '上传中...' : value ? '更换图片' : '上传图片'}
          </button>
          <button
            type="button"
            onClick={() => setShowPicker(p => !p)}
            className="ml-2 px-4 py-2 border border-ink-300 rounded text-sm hover:bg-ink-50"
          >
            从库选择
          </button>
          {showPicker && (
            <div className="mt-2 p-2 border rounded bg-ink-50">
              <MediaPicker current={value} onSelect={url => { onChange(url); setShowPicker(false) }} />
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="ml-2 px-4 py-2 text-red-600 text-sm hover:bg-red-50 rounded"
            >
              移除
            </button>
          )}
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
      </div>
    </div>
  )
}
