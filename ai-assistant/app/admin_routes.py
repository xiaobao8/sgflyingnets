"""
管理后台 API：邮箱、提示词、知识库、材料库、LLM、数据报表
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from pathlib import Path

from app.database import AsyncSessionLocal, SalesEmail, AIConfig, FormSubmission, EmailRecord, TokenUsage, MaterialFile, MaterialLibrary, KnowledgeFile
from sqlalchemy import select, func, delete
from datetime import datetime

router = APIRouter(prefix="/api/admin", tags=["admin"])


# ========== 邮箱配置（AI 统一发件） ==========
class EmailConfigModel(BaseModel):
    smtp_host: str
    smtp_port: int = 587
    smtp_user: str
    smtp_pass: str = ""
    smtp_from_name: str = ""


@router.get("/email-config")
async def get_email_config():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(AIConfig).where(AIConfig.key.in_(["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from_name"])))
        rows = r.scalars().all()
        d = {x.key: x.value for x in rows}
        return {
            "smtp_host": d.get("smtp_host", ""),
            "smtp_port": d.get("smtp_port", "587"),
            "smtp_user": d.get("smtp_user", ""),
            "smtp_pass": "",  # 不返回密码
            "smtp_from_name": d.get("smtp_from_name", "Flyingnets"),
        }


class TestEmailBody(BaseModel):
    to: str

@router.post("/email-config/test")
async def test_email_config(m: TestEmailBody):
    """测试 SMTP 配置"""
    from app.config_store import get_smtp_config
    from app.email_service import send_email
    cfg = await get_smtp_config()
    if not cfg.get("host") or not cfg.get("user"):
        raise HTTPException(400, "请先保存 SMTP 配置")
    try:
        await send_email(m.to, "[Flyingnets] SMTP 测试", "<p>测试成功，AI 助手邮箱配置正常。</p>", config=cfg)
        return {"ok": True}
    except Exception as e:
        raise HTTPException(400, str(e))


@router.put("/email-config")
async def save_email_config(m: EmailConfigModel):
    async with AsyncSessionLocal() as db:
        for key, val in [("smtp_host", m.smtp_host), ("smtp_port", str(m.smtp_port)), ("smtp_user", m.smtp_user), ("smtp_from_name", m.smtp_from_name)]:
            r = await db.execute(select(AIConfig).where(AIConfig.key == key))
            ex = r.scalars().first()
            if ex:
                ex.value = val
            else:
                db.add(AIConfig(key=key, value=val))
        if m.smtp_pass:
            r = await db.execute(select(AIConfig).where(AIConfig.key == "smtp_pass"))
            ex = r.scalars().first()
            if ex:
                ex.value = m.smtp_pass
            else:
                db.add(AIConfig(key="smtp_pass", value=m.smtp_pass))
        await db.commit()
    return {"ok": True}


# ========== LLM 配置 ==========
class LLMConfigModel(BaseModel):
    provider: str = "openai"
    api_key: str = ""
    base_url: str = ""
    model: str = "gpt-3.5-turbo"
    token_daily_limit: int = 100000
    token_monthly_limit: int = 2000000


@router.get("/llm-config")
async def get_llm_config():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(AIConfig).where(AIConfig.key.in_(["llm_provider", "llm_api_key", "llm_base_url", "llm_model", "token_daily_limit", "token_monthly_limit"])))
        rows = r.scalars().all()
        d = {x.key: x.value for x in rows}
        return {
            "provider": d.get("llm_provider", "openai"),
            "api_key": d.get("llm_api_key", "")[:8] + "..." if d.get("llm_api_key") else "",
            "api_key_set": bool(d.get("llm_api_key")),
            "base_url": d.get("llm_base_url", ""),
            "model": d.get("llm_model", "gpt-3.5-turbo"),
            "token_daily_limit": int(d.get("token_daily_limit") or 100000),
            "token_monthly_limit": int(d.get("token_monthly_limit") or 2000000),
        }


@router.put("/llm-config")
async def save_llm_config(m: LLMConfigModel):
    async with AsyncSessionLocal() as db:
        for key, val in [("llm_provider", m.provider), ("llm_base_url", m.base_url), ("llm_model", m.model), ("token_daily_limit", str(m.token_daily_limit)), ("token_monthly_limit", str(m.token_monthly_limit))]:
            r = await db.execute(select(AIConfig).where(AIConfig.key == key))
            ex = r.scalars().first()
            if ex:
                ex.value = str(val)
            else:
                db.add(AIConfig(key=key, value=str(val)))
        if m.api_key:
            r = await db.execute(select(AIConfig).where(AIConfig.key == "llm_api_key"))
            ex = r.scalars().first()
            if ex:
                ex.value = m.api_key
            else:
                db.add(AIConfig(key="llm_api_key", value=m.api_key))
        await db.commit()
    return {"ok": True}


# ========== 提示词配置 ==========
class PromptModel(BaseModel):
    key: str
    value: str


# ========== 内部销售邮箱 ==========
SCENARIO_OPTIONS = {"": "默认", "product_consult": "产品咨询", "partner_coop": "代理合作"}

@router.get("/sales-emails")
async def list_sales_emails():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(SalesEmail).order_by(SalesEmail.id))
        return [
            {"id": x.id, "email": x.email, "name": x.name, "is_active": x.is_active, "scenario": getattr(x, "scenario", None) or ""}
            for x in r.scalars().all()
        ]


class SalesEmailCreate(BaseModel):
    email: str
    name: str = ""
    scenario: str = ""  # "" / product_consult / partner_coop

@router.post("/sales-emails")
async def add_sales_email(m: SalesEmailCreate):
    async with AsyncSessionLocal() as db:
        db.add(SalesEmail(email=m.email, name=m.name, scenario=(m.scenario or "")))
        await db.commit()
    return {"ok": True}


class SalesEmailUpdate(BaseModel):
    scenario: str = ""
    is_active: bool = True

@router.put("/sales-emails/{sid}")
async def update_sales_email(sid: int, m: SalesEmailUpdate):
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(SalesEmail).where(SalesEmail.id == sid))
        row = r.scalars().first()
        if not row:
            raise HTTPException(404, "邮箱不存在")
        row.scenario = m.scenario or ""
        row.is_active = m.is_active
        await db.commit()
    return {"ok": True}


@router.delete("/sales-emails/{sid}")
async def delete_sales_email(sid: int):
    async with AsyncSessionLocal() as db:
        await db.execute(delete(SalesEmail).where(SalesEmail.id == sid))
        await db.commit()
    return {"ok": True}


# ========== 提示词 ==========
@router.get("/prompts")
async def list_prompts():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(AIConfig).where(AIConfig.key.like("prompt_%")))
        return {x.key: x.value for x in r.scalars().all()}


class PromptUpdate(BaseModel):
    key: str
    value: str

@router.put("/prompts")
async def update_prompt(m: PromptUpdate):
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(AIConfig).where(AIConfig.key == m.key))
        existing = r.scalars().first()
        if existing:
            existing.value = m.value
            existing.updated_at = datetime.utcnow()
        else:
            db.add(AIConfig(key=m.key, value=m.value))
        await db.commit()
    return {"ok": True}


# ========== 表单数据与邮件记录 ==========
@router.get("/submissions")
async def admin_submissions():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(FormSubmission).order_by(FormSubmission.created_at.desc()).limit(200))
        rows = r.scalars().all()
    return [{"id": x.id, "type": x.type, "company": x.company, "contact": x.contact, "email": x.email, "product_interest": x.product_interest, "message": x.message, "created_at": x.created_at.isoformat()} for x in rows]


@router.get("/email-records")
async def admin_email_records():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(EmailRecord).order_by(EmailRecord.created_at.desc()).limit(100))
        rows = r.scalars().all()
    return [{"id": x.id, "to_email": x.to_email, "subject": x.subject, "type": x.type, "status": x.status, "created_at": x.created_at.isoformat()} for x in rows]


# ========== Token 报表 ==========
@router.get("/token-report")
async def token_report():
    from config import settings
    now = datetime.utcnow()
    today = now.date()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    async with AsyncSessionLocal() as db:
        daily = await db.execute(select(func.sum(TokenUsage.input_tokens + TokenUsage.output_tokens)).where(func.date(TokenUsage.created_at) == today))
        monthly = await db.execute(select(func.sum(TokenUsage.input_tokens + TokenUsage.output_tokens)).where(TokenUsage.created_at >= month_start))
    return {
        "daily_used": daily.scalar() or 0,
        "monthly_used": monthly.scalar() or 0,
        "daily_limit": settings.TOKEN_DAILY_LIMIT,
        "monthly_limit": settings.TOKEN_MONTHLY_LIMIT,
    }


# ========== 材料库（material_library，独立模块） ==========
MATERIAL_SCENES = {"product_consult": "产品咨询", "partner_coop": "代理合作", "general": "通用"}

@router.get("/material-library")
async def list_material_library():
    """材料库列表：仅展示未删除记录"""
    async with AsyncSessionLocal() as db:
        r = await db.execute(
            select(MaterialLibrary)
            .where(MaterialLibrary.is_delete == False)
            .order_by(MaterialLibrary.id.desc())
        )
        rows = r.scalars().all()
    return [
        {
            "id": x.id,
            "file_name": x.file_name,
            "file_path": x.file_path,
            "scene": x.scene,
            "upload_time": x.upload_time.isoformat() if x.upload_time else "",
            "call_count": x.call_count or 0,
        }
        for x in rows
    ]


class MaterialLibraryUpdate(BaseModel):
    scene: str  # product_consult / partner_coop / general

@router.put("/material-library/{mid}")
async def update_material_library(mid: int, m: MaterialLibraryUpdate):
    if m.scene not in MATERIAL_SCENES:
        raise HTTPException(400, f"场景必须是: {', '.join(MATERIAL_SCENES.keys())}")
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(MaterialLibrary).where(MaterialLibrary.id == mid).where(MaterialLibrary.is_delete == False))
        row = r.scalars().first()
        if not row:
            raise HTTPException(404, "材料不存在")
        row.scene = m.scene
        await db.commit()
    return {"ok": True}


@router.post("/material-library/upload")
async def upload_material_library(
    file: UploadFile = File(...),
    scene: str = Form(...),
):
    """上传材料库 PDF，仅接受 PDF 格式"""
    if scene not in MATERIAL_SCENES:
        raise HTTPException(400, f"场景必须是: {', '.join(MATERIAL_SCENES.keys())}")
    ext = Path(file.filename or "").suffix.lower()
    if ext != ".pdf":
        raise HTTPException(400, "仅支持 PDF 格式，请重新上传")
    from app.materials.manager import save_material
    content = await file.read()
    path = save_material(content, file.filename or "file.pdf", scene)
    async with AsyncSessionLocal() as db:
        db.add(MaterialLibrary(file_name=file.filename or "file.pdf", file_path=path, scene=scene))
        await db.commit()
    return {"ok": True, "msg": "上传成功"}


@router.delete("/material-library/{mid}")
async def delete_material_library(mid: int):
    """软删除"""
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(MaterialLibrary).where(MaterialLibrary.id == mid))
        row = r.scalars().first()
        if not row:
            raise HTTPException(404, "材料不存在")
        row.is_delete = True
        await db.commit()
    return {"ok": True}


@router.get("/material-library/{mid}/preview")
async def preview_material_library(mid: int):
    """管理员预览：返回 PDF 内联展示"""
    from fastapi.responses import FileResponse
    from app.materials.library_service import get_material_path_for_preview
    path = await get_material_path_for_preview(mid)
    if not path:
        raise HTTPException(404, "文件不存在")
    return FileResponse(path, media_type="application/pdf", filename=Path(path).name, headers={"Content-Disposition": "inline"})


@router.get("/material-library/{mid}/download")
async def download_material_library(mid: int):
    """管理员下载：返回 PDF 下载链接（Content-Disposition: attachment）"""
    from fastapi.responses import FileResponse
    from app.materials.library_service import get_material_path_for_preview
    path = await get_material_path_for_preview(mid)
    if not path:
        raise HTTPException(404, "文件不存在")
    return FileResponse(path, media_type="application/pdf", filename=Path(path).name, headers={"Content-Disposition": f'attachment; filename="{Path(path).name}"'})


# ========== 材料库列表（旧 material_files，兼容） ==========
@router.get("/materials")
async def list_materials():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(MaterialFile).order_by(MaterialFile.id.desc()))
        return [{"id": x.id, "filename": x.filename, "scenario": x.scenario, "call_count": x.call_count, "created_at": x.created_at.isoformat()} for x in r.scalars().all()]


# ========== 知识库列表（仅内部参考，无下载/附件接口） ==========
@router.get("/knowledge")
async def list_knowledge():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(KnowledgeFile).order_by(KnowledgeFile.id.desc()))
        return [{"id": x.id, "filename": x.filename, "file_type": x.file_type, "created_at": x.created_at.isoformat()} for x in r.scalars().all()]
