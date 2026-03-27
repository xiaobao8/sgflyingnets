"""
AI 营销小助手 - FastAPI 主入口
"""
import json
import re
import time
import os
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

from config import settings
from app.database import init_db, AsyncSessionLocal, FormSubmission, SalesEmail, AIConfig, ChatSession, ChatMessage, EmailRecord, KnowledgeFile, MaterialFile, TokenUsage
from app.llm.providers import get_llm_response
from app.knowledge.async_parser import parse_file_async
from app.knowledge.vector_store import KnowledgeVectorStore
from app.materials.manager import save_material, UPLOAD_DIR, validate_pdf, SCENARIOS
from app.email_service import send_email, render_template
from app.admin_routes import router as admin_router
from app.config_store import get_config, get_config_multi, get_smtp_config, get_chat_prompt, get_email_prompt, normalize_chat_locale
from app.meeting_trigger import check_meeting_agreed, save_chat_message, load_chat_history, send_internal_meeting_email
from app.contact_collector import (
    should_guide_contact, CONTACT_GUIDE_PROMPT,
    extract_contact_from_messages, has_contact_info,
    trigger_contact_summary_email,
)
from app.materials.library_service import match_material_for_email


# 全局向量库
kb_store = KnowledgeVectorStore()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    kb_store.load()
    yield
    kb_store.save()


app = FastAPI(title="AI 营销小助手", lifespan=lifespan)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========== 表单联动：同步 HP submissions ==========
def sync_hp_submissions():
    """从 HP data/submissions.json 同步表单数据"""
    hp_data = Path(settings.HP_DATA_DIR) / "submissions.json"
    if not hp_data.exists():
        return
    try:
        data = json.loads(hp_data.read_text(encoding="utf-8"))
    except Exception:
        return
    if not isinstance(data, list):
        return
    # 使用绝对路径
    abs_hp = Path(settings.HP_DATA_DIR).resolve()
    if not (abs_hp / "submissions.json").exists():
        return
    data = json.loads((abs_hp / "submissions.json").read_text(encoding="utf-8"))
    if not isinstance(data, list):
        return
    # 同步到数据库（简化：仅做增量，实际可加去重）
    # 此处由后台定时或 webhook 触发，这里仅提供接口
    pass


# ========== 输入清理 ==========
_SSTI_PATTERN = re.compile(r'\{\{.*?\}\}|\{%.*?%\}|\$\{.*?\}')
_PATH_TRAVERSAL_PATTERN = re.compile(r'(?:\.\./|\.\.\\|/etc/|/proc/|/dev/|[a-zA-Z]:\\)')
_CMD_INJECTION_PATTERN = re.compile(
    r'[;|&`$]|\b(?:exec|eval|import\s+os|__import__|subprocess|os\.(?:system|popen|exec)|open\s*\()\b',
    re.IGNORECASE,
)
MAX_MESSAGE_LENGTH = 2000
MAX_SESSION_ID_LENGTH = 128
SESSION_ID_PATTERN = re.compile(r'^[a-zA-Z0-9_\-]+$')


def sanitize_chat_input(text: str) -> str:
    """Strip template injection, path traversal, and command injection patterns from user input."""
    text = _SSTI_PATTERN.sub('', text)
    text = _PATH_TRAVERSAL_PATTERN.sub('', text)
    text = _CMD_INJECTION_PATTERN.sub('', text)
    return text.strip()


