# AI 营销小助手 - 全面验证报告

## 一、核心验证维度

### 1. 前端悬浮聊天助手验证

| 验证点 | 结果 | 说明 |
|--------|------|------|
| 1.1 悬浮球可拖拽、点击弹出、适配 PC/移动端 | **部分通过** | 可拖拽、点击弹出已实现；拖拽逻辑存在潜在问题：`ball.offsetLeft` 在 `position:fixed` 下可能不准确；移动端未实现 touch 事件 |
| 1.2 AI 以销售身份回复，无强制预约话术 | **通过** | `config_store.get_chat_prompt()` 默认提示词明确禁止「预约会议」「填写表单」，仅自然引导 |
| 1.3 仅客户表达同意会议时触发内部邮件 | **通过** | `check_meeting_agreed()` 检测用户消息关键词；无会议预约表单/CRM 对接 |
| 1.4 读取表单信息实现个性化回复 | **通过** | Widget 通过 `getFormContext()` 读取 `company/contact/phone/email/product_interest` 等，传入 `submission_context` |

---

### 2. 智能邮件回复验证

| 验证点 | 结果 | 说明 |
|--------|------|------|
| 2.1 表单提交后自动生成个性化邮件 | **通过** | Webhook 接收 payload，`get_email_prompt(type)` 区分 contact/partnership，LLM 生成 HTML 回复 |
| 2.2 附件仅调用材料库 PDF | **通过** | `match_material_for_email()` 仅返回 material_library 路径；`email_service` 校验路径含 `data/materials` |
| 2.3 客户同意会议后发送内部邮件 | **通过** | `send_internal_meeting_email()` 生成沟通总结、兴趣分析、跟进建议、客户信息 |
| 2.4 非 PDF 上传材料库时拒绝 | **通过** | `upload_material_library` 校验 `ext != ".pdf"` 返回 400；前端校验 `ext !== 'pdf'` 提示「仅支持 PDF 格式，请重新上传」 |

---

### 3. 管理后台验证

| 验证点 | 结果 | 说明 |
|--------|------|------|
| 3.1 材料库管理模块 | **通过** | `/admin/materials` 独立入口；仅 PDF；列表含文件名/场景/调用次数；支持预览/编辑/删除/下载 |
| 3.2 内部销售邮箱配置 | **通过** | `/admin/ai/sales` 支持添加/编辑场景/删除；按场景分配收件人 |
| 3.3 知识库标注「仅内部参考」 | **通过** | 知识库页面有「仅内部参考，不可外发」提示；无附件下载接口 |
| 3.4 LLM 多厂商 + Token 上限 | **部分通过** | 支持 Token 日/月上限，超限抛 ValueError(429)；仅实现 openai 厂商，无多厂商 API 密钥切换 |
| 3.5 表单/邮件/Token 记录 | **部分通过** | AI 数据页展示 FormSubmission、EmailRecord、Token；**表单数据来源不一致**：admin 主站用 `submissions.json`，AI 数据页用 FormSubmission（仅 webhook 写入） |

---

### 4. 核心规则验证

| 验证点 | 结果 | 说明 |
|--------|------|------|
| 4.1 知识库无附件外发逻辑 | **通过** | 知识库仅 `parse_file`→向量库；`email_service` 仅允许 `data/materials` 路径 |
| 4.2 材料库仅 PDF，其他格式拦截 | **通过** | 后端 `ext != ".pdf"` 返回 400；前端 `accept=".pdf"` 且校验扩展名 |
| 4.3 内部邮件内容自动生成 | **通过** | `generate_internal_email_content()` 基于聊天+表单+知识库生成 summary/interest/suggestion |

---

### 5. 异常场景验证

| 验证点 | 结果 | 说明 |
|--------|------|------|
| 5.1 LLM 调用失败友好提示 | **部分通过** | 聊天 API 抛 HTTPException 时，Widget 显示「抱歉，服务暂时不可用，请稍后再试。」；未区分 429/500 给出「暂无法回复，稍后联系人工」 |
| 5.2 邮件发送失败记录日志 | **通过** | `form_webhook` 异常时写入 `EmailRecord(status='failed', error_msg=str(e))` |
| 5.3 文件解析失败提示 | **通过** | `upload_knowledge` 解析失败时 `os.remove(path)` 并 `raise HTTPException(400, f"文件解析失败: {e}")` |
| 5.4 Token 超限不触发邮件 | **通过** | `get_llm_response` 先 `check_token_limit()`，超限直接 raise，不会执行后续聊天与会议触发逻辑 |

---

## 二、未通过项修复建议

### 2.1 悬浮球拖拽（移动端 + 定位修正）

**文件**: `public/ai-assistant-widget.js`

