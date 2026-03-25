'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-ink-900 p-6">
      <h2 className="text-xl font-semibold mb-4">出错了</h2>
      <p className="text-ink-600 mb-6 text-center max-w-md">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-ink-900 text-cream rounded hover:bg-ink-800 transition-colors"
      >
        重试
      </button>
    </div>
  )
}