# ========== 聊天 API ==========
class ChatRequest(BaseModel):
    session_id: str
    message: str
    submission_context: dict | None = None
    locale: str | None = None

    @field_validator('session_id')
    @classmethod
    def validate_session_id(cls, v: str) -> str:
        if not v or len(v) > MAX_SESSION_ID_LENGTH:
            raise ValueError('invalid session_id length')
        if not SESSION_ID_PATTERN.match(v):
            raise ValueError('session_id contains invalid characters')
        return v

    @field_validator('message')
    @classmethod
    def validate_message(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('message cannot be empty')
        if len(v) > MAX_MESSAGE_LENGTH:
            raise ValueError(f'message exceeds {MAX_MESSAGE_LENGTH} characters')
        return v

    @field_validator('locale')
    @classmethod
    def validate_locale(cls, v: str | None) -> str | None:
        if v is not None and v not in ('zh', 'en', 'ja'):
            return None
        return v


class ChatResponse(BaseModel):
    reply: str
    meeting_agreed: bool = False


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """悬浮球聊天：AI 以销售身份回复，自然引导会议（提示词从管理后台读取）"""
    req.message = sanitize_chat_input(req.message)
    if not req.message:
        raise HTTPException(status_code=400, detail="Invalid message content")

    # 0. 确保会话存在并保存用户消息
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select
        r = await db.execute(select(ChatSession).where(ChatSession.session_id == req.session_id))
        if not r.scalars().first():
            db.add(ChatSession(session_id=req.session_id))
            await db.commit()
    await save_chat_message(req.session_id, "user", req.message)

    # 统计当前会话的用户消息数（用于判断是否引导留资）
    chat_history = await load_chat_history(req.session_id)
    user_msg_count = sum(1 for m in chat_history if m["role"] == "user")

    # 1. 检索知识库（仅参考）
    refs = kb_store.search(req.message, top_k=3)
    ref_text = "\n".join(r.get("text", "") for r in refs) if refs else ""

    # 2. 从管理后台按界面语言读取对应提示词（与前端 NEXT_LOCALE / document.lang 一致）
    locale = normalize_chat_locale(req.locale)
    sys_prompt = await get_chat_prompt(locale)
    # 语言指令：界面语言为默认；若提问者用其他语言，则用该语言回复
    lang_map = {
        "zh": "默认使用中文回复；若用户用英文或日文提问，则用相同语言回复。",
        "en": "Reply in English by default; if the user writes in Chinese or Japanese, reply in that language.",
        "ja": "デフォルトは日本語で返答；ユーザーが中国語や英語で書いた場合はその言語で返答。",
    }
    sys_prompt += f"\n\n{lang_map[locale]}"

    # 达到一定轮次后，引导客户留下联系方式
    if should_guide_contact(user_msg_count):
        contact_so_far = extract_contact_from_messages(chat_history)
        if not has_contact_info(contact_so_far):
            sys_prompt += CONTACT_GUIDE_PROMPT.get(locale, CONTACT_GUIDE_PROMPT["en"])

    if req.submission_context:
        ctx_label = {
            "zh": "客户已填表单信息（可精准回应）：",
            "en": "Form data already submitted by the customer (use for tailored replies): ",
            "ja": "お客様が入力済みのフォーム情報（参考に応答）：",
        }[locale]
        sys_prompt += f"\n{ctx_label}{req.submission_context}"
    if ref_text:
        ref_label = {
            "zh": "参考材料（仅作回复参考）：",
            "en": "Reference material (for reply context only): ",
            "ja": "参考資料（応答の参考のみ）：",
        }[locale]
        sys_prompt += f"\n{ref_label}{ref_text[:2000]}"

    messages = [
        {"role": "system", "content": sys_prompt},
        {"role": "user", "content": req.message},
    ]

    try:
        t0 = time.perf_counter()
        reply = await get_llm_response(messages)
        latency_ms = (time.perf_counter() - t0) * 1000
        try:
            from app.utils.logger import log_ai_call
            log_ai_call(req.session_id, 0, latency_ms, "chat")  # tokens 由 LLM 内部记录
        except Exception:
            pass
    except ValueError as e:
        raise HTTPException(status_code=429, detail=str(e))

    await save_chat_message(req.session_id, "assistant", reply)

    # 检测客户是否表达同意会议（仅检测用户消息中的关键词）
    meeting_agreed = check_meeting_agreed(req.message)

    if meeting_agreed:
        smtp_cfg = await get_smtp_config()
        if smtp_cfg.get("host"):
            await send_internal_meeting_email(
                req.session_id,
                chat_history,
                req.submission_context,
                kb_store,
                smtp_cfg,
            )

    # 检测客户是否已留下联系方式，触发对话总结邮件
    updated_history = await load_chat_history(req.session_id)
    contact = extract_contact_from_messages(updated_history)
    if has_contact_info(contact):
        try:
            await trigger_contact_summary_email(req.session_id, req.submission_context)
        except Exception as e:
            print(f"对话总结邮件发送异常: {e}")

    return ChatResponse(reply=reply, meeting_agreed=meeting_agreed)


# ========== 表单数据 API（供前端读取） ==========
@app.get("/api/submissions")
async def list_submissions():
    """获取表单提交列表（含 HP 同步）"""
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select
        r = await db.execute(select(FormSubmission).order_by(FormSubmission.created_at.desc()).limit(100))
        rows = r.scalars().all()
    return [{"id": x.id, "type": x.type, "company": x.company, "contact": x.contact, "email": x.email, "message": x.message, "created_at": x.created_at.isoformat()}]


# ========== 知识库管理（仅参考） ==========
@app.post("/api/knowledge/upload")
async def upload_knowledge(file: UploadFile = File(...)):
    """上传知识库：PDF/PPT/Excel/Word，仅用于 AI 参考"""
    filename = Path(file.filename or "").name
    if not filename or '..' in filename or '/' in filename or '\\' in filename:
        raise HTTPException(400, "非法文件名")
    ext = Path(filename).suffix.lower()
    if ext not in (".pdf", ".pptx", ".xlsx", ".docx"):
        raise HTTPException(400, "仅支持 PDF/PPT/Excel/Word")
    content = await file.read()
    max_bytes = settings.KNOWLEDGE_MAX_FILE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(400, f"文件大小超过 {settings.KNOWLEDGE_MAX_FILE_MB}MB 限制")
    os.makedirs("data/knowledge", exist_ok=True)
    path = f"data/knowledge/{filename}"
    resolved = Path(path).resolve()
    if not str(resolved).startswith(str(Path("data/knowledge").resolve())):
        raise HTTPException(400, "非法文件路径")
    with open(path, "wb") as f:
        f.write(content)
    try:
        text = await parse_file_async(path, ext[1:])
    except Exception as e:
        os.remove(path)
        raise HTTPException(400, "文件解析失败")
    kb_store.add(text[:10000], {"file": filename, "text": text[:2000]})
    kb_store.save()
    async with AsyncSessionLocal() as db:
        db.add(KnowledgeFile(filename=filename, file_path=path, file_type=ext[1:], parsed_text=text[:50000]))
        await db.commit()
    return {"ok": True, "msg": "已入库，仅作 AI 参考，不可外发"}


# ========== 材料库管理（仅 PDF） ==========
@app.post("/api/materials/upload")
async def upload_material(
    file: UploadFile = File(...),
    scenario: str = Form(...),
):
    """材料库上传：仅 PDF，可作邮件附件"""
    if scenario not in SCENARIOS:
        raise HTTPException(400, f"场景必须是: {', '.join(SCENARIOS)}")
    if Path(file.filename or "").suffix.lower() != ".pdf":
        raise HTTPException(400, "材料库仅支持 PDF 格式")
    content = await file.read()
    path = save_material(content, file.filename or "file.pdf", scenario)
    async with AsyncSessionLocal() as db:
        db.add(MaterialFile(filename=file.filename, file_path=path, scenario=scenario))
        await db.commit()
    return {"ok": True}


# ========== 内部销售邮箱 ==========
class SalesEmailModel(BaseModel):
    email: str
    name: str = ""


@app.get("/api/sales-emails")
async def list_sales_emails():
    async with AsyncSessionLocal() as db:
        from sqlalchemy import select
        r = await db.execute(select(SalesEmail).where(SalesEmail.is_active == True))
        return [{"id": x.id, "email": x.email, "name": x.name} for x in r.scalars().all()]


@app.post("/api/sales-emails")
async def add_sales_email(m: SalesEmailModel):
    async with AsyncSessionLocal() as db:
        db.add(SalesEmail(email=m.email, name=m.name))
        await db.commit()
    return {"ok": True}


# ========== Token 统计 ==========
@app.get("/api/token-usage")
async def token_usage():
    from sqlalchemy import select, func
    from datetime import datetime
    today = datetime.utcnow().date()
    async with AsyncSessionLocal() as db:
        daily = await db.execute(select(func.sum(TokenUsage.input_tokens + TokenUsage.output_tokens)).where(func.date(TokenUsage.created_at) == today))
        month_start = today.replace(day=1) if hasattr(today, "replace") else datetime.utcnow().replace(day=1)
        monthly = await db.execute(select(func.sum(TokenUsage.input_tokens + TokenUsage.output_tokens)).where(TokenUsage.created_at >= month_start))
    return {"daily": daily.scalar() or 0, "monthly": monthly.scalar() or 0, "limits": {"daily": settings.TOKEN_DAILY_LIMIT, "monthly": settings.TOKEN_MONTHLY_LIMIT}}


# ========== HP 表单 Webhook（表单提交后调用） ==========
class FormWebhookPayload(BaseModel):
    type: str  # contact / partnership
    company: str
    contact: str
    phone: str
    email: str
    product_interest: str = ""
    coop_type: str = ""
    region: str = ""
    message: str = ""
    locale: str = "zh"  # zh/en/ja，用于回复邮件语言


@app.post("/api/webhook/form")
async def form_webhook(payload: FormWebhookPayload):
    """HP 表单提交后调用：存储 → AI 分析汇总 → 由 AI 邮箱统一回复客户"""
    async with AsyncSessionLocal() as db:
        sub = FormSubmission(
            type=payload.type,
            company=payload.company,
            contact=payload.contact,
            phone=payload.phone,
            email=payload.email,
            product_interest=payload.product_interest,
            coop_type=payload.coop_type,
            region=payload.region,
            message=payload.message,
            source="hp",
        )
        db.add(sub)
        await db.commit()
        sub_id = sub.id

    # AI 分析并生成个性化回复，由 AI 邮箱统一发送
    try:
        prompt = await get_email_prompt(payload.type)
        locale = (payload.locale or "zh").lower()
        if locale in ("en", "ja", "zh"):
            lang_instruction = {
                "zh": "请使用中文撰写邮件。",
                "en": "Please write the email in English.",
                "ja": "メールは日本語で作成してください。",
            }[locale]
            prompt += f"\n\n{lang_instruction}"
        ctx = f"公司：{payload.company}，联系人：{payload.contact}，电话：{payload.phone}，邮箱：{payload.email}，感兴趣：{payload.product_interest}，{payload.coop_type or ''}，{payload.region or ''}，留言：{payload.message}"
        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": f"请生成一封回复邮件正文（HTML），收件人：{payload.contact}，公司：{payload.company}。表单内容：{ctx}"},
        ]
        reply_html = await get_llm_response(messages)
        smtp_cfg = await get_smtp_config()
        if smtp_cfg.get("host"):
            subject = f"[Flyingnets] 感谢您的咨询 - {payload.company}"
            attachments = []
            mat_path = await match_material_for_email(payload.type)
            if mat_path:
                attachments.append(mat_path)
            await send_email(payload.email, subject, reply_html, config=smtp_cfg, attachments=attachments or None)
            async with AsyncSessionLocal() as db:
                db.add(EmailRecord(to_email=payload.email, subject=subject, type=f"{payload.type}_reply", submission_id=sub_id, status="sent"))
                await db.commit()
    except Exception as e:
        async with AsyncSessionLocal() as db:
            db.add(EmailRecord(to_email=payload.email, subject="", type=f"{payload.type}_reply", submission_id=sub_id, status="failed", error_msg=str(e)))
            await db.commit()
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
