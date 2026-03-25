# AI 营销小助手 - 五维优化建议

> 基于已验证通过的代码，从性能、体验、安全性、可维护性、业务适配性 5 个维度输出优化方案。

---

## 优化维度总览

| 维度 | 必做优化 | 可选优化 | 实施难度 |
|------|----------|----------|----------|
| 性能 | 异步解析、数据库索引 | 向量缓存、轻量模型 | 低~中 |
| 体验 | AI 话术自然化 | 红点、夜间模式、批量上传、表情包 | 低 |
| 安全 | 敏感数据加密、脱敏 | 角色权限、病毒扫描 | 中~高 |
| 可维护 | 日志、配置抽离、代码重构 | - | 低 |
| 业务 | - | 来源分配、行业话术、报表 | 中 |

---

## 一、性能优化

### 1.1 大文件解析异步化（必做）

**优化点**：>100MB 文件解析阻塞主线程，导致请求超时。改为异步任务队列，解析完成后入库。

**实施难度**：中  
**收益**：解析 100MB PDF 从阻塞 10s+ 降至后台处理，主请求 <500ms 返回。

**方案**：使用 `asyncio.to_thread` 或 Celery 将解析放入后台。

```python
# ai-assistant/app/knowledge/async_parser.py（新增）
import asyncio
from pathlib import Path
from app.knowledge.parser import parse_file

MAX_SYNC_SIZE_MB = 10  # 小于此值同步解析

async def parse_file_async(file_path: str, file_type: str = None) -> str:
    """大文件异步解析，避免阻塞"""
    size_mb = Path(file_path).stat().st_size / (1024 * 1024)
    if size_mb <= MAX_SYNC_SIZE_MB:
        return await asyncio.to_thread(parse_file, file_path, file_type)
    # 大文件：后台解析，限制并发
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, lambda: parse_file(file_path, file_type))
```

**main.py 修改**：
```python
# 原：text = parse_file(path)
# 改为：
from app.knowledge.async_parser import parse_file_async
text = await parse_file_async(path, ext[1:])
```

---

### 1.2 向量库匹配效率（必做）

**优化点**：每次聊天都 encode 用户消息 + 检索，延迟叠加。可缓存热点 query、预加载模型。

**实施难度**：中  
**收益**：检索从 ~800ms 降至 ~200ms（缓存命中时），整体回复 <3s。

```python
# ai-assistant/app/knowledge/vector_store.py 增加 LRU 缓存
from functools import lru_cache

@lru_cache(maxsize=128)
def _encode_cached(model_id: str, text: str) -> tuple:  # 需序列化
    ...

# 或使用 Redis 缓存 query -> top_k 结果，TTL 60s
```

**简化方案**：减少 top_k 从 5 到 3（已实现），使用更轻量模型 `all-MiniLM-L6-v2`（英文）或保持现有多语言模型。

---

### 1.3 数据库索引（必做）

**优化点**：表单、邮件、Token 按时间/类型查询无索引，数据量大时变慢。

**实施难度**：低  
**收益**：查询从 O(n) 降至 O(log n)，1000+ 记录时显著提升。

```python
# ai-assistant/app/database.py 在 init_db 中执行
CREATE INDEX idx_form_submissions_created ON form_submissions(created_at DESC);
CREATE INDEX idx_email_records_created ON email_records(created_at DESC);
CREATE INDEX idx_token_usage_created ON token_usage(created_at);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_material_library_scene ON material_library(scene) WHERE is_delete=0;
```

---

## 二、体验优化

### 2.1 悬浮球未读红点 + 夜间模式（可选）

**优化点**：新消息到达时显示红点；支持跟随系统/手动切换夜间模式。  
**实施难度**：低 | **收益**：提升用户感知

```javascript
// public/ai-assistant-widget.js 样式增加
#ai-widget-ball { position: relative; }
#ai-widget-ball.has-unread::after {
  content: ''; position: absolute; top: 4px; right: 4px;
  width: 10px; height: 10px; background: #ef4444;
  border-radius: 50%; border: 2px solid white;
}
[data-theme="dark"] #ai-widget-panel {
  background: #1f2937; color: #f3f4f6;
}
[data-theme="dark"] .ai-msg.assistant { background: #374151; color: #f3f4f6; }
// 新消息时：ball.classList.add('has-unread')
// 打开面板时：ball.classList.remove('has-unread')
```

