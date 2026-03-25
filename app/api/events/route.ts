/**
 * Server-Sent Events：后台内容变更时推送给前端
 * 前端订阅后，收到 content:updated 时触发 router.refresh() 实现准实时同步（≤5秒）
 */
import { NextRequest } from 'next/server'
import { subscribeContentUpdates } from '@/lib/sync'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const HEARTBEAT_INTERVAL_MS = 25_000

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: object) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
        } catch {
          // 连接已关闭
        }
      }
      send('connected', { ts: Date.now() })
      const unsubscribe = subscribeContentUpdates((payload) => {
        send('content:updated', payload)
      })
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`))
        } catch {
          clearInterval(heartbeat)
        }
      }, HEARTBEAT_INTERVAL_MS)
      const onAbort = () => {
        clearInterval(heartbeat)
        unsubscribe()
        controller.close()
      }
      req.signal?.addEventListener('abort', onAbort)
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
