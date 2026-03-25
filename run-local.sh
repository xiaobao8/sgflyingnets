#!/bin/bash
# 本地运行（不依赖 Docker，避免 chunk 加载问题）
cd "$(dirname "$0")"

echo ">>> 初始化数据..."
mkdir -p data
[ -f data/content.json ] || node scripts/seed-data.js

echo ">>> 构建..."
npm run build

echo ">>> 启动服务..."
echo ""
echo "✅ 请在浏览器打开: http://localhost:3000"
echo "   管理后台: http://localhost:3000/admin (admin，密码见 README)"
echo ""
echo "按 Ctrl+C 停止"
echo ""

exec npm run start
