"""
知识库向量存储（FAISS）
仅用于 AI 回复时检索参考，不可外发
"""
import os
import pickle
from pathlib import Path
from typing import List, Optional

# 延迟导入，避免无 GPU 时 sentence-transformers 报错
_faiss = None
_model = None


def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
    return _model


def _get_faiss():
    global _faiss
    if _faiss is None:
        import faiss
        _faiss = faiss
    return _faiss


class KnowledgeVectorStore:
    """知识库向量存储，仅内部参考"""

    def __init__(self, index_path: str = "data/knowledge.faiss", meta_path: str = "data/knowledge.meta"):
        self.index_path = index_path
        self.meta_path = meta_path
        self.index = None
        self.metadata: List[dict] = []

    def _ensure_dir(self):
        Path(self.index_path).parent.mkdir(parents=True, exist_ok=True)

    def add(self, text: str, meta: dict):
        """添加文本到向量库"""
        model = _get_model()
        faiss = _get_faiss()
        vec = model.encode([text])
        vec = vec.astype("float32")
        faiss.normalize_L2(vec)

        if self.index is None:
            dim = vec.shape[1]
            self.index = faiss.IndexFlatIP(dim)
            self.metadata = []

        self.index.add(vec)
        self.metadata.append(meta)

    def search(self, query: str, top_k: int = 5) -> List[dict]:
        """检索最相关的文本片段"""
        if self.index is None:
            return []
        model = _get_model()
        faiss = _get_faiss()
        qvec = model.encode([query])
        qvec = qvec.astype("float32")
        faiss.normalize_L2(qvec)
        scores, ids = self.index.search(qvec, min(top_k, self.index.ntotal))
        results = []
        for i, idx in enumerate(ids[0]):
            if idx >= 0 and idx < len(self.metadata):
                results.append({
                    **self.metadata[idx],
                    "score": float(scores[0][i]),
                })
        return results

    def save(self):
        """保存索引"""
        self._ensure_dir()
        if self.index is not None:
            _get_faiss().write_index(self.index, self.index_path)
        with open(self.meta_path, "wb") as f:
            pickle.dump(self.metadata, f)

    def load(self):
        """加载索引"""
        if os.path.exists(self.index_path):
            self.index = _get_faiss().read_index(self.index_path)
        if os.path.exists(self.meta_path):
            with open(self.meta_path, "rb") as f:
                self.metadata = pickle.load(f)
        else:
            self.metadata = []
