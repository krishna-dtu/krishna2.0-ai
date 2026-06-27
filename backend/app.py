import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

log = logging.getLogger("backend")

app = FastAPI()

# Configure CORS safely. In development allow localhost origins; in production
# require explicit FRONTEND_ORIGINS env var.
env = os.getenv("ENV", "production").lower()
if env in ("dev", "development"):
    allow_origins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3000/", "http://127.0.0.1:3000/"]
else:
    allow_origins = os.getenv("FRONTEND_ORIGINS", "").split(",") if os.getenv("FRONTEND_ORIGINS") else []

if env in ("dev", "development"):
    # permissive for local development to avoid CORS friction
    allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Krishna API router and surface import errors in logs
try:
    from .krishna_api import router as krishna_router
    app.include_router(krishna_router)
except Exception as e:
    log.exception("Failed to include krishna_api router: %s", e)


@app.get("/")
def home():
    return {"message": "Backend API is running!"}

# Keep this file minimal. Use `run_server.py` to run the app with
# environment-driven, secure defaults.
