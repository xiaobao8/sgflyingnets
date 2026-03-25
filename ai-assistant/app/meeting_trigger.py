"""
客户同意会议后触发内部邮件
- 关键词检测
- 基于聊天/表单生成：沟通总结、兴趣分析、跟进建议
- 按场景分配收件人（默认邮箱/产品/代理）
"""
from typing import Optional
from datetime import datetime
from app.database import AsyncSessionLocal, ChatMessage, SalesEmail, EmailRecord
from app.llm.providers import get_llm_response
from app.knowledge.vector_store import KnowledgeVectorStore
from app.email_service import send_email
from sqlalchemy import select, or_

# 触发关键词：客户表达同意开在线会议的意向（中/英/日）
AGREE_KEYWORDS = [
    # 中文
    "同意会议", "可以沟通", "想进一步聊聊", "想深入聊", "想详细聊",
    "可以约", "可以安排", "想约个时间", "想安排时间",
    "同意开", "可以开", "想开", "在线会议", "视频会议",
    "进一步沟通", "深入沟通", "详细沟通", "当面聊", "线上聊",
    "好的可以", "行可以", "可以啊", "没问题", "可以的",
    # English
    "schedule", "meeting", "call", "discuss", "talk", "demo",
    "yes please", "sure", "ok", "sounds good", "let's meet",
    "online meeting", "video call", "zoom", "teams",
    # 日本語
    "会議", "ミーティング", "打ち合わせ", "オンライン", "ビデオ",
    "はい", "お願いします", "大丈夫", "いいです", "相談",
]

# 场景推断关键词（中/英/日）
PRODUCT_KEYWORDS = ["产品", "价格", "服务", "咨询", "了解", "product", "price", "service", "demo", "製品", "価格", "サービス", "デモ"]
PARTNER_KEYWORDS = ["代理", "合作", "分成", "政策", "加盟", "partner", "distributor", "reseller", "oem", "代理店", "パートナー", "提携"]


def check_meeting_agreed(text: str) -> bool:
    """检测聊天内容是否包含客户同意会议的意向"""
    t = (text or "").lower().strip()
    return any(kw in t for kw in AGREE_KEYWORDS)


def infer_scenario(chat_text: str, submission_context: Optional[dict]) -> str:
    """
    推断客户兴趣场景：product_consult / partner_coop
    用于选择收件人
    """
    ctx = str(submission_context or "").lower()
    full = (chat_text or "").lower() + " " + ctx
    if any(k in full for k in PARTNER_KEYWORDS):
        return "partner_coop"
    if any(k in full for k in PRODUCT_KEYWORDS):
        return "product_consult"
    return ""


async def get_recipient_email(scenario: str) -> Optional[str]:
    """
    从内部销售邮箱中选取收件人
    - 优先匹配 scenario（product_consult / partner_coop）
    - 否则使用默认（scenario 为空或 null）
    """
    async with AsyncSessionLocal() as db:
        # 先按场景匹配
        if scenario:
            r = await db.execute(
                select(SalesEmail)
                .where(SalesEmail.is_active == True)
                .where(SalesEmail.scenario == scenario)
                .limit(1)
            )
            row = r.scalars().first()
            if row:
                return row.email
        # 默认邮箱（scenario 为空或 null）
        r = await db.execute(
            select(SalesEmail)
            .where(SalesEmail.is_active == True)
            .where(or_(SalesEmail.scenario == "", SalesEmail.scenario.is_(None)))
            .limit(1)
        )
        row = r.scalars().first()
        if row:
            return row.email
        # 任意一个
        r = await db.execute(select(SalesEmail).where(SalesEmail.is_active == True).limit(1))
        row = r.scalars().first()
        return row.email if row else None


async def load_chat_history(session_id: str) -> list[dict]:
    """加载会话的聊天记录"""
    async with AsyncSessionLocal() as db:
        r = await db.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at)
        )
        rows = r.scalars().all()
    return [{"role": r.role, "content": r.content or ""} for r in rows]


async def save_chat_message(session_id: str, role: str, content: str):
    """保存聊天消息"""
    async with AsyncSessionLocal() as db:
        db.add(ChatMessage(session_id=session_id, role=role, content=content))
        await db.commit()