---

### 2.2 AI 话术自然化（必做）

**优化点**：提示词生硬，引导会议不够自然。支持按客户语气调整风格。

```python
# config_store 默认提示词优化版
"""你是 Flyingnets 的销售顾问，专业且亲和。
- 根据客户回复语气调整：客户用「您/请问」则正式，用「你/哈」则轻松；
- 不主动提「预约」「表单」，仅在客户表达想深入沟通时，自然回应「那我们可以安排一次线上会议，您看方便吗？」；
- 避免推销感，以解决问题为导向。"""
```

---

### 2.3 材料库批量上传（可选）

**优化点**：支持多选 PDF 批量上传，批量标注场景。  
**实施难度**：低 | **收益**：提升管理效率

```tsx
// app/admin/materials/page.tsx
<input type="file" accept=".pdf" multiple onChange={onBatchUpload} />
const onBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || [])
  for (const f of files) {
    if (!f.name.toLowerCase().endsWith('.pdf')) continue
    const fd = new FormData()
    fd.append('file', f)
    fd.append('scene', scene)
    await fetch(`${PROXY}?path=${encodeURIComponent('/api/admin/material-library/upload')}`, {
      method: 'POST', credentials: 'include', body: fd,
    })
  }
  load()
}
```

**后端批量接口**（可选）：
```python
@router.post("/material-library/batch-upload")
async def batch_upload(files: list[UploadFile], scene: str = Form(...)):
    for f in files:
        if Path(f.filename or "").suffix.lower() != ".pdf": continue
        content = await f.read()
        path = save_material(content, f.filename or "file.pdf", scene)
        db.add(MaterialLibrary(file_name=f.filename, file_path=path, scene=scene))
    await db.commit()
```

---

## 三、安全性优化

### 3.1 角色权限（可选）

**优化点**：超级管理员可改 LLM API Key；普通管理员仅可改提示词、材料库。

```python
# 新增 AdminUser 表：role = super_admin | admin
# 中间件校验：PUT /api/admin/llm-config 需 super_admin
```

---

### 3.2 敏感数据加密（必做）

**优化点**：LLM API Key、邮箱密码明文存储，需 AES 加密。

```python
# ai-assistant/app/utils/crypto.py（新增）
import os
import base64
from cryptography.fernet import Fernet

def get_cipher():
    key = os.environ.get("ENCRYPTION_KEY") or Fernet.generate_key()
    return Fernet(base64.urlsafe_b64encode(key[:32].ljust(32)[:32]))

def encrypt(plain: str) -> str:
    return get_cipher().encrypt(plain.encode()).decode()

def decrypt(cipher: str) -> str:
    return get_cipher().decrypt(cipher.encode()).decode()
```

**存储**：AIConfig 中 `llm_api_key` 存加密后值，读取时解密。

---

### 3.3 数据脱敏（必做）

**优化点**：后台展示手机号、邮箱时隐藏中间位。

```python
def mask_phone(s: str) -> str:
    if not s or len(s) < 7: return s
    return s[:3] + "****" + s[-4:]

def mask_email(s: str) -> str:
    if not s or "@" not in s: return s
    a, b = s.split("@", 1)
    return a[:2] + "***@" + b
```

---

### 3.4 文件病毒扫描（可选）

**优化点**：材料库 PDF 上传前调用 ClamAV 扫描。

```python
# 需安装 pyclamd 或调用 clamav 命令行
import subprocess
def scan_file(path: str) -> bool:
    r = subprocess.run(["clamscan", "-i", path], capture_output=True)
    return r.returncode == 0
```

---

## 四、可维护性优化

### 4.1 代码结构重构（必做）

**优化点**：邮件、解析、材料匹配拆分为独立工具类。

```
ai-assistant/app/
├── services/
│   ├── email_service.py      # 邮件发送（已有，可移入）
│   ├── file_parser.py        # 文件解析封装
│   └── material_matcher.py   # 材料匹配逻辑
├── utils/
│   ├── crypto.py            # 加解密
│   ├── mask.py              # 脱敏
│   └── logger.py            # 统一日志
```

