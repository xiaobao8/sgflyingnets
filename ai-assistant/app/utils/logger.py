"""
系统日志：记录 AI 调用、邮件发送、文件上传
支持按时间/模块筛选
"""
import logging
import json
import os
from pathlib import Path
from datetime import datetime

LOG_DIR = Path("data/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)

logger = logging.getLogger("ai_assistant")
logger.setLevel(logging.INFO)
if not logger.handlers:
    fh = logging.FileHandler(LOG_DIR / "ai_assistant.log", encoding="utf-8")
    fh.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    logger.addHandler(fh)


def log_ai_call(session_id: str, tokens: int, latency_ms: float, module: str = "chat"):
    logger.info(json.dumps({
        "event": "ai_call",
        "module": module,
        "session_id": session_id,
        "tokens": tokens,
        "latency_ms": round(latency_ms, 2),
    }, ensure_ascii=False))


def log_email(to: str, subject: str, status: str, error: str = ""):
    logger.info(json.dumps({
        "event": "email",
        "to": to[:3] + "***" if len(to) > 3 else "***",
        "subject": subject[:50],
        "status": status,
        "error": error[:200] if error else "",
    }, ensure_ascii=False))


def log_upload(module: str, filename: str, size_bytes: int, success: bool):
    logger.info(json.dumps({
        "event": "upload",
        "module": module,
        "filename": filename,
        "size_bytes": size_bytes,
        "success": success,
    }, ensure_ascii=False))
