'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-6 font-sans">
        <h2 className="text-xl font-semibold mb-4">系统错误</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
        >
          重试
        </button>
      </body>
    </html>
  )
}