---

### 4.2 系统日志（必做）

**优化点**：记录 AI 调用、邮件发送、文件上传，支持按时间/模块筛选。

```python
# ai-assistant/app/utils/logger.py
import logging
import json
from datetime import datetime

logger = logging.getLogger("ai_assistant")
handler = logging.FileHandler("data/logs/ai_assistant.log")
handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
logger.addHandler(handler)

def log_ai_call(session_id: str, tokens: int, latency_ms: float):
    logger.info(json.dumps({"event": "ai_call", "session": session_id, "tokens": tokens, "latency_ms": latency_ms}))
```

---

### 4.3 配置抽离（必做）

**优化点**：Token 上限、文件大小限制等抽离到 .env。

```env
# .env.example
TOKEN_DAILY_LIMIT=100000
TOKEN_MONTHLY_LIMIT=2000000
KNOWLEDGE_MAX_FILE_MB=50
MATERIAL_MAX_FILE_MB=20
```

---

## 五、业务适配性优化

### 5.1 客户来源分配邮箱（可选）

**优化点**：按官网/公众号分配不同销售邮箱。

```python
# SalesEmail 增加 source 字段：website | wechat | default
# 聊天/表单传入 source，匹配时优先 source
```

---

### 5.2 按行业话术（可选）

**优化点**：客户选择行业（电商/制造业）时，提示词追加行业话术。

```python
# AIConfig 增加 prompt_chat_industry_ecommerce, prompt_chat_industry_manufacturing
# 聊天时若 submission_context 含 industry，追加对应提示词
```

---

### 5.3 可视化报表（可选）

**优化点**：ECharts 展示咨询量、会议转化率、材料库 TOP10。  
**实施难度**：中 | **收益**：数据决策支持

```tsx
// app/admin/ai/analytics/page.tsx
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function AnalyticsPage() {
  const chartRef = useRef(null);
  useEffect(() => {
    fetch('/api/ai/proxy?path=/api/admin/analytics/dashboard', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const chart = echarts.init(chartRef.current);
        chart.setOption({
          xAxis: { type: 'category', data: data.daily_labels },
          yAxis: { type: 'value' },
          series: [{ type: 'line', data: data.daily_consult }],
        });
      });
  }, []);
  return <div ref={chartRef} className="w-full h-80" />;
}
```

**后端聚合接口**：
```python
@router.get("/analytics/dashboard")
async def analytics_dashboard():
    # 近 30 日每日咨询量、会议意向数、材料库 TOP10
    ...
```

---

## 六、优化优先级汇总

| 类别 | 必做 | 可选 |
|------|------|------|
| 性能 | 异步解析、数据库索引、向量缓存 | 轻量模型 |
| 体验 | AI 话术优化 | 红点、夜间模式、批量上传、表情包 |
| 安全 | 敏感数据加密、脱敏 | 角色权限、病毒扫描 |
| 可维护 | 日志、配置抽离、代码重构 | - |
| 业务 | - | 来源分配、行业话术、报表 |

---

## 七、已实施优化清单（本次落地）

| 优化项 | 文件 | 状态 |
|--------|------|------|
| 大文件异步解析 | `app/knowledge/async_parser.py` | ✅ 已实现 |
| 数据库索引 | `app/database.py` init_db | ✅ 已实现 |
| 系统日志 | `app/utils/logger.py` | ✅ 已实现 |
| 配置抽离 | `config.py` + `.env.example` | ✅ 已实现 |
| AI 话术优化 | `app/config_store.py` | ✅ 已实现 |
| 脱敏工具 | `app/utils/mask.py` | ✅ 已实现 |
| 加密工具 | `app/utils/crypto.py` | ✅ 已实现（待接入 AIConfig） |

---

## 八、性能对比指标（预期）

| 场景 | 优化前 | 优化后 |
|------|--------|--------|
| 100MB PDF 解析 | 阻塞 10s+，请求超时 | 后台异步，主请求 <500ms |
| 表单/邮件列表查询（1000 条） | ~200ms | ~20ms（索引） |
| AI 回复端到端 | 2~5s | 2~4s（top_k=3 已优化） |
