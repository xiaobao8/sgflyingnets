#!/bin/bash
# AI 营销小助手 - 可执行测试用例
# 前置：AI 助手运行在 localhost:8000，HP 网站在 localhost:3000

AI_BASE="${AI_ASSISTANT_API:-http://localhost:8000}"
HP_BASE="${HP_BASE:-http://localhost:3000}"

echo "=== 测试 1: 聊天 API（需 LLM 已配置）==="
curl -s -X POST "$AI_BASE/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test_s1","message":"你好，想了解一下产品"}' | jq .

echo ""
echo "=== 测试 2: 同意会议关键词检测（应触发 meeting_agreed）==="
curl -s -X POST "$AI_BASE/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test_s2","message":"可以安排个时间详细聊聊吗"}' | jq .

echo ""
echo "=== 测试 3: 表单 Webhook（contact）==="
curl -s -X POST "$AI_BASE/api/webhook/form" \
  -H "Content-Type: application/json" \
  -d '{
    "type":"contact",
    "company":"测试公司",
    "contact":"张三",
    "phone":"13800138000",
    "email":"test@example.com",
    "product_interest":"安全产品",
    "message":"想了解报价"
  }' | jq .

echo ""
echo "=== 测试 4: 材料库非 PDF 上传（应返回 400）==="
echo "需通过管理后台上传 .docx 验证，或："
curl -s -X POST "$AI_BASE/api/admin/material-library/upload" \
  -F "file=@README.md" \
  -F "scene=product_consult" 2>/dev/null || echo "（需认证，此处仅作接口存在性检查）"

echo ""
echo "=== 测试 5: Token 统计 ==="
curl -s "$AI_BASE/api/token-usage" | jq .
