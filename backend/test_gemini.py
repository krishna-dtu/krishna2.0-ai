#!/usr/bin/env python3
"""Test script to verify Gemini API connection"""
import os
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    print("❌ GEMINI_API_KEY not found in environment!")
    exit(1)

print(f"✓ API Key found: {api_key[:15]}...")

# Test the API
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

payload = {
    "contents": [{
        "parts": [{
            "text": "Hello! Just say 'Hi' back to test the connection."
        }]
    }]
}

print(f"\nTesting API endpoint...")
print(f"URL: {url[:80]}...")

try:
    response = httpx.post(url, json=payload, timeout=30.0)
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ SUCCESS! API is working!")
        data = response.json()
        if 'candidates' in data:
            text = data['candidates'][0]['content']['parts'][0]['text']
            print(f"Response: {text}")
    else:
        print(f"❌ ERROR: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ Exception: {e}")
