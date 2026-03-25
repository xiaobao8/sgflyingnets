'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function AdminAccountPage() {
  const [username, setUsername] = useState('')
  const [current, setCurrent] = useState('')
  const [newUser, setNewUser] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(d => d?.username && setUsername(d.username))
  }, [])

  const save = async () => {
    if (!current) {
      setMsg('请输入当前密码')
      return
    }
    if (newPwd && newPwd.length < 6) {
      setMsg('新密码至少 6 位')
      return
    }
    if (newPwd && newPwd !== confirm) {
      setMsg('两次输入密码不一致')
      return
    }
    if (newUser && newUser.trim().length < 2) {
      setMsg('新用户名至少 2 位')
      return
    }
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: current,
          newPassword: newPwd || undefined,
          newUsername: newUser.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '修改失败')
      setMsg('修改成功，请使用新凭据重新登录')
      setCurrent('')
      setNewPwd('')
      setConfirm('')
      setNewUser('')
      if (data.username) setUsername(data.username)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : '修改失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="账号安全">
      <div className="space-y-8 max-w-md">
        <div className="bg-white border border-ink-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-ink-900 border-b pb-2">当前账号</h3>
          <p className="text-ink-600">用户名：<strong>{username || '-'}</strong></p>
        </div>

        <div className="bg-white border border-ink-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-ink-900 border-b pb-2">修改用户名 / 密码</h3>
          <p className="text-ink-500 text-sm">修改用户名后需重新登录。修改密码需输入当前密码。</p>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">当前密码 *</label>
            <input
              type="password"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">新用户名（可选，至少 2 位）</label>
            <input
              type="text"
              value={newUser}
              onChange={e => setNewUser(e.target.value)}
              placeholder={username}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">新密码（可选，至少 6 位）</label>
            <input
              type="password"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">确认新密码</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          {msg && <p className={msg.includes('成功') ? 'text-green-600' : 'text-red-600'}>{msg}</p>}
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-800 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存修改'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
