/**
 * 同步核心层：数据唯一来源、缓存失效、实时推送
 * - 后台数据变更后主动清除缓存，强制下次读取从持久化源拉取
 * - 通过 EventEmitter 通知 SSE 连接，实现准实时推送（≤5秒）
 * - 支持版本号/ETag 用于轮询兜底
 */
import { EventEmitter } from 'events'

// ========== 内容版本与缓存 ==========
let contentVersion = 0
const CACHE_TTL_MS = 60_000 // 1 分钟兜底过期
let contentCache: { data: unknown; ts: number } | null = null

/** 获取当前内容版本号（用于 ETag、轮询） */
export function getContentVersion(): number {
  return contentVersion
}

/** 读取缓存（若未过期），否则返回 null 表示需从 store 拉取 */
export function getCachedContent<T>(): T | null {
  if (!contentCache) return null
  if (Date.now() - contentCache.ts > CACHE_TTL_MS) {
    contentCache = null
    return null
  }
  return contentCache.data as T
}

/** 写入缓存 */
export function setCachedContent<T>(data: T): void {
  contentCache = { data, ts: Date.now() }
}

/** 清除内容缓存并递增版本，触发推送 */
export function invalidateContent(reason?: string): void {
  contentCache = null
  contentVersion += 1
  syncEvents.emit('content:updated', { version: contentVersion, reason: reason || 'write' })
}

// ========== 事件总线（SSE 推送源） ==========
export const syncEvents = new EventEmitter()
syncEvents.setMaxListeners(100)

/** 订阅内容变更（SSE 使用） */
export function subscribeContentUpdates(
  onUpdate: (payload: { version: number; reason?: string }) => void
): () => void {
  const handler = (payload: { version: number; reason?: string }) => onUpdate(payload)
  syncEvents.on('content:updated', handler)
  return () => syncEvents.off('content:updated', handler)
}

// ========== AI 配置变更（跨服务通知占位） ==========
/** AI 配置变更时由 AI 服务或代理调用，用于未来扩展 Redis 等 */
export function notifyAIConfigUpdated(scope?: string): void {
  syncEvents.emit('ai:config:updated', { scope: scope || 'all' })
}
