"""
数据脱敏：手机号、邮箱中间位隐藏
"""
import re


def mask_phone(s: str) -> str:
    """138****8000"""
    if not s:
        return ""
    s = re.sub(r"\D", "", s)
    if len(s) < 7:
        return s[:2] + "***" if len(s) > 2 else "***"
    return s[:3] + "****" + s[-4:]


def mask_email(s: str) -> str:
    """ab***@example.com"""
    if not s or "@" not in s:
        return s or ""
    parts = s.split("@", 1)
    return (parts[0][:2] + "***@" + parts[1]) if len(parts[0]) > 2 else "***@" + parts[1]
