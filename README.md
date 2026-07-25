# ✨ Xur — AI Chatbot Widget MVP

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/AI_Model-Google_Gemini-4285F4.svg?style=flat&logo=google-gemini)](https://aistudio.google.com/)
[![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla_JS-F7DF1E.svg?style=flat&logo=javascript)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![esbuild](https://img.shields.io/badge/Bundler-esbuild-FFCF00.svg?style=flat&logo=esbuild)](https://esbuild.github.io/)

**Xur** est un assistant IA conversationnel léger et hautement personnalisable, conçu pour s'intégrer instantanément sur n'importe quel site web via une seule balise `<script>`.
Propulsé par **Google Gemini (gemini-2.5-flash)** et une architecture backend **FastAPI**, Xur répond automatiquement et en **temps réel (Server-Sent Events streaming)** aux questions des visiteurs en s'appuyant sur la base de connaissances de l'entreprise.

---

## 📸 Aperçu de la Démo

L'assistant se présente sous la forme d'un widget flottant moderne avec effets de flou (glassmorphism), typography modernisée, suggestions d'options rapides et support complet du formatage Markdown.

---

## ⚡ Caractéristiques Principales

- 🚀 **Intégration Ultra-Simple** : Une seule balise `<script src="..." api-key="..."></script>` suffit pour l'intégrer à Shopify, WooCommerce ou un site HTML vitrine.
- 💬 **Streaming temps réel (SSE)** : Flux continu de réponses générées mot par mot par l'IA sans attente globale.
- 📚 **RAG / Contexte Métier (`knowledge_base.md`)** : Réponses structurées strictement basées sur la documentation d'entreprise (livraisons, retours, FAQ, offres).
- 🎨 **Design Moderne & Responsive** : UI épurée, responsive, compatible mobile et ordinateur, thématisable en CSS.
- 📦 **Architecture Modulaire Frontend** : Code JavaScript découpé en modules ES6 sous `frontend/src/` et compilé en un bundle unique via `esbuild`.
- 💸 **0€ de Frais d'Infrastructures (MVP)** : Utilise le quota gratuit de Google AI Studio (15 RPM, 1M tokens/jour) et un mode démo offline automatique si aucune clé n'est configurée.
- 🔒 **Clean Code & Zero Copernic** : Nettoyage intégral de toutes les références tierces obsolètes.

---

## 📁 Structure du Projet

```
Xur/
├── backend/
│   ├── app/
│   │   ├── main.py              # Application FastAPI, routes & CORS
│   │   ├── config.py            # Gestion des variables d'environnement
│   │   ├── knowledge_base.md    # Base de connaissances / Contexte métier pour le LLM
│   │   ├── routers/
│   │   │   ├── assistant.py     # Configuration du widget (/api/assistant/init)
│   │   │   └── sse.py           # Endpoint streaming SSE (/sse/get_response)
│   │   └── services/
│   │       ├── gemini.py        # Service de streaming API Google Gemini
│   │       └── session.py       # Gestionnaire de sessions de chat en RAM
│   ├── requirements.txt         # Dépendances Python (FastAPI, uvicorn, httpx, etc.)
│   ├── .env.example             # Modèle de variables d'environnement
│   └── run.py                   # Script de lancement du serveur
│
├── frontend/
│   ├── src/                     # Code source modulaire ES6
│   │   ├── index.js             # Point d'entrée principal (IIFE)
│   │   ├── chat.js              # Gestionnaire de l'interface chat DOM & état
│   │   ├── sse.js               # Client EventSource streaming SSE
│   │   ├── styles.js            # Injection CSS scopée et dynamique
│   │   ├── markdown.js          # Parser Markdown vers HTML
│   │   ├── tracker.js           # Tracking événements visiteurs
│   │   └── utils.js             # Helpers & icônes SVG inline
│   ├── dist/
│   │   ├── widget.js            # Bundle JavaScript compilé (esbuild)
│   │   └── widget.min.js        # Version minifiée pour la production
│   ├── demo.html                # Page boutique e-commerce de démonstration
│   └── build.js                 # Script de compilation esbuild
│
├── widget.js                    # Fichier bundle copié à la racine
├── README.md                    # Documentation officielle du projet
├── INTERVIEW.md                 # Questions & choix d'architecture
└── PROJET.md                    # Spécifications produit & roadmap
```

---

## 🚀 Démarrage Rapide (Développement Local)

### 1. Installation du Backend (Python)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Sur Linux/macOS
pip install -r requirements.txt
```

### 2. Configuration de la Clé API Gemini

Créez ou éditez le fichier `backend/.env` :

```env
GEMINI_API_KEY=votre_cle_api_google_ai_studio
PORT=8005
HOST=0.0.0.0
```

> 💡 *Note : Si vous ne renseignez pas de clé API, le backend bascule automatiquement en mode **Démo Offline** pour vous permettre de tester le widget sans configuration.*

### 3. Lancer le Backend

```bash
python3 run.py
```
Le serveur démarrera sur **`http://localhost:8005`**.

### 4. Compiler le Frontend (esbuild)

Dans un autre terminal :

```bash
cd frontend
npm install
npm run build
```

### 5. Tester sur la Page de Démo

Ouvrez simplement votre navigateur sur :
👉 **`http://localhost:8005/demo`**

---

## 💻 Intégration sur un Site Web (Code HTML)

Pour intégrer le chatbot Xur sur n'importe quel site web (Shopify, WordPress, Webflow, React, HTML statique) :

```html
<!-- Widget Xur AI Chatbot -->
<script src="http://localhost:8005/static/widget.js" api-key="demo-key"></script>
```

---

## 🗺️ Roadmap & Perspectives SaaS

- [x] **MVP Core** : Backend FastAPI + Streaming SSE + Integration Gemini 2.5 + Bundle esbuild
- [ ] **Multi-tenancy DB** : Stockage des contextes marchands & historique en PostgreSQL
- [ ] **Tableau de bord Admin** : Interface de gestion des marchands, personnalisation du thème et analytics (ratings, taux de clics)
- [ ] **Connecteurs E-commerce** : Synchronisation du catalogue produits Shopify/WooCommerce
- [ ] **Système d'Abonnement** : Gestion des clés API et facturation Stripe SaaS

---

## 👤 Auteur

Projet conçu et développé par **[Yacine Hamadouche](https://github.com/yacine20005)**.
