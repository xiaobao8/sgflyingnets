'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '登录失败')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#f8fafc]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[400px]"
      >
        <div className="admin-card bg-white border border-slate-200/80 rounded-2xl p-10 shadow-sm">
          <h1 className="admin-section-title text-slate-900 text-2xl text-center mb-2 tracking-tight">
            Flyingnets
          </h1>
          <p className="text-slate-500 text-sm text-center mb-8">管理后台登录</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none transition-shadow text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 outline-none transition-shadow text-slate-900"
                required
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-xs leading-relaxed">
            默认用户名 <span className="text-slate-500">admin</span>；初始密码见项目{' '}
            <code className="text-slate-500">README</code>，或通过环境变量{' '}
            <code className="text-slate-500">ADMIN_INITIAL_PASSWORD</code> 配置。
          </p>
        </div>
      </motion.div>
    </div>
  )
}
