"""
邮件服务：SMTP 协议
- 支持变量替换
- 附件发送（仅材料库 PDF）
- 内部销售邮箱分配：客户同意会议后发送
- 支持传入 config 覆盖（来自管理后台数据库配置）
"""
import os
from pathlib import Path
from typing import Optional, List, Dict, Any
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

from config import settings


async def send_email(
    to: str,
    subject: str,
    html: str,
    attachments: Optional[List[str]] = None,
    from_name: Optional[str] = None,
    config: Optional[Dict[str, Any]] = None,
) -> None:
    """
    发送邮件
    config: 来自管理后台的 SMTP 配置，优先于环境变量
    attachments: 仅材料库 PDF 路径，知识库文件不可作为附件
    """
    cfg = config or {}
    host = cfg.get("host") or settings.SMTP_HOST
    user = cfg.get("user") or settings.SMTP_USER
    pass_ = cfg.get("pass") or settings.SMTP_PASS
    port = int(cfg.get("port") or settings.SMTP_PORT or 587)
    from_name = from_name or cfg.get("from_name") or settings.SMTP_FROM_NAME or "Flyingnets"
    if not host or not user or not pass_:
        raise ValueError("SMTP 未配置，请在 AI 助手管理后台设置")

    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = f"{from_name} <{user}>"
    msg["To"] = to
    msg.attach(MIMEText(html, "html", "utf-8"))

    # 附件：仅材料库 PDF 可外发，知识库文件禁止作为附件
    MATERIAL_PREFIX = "data/materials"
    if attachments:
        for path in attachments:
            p = Path(path)
            if p.suffix.lower() != ".pdf":
                continue
            if str(p).replace("\\", "/").find(MATERIAL_PREFIX) < 0:
                continue  # 仅材料库路径可外发
            if p.exists():
                with open(p, "rb") as f:
                    part = MIMEApplication(f.read(), _subtype="pdf")
                    part.add_header("Content-Disposition", "attachment", filename=p.name)
                    msg.attach(part)

    async with aiosmtplib.SMTP(
        hostname=host,
        port=port,
        use_tls=port != 465,
    ) as smtp:
        await smtp.login(user, pass_)
        await smtp.send_message(msg)


def render_template(template: str, **kwargs) -> str:
    """简单变量替换：{{name}} -> kwargs['name']"""
    for k, v in kwargs.items():
        template = template.replace("{{" + str(k) + "}}", str(v or ""))
    return template
