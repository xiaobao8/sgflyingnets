import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromCookies } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { readStore, writeStore } from '@/lib/store'

export async function POST(req: NextRequest) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { currentPassword, newPassword, newUsername } = body

    const store = readStore()
    const admin = store.admins.find(a => a.username === auth.username)
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

    const valid = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!valid) return NextResponse.json({ error: '当前密码错误' }, { status: 401 })

    const updates: { username?: string; password_hash?: string } = {}

    if (newUsername && typeof newUsername === 'string' && newUsername.trim().length >= 2) {
      const trimmed = newUsername.trim()
      if (store.admins.some(a => a.username === trimmed && a.username !== auth.username)) {
        return NextResponse.json({ error: '用户名已存在' }, { status: 400 })
      }
      updates.username = trimmed
    }

    if (newPassword && newPassword.length >= 6) {
      updates.password_hash = await bcrypt.hash(newPassword, 10)
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: '请提供新用户名或新密码' }, { status: 400 })
    }

    const admins = store.admins.map(a =>
      a.username === auth.username ? { ...a, ...updates } : a
    )
    writeStore({ admins })
    return NextResponse.json({ ok: true, username: updates.username })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
