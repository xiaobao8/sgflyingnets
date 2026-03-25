/**
 * 自定义服务器：修复 OrbStack/Docker 环境下 /_next 被剥离为 /next 的问题
 * 1. /_next/*、/next/*、/nxt/* 请求 -> 直接从 .next/static 提供文件，绕过 Next.js 避免 400
 * 2. HTML/JS/CSS 响应中 /_next/ -> /nxt/
 * 3. 规范化 X-Forwarded-* 头
 */
const { createServer } = require('http')
const { parse } = require('url')
const { readFileSync, existsSync } = require('fs')
const { join } = require('path')
const next = require('next')

const PROXY_HEADERS = ['x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-port']
const ASSET_PATH = '/nxt/'
const MIME = { '.js': 'application/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.map': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' }

function normalizeProxyHeaders(req) {
  for (const name of PROXY_HEADERS) {
    const val = req.headers[name]
    if (!val) continue
    const str = Array.isArray(val) ? val[0] : String(val)
    if (str.includes(',')) req.headers[name] = str.split(',')[0].trim()
  }
}

// Next.js 构建有时会引用不存在的 chunk 914，用 972 作为 fallback（同为 client 组件 chunk）
const CHUNK_FALLBACK = { 'static/chunks/914-942b17b0ebf36b7c.js': 'static/chunks/972-6567da0868a15ef4.js' }

function serveStatic(req, res, pathname) {
  const subPath = pathname.replace(/^\/(nxt|next|_next)\//, '')  // static/css/xxx 或 static/chunks/xxx
  if (!subPath.startsWith('static/') || subPath.includes('..')) return false
  let filePath = join(process.cwd(), '.next', subPath)
  if (!existsSync(filePath) && CHUNK_FALLBACK[subPath]) filePath = join(process.cwd(), '.next', CHUNK_FALLBACK[subPath])
  if (!existsSync(filePath)) return false
  try {
    const ext = subPath.includes('.') ? '.' + subPath.split('.').pop() : ''
    const mime = MIME[ext] || 'application/octet-stream'
    const data = readFileSync(filePath)
    res.setHeader('Content-Type', mime)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.end(data)
    return true
  } catch {
    return false
  }
}

function servePublicFile(req, res, pathname) {
  // /images/* 和 /uploads/* 直接从 public 提供
  if (!pathname.startsWith('/images/') && !pathname.startsWith('/uploads/')) return false
  const subPath = pathname.slice(1)
  if (subPath.includes('..')) return false
  const filePath = join(process.cwd(), 'public', subPath)
  if (!existsSync(filePath)) return false
  try {
    const data = readFileSync(filePath)
    let mime = MIME[subPath.includes('.') ? '.' + subPath.split('.').pop() : ''] || 'application/octet-stream'
    if (data[0] === 0xff && data[1] === 0xd8) mime = 'image/jpeg'
    else if (data[0] === 0x89 && data[1] === 0x50) mime = 'image/png'
    res.setHeader('Content-Type', mime)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.end(data)
    return true
  } catch {
    return false
  }
}

function interceptHtmlResponse(res) {
  const chunks = []
  const _setHeader = res.setHeader.bind(res)
  const _end = res.end.bind(res)
  // 阻止 Next.js 设置 Content-Encoding，避免修改响应体后编码不匹配导致 ERR_CONTENT_DECODING_FAILED
  res.setHeader = function (name, value) {
    if (String(name).toLowerCase() === 'content-encoding') return
    return _setHeader(name, value)
  }
  res.write = (chunk, ...args) => {
    if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    return true
  }
  res.end = (chunk, ...args) => {
    if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    const ct = String(res.getHeader('Content-Type') || '')
    const body = Buffer.concat(chunks).toString('utf8')
    const isText = ct.includes('text/html') || ct.includes('javascript') || ct.includes('text/css')
    const modified = isText ? body.replace(/\/_next\//g, ASSET_PATH) : body
    if (!res.headersSent) {
      _setHeader('Content-Length', Buffer.byteLength(modified))
      if (ct.includes('text/html')) _setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    }
    return _end(modified, ...args)
  }
}

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    normalizeProxyHeaders(req)
    // 对需要拦截修改的请求，禁用压缩，避免修改后 Content-Encoding 与内容不匹配导致 ERR_CONTENT_DECODING_FAILED
    const parsedUrl = parse(req.url, true)
    const pathname = parsedUrl.pathname || ''
    if ((pathname.startsWith('/images/') || pathname.startsWith('/uploads/')) && servePublicFile(req, res, pathname)) return
    if (pathname.startsWith('/nxt/') || pathname.startsWith('/next/') || pathname.startsWith('/_next/')) {
      if (serveStatic(req, res, pathname)) return
      parsedUrl.pathname = pathname.replace(/^\/(nxt|next|_next)\//, '/_next/')
      parsedUrl.path = parsedUrl.pathname + (parsedUrl.search || '')
      req.url = parsedUrl.path
    }
    if (pathname === '/' || pathname === '' || (!pathname.startsWith('/_next') && !pathname.startsWith('/api') && !pathname.startsWith('/favicon'))) {
      req.headers['accept-encoding'] = 'identity'  // 要求 Next.js 返回未压缩内容，便于拦截修改
      interceptHtmlResponse(res)
    }
    handle(req, res, parsedUrl)
  }).listen(parseInt(process.env.PORT || '3000', 10), process.env.HOSTNAME || '0.0.0.0', () => {
    console.log(`> Ready on http://${process.env.HOSTNAME || '0.0.0.0'}:${process.env.PORT || 3000}`)
  })
})
