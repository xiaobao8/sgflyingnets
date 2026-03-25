/**
 * 内容版本号：用于轮询兜底（≤5秒轮询）
 * 前端可轮询此接口，若 version 变化则 refetch 或 router.refresh()
 */
import { NextResponse } from 'next/server'
import { getContentVersion } from '@/lib/sync'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ version: getContentVersion(), ts: Date.now() })
}
