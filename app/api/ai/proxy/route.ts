/**
 * AI 助手 API 代理（支持任意 path 和 method）
 * 用于管理后台调用，避免 CORS，统一鉴权
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromCookies } from '@/lib/auth'

const AI_BASE = process.env.AI_ASSISTANT_API || 'http://localhost:8000'

export async function GET(req: NextRequest) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const path = req.nextUrl.searchParams.get('path') || '/'
  const url = `${AI_BASE}${path}`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'AI 助手服务不可用' }, { status: 502 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const path = req.nextUrl.searchParams.get('path') || '/'
  const url = `${AI_BASE}${path}`
  try {
    const contentType = req.headers.get('content-type') || ''
    const isForm = contentType.includes('multipart/form-data')
    const opts: RequestInit = { method: 'POST' }
    if (isForm) {
      opts.body = await req.formData()
      opts.headers = {}
    } else {
      opts.headers = { 'Content-Type': 'application/json' }
      opts.body = await req.text()
    }
    const res = await fetch(url, opts)
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'AI 助手服务不可用' }, { status: 502 })
  }
}

export async function PUT(req: NextRequest) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const path = req.nextUrl.searchParams.get('path') || '/'
  const url = `${AI_BASE}${path}`
  try {
    const body = await req.json().catch(() => ({}))
    const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } as RequestInit)
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'AI 助手服务不可用' }, { status: 502 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const path = req.nextUrl.searchParams.get('path') || '/'
  const url = `${AI_BASE}${path}`
  try {
    const res = await fetch(url, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'AI 助手服务不可用' }, { status: 502 })
  }
}
