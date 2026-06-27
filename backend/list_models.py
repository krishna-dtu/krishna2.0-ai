#!/usr/bin/env python3
"""List available Gemini models"""
import os
import httpx
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
api_key = os.getenv('GEMINI_API_KEY')

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

print("Fetching available models...")
try:
    response = httpx.get(url, timeout=30.0)
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Available models:")
        for model in data.get('models', []):
            name = model.get('name', '')
            display_name = model.get('displayName', '')
            supported = model.get('supportedGenerationMethods', [])
            if 'generateContent' in supported:
                print(f"  - {name} ({display_name})")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Exception: {e}")
