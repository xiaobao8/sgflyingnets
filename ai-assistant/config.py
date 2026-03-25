"""
AI 营销小助手 - 配置
支持环境变量覆盖
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # 数据库：SQLite 默认，可改为 postgresql:// 或 mysql://
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/ai_assistant.db"

    # 现有网站表单数据同步：HP 项目 data 目录路径（用于读取 submissions.json）
    HP_DATA_DIR: str = "../data"

    # CORS：允许的前端域名
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://0.0.0.0:3000"

    # SMTP（AI 发件）
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASS: Optional[str] = None
    SMTP_FROM_NAME: str = "Flyingnets Sales"

    # LLM 默认
    LLM_PROVIDER: str = "openai"  # openai / xunfei / baidu
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_BASE_URL: Optional[str] = None  # 兼容国内代理

    # Token 限流（日/月）
    TOKEN_DAILY_LIMIT: int = 100000
    TOKEN_MONTHLY_LIMIT: int = 2000000

    # 文件大小限制（MB）
    KNOWLEDGE_MAX_FILE_MB: int = 50
    MATERIAL_MAX_FILE_MB: int = 20

    class Config:
        env_file = ".env"


settings = Settings()
