import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-ink-900 p-6">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-ink-600 mb-6">页面未找到</p>
      <Link
        href="/"
        className="px-6 py-3 bg-ink-900 text-cream rounded hover:bg-ink-800 transition-colors"
      >
        返回首页
      </Link>
    </div>
  )
}
