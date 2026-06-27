"""
Vercel Serverless Function Entry Point
This wraps the FastAPI app for Vercel deployment
"""
import os
import sys

# Make the backend root importable for the serverless runtime.
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

try:
    from backend.app import app
except ImportError:
    from app import app

# Vercel serverless handler
handler = app
