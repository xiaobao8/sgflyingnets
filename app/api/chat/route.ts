/**
 * AI 聊天代理：将前端 widget 的请求转发到 Python AI 后端
 * 避免前端直连 localhost:8000，解决线上跨域和地址不可达问题
 */
import { NextRequest, NextResponse } from 'next/server'

const AI_BASE = process.env.AI_ASSISTANT_API || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const res = await fetch(`${AI_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { error: 'AI 助手服务不可用' },
      { status: 502 }
    )
  }
}

