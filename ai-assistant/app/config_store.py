"""
从数据库读取 AI 配置，供聊天、邮件等使用
管理界面修改后立即生效
"""
from typing import Optional

from app.database import AsyncSessionLocal, AIConfig
from sqlalchemy import select

# 分语言聊天提示词（管理后台 key）；未配置时回退 prompt_chat_base，再回退下列默认
CHAT_PROMPT_KEYS = ("prompt_chat_zh", "prompt_chat_en", "prompt_chat_ja")

_DEFAULT_CHAT_ZH = """你是 Flyingnets 的销售顾问，专业且亲和。
- 根据客户回复语气调整：客户用「您/请问」则正式，用「你/哈」则轻松；
- 不主动提「预约」「表单」，仅在客户表达想深入沟通时，自然回应「那我们可以安排一次线上会议，您看方便吗？」；
- 避免推销感，以解决问题为导向。当客户同意沟通时，系统会自动通知销售跟进。"""

_DEFAULT_CHAT_EN = """You are a Flyingnets sales consultant: professional and approachable.
- Mirror the customer's tone: more formal if they are formal, lighter if they are casual;
- Do not push "booking" or "forms"; only when they want to go deeper, naturally offer something like "We can set up a brief online meeting—would that work for you?";
- Avoid hard selling; focus on solving their needs. When they agree to talk further, the team is notified automatically."""

_DEFAULT_CHAT_JA = """あなたは Flyingnets の営業担当です。プロフェッショナルかつ親しみやすく対応してください。
- お客様の文体に合わせる：敬語なら丁寧に、カジュアルならやわらかく；
- 「予約」「フォーム」を押し付けない。深く話したいと言ったときだけ、自然に「オンラインで一度お話しできればと思いますが、いかがでしょうか？」のように誘導；
- 押し売りは避け、課題解決を優先。合意があれば営業へ自動通知されます。"""

DEFAULT_CHAT_PROMPTS = {
    "zh": _DEFAULT_CHAT_ZH,
    "en": _DEFAULT_CHAT_EN,
    "ja": _DEFAULT_CHAT_JA,
}


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


def normalize_chat_locale(locale: Optional[str]) -> str:
    loc = (locale or "en").lower().strip()
    if loc.startswith("zh"):
        return "zh"
    if loc.startswith("ja"):
        return "ja"
    if loc.startswith("en"):
        return "en"
    return "en"


async def get_chat_prompt(locale: Optional[str] = None) -> str:
    """按界面语言加载聊天系统提示词；优先分语言配置，其次 prompt_chat_base，最后内置默认。"""
    loc = normalize_chat_locale(locale)
    key_for_locale = {"zh": "prompt_chat_zh", "en": "prompt_chat_en", "ja": "prompt_chat_ja"}[loc]
    cfg = await get_config_multi(*CHAT_PROMPT_KEYS, "prompt_chat_base")
    p = (cfg.get(key_for_locale) or "").strip() or (cfg.get("prompt_chat_base") or "").strip()
    if p:
        return p
    return DEFAULT_CHAT_PROMPTS[loc]


async def seed_default_chat_prompts_if_missing() -> None:
    """启动时：若分语言 key 不存在则写入（新库写三份默认；仅存在 prompt_chat_base 时中文用旧内容，英日用默认）。"""
    async with AsyncSessionLocal() as db:
        r_base = await db.execute(select(AIConfig).where(AIConfig.key == "prompt_chat_base"))
        row_base = r_base.scalars().first()
        base_val = (row_base.value or "").strip() if row_base else ""

        seeds: list[tuple[str, str]] = []
        for loc, key in [("zh", "prompt_chat_zh"), ("en", "prompt_chat_en"), ("ja", "prompt_chat_ja")]:
            r = await db.execute(select(AIConfig).where(AIConfig.key == key))
            if r.scalars().first() is not None:
                continue
            if loc == "zh" and base_val:
                seeds.append((key, base_val))
            else:
                seeds.append((key, DEFAULT_CHAT_PROMPTS[loc]))

        for key, value in seeds:
            db.add(AIConfig(key=key, value=value))
        if seeds:
            await db.commit()


async def get_email_prompt(form_type: str) -> str:
    """获取邮件回复提示词（产品/代理场景）"""
    key = "prompt_email_product" if form_type == "contact" else "prompt_email_partner"
    p = await get_config(key)
    return p or f"""根据以下表单信息，以 Flyingnets 销售身份撰写一封简短、专业的回复邮件。
- 根据用户兴趣点（{form_type}）个性化话术；
- 自然引导客户同意安排在线会议深入沟通；
- 语气友好、专业，不要过于推销。"""
