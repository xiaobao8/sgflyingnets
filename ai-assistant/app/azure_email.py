"""
Azure Graph API 邮件发送
使用 OAuth2 客户端凭据流获取 token，通过 Microsoft Graph 发送邮件
仅依赖 httpx（项目已有）
"""
import httpx
from typing import Optional
from config import settings


async def _get_access_token() -> str:
    """通过 client_credentials 流获取 Graph API access_token"""
    tenant_id = settings.AZURE_APP_TENANT_ID
    client_id = settings.AZURE_APP_CLIENT_ID
    client_secret = settings.AZURE_APP_CLIENT_SECRET

    if not all([tenant_id, client_id, client_secret]):
        raise ValueError("Azure 凭据未配置")

    url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": "https://graph.microsoft.com/.default",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, data=data)
        resp.raise_for_status()
        return resp.json()["access_token"]


async def send_azure_email(
    to_list: list[str],
    subject: str,
    html_content: str,
    cc_list: Optional[list[str]] = None,
) -> str:
    """
    通过 Azure Graph API 发送邮件
    发件人为 settings.AZURE_MAILBOX
    """
    mailbox = settings.AZURE_MAILBOX
    if not mailbox:
        raise ValueError("AZURE_MAILBOX 未配置")

    token = await _get_access_token()
    url = f"https://graph.microsoft.com/v1.0/users/{mailbox}/sendMail"

    message: dict = {
        "subject": subject,
        "body": {"contentType": "Html", "content": html_content},
        "toRecipients": [{"emailAddress": {"address": addr}} for addr in to_list],
    }
    if cc_list:
        message["ccRecipients"] = [{"emailAddress": {"address": addr}} for addr in cc_list]

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            url,
            json={"message": message},
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )
    if resp.status_code in (200, 202):
        return "发送成功"
    return f"发送失败: {resp.status_code} {resp.text}"
