"""
数据库模型与连接
存储：表单数据、AI 配置、邮件记录、内部销售邮箱、Token 消耗
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, JSON
from datetime import datetime
import os

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import settings

# 确保 data 目录存在
os.makedirs("data", exist_ok=True)

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
)

AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


# ========== 表单数据（与现有 HP 表单联动） ==========
class FormSubmission(Base):
    """表单提交记录，与 HP submissions.json 同步"""
    __tablename__ = "form_submissions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(32))  # contact / partnership
    company = Column(String(256))
    contact = Column(String(128))
    phone = Column(String(64))
    email = Column(String(256))
    product_interest = Column(String(512), default="")
    coop_type = Column(String(128), default="")
    region = Column(String(128), default="")
    message = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    # 同步来源
    source = Column(String(32), default="hp")  # hp / manual


# ========== 内部销售邮箱配置 ==========
class SalesEmail(Base):
    """内部真人销售邮箱，客户同意会议后发送到此"""
    __tablename__ = "sales_emails"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(256), unique=True)
    name = Column(String(128), default="")
    is_active = Column(Boolean, default=True)
    # 场景分配："" 或 null = 默认，product_consult = 产品咨询，partner_coop = 代理合作
    scenario = Column(String(64), default="", nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# ========== AI 配置 ==========
class AIConfig(Base):
    """AI 提示词、LLM 配置等"""
    __tablename__ = "ai_config"
    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(64), unique=True)
    value = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ========== LLM Token 消耗 ==========
class TokenUsage(Base):
    """Token 消耗记录，用于限流与报表"""
    __tablename__ = "token_usage"
    id = Column(Integer, primary_key=True, autoincrement=True)
    provider = Column(String(32))
    model = Column(String(64))
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


# ========== 聊天记录 ==========
class ChatSession(Base):
    """聊天会话"""
    __tablename__ = "chat_sessions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(64), unique=True)
    # 关联表单（若有）
    submission_id = Column(Integer, ForeignKey("form_submissions.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatMessage(Base):
    """聊天消息"""
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(64))
    role = Column(String(16))  # user / assistant
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


# ========== 邮件记录 ==========
class EmailRecord(Base):
    """邮件发送记录"""
    __tablename__ = "email_records"
    id = Column(Integer, primary_key=True, autoincrement=True)
    to_email = Column(String(256))
    subject = Column(String(512))
    type = Column(String(32))  # product_reply / partner_reply / internal_assign
    submission_id = Column(Integer, ForeignKey("form_submissions.id"), nullable=True)
    session_id = Column(String(64), nullable=True)
    # 内部邮件分配：发送给销售
    sales_email_id = Column(Integer, ForeignKey("sales_emails.id"), nullable=True)
    attachments = Column(JSON, default=list)  # 材料库 PDF 路径
    status = Column(String(16), default="sent")  # sent / failed
    error_msg = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# ========== 知识库（仅参考，不可外发） ==========
class KnowledgeFile(Base):
    """知识库文件：PDF/PPT/Excel/Word，仅用于 AI 参考"""
    __tablename__ = "knowledge_files"
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(256))
    file_path = Column(String(512))
    file_type = Column(String(16))  # pdf / pptx / xlsx / docx
    parsed_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


# ========== 材料库（仅 PDF，AI 邮件附件专用） ==========
class MaterialFile(Base):
    """材料库（旧表，兼容）：仅 PDF，AI 可匹配后作为邮件附件发送"""
    __tablename__ = "material_files"
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(256))
    file_path = Column(String(512))
    scenario = Column(String(64))  # product_consult / partner_coop
    call_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


# ========== 材料库（独立模块，material_library） ==========
class MaterialLibrary(Base):
    """材料库：仅 PDF，仅 AI 邮件回复时可调用作为附件，管理员可预览/编辑"""
    __tablename__ = "material_library"
    id = Column(Integer, primary_key=True, autoincrement=True)
    file_name = Column(String(256))
    file_path = Column(String(512))
    scene = Column(String(64))  # product_consult / partner_coop / general
    upload_time = Column(DateTime, default=datetime.utcnow)
    call_count = Column(Integer, default=0)
    is_delete = Column(Boolean, default=False)  # 软删除


async def init_db():
    """初始化数据库表及索引"""
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        try:
            await conn.execute(text("ALTER TABLE sales_emails ADD COLUMN scenario VARCHAR(64)"))
        except Exception:
            pass  # 列已存在则忽略
        # 性能优化：添加常用查询索引
        for idx_sql in [
            "CREATE INDEX IF NOT EXISTS idx_form_submissions_created ON form_submissions(created_at DESC)",
            "CREATE INDEX IF NOT EXISTS idx_email_records_created ON email_records(created_at DESC)",
            "CREATE INDEX IF NOT EXISTS idx_token_usage_created ON token_usage(created_at)",
            "CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id)",
        ]:
            try:
                await conn.execute(text(idx_sql))
            except Exception:
                pass

    from app.config_store import seed_default_chat_prompts_if_missing

    await seed_default_chat_prompts_if_missing()
