from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from app.services.session import session_manager
from app.services.gemini import stream_gemini_response

router = APIRouter(prefix="/sse", tags=["sse"])

@router.get("/get_response")
async def get_response(
    api_key: str = Query(...),
    user_message: str = Query(...),
    session_id: str = Query(default=""),
    page_url: str = Query(default="")
):
    actual_session_id = session_manager.get_or_create_session(session_id)
    history = session_manager.get_history(actual_session_id)
    
    # Store user message in history
    session_manager.add_message(actual_session_id, "user", user_message)

    async def event_generator():
        full_assistant_response = []
        async for chunk in stream_gemini_response(user_message, history):
            # Parse token if possible to record history
            if "assistant_delta" in chunk:
                try:
                    # chunk format: "data: {"event": "assistant_delta", "content": "..."}\n\n"
                    raw_json = chunk.replace("data: ", "").strip()
                    import json
                    parsed = json.loads(raw_json)
                    content = parsed.get("content", "")
                    full_assistant_response.append(content)
                except Exception:
                    pass
            yield chunk
        
        if full_assistant_response:
            session_manager.add_message(actual_session_id, "assistant", "".join(full_assistant_response))

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
