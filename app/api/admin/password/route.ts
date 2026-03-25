import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromCookies } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { readStore, writeStore } from '@/lib/store'

export async function POST(req: NextRequest) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const store = readStore()
    const admin = store.admins.find(a => a.username === auth.username)
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

    const valid = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!valid) return NextResponse.json({ error: 'Current password incorrect' }, { status: 401 })

    const hash = await bcrypt.hash(newPassword, 10)
    const admins = store.admins.map(a =>
      a.username === auth.username ? { ...a, password_hash: hash } : a
    )
    writeStore({ admins })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
