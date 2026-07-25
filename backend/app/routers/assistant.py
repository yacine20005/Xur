from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.services.session import session_manager

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

class InitRequest(BaseModel):
    page_url: Optional[str] = ""

class RatingRequest(BaseModel):
    api_key: str
    message_id: str
    rating: str # 'up' or 'down'

class ClickRequest(BaseModel):
    api_key: str
    message_id: Optional[str] = None
    url: Optional[str] = None

@router.get("/init/{api_key}")
@router.post("/init/{api_key}")
async def init_assistant(api_key: str, body: Optional[InitRequest] = None):
    session_id = session_manager.get_or_create_session()
    
    return {
        "session_id": session_id,
        "proactive_enabled": False,
        "response": {
            "displayType": "inline",
            "language": "fr",
            "companyName": "Yacine Hamadouche (Xur AI)",
            "companyProfilePicUrl": None,
            "initialMessage": "Bonjour ! Je suis l'assistant virtuel de Yacine et une démonstration vivante du projet Xur AI qu'il a conçu et développé. Comment puis-je vous aider ?",
            "button_options": [
                "Qui est Yacine ?",
                "Quels sont ses projets phares ?",
                "Comment le contacter ?"
            ],
            "displayLogo": True,
            "theme": {
                "primaryColor": "#2563eb",
                "fontFamily": "Inter, sans-serif"
            }
        }
    }

@router.post("/rating")
async def record_rating(payload: RatingRequest):
    return {"status": "success", "message": "Rating recorded"}

@router.post("/click")
async def record_click(payload: ClickRequest):
    return {"status": "success", "message": "Click recorded"}
