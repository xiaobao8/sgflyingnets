'use client'

/**
 * 内容同步订阅：SSE 实时推送 + 轮询兜底
 * 收到 content:updated 时触发 router.refresh()，实现后台修改后前端自动刷新（≤5秒）
 */
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const POLL_INTERVAL_MS = 5000
const SSE_URL = '/api/events'
const VERSION_URL = '/api/content/version'

export function ContentSyncNotifier() {
  const router = useRouter()
  const versionRef = useRef<number | null>(null)
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const doRefresh = () => {
    router.refresh()
  }

  useEffect(() => {
    let eventSource: EventSource | null = null
    let mounted = true

    const startPolling = () => {
      if (pollTimerRef.current) return
      pollTimerRef.current = setInterval(async () => {
        if (!mounted) return
        try {
          const res = await fetch(VERSION_URL, { cache: 'no-store' })
          const d = await res.json()
          const v = d?.version
          if (typeof v === 'number') {
            if (versionRef.current !== null && versionRef.current !== v) {
              doRefresh()
            }
            versionRef.current = v
          }
        } catch {
          // 忽略轮询错误
        }
      }, POLL_INTERVAL_MS)
    }

    const stopPolling = () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
        pollTimerRef.current = null
      }
    }

    try {
      eventSource = new EventSource(SSE_URL)
      eventSource.addEventListener('connected', () => {
        stopPolling()
      })
      eventSource.addEventListener('content:updated', () => {
        doRefresh()
      })
      eventSource.onerror = () => {
        eventSource?.close()
        eventSource = null
        startPolling()
      }
    } catch {
      startPolling()
    }

    return () => {
      mounted = false
      eventSource?.close()
      stopPolling()
    }
  }, [router])

  return null
}
