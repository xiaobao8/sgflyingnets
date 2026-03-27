"""
聊天留资检测与总结邮件
- 从聊天记录中提取客户联系方式（邮箱/手机/姓名/公司）
- 对话达到一定轮次后，通过系统提示词引导 AI 收集联系方式
- 检测到联系方式后，生成对话总结并发送邮件通知
"""
import re
from typing import Optional
from datetime import datetime

from app.database import AsyncSessionLocal, EmailRecord
from app.llm.providers import get_llm_response
from app.azure_email import send_azure_email
from app.meeting_trigger import load_chat_history
from config import settings
from sqlalchemy import select


EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
PHONE_REGEX = re.compile(
    r"(?:\+?\d{1,4}[\s\-]?)?"
    r"(?:\(?\d{2,4}\)?[\s\-]?)?"
    r"\d{3,4}[\s\-]?\d{3,4}"
)

GUIDE_ROUND_THRESHOLD = 3

CONTACT_GUIDE_PROMPT = {
    "zh": (
        "\n\n【重要】当你已经回答了客户的主要问题后，请自然地引导客户留下联系方式（姓名、公司、手机号、邮箱），"
        "以便安排专业顾问后续跟进。语气亲切自然，不要生硬。"
        "例如：'为了让我们的专业顾问为您提供更详细的方案，方便留一下您的联系方式吗？（姓名、公司、手机、邮箱）'"
    ),
    "en": (
        "\n\n[IMPORTANT] After answering the customer's main questions, naturally guide them to share their contact details "
        "(name, company, phone, email) so a specialist can follow up. Be friendly and not pushy. "
        "Example: 'To have our specialist provide a tailored proposal, could you share your contact info? (name, company, phone, email)'"
    ),
    "ja": (
        "\n\n【重要】お客様の主な質問に回答した後、自然にお客様の連絡先（お名前、会社名、電話番号、メールアドレス）を"
        "お伺いしてください。専門のコンサルタントがフォローアップできるようにするためです。"
        "丁寧かつ自然な口調でお願いします。"
    ),
}


def extract_contact_from_messages(messages: list[dict]) -> dict:
    """
    从用户消息中提取联系方式
    返回 {"email": ..., "phone": ..., "name": ..., "company": ...}
    """
    user_texts = [m["content"] for m in messages if m["role"] == "user"]
    full_text = "\n".join(user_texts)

    emails = EMAIL_REGEX.findall(full_text)
    phones = PHONE_REGEX.findall(full_text)

    # 过滤掉 flyingnets.com / sgflyingnets.com 等内部邮箱
    customer_emails = [
        e for e in emails
        if "flyingnets" not in e.lower() and "sgflyingnets" not in e.lower()
    ]
    # 过滤过短的电话匹配（至少 7 位数字）
    valid_phones = [p.strip() for p in phones if sum(c.isdigit() for c in p) >= 7]

    return {
        "email": customer_emails[0] if customer_emails else "",
        "phone": valid_phones[0] if valid_phones else "",
    }


def should_guide_contact(message_count: int) -> bool:
    """判断是否应该在系统提示词中加入留资引导"""
    return message_count >= GUIDE_ROUND_THRESHOLD


def has_contact_info(contact: dict) -> bool:
    """判断是否已收集到足够的联系方式（邮箱或手机至少有一个）"""
    return bool(contact.get("email") or contact.get("phone"))


async def generate_chat_summary(chat_history: list[dict]) -> str:
    """使用 LLM 生成对话总结"""
    chat_text = "\n".join(f"{m['role']}: {m['content']}" for m in chat_history)

    prompt = f"""请根据以下客户与AI助手的聊天记录，生成一份简洁的内部销售跟进总结。
严格按JSON格式输出，不要其他文字：
{{
  "summary": "对话总结：客户咨询了什么，核心诉求是什么（100字内）",
  "interest": "客户兴趣点：对哪些产品/服务感兴趣（50字内）",
  "suggestion": "跟进建议：建议销售如何跟进（80字内）",
  "urgency": "紧急程度：高/中/低"
}}

聊天记录：
{chat_text[:3000]}"""

    try:
        reply = await get_llm_response([{"role": "user", "content": prompt}])
        import json
        for start in ["{", "```json"]:
            if start in reply:
                j = reply[reply.find("{"):reply.rfind("}") + 1]
                try:
                    return json.loads(j)
                except json.JSONDecodeError:
                    pass
        return {
            "summary": "客户通过官网AI助手进行了咨询",
            "interest": "待分析",
            "suggestion": "请尽快联系客户",
            "urgency": "中",
        }
    except Exception:
        return {
            "summary": "客户通过官网AI助手进行了咨询",
            "interest": "待分析",
            "suggestion": "请尽快联系客户",
            "urgency": "中",
        }


