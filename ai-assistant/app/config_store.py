"""
从数据库读取 AI 配置，供聊天、邮件等使用
管理界面修改后立即生效
"""
from typing import Optional
from app.database import AsyncSessionLocal, AIConfig
from sqlalchemy import select


async def get_config(key: str) -> Optional[str]:
    """获取单条配置"""
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(AIConfig).where(AIConfig.key == key))
        row = r.scalars().first()
        return row.value if row else None


async def get_config_multi(*keys: str) -> dict[str, str]:
    """批量获取配置"""
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(AIConfig).where(AIConfig.key.in_(keys)))
        rows = r.scalars().all()
        return {row.key: row.value for row in rows if row.value}


async def get_smtp_config() -> dict:
    """获取 SMTP 配置（优先数据库，其次环境变量）"""
    from config import settings
    cfg = await get_config_multi("smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from_name")
    return {
        "host": cfg.get("smtp_host") or settings.SMTP_HOST,
        "port": int(cfg.get("smtp_port") or settings.SMTP_PORT or 587),
        "user": cfg.get("smtp_user") or settings.SMTP_USER,
        "pass": cfg.get("smtp_pass") or settings.SMTP_PASS,
        "from_name": cfg.get("smtp_from_name") or settings.SMTP_FROM_NAME or "Flyingnets",
    }


async def get_chat_prompt() -> str:
    """获取聊天基础提示词"""
    p = await get_config("prompt_chat_base")
    return p or """你是 Flyingnets 的销售顾问，专业且亲和。
- 根据客户回复语气调整：客户用「您/请问」则正式，用「你/哈」则轻松；
- 不主动提「预约」「表单」，仅在客户表达想深入沟通时，自然回应「那我们可以安排一次线上会议，您看方便吗？」；
- 避免推销感，以解决问题为导向。当客户同意沟通时，系统会自动通知销售跟进。"""


async def get_email_prompt(form_type: str) -> str:
    """获取邮件回复提示词（产品/代理场景）"""
    key = "prompt_email_product" if form_type == "contact" else "prompt_email_partner"
    p = await get_config(key)
    return p or f"""根据以下表单信息，以 Flyingnets 销售身份撰写一封简短、专业的回复邮件。
- 根据用户兴趣点（{form_type}）个性化话术；
- 自然引导客户同意安排在线会议深入沟通；
- 语气友好、专业，不要过于推销。"""
