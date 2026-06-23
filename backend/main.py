from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict
from datetime import datetime
import uuid
import random

from models import (
    Article, ArticleCreate, ArticleUpdate, Comment, 
    Category, ChatRequest, ChatResponse, AnalyticsWidget, SentimentAnalysis,
    WeatherWidget, RateWidget, SportsWidget, EducationWidget, JobAlert, EpaperItem, CricketMatch
)
import database as db

app = FastAPI(
    title="Kumari News API Portal",
    description="Enterprise-grade bilingual REST API for Kumari News Digital Network",
    version="1.5.0"
)

# Allow CORS for Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/articles", response_model=List[Article])
def list_articles(
    category: Optional[str] = None,
    search: Optional[str] = None,
    trending: Optional[bool] = None,
    editors_pick: Optional[bool] = None,
    tag: Optional[str] = None,
    district: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    articles = db.get_articles()
    filtered = []
    
    for art in articles:
        # Category Filter (match id, name or name_ta)
        if category:
            cat_lower = category.lower()
            art_cat = art.get("category", "").lower()
            art_cat_ta = art.get("category_ta", "").lower()
            if art_cat != cat_lower and art_cat_ta != cat_lower:
                continue
        # Search Filter (Title, summary, content, author, title_ta, summary_ta, content_ta)
        if search:
            q = search.lower()
            in_title = q in art.get("title", "").lower() or (art.get("title_ta") and q in art.get("title_ta", "").lower())
            in_summary = q in art.get("summary", "").lower() or (art.get("summary_ta") and q in art.get("summary_ta", "").lower())
            in_content = q in art.get("content", "").lower() or (art.get("content_ta") and q in art.get("content_ta", "").lower())
            in_author = q in art.get("author", "").lower()
            if not (in_title or in_summary or in_content or in_author):
                continue
        # Trending Filter
        if trending is not None and art.get("trending") != trending:
            continue
        # Editor's Pick Filter
        if editors_pick is not None and art.get("editors_pick") != editors_pick:
            continue
        # Tag Filter
        if tag and not any(t.lower() == tag.lower() for t in art.get("tags", [])):
            continue
        # District Filter
        if district and art.get("district", "").lower() != district.lower():
            continue
            
        filtered.append(art)
        
    # Sort by published_at descending
    filtered.sort(key=lambda x: x.get("published_at", ""), reverse=True)
    
    return filtered[offset:offset+limit]

@app.get("/api/articles/{article_id}", response_model=Article)
def get_article(article_id: str = Path(..., description="The ID of the article to retrieve")):
    art = db.get_article_by_id(article_id)
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment view count
    db.increment_article_views(article_id)
    return db.get_article_by_id(article_id)

@app.post("/api/articles", response_model=Article)
def create_article(payload: ArticleCreate):
    articles = db.get_articles()
    
    reading_time = max(1, len(payload.content.split()) // 200)
    
    # Defaults
    ai_summary = payload.ai_summary_ta or f"Automated AI synthesis of '{payload.title}'."
    key_takeaways = payload.key_takeaways or ["Important milestone in Tamil Nadu.", "Authored and verified by professional desk."]
    
    sentiment = SentimentAnalysis(
        positive=random.randint(40, 90),
        neutral=random.randint(10, 40),
        negative=random.randint(0, 20),
        label="Positive"
    )
    sentiment.label = "Positive" if sentiment.positive > 60 else "Neutral"

    new_article = Article(
        id=str(uuid.uuid4())[:8],
        title=payload.title,
        content=payload.content,
        summary=payload.summary,
        image=payload.image or "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
        category=payload.category,
        author=payload.author,
        author_role=payload.author_role,
        author_avatar=payload.author_avatar,
        tags=payload.tags,
        trending=payload.trending,
        editors_pick=payload.editors_pick,
        published_at=datetime.utcnow().isoformat() + "Z",
        views=0,
        likes=0,
        reading_time=reading_time,
        ai_summary=payload.ai_summary_ta or f"AI Summary for {payload.title}",
        key_takeaways=key_takeaways,
        sentiment=sentiment,
        comments=[],
        # bilingual & district additions
        title_ta=payload.title_ta,
        content_ta=payload.content_ta,
        summary_ta=payload.summary_ta,
        category_ta=payload.category_ta,
        ai_summary_ta=payload.ai_summary_ta,
        key_takeaways_ta=payload.key_takeaways_ta,
        district=payload.district
    )
    
    # Fallbacks for bilingual
    if not new_article.title_ta: new_article.title_ta = new_article.title
    if not new_article.summary_ta: new_article.summary_ta = new_article.summary
    if not new_article.content_ta: new_article.content_ta = new_article.content
    if not new_article.category_ta: new_article.category_ta = new_article.category
    
    articles.append(new_article.dict())
    db.save_articles(articles)
    return new_article

@app.put("/api/articles/{article_id}", response_model=Article)
def update_article(article_id: str, payload: ArticleUpdate):
    articles = db.get_articles()
    found_idx = -1
    for idx, art in enumerate(articles):
        if art["id"] == article_id:
            found_idx = idx
            break
            
    if found_idx == -1:
        raise HTTPException(status_code=404, detail="Article not found")
        
    current_art = articles[found_idx]
    
    # Update fields
    update_data = payload.dict(exclude_unset=True)
    for key, val in update_data.items():
        current_art[key] = val
        
    if "content" in update_data:
        current_art["reading_time"] = max(1, len(current_art["content"].split()) // 200)
        
    articles[found_idx] = current_art
    db.save_articles(articles)
    return current_art

@app.delete("/api/articles/{article_id}")
def delete_article(article_id: str):
    articles = db.get_articles()
    found_idx = -1
    for idx, art in enumerate(articles):
        if art["id"] == article_id:
            found_idx = idx
            break
            
    if found_idx == -1:
        raise HTTPException(status_code=404, detail="Article not found")
        
    articles.pop(found_idx)
    db.save_articles(articles)
    return {"message": f"Article {article_id} deleted successfully"}

@app.get("/api/categories", response_model=List[Category])
def list_categories():
    db.sync_categories()
    return db.get_categories()

@app.post("/api/articles/{article_id}/comments", response_model=Comment)
def create_comment(article_id: str, payload: Dict[str, str]):
    author = payload.get("author", "Anonymous Reader")
    content = payload.get("content", "")
    if not content:
        raise HTTPException(status_code=400, detail="Comment content cannot be empty")
        
    comment = db.add_comment(article_id, author, content)
    if not comment:
        raise HTTPException(status_code=404, detail="Article not found")
    return comment

@app.get("/api/analytics", response_model=AnalyticsWidget)
def get_analytics():
    return db.get_analytics()

@app.post("/api/articles/{article_id}/chat", response_model=ChatResponse)
def chat_with_article(article_id: str, payload: ChatRequest):
    art = db.get_article_by_id(article_id)
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")
        
    msg = payload.message.lower()
    
    # Detect Tamil request
    is_ta = "ta" in msg or "tamil" in msg or any(c in msg for c in "அஇஉஎஒகசதநபமயரலவ")
    
    if is_ta:
        title = art.get("title_ta") or art.get("title")
        content = art.get("content_ta") or art.get("content")
        summary = art.get("summary_ta") or art.get("summary")
        takeaways = art.get("key_takeaways_ta") or art.get("key_takeaways")
        author = art.get("author", "எங்கள் நிருபர்")
        
        if "ஏன்" in msg or "காரணம்" in msg:
            answer = f"'{title}' கட்டுரையின் படி, இது முக்கிய மாற்றங்கள் மற்றும் வளரும் தேவைகளால் ஏற்படுகிறது: '{content[:120]}...'"
        elif "முக்கிய" in msg or "குறிப்பு" in msg or "தகவல்" in msg:
            points = "\n".join([f"- {t}" for t in takeaways])
            answer = f"இந்தக் கட்டுரையின் முக்கிய தகவல்கள் பின்வருமாறு:\n{points}"
        elif "சுருக்கம்" in msg or "விளக்க" in msg:
            answer = f"கட்டுரையின் சுருக்கம்: {summary}"
        elif "யார்" in msg or "எழுதிய" in msg:
            answer = f"இந்த செய்திக் கட்டுரையை எழுதியவர்: {author}."
        else:
            answer = f"தங்கள் கேள்விக்கு நன்றி. செய்தியின் சுருக்கம்: {summary} மேலும் விவரங்களுக்கு கட்டுரையின் முக்கிய குறிப்புகள்:\n" + "\n".join([f"• {t}" for t in takeaways[:2]])
    else:
        content = art.get("content", "")
        title = art.get("title", "")
        takeaways = art.get("key_takeaways", [])
        summary = art.get("ai_summary", "")
        author = art.get("author", "our staff editor")
        
        if "why" in msg or "reason" in msg:
            answer = f"According to the article '{title}', this shift is driven primarily by technical thresholds and scaling constraints: '{content[:150]}...'"
        elif "takeaway" in msg or "bullet" in msg or "key points" in msg:
            points = "\n".join([f"- {t}" for t in takeaways])
            answer = f"Here are the key takeaways from the article:\n{points}"
        elif "summary" in msg or "summarize" in msg:
            answer = f"Based on the analysis, here is the AI-generated summary: {summary}"
        elif "author" in msg or "who wrote" in msg:
            answer = f"This article was written by {author}, who serves as the {art.get('author_role', 'Staff Writer')}."
        else:
            answer = f"Thank you for asking. The summary of this report is: {summary} Key highlights:\n" + "\n".join([f"• {t}" for t in takeaways[:2]])
        
    return ChatResponse(answer=answer)

# New bilingual REST endpoints for Kumari News widgets
@app.get("/api/widgets/rates", response_model=RateWidget)
def get_rates():
    return RateWidget(
        gold_22k=5850.0,
        gold_24k=6380.0,
        silver=82.5,
        petrol=102.63,
        diesel=94.24,
        unit="per gram / liter",
        unit_ta="ஒரு கிராம் / லிட்டர்"
    )

@app.get("/api/widgets/weather", response_model=List[WeatherWidget])
def get_weather(city: Optional[str] = None):
    weather_data = [
        WeatherWidget(city="Chennai", city_ta="சென்னை", temp=34, condition="Humid & Partly Cloudy", condition_ta="அதிக ஈரப்பதம், பகுதி மேகமூட்டம்", humidity=78, wind="14 km/h", wind_ta="மணிக்கு 14 கி.மீ", alert="Rain warning in suburban zones", alert_ta="புறநகர் பகுதிகளில் மழை எச்சரிக்கை"),
        WeatherWidget(city="Madurai", city_ta="மதுரை", temp=37, condition="Sunny & Hot", condition_ta="வெப்பமான வெயில் காலம்", humidity=45, wind="10 km/h", wind_ta="மணிக்கு 10 கி.மீ"),
        WeatherWidget(city="Coimbatore", city_ta="கோயம்புத்தூர்", temp=29, condition="Pleasant & Breezy", condition_ta="இதமான காற்றுடன் கூடிய வானிலை", humidity=65, wind="18 km/h", wind_ta="மணிக்கு 18 கி.மீ"),
        WeatherWidget(city="Trichy", city_ta="திருச்சி", temp=36, condition="Sunny", condition_ta="வெயில்", humidity=50, wind="12 km/h", wind_ta="மணிக்கு 12 கி.மீ"),
        WeatherWidget(city="Salem", city_ta="சேலம்", temp=35, condition="Partly Cloudy", condition_ta="பகுதி மேகமூட்டம்", humidity=52, wind="11 km/h", wind_ta="மணிக்கு 11 கி.மீ"),
        WeatherWidget(city="Erode", city_ta="ஈரோடு", temp=36, condition="Sunny", condition_ta="வெயில்", humidity=48, wind="9 km/h", wind_ta="மணிக்கு 9 கி.மீ"),
        WeatherWidget(city="Tirunelveli", city_ta="திருநெல்வேலி", temp=34, condition="Windy", condition_ta="பலத்த காற்று", humidity=55, wind="22 km/h", wind_ta="மணிக்கு 22 கி.மீ"),
        WeatherWidget(city="Ramanathapuram", city_ta="இராமநாதபுரம்", temp=33, condition="Coastal Breeze", condition_ta="கடற்கரை காற்று", humidity=72, wind="16 km/h", wind_ta="மணிக்கு 16 கி.மீ"),
        WeatherWidget(city="Kanyakumari", city_ta="கன்னியாகுமரி", temp=30, condition="Scattered Showers", condition_ta="ஆங்காங்கே மழை", humidity=80, wind="20 km/h", wind_ta="மணிக்கு 20 கி.மீ", alert="Rough sea warning for fishermen", alert_ta="மீனவர்களுக்கான கடல் அலை சீற்ற எச்சரிக்கை"),
        WeatherWidget(city="Thoothukudi", city_ta="தூத்துக்குடி", temp=33, condition="Sunny", condition_ta="வெயில்", humidity=70, wind="15 km/h", wind_ta="மணிக்கு 15 கி.மீ"),
        WeatherWidget(city="Vellore", city_ta="வேலூர்", temp=38, condition="Extreme Heat", condition_ta="கடுமையான வெயில்", humidity=40, wind="8 km/h", wind_ta="மணிக்கு 8 கி.மீ")
    ]
    if city:
        filtered = [w for w in weather_data if w.city.lower() == city.lower() or w.city_ta == city]
        return filtered if filtered else [weather_data[0]]
    return weather_data

@app.get("/api/widgets/sports", response_model=SportsWidget)
def get_sports():
    return SportsWidget(
        live_match=CricketMatch(
            teams="IND vs AUS (T20 World Cup)",
            teams_ta="இந்தியா எதிர் ஆஸ்திரேலியா (டி20 உலகக் கோப்பை)",
            status="In Progress - Innings Break",
            status_ta="விளையாட்டு நடந்து கொண்டிருக்கிறது - இடைவேளை",
            score="IND: 196/5 (20.0 Over) | AUS: 0/0 (0.0 Over)",
            score_ta="IND: 196/5 (20.0 ஓவர்) | AUS: 0/0 (0.0 ஓவர்)"
        ),
        headlines=[
            "India posts a massive total of 196 against Australia in Super 8 stage",
            "Hardik Pandya slams quick-fire 45 off 18 balls to lift the score",
            "CSK resumes training camp in Chennai ahead of qualifiers"
        ],
        headlines_ta=[
            "சூப்பர் 8 சுற்றில் ஆஸ்திரேலியாவுக்கு எதிராக இந்தியா 196 ரன்கள் குவித்தது",
            "ஹர்திக் பாண்டியா 18 பந்துகளில் 45 ரன்கள் விளாசி ஸ்கோரை உயர்த்தினார்",
            "தகுதிச் சுற்றுக்கு முன்னதாக சென்னையில் சி.எஸ்.கே அணி பயிற்சியை தொடங்கியது"
        ]
    )

@app.get("/api/widgets/education", response_model=EducationWidget)
def get_education():
    return EducationWidget(
        updates=[
            "NEET 2026: Counseling procedures for medical seats set to start next week",
            "JEE Advanced: Answer keys published; objections window open till Friday",
            "TNEA Counseling guidelines issued; TNEA engineering rank list on July 18th",
            "Anna University announces undergraduate semester exams dates from November 10"
        ],
        updates_ta=[
            "நீட் 2026: மருத்துவ இடங்களுக்கான கலந்தாய்வு அடுத்த வாரம் தொடங்குகிறது",
            "ஜே.இ.இ அட்வான்ஸ்டு: விடைக்குறிப்புகள் வெளியீடு; வெள்ளிக்கிழமை வரை ஆட்சேபனை தெரிவிக்கலாம்",
            "டி.என்.இ.ஏ கலந்தாய்வு வழிகாட்டுதல்கள் வெளியீடு; ஜூலை 18-ல் பொறியியல் தரவரிசைப் பட்டியல்",
            "அண்ணா பல்கலைக்கழகம்: இளங்கலை செமஸ்டர் தேர்வுகள் நவம்பர் 10 முதல் தொடங்கும் என அறிவிப்பு"
        ]
    )

@app.get("/api/widgets/jobs", response_model=List[JobAlert])
def get_jobs():
    return [
        JobAlert(
            id="j1",
            title="Junior Assistant, VAO Recruitment (Group 4)",
            title_ta="இளநிலை உதவியாளர், கிராம நிர்வாக அலுவலர் (VAO)",
            organization="Tamil Nadu Public Service Commission (TNPSC)",
            organization_ta="தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையம்",
            category="Government",
            category_ta="அரசுப் பணி",
            deadline="July 20, 2026",
            deadline_ta="ஜூலை 20, 2026",
            link="/jobs"
        ),
        JobAlert(
            id="j2",
            title="Software Engineer, Cloud Infrastructure Desk",
            title_ta="மென்பொருள் பொறியாளர் (கிளவுட் உள்கட்டமைப்பு)",
            organization="Kumari Tech Solutions Pvt Ltd",
            organization_ta="குமரி டெக் சொல்யூஷன்ஸ்",
            category="Private",
            category_ta="தனியார் துறை",
            deadline="July 15, 2026",
            deadline_ta="ஜூலை 15, 2026",
            link="/jobs"
        ),
        JobAlert(
            id="j3",
            title="Probationary Officers recruitment exam notices",
            title_ta="வங்கி அதிகாரி (PO) தேர்வுகள் அறிவிப்பு",
            organization="State Bank of India (SBI)",
            organization_ta="பாரத ஸ்டேட் வங்கி",
            category="Government",
            category_ta="அரசுப் பணி",
            deadline="August 02, 2026",
            deadline_ta="ஆகஸ்ட் 02, 2026",
            link="/jobs"
        )
    ]

@app.get("/api/widgets/epaper", response_model=List[EpaperItem])
def get_epaper():
    return [
        EpaperItem(id="e1", date="2026-06-23", pdf_url="/mock-epaper.pdf", thumbnail="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=200&q=80"),
        EpaperItem(id="e2", date="2026-06-22", pdf_url="/mock-epaper.pdf", thumbnail="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=200&q=80"),
        EpaperItem(id="e3", date="2026-06-21", pdf_url="/mock-epaper.pdf", thumbnail="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=200&q=80")
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
