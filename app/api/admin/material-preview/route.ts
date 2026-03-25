/**
 * 材料库 PDF 预览（仅管理员）
 * 代理到 AI 助手，校验登录后返回 PDF 流
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromCookies } from '@/lib/auth'

const AI_BASE = process.env.AI_ASSISTANT_API || 'http://20.188.26.9:8000/'

export async function GET(req: NextRequest) {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const url = `${AI_BASE}/api/admin/material-library/${id}/preview`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      return NextResponse.json({ error: '文件不存在' }, { status: res.status })
    }
    const blob = await res.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline', // 预览，非下载
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'AI 助手服务不可用' }, { status: 502 })
  }
}
