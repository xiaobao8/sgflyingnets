#!/bin/sh
# 确保数据存在后启动服务
cd "$(dirname "$0")/.."
mkdir -p data
[ -f data/content.json ] || node scripts/seed-data.js
npm run serve
