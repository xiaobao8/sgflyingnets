import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { readStore } from './store'

const JWT_SECRET = process.env.JWT_SECRET || 'flyingnets-admin-secret-2026'

export async function verifyPassword(username: string, password: string) {
  const store = readStore()
  const admin = store.admins.find(a => a.username === username)
  if (!admin) return null
  const ok = await bcrypt.compare(password, admin.password_hash)
  return ok ? { username } : null
}

export function createToken(payload: { username: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { username: string }
    return payload
  } catch {
    return null
  }
}

export async function getAuthFromCookies() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return null
  return verifyToken(token) as { username: string } | null
}
