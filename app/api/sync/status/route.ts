/**
 * 同步状态校验接口：后台可查看各模块同步状态
 */
import { NextResponse } from 'next/server'
import { getAuthFromCookies } from '@/lib/auth'
import { getContentVersion } from '@/lib/sync'

export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await getAuthFromCookies()
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const aiBase = process.env.AI_ASSISTANT_API || 'http://localhost:8000'
  let aiReachable = false
  try {
    const r = await fetch(`${aiBase}/api/admin/email-config`, { cache: 'no-store', signal: AbortSignal.timeout(3000) })
    aiReachable = r.ok
  } catch {
    // AI 服务不可用
  }

  return NextResponse.json({
    content: {
      version: getContentVersion(),
      source: 'content.json',
      cacheTtlSec: 60,
    },
    ai: {
      reachable: aiReachable,
      configSource: 'database',
      note: 'AI 配置每次请求从数据库读取，无缓存，修改后立即生效',
    },
    sync: {
      sseEndpoint: '/api/events',
      versionEndpoint: '/api/content/version',
      pollIntervalSec: 5,
    },
    ts: Date.now(),
  })
}
