# AETHER NEWS: Premium Digital News & Media Platform

Aether News is a premium, enterprise-grade publishing and reporting network built with **Next.js 15 App Router (TypeScript, Tailwind CSS, Framer Motion)** and a fast **FastAPI (Python)** API gateway. 

This platform features editorial bento grids, interactive carousels, instant search interfaces, deep reading helper utilities (Text-To-Speech & read progress bars), an executive **Mock AI Analysis** panel (summarization, sentiment gauges, simulated streaming chat widgets), and a comprehensive content management console (CMS CRUD table + SVG analytics dashboards).

---

## Folder Structure

```text
NEWS WEBSITE/
├── backend/
│   ├── data/                 # JSON Mock Database store
│   │   ├── articles.json     # Article details & pre-computed AI models
│   │   ├── categories.json   # Category tags count
│   │   └── analytics.json    # Traffic metrics
│   ├── main.py               # FastAPI core entry & routes
│   ├── models.py             # Pydantic schemas
│   └── database.py           # JSON database helper service
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (site)/       # Public routes (Home, Search, Details)
│   │   │   ├── admin/        # Admin analytics panel & CMS table
│   │   │   ├── layout.tsx    # App layout shell
│   │   │   └── globals.css   # Tailored theme system
│   │   └── components/
│   │       ├── ui/           # Custom reusable glass elements
│   │       ├── Navbar.tsx    # Glass navigation & live clock
│   │       ├── Footer.tsx    # Columns & newsletter form
│   │       ├── Hero.tsx      # Editorial carousel
│   │       ├── ArticleCard.tsx # Bento glass article layout
│   │       ├── AiSidebar.tsx # AI summarizer, gauges & chat bot
│   │       └── ThemeProvider.tsx # Dark/Light toggle context
│   ├── tailwind.config.ts
│   └── package.json
└── README.md                 # Deployment & integration guide
```

---

## Local Setup Instructions

### 1. Backend Service (FastAPI)
Verify that Python 3.10+ is installed on your local host.

```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install required dependencies
pip install fastapi uvicorn pydantic

# Start local server
python main.py
```
The backend API server will list endpoints and start listening at `http://127.0.0.1:8000`. You can inspect interactive Swagger documentation at `http://127.0.0.1:8000/docs`.

### 2. Frontend Application (Next.js 15)
Verify that Node.js 18+ and NPM are installed.

```bash
# Navigate to the frontend directory
cd frontend

# Install package dependencies
npm install

# Start Next.js development server
npm run dev
```
The web client will compile and compile pages locally at `http://localhost:3000`.

---

## Production Build & Deployment

### 1. Compile Next.js Static & Server Bundles
To check code safety, compile the static next packages:
```bash
cd frontend
npm run build
```
This builds optimized HTML pages, bundles JS, and optimizes tailwind styles. You can preview this local bundle with `npm run start`.

### 2. Production API Server Execution
To run the FastAPI server under a multi-threaded web worker, use `gunicorn` or run Uvicorn directly:
```bash
cd backend
uvicorn main:app --host 0.0.0.5 --port 8000 --workers 4
```

---

## Transitioning to Supabase (Database Integration)

The database service layer (`backend/database.py`) is structured to allow simple migration to database engines like **Supabase (PostgreSQL)**.

### Step 1: Install Database Clients
Install Supabase's python module in the backend:
```bash
pip install supabase
```

### Step 2: Initialize Client Connection
Update `backend/database.py` to read secrets and establish client sessions:
```python
from supabase import create_client, Client
import os

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
```

### Step 3: Implement Database Table Querying
Refactor backend helpers to read/write columns directly from Supabase tables:

```python
# Before (JSON read):
# def get_article_by_id(article_id: str):
#     articles = read_json(ARTICLES_PATH)
#     return next((a for a in articles if a["id"] == article_id), None)

# After (Supabase integration):
def get_article_by_id(article_id: str):
    response = supabase.table("articles").select("*").eq("id", article_id).single().execute()
    return response.data
```

### Step 4: Write Comments to DB
```python
def add_comment(article_id: str, author: str, content: str):
    new_comment = {
        "article_id": article_id,
        "author": author,
        "content": content,
        "created_at": "now()"
    }
    response = supabase.table("comments").insert(new_comment).execute()
    return response.data[0]
```
This architecture decouples storage engines, allowing instant scaling of databases without modifying frontend React client-components.
