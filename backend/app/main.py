import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.routers import assistant, sse

app = FastAPI(
    title="Xur AI Chatbot API",
    description="Backend API pour le widget Xur AI avec Google Gemini et streaming SSE",
    version="1.0.0"
)

# Enable CORS for cross-origin widget embedding
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to prevent browser caching for static files during development
@app.middleware("http")
async def add_no_cache_headers(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/static") or request.url.path.startswith("/demo"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

# Mount routers
app.include_router(assistant.router)
app.include_router(sse.router)

# Resolve static and demo paths with fallback for monorepo and standalone deployments
backend_dir = Path(__file__).resolve().parent.parent
static_dir = backend_dir / "static"

if (static_dir / "widget.js").exists():
    frontend_dist = static_dir
    demo_file = static_dir / "demo.html"
else:
    frontend_dir = backend_dir.parent / "frontend"
    frontend_dist = frontend_dir / "dist"
    demo_file = frontend_dir / "demo.html"

# Ensure target directory exists to avoid FastAPI errors
if not frontend_dist.exists():
    frontend_dist.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=str(frontend_dist)), name="static")

@app.get("/")
async def root():
    return {
        "name": "Xur AI Chatbot API",
        "status": "online",
        "version": "1.0.0",
        "widget_url": "/static/widget.js",
        "demo_url": "/demo"
    }

@app.get("/demo")
async def get_demo_page():
    return FileResponse(
        demo_file,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

@app.get("/health")
async def health_check():
    return {"status": "ok"}
