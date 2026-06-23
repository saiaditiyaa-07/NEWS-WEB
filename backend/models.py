from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class Comment(BaseModel):
    id: str
    author: str
    avatar: str
    content: str
    created_at: str
    likes: int = 0

class SentimentAnalysis(BaseModel):
    positive: int
    neutral: int
    negative: int
    label: str

class ArticleBase(BaseModel):
    title: str
    content: str
    summary: str
    image: str
    category: str
    author: str
    author_role: str = "Staff Writer"
    author_avatar: str = "/placeholder-avatar.jpg"
    tags: List[str] = []
    trending: bool = False
    editors_pick: bool = False
    
    # Tamil translation equivalents
    title_ta: Optional[str] = None
    content_ta: Optional[str] = None
    summary_ta: Optional[str] = None
    category_ta: Optional[str] = None
    ai_summary_ta: Optional[str] = None
    key_takeaways_ta: Optional[List[str]] = None
    district: Optional[str] = None # e.g. Chennai, Madurai, Coimbatore, etc.

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: str
    published_at: str
    views: int = 0
    likes: int = 0
    reading_time: int
    ai_summary: str
    key_takeaways: List[str]
    sentiment: SentimentAnalysis
    comments: List[Comment] = []

class Category(BaseModel):
    id: str
    name: str
    name_ta: Optional[str] = None
    description: str
    description_ta: Optional[str] = None
    article_count: int

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    trending: Optional[bool] = None
    editors_pick: Optional[bool] = None
    title_ta: Optional[str] = None
    content_ta: Optional[str] = None
    summary_ta: Optional[str] = None
    category_ta: Optional[str] = None
    district: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

class ChatResponse(BaseModel):
    answer: str

class AnalyticsWidget(BaseModel):
    total_views: int
    total_articles: int
    active_users: int
    newsletter_subscribers: int
    category_views: Dict[str, int]
    views_over_time: List[Dict[str, int]]

# Widget Schemas for Kumari News
class WeatherWidget(BaseModel):
    city: str
    city_ta: str
    temp: int
    condition: str
    condition_ta: str
    humidity: int
    wind: str
    wind_ta: str
    alert: Optional[str] = None
    alert_ta: Optional[str] = None

class RateWidget(BaseModel):
    gold_22k: float
    gold_24k: float
    silver: float
    petrol: float
    diesel: float
    unit: str
    unit_ta: str

class CricketMatch(BaseModel):
    teams: str
    teams_ta: str
    status: str
    status_ta: str
    score: str
    score_ta: str

class SportsWidget(BaseModel):
    live_match: CricketMatch
    headlines: List[str]
    headlines_ta: List[str]

class EducationWidget(BaseModel):
    updates: List[str]
    updates_ta: List[str]

class JobAlert(BaseModel):
    id: str
    title: str
    title_ta: str
    organization: str
    organization_ta: str
    category: str # Government / Private
    category_ta: str
    deadline: str
    deadline_ta: str
    link: str

class EpaperItem(BaseModel):
    id: str
    date: str
    pdf_url: str
    thumbnail: str
