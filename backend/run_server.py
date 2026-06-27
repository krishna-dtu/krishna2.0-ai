#!/usr/bin/env python3
"""Run the FastAPI app with safe, environment-driven settings.

Usage:
  python -m backend.run_server

Environment variables:
  ENV     - 'development' or 'production' (default: production)
  HOST    - host to bind (default: 127.0.0.1)
  PORT    - port to bind (default: 8000)
  DEBUG   - '1' to enable debug-level logging and allow reload in dev

This script intentionally avoids enabling auto-reload in production.
"""
import os
from dotenv import load_dotenv
import uvicorn

# Load environment from backend/.env when present
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


def main():
    env = os.getenv("ENV", "production").lower()
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("DEBUG", "0") in ("1", "true", "True")
    reload = debug and env in ("dev", "development")

    log_level = "debug" if debug else "info"

    uvicorn.run("backend.app:app", host=host, port=port, reload=reload, log_level=log_level)


if __name__ == "__main__":
    main()
