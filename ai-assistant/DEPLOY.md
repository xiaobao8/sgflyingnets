# AI 营销小助手 - 部署说明

## 一、依赖安装

```bash
cd ai-assistant
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 二、配置文件

复制 `.env.example` 为 `.env` 并修改：

```bash
cp .env.example .env
```

`.env` 示例：

```env
# 数据库（默认 SQLite，可改为 PostgreSQL）
DATABASE_URL=sqlite+aiosqlite:///./data/ai_assistant.db

# HP 网站 data 目录（用于同步 submissions.json）
HP_DATA_DIR=../data

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# SMTP（AI 发件）
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=授权码

# LLM
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-xxx
# OPENAI_BASE_URL=https://api.openai.com/v1  # 国内代理可改

# Token 限流
TOKEN_DAILY_LIMIT=100000
TOKEN_MONTHLY_LIMIT=2000000
```

## 三、启动服务

```bash
cd ai-assistant
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 四、与 HP 网站集成

### 1. 前端悬浮球

HP 项目已集成悬浮球脚本，通过环境变量配置 API 地址：

```env
# HP 项目 .env.local
NEXT_PUBLIC_AI_ASSISTANT_API=http://localhost:8000
```

### 2. 表单统一由 AI 处理

- 各表单独立邮箱已移除，所有表单提交统一发送到 AI 助手
- 环境变量 `AI_ASSISTANT_WEBHOOK` 必填，如：`http://localhost:8000/api/webhook/form`
- AI 助手接收后：存储 → AI 分析 → 由 AI 邮箱统一回复客户

### 3. 管理后台代理

- HP 管理后台通过 `/api/ai/proxy` 调用 AI 助手
- 环境变量 `AI_ASSISTANT_API` 必填，如：`http://localhost:8000`

### 4. 数据同步

- 表单数据：通过 Webhook 实时同步
- 或定时任务读取 `HP/data/submissions.json` 同步到 AI 助手数据库

## 五、权限与规则说明

| 模块 | 用途 | 是否可外发 |
|------|------|------------|
| 知识库 | PDF/PPT/Excel/Word，AI 回复参考 | 否，仅内部参考 |
| 材料库 | 仅 PDF，邮件附件 | 是，可作附件发送 |

- **内部销售邮箱**：客户同意会议后，系统发送「沟通总结+兴趣分析+跟进建议」到配置的销售邮箱
- **Token 限流**：调用前校验日/月剩余量，超限则返回 429

## 六、异常处理

- LLM 调用失败：返回友好提示，记录日志
- 邮件发送失败：记录到 email_records，status=failed
- 文件解析错误：拒绝入库，返回错误信息
- Token 超限：返回 429，提示联系管理员
- 材料库非 PDF：拒绝上传，返回 400

## 七、测试

```bash
# 健康检查
curl http://localhost:8000/docs

# 聊天测试
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test1","message":"你好"}'
```
