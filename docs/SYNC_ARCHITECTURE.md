# Flyingnets 同步架构说明

## 核心原则

1. **数据唯一来源**：网站内容以 `data/content.json` 为唯一可信源；AI 配置以 SQLite 数据库为唯一可信源
2. **实时生效**：后台保存后，前端/AI 助手 ≤5 秒内感知变更
3. **事务一致性**：`writeStore` 全量写入，失败则回滚（不写入文件）
4. **可见即所得**：后台配置与前端表现一致

---

## 模块同步矩阵

| 模块 | 数据源 | 触发条件 | 延迟阈值 | 一致性级别 |
|------|--------|----------|----------|------------|
| 网站内容（文字/图片/布局） | content.json | PUT /api/content/[section]、PUT /api/admin/layout | ≤5s（SSE 推送） | 强一致 |
| AI 提示词/LLM/邮箱 | AI 数据库 | 管理后台保存 | 立即（无缓存） | 强一致 |
| 知识库/材料库 | AI 数据库 + 文件 | 上传/删除/更新 | 下次调用时读取最新 | 强一致 |
| 表单提交 | submissions.json + FormSubmission | 前端表单 POST | 实时 | 强一致 |
| 邮件/会议意向 | EmailRecord | AI 发送后 | 实时 | 强一致 |
| Token 消耗 | TokenUsage | 每次 AI 调用后 | ≤1min（仪表盘轮询） | 最终一致 |

---

## 技术实现

### 1. 内容同步（网站文字/图片/布局）

**缓存策略**：
- `GET /api/content` 使用内存缓存，TTL 60 秒
- `writeStore` 成功后调用 `invalidateContent()` 清除缓存

**推送机制**：
- **SSE**：`GET /api/events`，后台保存后立即推送 `content:updated`
- **轮询兜底**：`GET /api/content/version`，每 5 秒轮询，version 变化则 `router.refresh()`

**前端**：`ContentSyncNotifier` 组件订阅 SSE，收到事件后调用 `router.refresh()`，服务端组件重新渲染并读取最新 content.json

### 2. AI 配置同步

- **无缓存**：`config_store.py` 每次请求从数据库读取
- 提示词、LLM、邮箱、销售邮箱修改后，下次 AI 对话/邮件生成立即使用新配置
- 悬浮球欢迎语：当前从提示词/配置读取，需在管理后台配置 `prompt_chat_base` 或扩展 AI 人设定

### 3. 业务数据同步

- 表单提交：`/api/submit/*` 写入 submissions.json 并调用 AI Webhook，AI 存储到 FormSubmission
- 邮件记录：AI 发送后写入 EmailRecord
- Token：每次 LLM 调用后写入 TokenUsage，仪表盘通过 `/api/ai/proxy?path=/api/token-usage` 获取

### 4. 异常处理与重试

- **保存失败**：`writeStore` 抛出异常，API 返回 500，前端提示错误，不调用 invalidate
- **SSE 断开**：前端自动降级为 5 秒轮询
- **同步状态**：`GET /api/sync/status`（需登录）可查看各模块状态

---

## API 清单

| 接口 | 说明 |
|------|------|
| `GET /api/events` | SSE 流，推送 content:updated |
| `GET /api/content/version` | 内容版本号，用于轮询 |
| `GET /api/content` | 全量内容（带 X-Content-Version 头） |
| `GET /api/sync/status` | 同步状态（管理员） |
