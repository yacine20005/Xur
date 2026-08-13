# Xur — AI Chatbot Widget MVP

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/AI_Model-Google_Gemini-4285F4.svg?style=flat&logo=google-gemini)](https://aistudio.google.com/)
[![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla_JS-F7DF1E.svg?style=flat&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![esbuild](https://img.shields.io/badge/Bundler-esbuild-FFCF00.svg?style=flat&logo=esbuild)](https://esbuild.github.io/)

**Xur** is a lightweight, highly customizable conversational AI assistant designed to integrate instantly into any website via a single `<script>` tag.
Powered by **Google Gemini** and a **FastAPI** backend architecture, Xur responds automatically and in **real-time (Server-Sent Events streaming)** to visitor questions based on your company's knowledge base.

---

## Demo Preview

The assistant appears as a modern floating widget with glassmorphism blur effects, updated typography, quick suggestion options, and full Markdown formatting support.

---

## Key Features

- **Ultra-Simple Integration**: A single `<script src="..." api-key="..."></script>` tag is all you need to embed it into Shopify, WooCommerce, or any custom HTML site.
- **Real-time Streaming (SSE)**: Continuous flow of responses generated token-by-token by AI with zero latency.
- **RAG / Business Context**: Structured answers strictly grounded in company documentation (shipping, returns, FAQ, pricing).
- **Modern & Responsive Design**: Sleek, responsive UI compatible with mobile and desktop devices, customizable via CSS.
- **Modular Frontend Architecture**: JavaScript codebase organized into ES6 modules under `frontend/src/` and bundled into a single file via `esbuild`.
- **Clean Codebase**: Completely streamlined and decoupled architecture.

---

## Project Structure

```
Xur/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application, routing & CORS
│   │   ├── config.py            # Environment variable configuration
│   │   ├── knowledge_base.md    # Knowledge base / Business context for the LLM
│   │   ├── routers/
│   │   │   ├── assistant.py     # Widget configuration (/api/assistant/init)
│   │   │   └── sse.py           # SSE streaming endpoint (/sse/get_response)
│   │   └── services/
│   │       ├── gemini.py        # Google Gemini API streaming service
│   │       └── session.py       # In-memory chat session manager
│   ├── requirements.txt         # Python dependencies (FastAPI, uvicorn, httpx, etc.)
│   ├── .env.example             # Environment variables template
│   └── run.py                   # Server entrypoint script
│
├── frontend/
│   ├── src/                     # ES6 modular source code
│   │   ├── index.js             # Main entry point (IIFE)
│   │   ├── chat.js              # Chat UI DOM manager & state handling
│   │   ├── sse.js               # SSE streaming EventSource client
│   │   ├── styles.js            # Scoped & dynamic CSS injection
│   │   ├── markdown.js          # Markdown-to-HTML parser
│   │   ├── tracker.js           # Visitor event tracking
│   │   └── utils.js             # Helpers & inline SVG icons
│   ├── dist/
│   │   ├── widget.js            # Compiled JavaScript bundle (esbuild)
│   │   └── widget.min.js        # Minified production bundle
│   ├── demo.html                # E-commerce store demo page
│   └── build.js                 # esbuild compilation script
│
├── widget.js                    # Root copy of the bundled widget JS
└── README.md                    # Official project documentation
```

---

## Quick Start (Local Development)

### 1. Backend Setup (Python)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Linux/macOS
# On Windows PowerShell: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Configure Gemini API Key

Create or edit the `backend/.env` file:

```env
GEMINI_API_KEY=your_google_ai_studio_api_key
PORT=8005
HOST=0.0.0.0
```

> *Note: If no API key is specified, the backend automatically falls back to **Offline Demo Mode**, allowing you to test the widget without any configuration.*

### 3. Start the Backend

```bash
python3 run.py
```
The server will start on **`http://localhost:8005`**.

### 4. Build the Frontend (esbuild)

In a separate terminal window:

```bash
cd frontend
npm install
npm run build
```

### 5. Test on Demo Page

Simply open your browser to:
**`http://localhost:8005/demo`**

---

## 💻 Website Integration (HTML Code)

To integrate the Xur chatbot into any website (Shopify, WordPress, Webflow, React, static HTML):

```html
<!-- Xur AI Chatbot Widget -->
<script src="http://localhost:8005/static/widget.js" api-key="demo-key"></script>
```

---

## Roadmap

- [x] **MVP Core**: FastAPI Backend + SSE Streaming + Gemini Integration + esbuild Bundler
- [ ] **Multi-tenancy DB**: Storage for merchant contexts & chat history in PostgreSQL
- [ ] **Admin Dashboard**: Merchant management UI, theme customization, and analytics (ratings, click-through rates)
- [ ] **E-commerce Connectors**: Catalog sync with Shopify & WooCommerce
- [ ] **Subscription System**: API key management & Stripe SaaS billing

---

## Author

Designed and developed by **[Yacine Hamadouche](https://github.com/yacine20005)**.
