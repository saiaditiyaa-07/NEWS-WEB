import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

ARTICLES_PATH = os.path.join(DATA_DIR, "articles.json")
CATEGORIES_PATH = os.path.join(DATA_DIR, "categories.json")
ANALYTICS_PATH = os.path.join(DATA_DIR, "analytics.json")

def ensure_files_exist():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(ARTICLES_PATH):
        with open(ARTICLES_PATH, "w") as f:
            json.dump([], f)
    if not os.path.exists(CATEGORIES_PATH):
        with open(CATEGORIES_PATH, "w") as f:
            json.dump([], f)
    if not os.path.exists(ANALYTICS_PATH):
        with open(ANALYTICS_PATH, "w") as f:
            json.dump({
                "total_views": 0,
                "total_articles": 0,
                "active_users": 150,
                "newsletter_subscribers": 1200,
                "category_views": {},
                "views_over_time": []
            }, f)

def read_json(path: str) -> Any:
    ensure_files_exist()
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return [] if "articles" in path or "categories" in path else {}

def write_json(path: str, data: Any):
    ensure_files_exist()
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_articles() -> List[Dict[str, Any]]:
    return read_json(ARTICLES_PATH)

def save_articles(articles: List[Dict[str, Any]]):
    write_json(ARTICLES_PATH, articles)
    sync_categories()

def get_article_by_id(article_id: str) -> Optional[Dict[str, Any]]:
    articles = get_articles()
    for art in articles:
        if art["id"] == article_id:
            return art
    return None

def increment_article_views(article_id: str):
    articles = get_articles()
    category_name = None
    for art in articles:
        if art["id"] == article_id:
            art["views"] = art.get("views", 0) + 1
            category_name = art.get("category")
            break
    save_articles(articles)

    # Also update analytics
    analytics = read_json(ANALYTICS_PATH)
    analytics["total_views"] = analytics.get("total_views", 0) + 1
    if category_name:
        cat_views = analytics.get("category_views", {})
        cat_views[category_name] = cat_views.get(category_name, 0) + 1
        analytics["category_views"] = cat_views
    write_json(ANALYTICS_PATH, analytics)

def add_comment(article_id: str, author: str, content: str) -> Optional[Dict[str, Any]]:
    articles = get_articles()
    new_comment = {
        "id": str(uuid.uuid4()),
        "author": author,
        "avatar": f"https://images.unsplash.com/photo-{1500000000000 + int(uuid.uuid4().int % 1000000)}?auto=format&fit=crop&w=100&q=80",
        "content": content,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "likes": 0
    }
    for art in articles:
        if art["id"] == article_id:
            comments = art.get("comments", [])
            comments.insert(0, new_comment) # newest comments first
            art["comments"] = comments
            save_articles(articles)
            return new_comment
    return None

def get_categories() -> List[Dict[str, Any]]:
    return read_json(CATEGORIES_PATH)

def sync_categories():
    articles = get_articles()
    categories = get_categories()
    
    # count articles per category
    counts = {}
    for art in articles:
        cat = art.get("category", "").lower()
        if cat:
            counts[cat] = counts.get(cat, 0) + 1

    updated = False
    for cat in categories:
        cat_id = cat["id"].lower()
        new_count = counts.get(cat_id, 0)
        if cat["article_count"] != new_count:
            cat["article_count"] = new_count
            updated = True
            
    if updated:
        write_json(CATEGORIES_PATH, categories)

def get_analytics() -> Dict[str, Any]:
    articles = get_articles()
    analytics = read_json(ANALYTICS_PATH)
    # Sync counter values
    analytics["total_articles"] = len(articles)
    return analytics