def build_notification_html(
    summary_data: dict,
    contact: dict,
    submission_context: Optional[dict],
) -> str:
    """构建通知邮件 HTML"""
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

    form_info = ""
    if submission_context:
        form_rows = "".join(
            f"<tr><td style='padding:6px 12px;font-weight:600;color:#333;border-bottom:1px solid #eee'>{k}</td>"
            f"<td style='padding:6px 12px;color:#555;border-bottom:1px solid #eee'>{v or '-'}</td></tr>"
            for k, v in submission_context.items() if v
        )
        if form_rows:
            form_info = f"""
            <h3 style="color:#1a1a2e;margin-top:20px">📋 客户已填表单</h3>
            <table style="width:100%;border-collapse:collapse">{form_rows}</table>"""

    urgency_color = {"高": "#e74c3c", "中": "#f39c12", "低": "#27ae60"}.get(
        summary_data.get("urgency", "中"), "#f39c12"
    )

    return f"""
<div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto">
  <h2 style="color:#1a1a2e;border-bottom:2px solid #c9a96e;padding-bottom:8px">
    💬 AI 助手对话总结
    <span style="float:right;font-size:14px;font-weight:normal;color:{urgency_color}">
      紧急程度：{summary_data.get('urgency', '中')}
    </span>
  </h2>

  <h3 style="color:#1a1a2e;margin-top:20px">📝 对话总结</h3>
  <p style="color:#555;line-height:1.6">{summary_data.get('summary', '')}</p>

  <h3 style="color:#1a1a2e">🎯 客户兴趣</h3>
  <p style="color:#555;line-height:1.6">{summary_data.get('interest', '')}</p>

  <h3 style="color:#1a1a2e">💡 跟进建议</h3>
  <p style="color:#555;line-height:1.6">{summary_data.get('suggestion', '')}</p>

  <h3 style="color:#1a1a2e">👤 客户联系方式</h3>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:6px 12px;font-weight:600;color:#333;border-bottom:1px solid #eee">邮箱</td>
        <td style="padding:6px 12px;color:#555;border-bottom:1px solid #eee">{contact.get('email') or '未提供'}</td></tr>
    <tr><td style="padding:6px 12px;font-weight:600;color:#333;border-bottom:1px solid #eee">电话</td>
        <td style="padding:6px 12px;color:#555;border-bottom:1px solid #eee">{contact.get('phone') or '未提供'}</td></tr>
  </table>
  {form_info}

  <p style="margin-top:24px;font-size:12px;color:#999">此邮件由 Flyingnets 官网 AI 助手自动发送 · {now}</p>
</div>"""


async def trigger_contact_summary_email(
    session_id: str,
    submission_context: Optional[dict],
) -> bool:
    """
    检测到联系方式后，生成总结并发送通知邮件
    同一会话仅触发一次
    """
    async with AsyncSessionLocal() as db:
        r = await db.execute(
            select(EmailRecord)
            .where(EmailRecord.session_id == session_id)
            .where(EmailRecord.type == "chat_summary")
        )
        if r.scalars().first():
            return False

    recipients = [
        e.strip() for e in (settings.AZURE_CHAT_NOTIFY_EMAILS or "").split(",") if e.strip()
    ]
    if not recipients:
        return False

    chat_history = await load_chat_history(session_id)
    contact = extract_contact_from_messages(chat_history)

    if not has_contact_info(contact):
        return False

    summary_data = await generate_chat_summary(chat_history)
    html = build_notification_html(summary_data, contact, submission_context)
    subject = f"[AI对话总结] 客户咨询 - {contact.get('email') or contact.get('phone')}"

    try:
        result = await send_azure_email(recipients, subject, html)
        status = "sent" if "成功" in result else "failed"
        async with AsyncSessionLocal() as db:
            db.add(EmailRecord(
                to_email=",".join(recipients),
                subject=subject,
                type="chat_summary",
                session_id=session_id,
                status=status,
                error_msg="" if status == "sent" else result,
            ))
            await db.commit()
        return status == "sent"
    except Exception as e:
        async with AsyncSessionLocal() as db:
            db.add(EmailRecord(
                to_email=",".join(recipients),
                subject=subject,
                type="chat_summary",
                session_id=session_id,
                status="failed",
                error_msg=str(e),
            ))
            await db.commit()
        return False