```javascript
// 拖拽：支持 touch
function setupDrag() {
  const getPos = (e) => {
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    return { x: e.clientX, y: e.clientY }
  }
  const onStart = (e) => {
    e.preventDefault()
    const pos = getPos(e)
    const rect = ball.getBoundingClientRect()
    const startX = pos.x - rect.left
    const startY = pos.y - rect.top
    ball.classList.add("dragging")
    const onMove = (e2) => {
      const p = getPos(e2)
      ball.style.left = (p.x - startX) + "px"
      ball.style.right = "auto"
      ball.style.bottom = "auto"
      ball.style.top = (p.y - startY) + "px"
    }
    const onEnd = () => {
      ball.classList.remove("dragging")
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onEnd)
      document.removeEventListener("touchmove", onMove)
      document.removeEventListener("touchend", onEnd)
    }
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onEnd)
    document.addEventListener("touchmove", onMove, { passive: false })
    document.addEventListener("touchend", onEnd)
  }
  ball.addEventListener("mousedown", onStart)
  ball.addEventListener("touchstart", onStart, { passive: false })
}
```

### 2.2 LLM/网络失败友好提示

**文件**: `public/ai-assistant-widget.js`，`send()` 内：

```javascript
if (res.ok) {
  addMsg("assistant", data.reply);
} else {
  const detail = data?.detail || data?.error || "";
  const msg = res.status === 429
    ? "今日 AI 使用已达上限，请明日再试。如需紧急咨询请联系人工客服。"
    : "暂无法回复，请稍后联系人工客服。";
  addMsg("assistant", msg);
}
```

### 2.3 表单数据同步说明

当前：HP 表单提交写入 `data/submissions.json`，并调用 `AI_ASSISTANT_WEBHOOK`；AI 助手将数据写入 `FormSubmission`。需确保环境变量 `AI_ASSISTANT_WEBHOOK=http://<ai-host>/api/webhook/form` 已配置，否则 AI 数据页无表单记录。

---

## 三、测试用例

### 用例 1：聊天 + 同意会议触发内部邮件

**前置**: 配置 LLM、SMTP、至少一个内部销售邮箱；材料库有 PDF。

**步骤**:
1. 打开联系页，填写表单（公司、联系人、邮箱、电话、留言）
2. 点击悬浮球，输入「想了解一下你们的产品」
3. AI 回复后，输入「可以安排个时间详细聊聊吗」

**预期**:
- AI 以销售口吻回复，无「预约会议」「填写表单」
- 内部销售邮箱收到主题为「【客户会议意向】xxx-xxx」的邮件，含沟通总结、兴趣分析、跟进建议、客户信息

---

### 用例 2：表单提交 → 个性化邮件 + 材料库附件

**前置**: `AI_ASSISTANT_WEBHOOK` 已配置；材料库有 product_consult 场景 PDF。

**步骤**:
```bash
curl -X POST http://localhost:3000/api/submit/contact \
  -H "Content-Type: application/json" \
  -d '{"company":"测试公司","contact":"张三","phone":"13800138000","email":"test@example.com","product_interest":"安全产品","message":"想了解报价"}'
```

**预期**:
- 返回 `{"ok":true}`
- `test@example.com` 收到感谢咨询邮件，正文含公司/联系人信息
- 邮件附带材料库 PDF（若存在匹配）
- 材料库对应文件 `call_count` +1

---

### 用例 3：材料库非 PDF 上传拒绝

**步骤**:
1. 登录管理后台，进入「材料库管理」
2. 选择 .docx 或 .pptx 文件上传

**预期**:
- 前端提示「仅支持 PDF 格式，请重新上传」
- 若绕过前端直接调 API，返回 400：「仅支持 PDF 格式，请重新上传」

---

### 用例 4：Token 超限不触发邮件

**前置**: 将 Token 日限设为 100，先消耗完。

**步骤**:
1. 悬浮球聊天，输入任意内容

**预期**:
- 返回 429 或前端显示「今日 AI 使用已达上限」
- 不发送内部邮件，不增加 EmailRecord

---

### 用例 5：知识库无附件外发

**步骤**:
1. 上传 PDF 到知识库
2. 检查 `email_service.send_email` 的 `attachments` 参数来源

**预期**:
- 附件仅来自 `match_material_for_email()`（材料库）
- 知识库文件路径（如 `data/knowledge/xxx.pdf`）不会出现在 `attachments` 中
- `email_service` 中 `str(p).find("data/materials") < 0` 会过滤掉知识库路径

---

## 四、环境检查清单

- [ ] `NEXT_PUBLIC_AI_ASSISTANT_API` 指向 AI 助手地址（如 `http://localhost:8000`）
- [ ] `AI_ASSISTANT_WEBHOOK` 指向 `http://<ai-host>/api/webhook/form`
- [ ] AI 助手管理后台配置：SMTP、LLM API Key、至少一个内部销售邮箱
- [ ] 材料库至少上传一个 PDF（产品咨询或代理合作场景）
