import React from "react";
import BreakingNews from "@/components/BreakingNews";
import ArticleCard from "@/components/ArticleCard";
import HomeFeed from "@/components/HomeFeed";
import Link from "next/link";
import { 
  Sparkles, Star, TrendingUp, Mail, 
  Smartphone, Monitor, ExternalLink, Globe, ChevronRight 
} from "lucide-react";

interface ArticleData {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  author: string;
  published_at: string;
  views: number;
  reading_time: number;
  editors_pick: boolean;
  trending: boolean;
}

export const revalidate = 5; 

async function getArticles(): Promise<ArticleData[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/articles", {
      next: { revalidate: 5 }
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    return [
      {
        id: "1",
        title: "The Silicon Horizon: Quantum Photonic Accelerators Enter Commercial Fab Production",
        summary: "Electronic computing is approaching physical silicon limits. A quiet revolution in optoelectronics is launching light-based quantum accelerators into industrial scale.",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
        category: "Technology",
        author: "Dr. Aris Thorne",
        published_at: "2026-06-23T10:30:00Z",
        views: 41250,
        reading_time: 4,
        editors_pick: true,
        trending: true
      },
      {
        id: "2",
        title: "Deep Ocean Biotech: Unlocking the Secrets of Europa-like Extremophiles in the Mariana Trench",
        summary: "Deep-sea research vessels have isolated novel heat-resistant bacterial enzymes that offer new paths for genetic longevity therapies.",
        image: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=80",
        category: "Science",
        author: "Dr. Elena Vance",
        published_at: "2026-06-22T08:15:00Z",
        views: 28400,
        reading_time: 3,
        editors_pick: false,
        trending: true
      },
      {
        id: "3",
        title: "The Decarbonization Boom: Green Hydrogen Attracts $120B in Venture Capital",
        summary: "Large investment combines with massive electrolyzer projects as policy mandates spark a run on zero-emission fuel production.",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
        category: "Business",
        author: "Julian Sterling",
        published_at: "2026-06-21T14:20:00Z",
        views: 35100,
        reading_time: 4,
        editors_pick: true,
        trending: false
      },
      {
        id: "4",
        title: "The Algorithmic Sovereignty Act: Global Powers Agree on First AI Border Controls",
        summary: "In a historic Geneva treaty, nations will enforce boundary limits on neural networks, restricting data scraping and training rights.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        category: "Politics",
        author: "Amara Diallo",
        published_at: "2026-06-20T11:00:00Z",
        views: 18200,
        reading_time: 3,
        editors_pick: false,
        trending: false
      },
      {
        id: "5",
        title: "The Death of the Screen: How Neural-Haptic VR is Reshaping the Creative Industry",
        summary: "Direct brain-computer interfaces bypass optical displays, generating simulated virtual environments directly within the user's visual cortex.",
        image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80",
        category: "Entertainment",
        author: "Leo Sterling",
        published_at: "2026-06-19T16:45:00Z",
        views: 29800,
        reading_time: 4,
        editors_pick: false,
        trending: true
      },
      {
        id: "6",
        title: "Next-Gen Fusion: High-Temperature Superconducting Magnets Clear Final Stability Review",
        summary: "A breakthrough magnetic assembly has maintained a plasma core at 150 million degrees for over 10 hours, bringing commercial fusion closer.",
        image: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
        category: "Technology",
        author: "Dr. Clara Wu",
        published_at: "2026-06-18T09:00:00Z",
        views: 52100,
        reading_time: 4,
        editors_pick: true,
        trending: true
      }
    ];
  }
}

