"""
大文件异步解析：避免阻塞主线程
>10MB 使用 run_in_executor 后台解析
"""
import asyncio
from pathlib import Path
from app.knowledge.parser import parse_file

MAX_SYNC_SIZE_MB = 10


async def parse_file_async(file_path: str, file_type: str = None) -> str:
    """异步解析，大文件不阻塞"""
    try:
        size_mb = Path(file_path).stat().st_size / (1024 * 1024)
    except OSError:
        size_mb = 0
    if size_mb <= MAX_SYNC_SIZE_MB:
        return await asyncio.to_thread(parse_file, file_path, file_type)
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, lambda: parse_file(file_path, file_type))
