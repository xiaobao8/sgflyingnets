"""
敏感数据加密：LLM API Key、邮箱密码
使用 Fernet（AES-128-CBC）加密存储
"""
import os
import base64

_cipher = None


def _get_cipher():
    global _cipher
    if _cipher is None:
        try:
            from cryptography.fernet import Fernet
            key = os.environ.get("ENCRYPTION_KEY")
            if key:
                # 用户提供的 key 需为 32 字节 url-safe base64
                k = base64.urlsafe_b64encode(key.encode()[:32].ljust(32)[:32])
                _cipher = Fernet(k)
            else:
                _cipher = None  # 未配置则不加密
        except Exception:
            _cipher = None
    return _cipher


def encrypt(plain: str) -> str:
    """加密，未配置 ENCRYPTION_KEY 时返回原文"""
    c = _get_cipher()
    if not c or not plain:
        return plain
    try:
        return c.encrypt(plain.encode()).decode()
    except Exception:
        return plain


def decrypt(cipher_text: str) -> str:
    """解密，未加密或失败时返回原文"""
    c = _get_cipher()
    if not c or not cipher_text:
        return cipher_text or ""
    try:
        return c.decrypt(cipher_text.encode()).decode()
    except Exception:
        return cipher_text
