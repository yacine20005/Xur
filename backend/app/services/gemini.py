import json
import asyncio
from typing import AsyncGenerator, List, Dict
import httpx
from app.config import GEMINI_API_KEY, GEMINI_MODEL, get_knowledge_base

async def stream_gemini_response(
    user_message: str,
    history: List[Dict[str, str]]
) -> AsyncGenerator[str, None]:
    """
    Streams response from Gemini API using Server-Sent Events format.
    If no GEMINI_API_KEY is provided, uses a smart offline fallback answer.
    """
    context = get_knowledge_base()

    system_instruction = (
        "Tu es Xur, un assistant virtuel intelligent et chaleureux.\n"
        "Voici la base de connaissances du site sur laquelle tu DOIS exclusivement t'appuyer :\n\n"
        f"--- DEBUT BASE DE CONNAISSANCES ---\n{context}\n--- FIN BASE DE CONNAISSANCES ---\n\n"
        "Consignes :\n"
        "1. Réponds de façon naturelle, synthétique et utile.\n"
        "2. Formate ta réponse en Markdown clair (gras, listes à puces).\n"
        "3. Si la question n'a aucun rapport avec la base de connaissances, réponds poliment en invitant l'utilisateur à contacter le support client."
    )

    if not GEMINI_API_KEY or GEMINI_API_KEY.strip() == "" or GEMINI_API_KEY == "votre_cle_api_gemini_ici":
        # Smart offline fallback for portfolio demonstration without API key
        fallback_text = (
            f"**[Mode Démo Offline]** Merci pour votre message : *\"{user_message}\"*.\n\n"
            "Je suis l'assistant **Xur**. Pour activer les réponses en temps réel via l'IA Google Gemini, "
            "ajoutez votre `GEMINI_API_KEY` dans le fichier `backend/.env`.\n\n"
            "Voici un aperçu de ce que je peux faire d'après la base de connaissances :\n"
            "- **Livraison** : Gratuite dès 50€ d'achat (24-48h en France).\n"
            "- **Retours** : 14 jours pour vous rétracter via `support@xur-ai.com`.\n"
            "- **Offres** : Pack Starter (Gratuit) & Pack Pro (49€/mois)."
        )
        words = fallback_text.split(" ")
        for word in words:
            yield f"data: {json.dumps({'event': 'assistant_delta', 'content': word + ' '})}\n\n"
            await asyncio.sleep(0.04)
        yield "data: [DONE]\n\n"
        return

    # Build Gemini request payload
    contents = []
    # Add system instruction as first user/model context or system_instruction
    contents.append({
        "role": "user",
        "parts": [{"text": f"Instruction système: {system_instruction}"}]
    })
    contents.append({
        "role": "model",
        "parts": [{"text": "Compris. Je suis Xur et je répondrai strictement selon vos consignes et la base de connaissances."}]
    })

    # Add conversation history
    for msg in history[-6:]: # Keep recent history context
        role = "user" if msg["role"] == "user" else "model"
        contents.append({
            "role": role,
            "parts": [{"text": msg["content"]}]
        })

    # Add latest user message if not already in history
    if not history or history[-1]["content"] != user_message:
        contents.append({
            "role": "user",
            "parts": [{"text": user_message}]
        })

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 800,
        }
    }

    gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:streamGenerateContent"
    url = f"{gemini_api_url}?alt=sse&key={GEMINI_API_KEY.strip()}"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            async with client.stream("POST", url, json=payload) as response:
                if response.status_code != 200:
                    error_body = await response.aread()
                    error_msg = f"Erreur API Gemini ({response.status_code}): {error_body.decode('utf-8', errors='ignore')}"
                    yield f"data: {json.dumps({'event': 'assistant_delta', 'content': error_msg})}\n\n"
                    yield "data: [DONE]\n\n"
                    return

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        json_str = line[6:].strip()
                        if not json_str:
                            continue
                        try:
                            data = json.loads(json_str)
                            candidates = data.get("candidates", [])
                            if candidates:
                                parts = candidates[0].get("content", {}).get("parts", [])
                                for part in parts:
                                    text_chunk = part.get("text", "")
                                    if text_chunk:
                                        yield f"data: {json.dumps({'event': 'assistant_delta', 'content': text_chunk})}\n\n"
                        except Exception:
                            pass
        yield "data: [DONE]\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'event': 'assistant_delta', 'content': f'Erreur de connexion Gemini: {str(e)}'})}\n\n"
        yield "data: [DONE]\n\n"
