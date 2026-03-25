import { NextResponse } from 'next/server'
import { getAuthFromCookies } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import { readStore } from '@/lib/store'

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json')

function loadSubmissions() {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return []
  try {
    return JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

export async function GET() {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const list = loadSubmissions()
    const today = new Date().toISOString().slice(0, 10)
    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)
    const weekAgo = thisWeek.toISOString()

    const total = list.length
    const contactCount = list.filter((s: { type?: string }) => s.type === 'contact').length
    const partnershipCount = list.filter((s: { type?: string }) => s.type === 'partnership').length
    const todayCount = list.filter((s: { created_at?: string }) => (s.created_at || '').startsWith(today)).length
    const weekCount = list.filter((s: { created_at?: string }) => (s.created_at || '') >= weekAgo).length

    const store = readStore()
    const siteSmtp = !!(process.env.SMTP_HOST || store.site_config?.smtp_host) &&
      !!(process.env.SMTP_USER || store.site_config?.smtp_user) &&
      !!(process.env.SMTP_PASS || store.site_config?.smtp_pass)

    // AI 发件邮箱（表单回复、会议触发均用此配置）
    let aiSmtpConfigured = siteSmtp
    try {
      const aiBase = process.env.AI_ASSISTANT_API || 'http://localhost:8000'
      const aiRes = await fetch(`${aiBase}/api/admin/email-config`, { cache: 'no-store' })
      if (aiRes.ok) {
        const d = await aiRes.json()
        aiSmtpConfigured = !!(d?.smtp_host && d?.smtp_user)
      }
    } catch {
      // AI 服务不可用时沿用站点配置
    }

    return NextResponse.json({
      submissions: { total, contact: contactCount, partnership: partnershipCount, today: todayCount, week: weekCount },
      smtpConfigured: aiSmtpConfigured,
      contactEmail: store.site_config?.contact_email || '',
      partnershipEmail: store.site_config?.partnership_email || '',
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
