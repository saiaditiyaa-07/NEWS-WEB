# KUMARI NEWS: Premium Bilingual Digital News & Media Platform

Kumari News (**"Voice of Tamil Nadu, Vision of the Future"**) is a premium, enterprise-grade publishing and reporting network built with a clean print-newspaper-inspired editorial layout. The platform is developed using **Next.js 15 App Router (TypeScript, Tailwind CSS, Framer Motion)** and a fast **FastAPI (Python)** API gateway.

This platform features a widescreen editorial grid (1600px width), instant bilingual language switching (English/Tamil), live utility widgets (Weather, Rates, Cricket, Jobs, Education, E-Paper), local district routes with weather alerts, a Speech Synthesis Voice Reader (TTS), AI-augmented summaries, a cognitive chat box, and a robust publisher CMS database editor with traffic analysis dashboards.

---

## Key Features

1. **Editorial Newspaper Grid:** Styled with a widescreen layout (`max-w-[1600px] w-[90%]`) utilizing 85-90% of desktop viewports to remove excessive empty margins.
2. **Instant English/Tamil Bilingual Toggle:** Global context-backed dictionary translation system for navigation, tickers, headings, categories, and article details.
3. **Utility Widgets Board:** Grouped neatly at the bottom of the homepage:
   * **Weather:** Active temperatures, wind, and humidity indices.
   * **Gold & Silver Rates:** 22K and 24K gold pricing, silver, and fuel rates.
   * **Sports Match scorecard:** Live cricket board score updates.
   * **Job Alerts:** Government and private placements board.
   * **Education Updates:** Counselling, ranks, and exam notices.
   * **E-Paper Viewer:** Read and download digital prints.
4. **Local District Bulletins:** Dynamic sub-routes (`/district/[name]`) for Tamil Nadu's 11 major districts with custom weather warning banners.
5. **Interactive Article Details:** 
   * **Text-to-Speech (TTS):** Implements local speech synthesis matching the chosen language (`ta-IN` for Tamil, `en-US` for English) with play, pause, and reset controls.
   * **AI Executive Summaries:** Shows bulleted takeaways and a color-coded sentiment analysis gauge.
   * **Bilingual News Chat:** A question-and-answer widget under each article that replies to queries about the report in Tamil or English.
6. **Bookmarks & Reading Portfolio:** Saves briefings to local storage for offline reading, logs reading history, and allows customizing homepage recommendations based on personal interest tags.
7. **Admin CMS & Analytics Dashboard:**
   * **CMS Manager (`/admin/articles`):** Full CRUD control to add/edit/delete news. Supports bilingual inputs (`title_ta`, `content_ta`, `summary_ta`, etc.) and district tagging dropdown selector.
   * **Analytics Console (`/admin`):** Premium publisher dashboard displaying pageviews, subscribers, category traffic share, and interactive SVG views line chart.
8. **Image Fallback System:** All images verify loading and swap dynamically with a high-quality newspaper illustration fallback if the source URL is broken or missing.

---

## Folder Structure

```text
NEWS-WEB/
├── backend/
│   ├── data/                 # JSON Database store
│   │   ├── articles.json     # Article details & pre-computed AI models
│   │   ├── categories.json   # Category tags count
│   │   └── analytics.json    # Traffic metrics
│   ├── main.py               # FastAPI core entry & routes
│   ├── models.py             # Pydantic schemas (ArticleCreate, ArticleUpdate, etc.)
│   └── database.py           # JSON database helper service
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/        # Admin analytics panel & CMS table
│   │   │   │   └── articles/ # CRUD form with Tamil translations & district dropdown
│   │   │   ├── article/[id]/ # Article detail view client with TTS & AI Summary
│   │   │   ├── bookmarks/    # saved items, reading history, interest checklist
│   │   │   ├── district/[name]/ # local news bulletins dashboard
│   │   │   ├── education/    # educational updates page
│   │   │   ├── epaper/       # newspaper PDF sheet archives
│   │   │   ├── jobs/         # recruitment listings portal
│   │   │   ├── search/       # instant search page
│   │   │   ├── layout.tsx    # App layout shell wrapped with LanguageProvider
│   │   │   ├── page.tsx      # Wide-screen responsive editorial homepage
│   │   │   └── globals.css   # Custom CSS theme system tokens
│   │   ├── components/
│   │   │   ├── widgets/      # Weather, Rates, Sports, Education, Jobs widgets
│   │   │   ├── Navbar.tsx    # Widescreen navigation & bilingual selector
│   │   │   ├── Footer.tsx    # Newsletter form & corporate columns
│   │   │   ├── BreakingNews.tsx # Scrolling breaking news ticker
│   │   │   ├── ArticleCard.tsx # Client-rendered 3-column card with image fallback
│   │   │   ├── HomeFeed.tsx  # Dynamic paginated list grid in 3-columns
│   │   │   └── AiSidebar.tsx # AI summarizer panel, sentiment gauge, chat box
│   │   └── context/
│   │       └── LanguageContext.tsx # Bilingual English/Tamil dictionary translator
│   ├── next.config.ts        # Next.js image domain remote patterns config
│   ├── tailwind.config.ts
│   └── package.json
└── walkthrough.md            # Redesign and setup log
```

---

## Local Setup Instructions

### 1. Backend Service (FastAPI)
Verify that Python 3.10+ is installed.

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
pip install fastapi uvicorn pydantic requests

# Start local server
python main.py
```
The backend API server will start listening at `http://127.0.0.1:8000`. You can inspect interactive Swagger documentation at `http://127.0.0.1:8000/docs`.

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
The web client will compile pages locally at `http://localhost:3000`.

---

## Production Build & Deployment

### 1. Compile Next.js Static & Server Bundles
To build the optimized production build of the frontend:
```bash
cd frontend
npm run build
```
This builds optimized HTML pages, bundles JS, and compiles Tailwind styles. You can preview this local bundle with `npm run start`.

### 2. Production API Server Execution
To run the FastAPI server under a multi-threaded web worker, use Uvicorn directly:
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## Database Migration to Supabase (PostgreSQL)

The database service layer (`backend/database.py`) is decoupled from the route controllers. Migrating to **Supabase** is straightforward:

1. **Install Supabase SDK:**
   ```bash
   pip install supabase
   ```
2. **Initialize Connection:**
   Update `backend/database.py` with your Supabase configurations:
   ```python
   from supabase import create_client, Client
   import os

   SUPABASE_URL = os.environ.get("SUPABASE_URL")
   SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

   supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
   ```
3. **Refactor Helper Queries:**
   Swap out the local JSON read/write calls for table commands:
   ```python
   # Fetch single article
   def get_article_by_id(article_id: str):
       response = supabase.table("articles").select("*").eq("id", article_id).single().execute()
       return response.data
   ```