async def generate_internal_email_content(
    chat_history: list[dict],
    submission_context: Optional[dict],
    kb_store: KnowledgeVectorStore,
) -> tuple[str, str, str]:
    """
    基于聊天记录、表单、知识库生成内部邮件内容
    返回 (沟通总结, 兴趣分析, 跟进建议)
    """
    chat_text = "\n".join(f"{m['role']}: {m['content']}" for m in chat_history)
    form_text = str(submission_context or "")
    refs = kb_store.search(chat_text + " " + form_text, top_k=3)
    ref_text = "\n".join(r.get("text", "")[:500] for r in refs) if refs else ""

    prompt = """根据以下聊天记录和表单信息，生成内部销售跟进用的结构化内容。严格按 JSON 输出，不要其他文字：
{
  "summary": "沟通总结：提取客户核心问题，如「咨询XX产品价格」「想了解代理分成」等，50字内",
  "interest": "兴趣分析：标注客户核心需求（产品/代理、优先级、潜在关注点），50字内",
  "suggestion": "跟进建议：基于参考材料生成，如「建议重点介绍XX产品核心优势，附带代理政策PDF」，80字内"
}

聊天记录：
"""
    prompt += chat_text[:2000] + "\n\n表单信息：" + form_text[:500]
    if ref_text:
        prompt += "\n\n参考材料（知识库）：" + ref_text[:1000]

    try:
        reply = await get_llm_response([{"role": "user", "content": prompt}])
        import json
        # 尝试解析 JSON
        for start in ["{", "```json"]:
            if start in reply:
                j = reply[reply.find(start):].replace("```json", "").replace("```", "").strip()
                try:
                    d = json.loads(j)
                    return (
                        d.get("summary", "") or "客户表达会议意向",
                        d.get("interest", "") or "待分析",
                        d.get("suggestion", "") or "请尽快联系客户安排在线会议",
                    )
                except json.JSONDecodeError:
                    pass
        return ("客户表达会议意向", "待分析", "请尽快联系客户安排在线会议")
    except Exception:
        return ("客户表达会议意向", "待分析", "请尽快联系客户安排在线会议")


def extract_client_info(submission_context: Optional[dict], chat_history: list[dict]) -> dict:
    """从表单或聊天中提取客户信息"""
    info = {"name": "", "phone": "", "email": "", "interest": "", "time": datetime.utcnow().strftime("%Y-%m-%d %H:%M")}
    if submission_context:
        info["name"] = submission_context.get("contact") or submission_context.get("company") or ""
        info["phone"] = submission_context.get("phone") or ""
        info["email"] = submission_context.get("email") or ""
        info["interest"] = (submission_context.get("product_interest") or submission_context.get("coop_type") or submission_context.get("message") or "")[:100]
    # 若表单无邮箱，尝试从聊天中推断（简化：不解析）
    return info


async def send_internal_meeting_email(
    session_id: str,
    chat_history: list[dict],
    submission_context: Optional[dict],
    kb_store: KnowledgeVectorStore,
    smtp_config: dict,
) -> bool:
    """
    客户同意会议后，生成并发送内部邮件
    标题：【客户会议意向】{{客户姓名}}-{{兴趣点}}
    正文：沟通总结、兴趣分析、跟进建议、客户信息
    """
    # 避免同一会话重复触发
    async with AsyncSessionLocal() as db:
        r = await db.execute(
            select(EmailRecord).where(EmailRecord.session_id == session_id).where(EmailRecord.type == "internal_meeting")
        )
        if r.scalars().first():
            return False

    recipient = await get_recipient_email(infer_scenario(" ".join(m.get("content", "") for m in chat_history), submission_context))
    if not recipient or not smtp_config.get("host"):
        return False

    summary, interest, suggestion = await generate_internal_email_content(chat_history, submission_context, kb_store)
    client = extract_client_info(submission_context, chat_history)
    name = client["name"] or "客户"
    interest_short = (client["interest"] or interest or "会议意向")[:30]

    subject = f"【客户会议意向】{name}-{interest_short}"
    body = f"""
<h2>沟通总结</h2>
<p>{summary}</p>

<h2>兴趣分析</h2>
<p>{interest}</p>

<h2>跟进建议</h2>
<p>{suggestion}</p>

<h2>客户信息</h2>
<ul>
<li>姓名：{client['name'] or '未提供'}</li>
<li>联系方式：{client['phone'] or '未提供'}</li>
<li>邮箱：{client['email'] or '未提供'}</li>
<li>沟通时间：{client['time']}</li>
</ul>
"""
    try:
        await send_email(recipient, subject, body, config=smtp_config)
        async with AsyncSessionLocal() as db:
            db.add(EmailRecord(
                to_email=recipient,
                subject=subject,
                type="internal_meeting",
                session_id=session_id,
                status="sent",
            ))
            await db.commit()
        return True
    except Exception as e:
        async with AsyncSessionLocal() as db:
            db.add(EmailRecord(to_email=recipient, subject=subject, type="internal_meeting", session_id=session_id, status="failed", error_msg=str(e)))
            await db.commit()
        return False
