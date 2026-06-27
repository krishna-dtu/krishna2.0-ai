from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
import httpx

router = APIRouter()

PROMPT_PATH = os.path.join(os.path.dirname(__file__), "krishna_system_prompt.txt")
try:
    with open(PROMPT_PATH, "r", encoding="utf-8") as f:
        SYSTEM_PROMPT = f.read()
except Exception:
    SYSTEM_PROMPT = "You are Krishna-2.0, a focused UPSC tutor and study partner."

class Message(BaseModel):
    role: str
    content: str
    attachments: Optional[List[Dict[str, Any]]] = None

class ChatRequest(BaseModel):
    messages: list[Message]
    model: str = "gemini-2.5-flash"
    max_tokens: int = 2048

@router.get('/krishna2/system_prompt')
def get_system_prompt():
    return {'name': 'Krishna-2.0', 'system_prompt': SYSTEM_PROMPT}

@router.get('/krishna2/test')
async def test_api():
    """Test endpoint to verify API key and connection"""
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        return {'status': 'error', 'message': 'GEMINI_API_KEY not found'}
    
    return {
        'status': 'ok',
        'api_key_present': True,
        'api_key_prefix': api_key[:10] + '...' if len(api_key) > 10 else 'too short',
        'system_prompt_loaded': len(SYSTEM_PROMPT) > 0,
        'endpoint': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
    }

@router.post('/krishna2/chat')
async def krishna_chat(body: ChatRequest):
    api_key = os.getenv('GEMINI_API_KEY')

    if not api_key:
        raise HTTPException(status_code=500, detail='GEMINI_API_KEY not found in environment')

    try:
        # Build conversation parts for Gemini API
        contents = []
        
        # Add system prompt as first user message
        contents.append({
            "role": "user",
            "parts": [{"text": SYSTEM_PROMPT}]
        })
        contents.append({
            "role": "model",
            "parts": [{"text": "Understood. I'm Krishna-2.0, Nitigya's personal study partner. I'll follow all the guidelines you've provided."}]
        })
        
        # Add conversation history with attachments support
        for msg in body.messages:
            parts = []
            
            # Add text content
            if msg.content:
                parts.append({"text": msg.content})
            
            # Add attachments if present
            if msg.attachments:
                for attachment in msg.attachments:
                    if attachment.get('type') == 'image':
                        parts.append({
                            "inline_data": {
                                "mime_type": attachment.get('mimeType', 'image/jpeg'),
                                "data": attachment.get('data')
                            }
                        })
                    elif attachment.get('type') == 'document':
                        # For PDFs, Gemini 2.5 can process them directly
                        parts.append({
                            "inline_data": {
                                "mime_type": "application/pdf",
                                "data": attachment.get('data')
                            }
                        })
            
            if parts:  # Only add if there are parts
                contents.append({
                    "role": "user" if msg.role == "user" else "model",
                    "parts": parts
                })

        # Gemini API endpoint - using gemini-2.5-flash (supports vision & documents)
        gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

        # Prepare Gemini API payload
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": body.max_tokens,
            },
            "safetySettings": [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
            ]
        }

        headers = {
            'Content-Type': 'application/json',
        }

        params = None
        if api_key.startswith(('AIza', 'AQ.')):
            params = {'key': api_key}
        else:
            headers['Authorization'] = f'Bearer {api_key}'

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(gemini_url, json=payload, headers=headers, params=params)

        if resp.status_code >= 400:
            error_detail = resp.text
            try:
                error_json = resp.json()
                error_detail = error_json.get('error', {}).get('message', error_detail)
            except:
                pass
            # Log the full error for debugging
            print(f"Gemini API Error ({resp.status_code}): {error_detail}")
            raise HTTPException(status_code=resp.status_code, detail=f'Gemini API error: {error_detail}')

        return resp.json()
        
    except httpx.RequestError as e:
        print(f"Request Error: {str(e)}")
        raise HTTPException(status_code=502, detail=f'Gemini API request failed: {str(e)}')
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f'Internal error: {str(e)}')
