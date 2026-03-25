# AI 营销小助手

基于 Flyingnets 官网的 AI 营销小助手，与现有表单系统深度联动。

## 功能概览

| 模块 | 说明 |
|------|------|
| **悬浮球聊天** | 圆形可拖拽，AI 以销售身份回复，自然引导客户同意在线会议 |
| **表单联动** | 读取产品/代理表单信息，精准回应；客户同意会议后触发内部邮件分配 |
| **知识库** | PDF/PPT/Excel/Word 解析，FAISS 向量存储，**仅 AI 参考，不可外发** |
| **材料库** | 仅 PDF，AI 智能匹配后作为**邮件附件**发送 |
| **内部邮件** | 客户同意会议后，自动发送沟通总结+兴趣分析+跟进建议到指定销售邮箱 |
| **Token 限流** | 日/月限额，超限暂停并通知 |

## 快速启动

```bash
cd ai-assistant
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env 填写 OPENAI_API_KEY、SMTP 等
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 与 HP 网站集成

1. **悬浮球**：HP 已集成，设置 `NEXT_PUBLIC_AI_ASSISTANT_API=http://localhost:8000`
2. **表单 Webhook**：HP 表单提交后同步数据，设置 `AI_ASSISTANT_WEBHOOK=http://localhost:8000/api/webhook/form`

详见 [DEPLOY.md](./DEPLOY.md)。
