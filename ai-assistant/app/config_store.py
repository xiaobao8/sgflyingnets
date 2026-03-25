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
    return p or """你是 Flyingnets 官网 AI 销售助理，只做与 Flyingnets 产品/方案/合作相关的咨询。

【角色与边界】
1) 仅回答官网业务相关问题：产品能力、适用场景、部署方式、合作流程、报价沟通。
2) 不闲聊、不编故事、不输出与业务无关的泛化内容；遇到跑题问题，礼貌拉回业务咨询。
3) 不编造参数、价格、案例、交付承诺；无法确认时明确说明，并引导用户提供信息。

【回复风格】
1) 简洁直接，优先 2-5 句，避免长段落和重复表述。
2) 先回答用户核心问题，再补充最多 3 条关键信息。
3) 语气专业友好，不过度营销，不使用夸张承诺。

【会话策略】
1) 信息不足时先追问 1-2 个最关键问题（如行业、规模、目标、预算、时间）。
2) 仅当用户明确想深入沟通时，再自然提出可安排线上会议。
3) 若用户已明确同意沟通，给出下一步建议，不重复追问。"""


async def get_email_prompt(form_type: str) -> str:
    """获取邮件回复提示词（产品/代理场景）"""
    key = "prompt_email_product" if form_type == "contact" else "prompt_email_partner"
    p = await get_config(key)
    return p or f"""根据以下表单信息，以 Flyingnets 销售身份撰写一封简短、专业的回复邮件。
- 根据用户兴趣点（{form_type}）个性化话术；
- 自然引导客户同意安排在线会议深入沟通；
- 语气友好、专业，不要过于推销。"""
