#!/bin/bash
# 本地预览（不依赖 Docker，解决 OrbStack 浏览器无法访问问题）
# 每次均做完整清理构建，避免 chunk 缺失导致 "Cannot find module" 错误
cd "$(dirname "$0")"

# 停止 Docker 和占用 3000 端口的进程
docker compose down 2>/dev/null || true
lsof -ti :3000 | xargs kill -9 2>/dev/null || true

# 彻底清理构建产物和缓存（避免 276.js 等 chunk 缺失）
echo ">>> 清理旧构建..."
rm -rf .next node_modules/.cache

echo ">>> 初始化数据..."
mkdir -p data
[ -f data/content.json ] || node scripts/seed-data.js

echo ">>> 构建（首次约 1 分钟）..."
npm run build

echo ""
echo ">>> 启动服务..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  请在浏览器打开: http://localhost:3000"
echo "  管理后台: http://localhost:3000/admin"
echo "  默认账号: admin / admin123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "按 Ctrl+C 停止"
echo ""

# 本地预览使用标准 next start，避免 server.js 的 /_next -> /nxt 重写导致静态资源 404
exec npm run start:next
