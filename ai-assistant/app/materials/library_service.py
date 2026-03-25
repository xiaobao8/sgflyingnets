"""
材料库服务：匹配规则、调用计数
- 根据用户兴趣点（产品/代理）匹配对应场景的 PDF
- 优先：调用次数少 > 最新上传
- 仅 AI 邮件回复时可调用作为附件
"""
from pathlib import Path
from app.database import AsyncSessionLocal, MaterialLibrary
from sqlalchemy import select, and_, or_, asc, desc

SCENE_MAP = {
    "contact": ["product_consult", "general"],      # 产品咨询表单
    "partnership": ["partner_coop", "general"],     # 代理合作表单
}


async def match_material_for_email(interest_type: str) -> str | None:
    """
    根据用户兴趣点匹配材料库 PDF
    interest_type: contact(产品咨询) / partnership(代理合作)
    返回文件路径，无匹配返回 None
    匹配规则：优先调用次数少、其次最新上传
    """
    scenes = SCENE_MAP.get(interest_type, ["general"])
    async with AsyncSessionLocal() as db:
        r = await db.execute(
            select(MaterialLibrary)
            .where(MaterialLibrary.is_delete == False)
            .where(MaterialLibrary.scene.in_(scenes))
            .order_by(asc(MaterialLibrary.call_count), desc(MaterialLibrary.upload_time))
            .limit(1)
        )
        row = r.scalars().first()
        if not row:
            return None
        p = Path(row.file_path)
        if not p.exists():
            return None
        # 增加调用计数
        row.call_count = (row.call_count or 0) + 1
        await db.commit()
        return row.file_path


async def get_material_path_for_preview(material_id: int) -> str | None:
    """管理员预览：根据 ID 获取文件路径，不增加 call_count"""
    async with AsyncSessionLocal() as db:
        r = await db.execute(
            select(MaterialLibrary).where(MaterialLibrary.id == material_id).where(MaterialLibrary.is_delete == False)
        )
        row = r.scalars().first()
        if not row:
            return None
        p = Path(row.file_path)
        return row.file_path if p.exists() else None
