#!/bin/bash
# 一键启动并验证
set -e
cd "$(dirname "$0")"

echo ">>> 停止旧容器..."
docker compose down 2>/dev/null || true

echo ">>> 构建并启动..."
docker compose up -d --build

echo ">>> 等待服务启动..."
sleep 6

echo ""
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q 200; then
  echo "✅ 启动成功！"
  echo ""
  echo "访问地址："
  echo "  http://localhost:3000"
  echo "  http://127.0.0.1:3000"
  echo ""
  echo "管理后台：http://localhost:3000/admin"
  echo "管理后台：admin，初始密码见 README 或 ADMIN_INITIAL_PASSWORD"
  echo ""
else
  echo "❌ 无法访问，请检查："
  echo "  1. OrbStack 是否已启动"
  echo "  2. 运行 docker compose logs -f 查看日志"
  exit 1
fi
