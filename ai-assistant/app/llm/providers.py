"""
LLM 多厂商对接：OpenAI / 讯飞 / 百度文心
配置从管理后台数据库读取，调用前校验 Token 剩余量
"""
from typing import Optional
from openai import AsyncOpenAI
from config import settings
from app.database import AsyncSessionLocal, TokenUsage
from app.config_store import get_config_multi
from sqlalchemy import select, func
from datetime import datetime


async def _get_limits():
    """从数据库读取 Token 限额，优先于环境变量"""
    cfg = await get_config_multi("token_daily_limit", "token_monthly_limit")
    return (
        int(cfg.get("token_daily_limit") or settings.TOKEN_DAILY_LIMIT or 100000),
        int(cfg.get("token_monthly_limit") or settings.TOKEN_MONTHLY_LIMIT or 2000000),
    )


async def check_token_limit() -> tuple[bool, str]:
    """校验 Token 剩余量，限额从管理后台读取"""
    daily_limit, monthly_limit = await _get_limits()
    async with AsyncSessionLocal() as db:
        today = datetime.utcnow().date()
        month_start = today.replace(day=1)
        daily = await db.execute(select(func.sum(TokenUsage.input_tokens + TokenUsage.output_tokens)).where(func.date(TokenUsage.created_at) == today))
        monthly = await db.execute(select(func.sum(TokenUsage.input_tokens + TokenUsage.output_tokens)).where(TokenUsage.created_at >= month_start))
        daily_used = daily.scalar() or 0
        monthly_used = monthly.scalar() or 0
    if daily_used >= daily_limit:
        return False, f"今日 Token 已达上限 {daily_limit}，请明日再试"
    if monthly_used >= monthly_limit:
        return False, f"本月 Token 已达上限 {monthly_limit}，请联系管理员"
    return True, ""


async def record_token_usage(provider: str, model: str, input_tokens: int, output_tokens: int):
    async with AsyncSessionLocal() as db:
        db.add(TokenUsage(provider=provider, model=model, input_tokens=input_tokens, output_tokens=output_tokens))
        await db.commit()


async def get_llm_response(messages: list[dict], provider: Optional[str] = None) -> str:
    """统一 LLM 调用入口，API Key 等从管理后台读取"""
    cfg = await get_config_multi("llm_provider", "llm_api_key", "llm_base_url", "llm_model")
    prov = provider or cfg.get("llm_provider") or settings.LLM_PROVIDER
    api_key = cfg.get("llm_api_key") or settings.OPENAI_API_KEY
    base_url = cfg.get("llm_base_url") or settings.OPENAI_BASE_URL
    model = cfg.get("llm_model") or "gpt-3.5-turbo"
    if not api_key:
        raise ValueError("LLM API Key 未配置，请在 AI 助手管理后台设置")
    if prov == "openai":
        client = AsyncOpenAI(api_key=api_key, base_url=base_url or None)
        ok, msg = await check_token_limit()
        if not ok:
            raise ValueError(msg)
        resp = await client.chat.completions.create(model=model, messages=messages)
        content = (resp.choices[0].message.content or "")
        if resp.usage:
            await record_token_usage("openai", model, resp.usage.prompt_tokens or 0, resp.usage.completion_tokens or 0)
        return content
    raise ValueError(f"不支持的 LLM 厂商: {prov}")
