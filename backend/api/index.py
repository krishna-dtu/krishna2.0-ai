"""
Vercel Serverless Function Entry Point
This wraps the FastAPI app for Vercel deployment
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.app import app

# Vercel serverless handler
handler = app
