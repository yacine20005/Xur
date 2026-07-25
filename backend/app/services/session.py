import uuid
from typing import Dict, List, Any

class SessionManager:
    """In-memory session manager for storing chat history per session_id."""

    def __init__(self):
        self._sessions: Dict[str, List[Dict[str, str]]] = {}

    def get_or_create_session(self, session_id: str = None) -> str:
        if not session_id or session_id not in self._sessions:
            new_id = session_id or f"session_{uuid.uuid4().hex[:12]}"
            self._sessions[new_id] = []
            return new_id
        return session_id

    def add_message(self, session_id: str, role: str, content: str):
        if session_id not in self._sessions:
            self._sessions[session_id] = []
        self._sessions[session_id].append({"role": role, "content": content})

    def get_history(self, session_id: str) -> List[Dict[str, str]]:
        return self._sessions.get(session_id, [])

    def clear_session(self, session_id: str):
        if session_id in self._sessions:
            self._sessions[session_id] = []

session_manager = SessionManager()