export default async function HomePage() {
  const articles = await getArticles();

  // Distribute items for Daily Thanthi layout columns
  // Left Column list (smaller briefs)
  const leftBriefs = articles.slice(1, 5);
  // Center Column items
  const centerFeatured = articles[0] || null;
  const centerSecondary = articles.slice(2, 6);

  // Get category badge color class
  const getBadgeClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "politics": return "badge-politics";
      case "business": return "badge-business";
      case "science": return "badge-science";
      case "technology": return "badge-technology";
      case "entertainment": return "badge-entertainment";
      default: return "badge-politics";
    }
  };
  
  return (
    <main className="space-y-4 min-h-screen bg-white text-gray-900 transition-colors">
      
      {/* 1. Breaking News Ticker */}
      <BreakingNews />

      {/* 2. Editorial Utility Header Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Social channels & digital shortcuts */}
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
          <div className="flex gap-2.5">
            <a href="#" className="hover:text-[#d60000]">Facebook</a>
            <a href="#" className="hover:text-[#d60000]">Twitter</a>
            <a href="#" className="hover:text-[#d60000]">Instagram</a>
            <a href="#" className="hover:text-[#d60000]">WhatsApp</a>
          </div>
          <span className="h-3.5 w-px bg-gray-200" />
          <Link href="/search?bookmarks=true" className="hover:text-[#d60000]">E-Paper</Link>
          <Link href="/admin" className="hover:text-[#d60000]">Thanthi TV</Link>
        </div>

        {/* Center Logo branding */}
        <div className="text-center">
          <h1 className="serif-title text-4xl font-black tracking-tight text-[#003366] leading-none">
            AETHER NEWS
          </h1>
          <span className="text-[9px] font-black tracking-widest uppercase text-[#d60000] block mt-1.5">
            THE CHRONICLE OF FUTURE RESEARCH
          </span>
        </div>

        {/* Right: Platform Store Badges */}
        <div className="flex items-center gap-2">
          <a href="#" className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-700 font-bold text-[9px] flex items-center gap-1 hover:bg-gray-50 uppercase tracking-wide">
            <Smartphone className="w-3.5 h-3.5 text-[#d60000]" />
            <span>App Store</span>
          </a>
          <a href="#" className="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-700 font-bold text-[9px] flex items-center gap-1 hover:bg-gray-50 uppercase tracking-wide">
            <Monitor className="w-3.5 h-3.5 text-[#003366]" />
            <span>Google Play</span>
          </a>
        </div>
      </div>

      {/* 3. Sub-Navigation Category Bar (Solid Dark Bar) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="w-full bg-[#003366] text-white rounded-md px-6 py-2.5 flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <Link href="/" className="hover:text-red-300 text-red-300">Home</Link>
          <Link href="/search?category=Technology" className="hover:text-red-300">Technology</Link>
          <Link href="/search?category=Science" className="hover:text-red-300">Science</Link>
          <Link href="/search?category=Business" className="hover:text-red-300">Business</Link>
          <Link href="/search?category=Politics" className="hover:text-red-300">Politics</Link>
          <Link href="/search?category=Entertainment" className="hover:text-red-300">Entertainment</Link>
          <span className="h-4 w-px bg-blue-900 ml-auto hidden sm:block" />
          <Link href="/admin" className="hover:text-red-300 text-slate-300 hidden sm:block">CMS Admin</Link>
        </nav>
      </div>

      {/* 4. Horizontal Header Banner / Ad Space */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2">
        <div className="w-full h-[80px] bg-[#f8f9fa] rounded border border-gray-200 flex items-center justify-center p-2 shadow-sm overflow-hidden relative">
          <div className="text-center">
            <span className="text-[8px] font-black text-gray-400 tracking-wider block uppercase mb-0.5">Sponsored Intelligence Update</span>
            <span className="serif-title text-xs md:text-sm font-bold text-gray-900 tracking-tight">
              DISCOVER THE LEGACY OF G.D. NAIDU • EXPLORE PIONEERING CONTRIBUTIONS
            </span>
          </div>
          <a href="#" className="absolute right-4 text-[9px] font-bold text-[#d60000] flex items-center gap-0.5 hover:underline uppercase">
            <span>Details</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 5. Main Layout Grid (3 Columns) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column A: Left Column (3/12 wide) - Local Briefings */}
          <section className="lg:col-span-3 space-y-6 lg:border-r lg:border-gray-200 pr-4">
            <div className="border-b-2 border-[#d60000] pb-1.5 mb-4">
              <h3 className="serif-title text-sm font-extrabold uppercase text-gray-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#d60000]" />
                <span>Regional Briefs</span>
              </h3>
            </div>
            
            {/* Top item (Large Card) */}
            {leftBriefs[0] && (
              <div className="space-y-2 group relative">
                <div className="aspect-video w-full overflow-hidden rounded border border-gray-200 bg-gray-50">
                  <img src={leftBriefs[0].image} alt={leftBriefs[0].title} className="object-cover w-full h-full transform group-hover:scale-[1.01] transition-transform duration-350" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${getBadgeClass(leftBriefs[0].category)}`}>
                  {leftBriefs[0].category}
                </span>
                <h4 className="serif-title text-sm font-black leading-snug group-hover:text-[#d60000] transition-colors">
                  <Link href={`/article/${leftBriefs[0].id}`}>
                    <span className="absolute inset-0" />
                    {leftBriefs[0].title}
                  </Link>
                </h4>
                <p className="text-[9px] text-gray-400 font-bold">{leftBriefs[0].reading_time} min read</p>
              </div>
            )}

            {/* List items with small thumbnails */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {leftBriefs.slice(1).map((art) => (
                <div key={art.id} className="flex gap-3 group relative items-start">
                  <img src={art.image} alt={art.title} className="w-16 h-12 rounded object-cover border border-gray-200 shrink-0" />
                  <div className="space-y-0.5">
                    <h5 className="serif-title text-xs font-black leading-snug group-hover:text-[#d60000] transition-colors line-clamp-2">
                      <Link href={`/article/${art.id}`}>
                        <span className="absolute inset-0" />
                        {art.title}
                      </Link>
                    </h5>
                    <span className="text-[9px] font-semibold text-gray-400">{art.reading_time} min read</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Column B: Middle Column (6/12 wide) - Featured Focus */}
          <section className="lg:col-span-6 space-y-6">
            
            {/* Primary Large Featured Headline */}
            {centerFeatured && (
              <div className="space-y-4 group relative">
                <div className="relative aspect-video w-full overflow-hidden rounded border border-gray-200 bg-gray-50">
                  <img 
                    src={centerFeatured.image} 
                    alt={centerFeatured.title} 
                    className="object-cover w-full h-full transform group-hover:scale-[1.01] transition-transform duration-350"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase bg-[#d60000] text-white">
                    FEATURED HEADLINE
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-gray-450 uppercase tracking-widest">
                    <span className="text-[#003366]">{centerFeatured.category}</span>
                    <span>•</span>
                    <span>By {centerFeatured.author}</span>
                  </div>
                  <h2 className="serif-title text-xl sm:text-2xl font-black text-gray-900 leading-snug group-hover:text-[#d60000] transition-colors">
                    <Link href={`/article/${centerFeatured.id}`}>
                      <span className="absolute inset-0" />
                      {centerFeatured.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                    {centerFeatured.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Middle Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              {centerSecondary.slice(0, 4).map((art) => (
                <div key={art.id} className="p-4 rounded border border-gray-200 hover:border-gray-400 transition-all group relative bg-white shadow-sm">
                  <div className="space-y-2">
                    <img src={art.image} alt={art.title} className="aspect-video w-full object-cover rounded border border-gray-200" />
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-block ${getBadgeClass(art.category)}`}>
                      {art.category}
                    </span>
                    <h4 className="serif-title text-xs font-black leading-snug group-hover:text-[#d60000] transition-colors line-clamp-2">
                      <Link href={`/article/${art.id}`}>
                        <span className="absolute inset-0" />
                        {art.title}
                      </Link>
                    </h4>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* Column C: Right Column (3/12 wide) - Sponsored Panels */}
          <section className="lg:col-span-3 space-y-6 lg:border-l lg:border-gray-200 pl-4">
            
            {/* Sponsored Panel 1 */}
            <div className="p-5 rounded border border-gray-200 bg-[#f8f9fa] flex flex-col justify-between h-[210px] shadow-sm">
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#d60000]">Ad Space Placeholder</span>
                <h4 className="serif-title text-xs font-black text-gray-900 leading-snug">
                  Accelerate your local cloud deployments with Aether Virtualization toolkits.
                </h4>
                <p className="text-[10px] text-gray-500 leading-normal font-semibold">
                  Standardized matrices for multi-tenant computational workloads.
                </p>
              </div>
              <a href="#" className="text-[9px] font-black text-[#003366] flex items-center gap-0.5 hover:underline uppercase tracking-wide">
                <span>Deploy Node</span>
                <ChevronRight className="w-3 h-3 text-[#d60000]" />
              </a>
            </div>

            {/* Sponsored Panel 2 */}
            <div className="p-5 rounded border border-gray-200 bg-[#f8f9fa] flex flex-col justify-between h-[210px] shadow-sm">
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Briefing Services</span>
                <h4 className="serif-title text-xs font-black text-gray-900 leading-snug">
                  Read offline and save reports directly to your local portfolio.
                </h4>
                <p className="text-[10px] text-gray-550 leading-normal font-semibold">
                  Access compiled data without network connections.
                </p>
              </div>
              <Link href="/search?bookmarks=true" className="text-[9px] font-black text-[#003366] flex items-center gap-0.5 hover:underline uppercase tracking-wide">
                <span>View Portfolio</span>
                <ChevronRight className="w-3 h-3 text-[#d60000]" />
              </Link>
            </div>

          </section>

        </div>
      </div>

      {/* 6. Feed Scroll Container (Sits below the layout grid) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 border-t border-gray-200">
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-gray-900 pb-2">
            <h3 className="serif-title text-sm font-extrabold uppercase text-gray-900">
              All Briefings & Updates
            </h3>
          </div>
          <HomeFeed initialArticles={articles} />
        </div>
      </div>

    </main>
  );
}
