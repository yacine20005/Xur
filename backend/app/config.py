import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")

KNOWLEDGE_BASE_PATH = os.getenv(
    "KNOWLEDGE_BASE_PATH",
    str(Path(__file__).resolve().parent / "knowledge_base.md")
)

def get_knowledge_base() -> str:
    path = Path(KNOWLEDGE_BASE_PATH)
    if path.exists():
        return path.read_text(encoding="utf-8")
    return "Base de connaissances par défaut de l'assistant Xur."
