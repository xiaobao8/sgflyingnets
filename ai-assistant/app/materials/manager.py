"""
材料库管理：仅 PDF
- 仅接受 PDF 格式，其他格式拒绝
- 支持标注适用场景（产品咨询/代理合作/通用）
- AI 可根据用户兴趣匹配并作为邮件附件发送
- 记录文件调用次数
- 仅 AI 邮件回复时可调用，前端/后台不可直接下载外发
"""
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional

UPLOAD_DIR = Path("data/materials")
ALLOWED_EXT = ".pdf"
SCENARIOS = ["product_consult", "partner_coop", "general"]  # 产品咨询/代理合作/通用


def ensure_dir():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def validate_pdf(file_path: str) -> bool:
    """校验是否为 PDF"""
    return Path(file_path).suffix.lower() == ".pdf"


def save_material(file_content: bytes, filename: str, scenario: str) -> str:
    """
    保存材料库文件（仅 PDF）
    返回存储路径
    """
    if Path(filename).suffix.lower() != ".pdf":
        raise ValueError("材料库仅支持 PDF 格式，请上传 PDF 文件")
    if scenario not in SCENARIOS:
        raise ValueError(f"场景必须是: {', '.join(SCENARIOS)}")
    ensure_dir()
    safe_base = "".join(c for c in Path(filename).stem if c.isalnum() or c in "._- ") or "file"
    ts = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    path = UPLOAD_DIR / f"{safe_base}_{ts}.pdf"
    with open(path, "wb") as f:
        f.write(file_content)
    return str(path)


def get_material_path(file_id: int, db_path: str) -> Optional[str]:
    """根据数据库记录获取材料文件路径"""
    p = Path(db_path)
    if p.exists():
        return db_path
    return None
