import React from "react";
import ArticleClient from "./ArticleClient";
import { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

async function getArticleData(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, {
      next: { revalidate: 5 }
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (err) {
    // Fallback static article on failure
    return {
      id: id,
      title: "The Silicon Horizon: Quantum Photonic Accelerators Enter Commercial Fab Production",
      summary: "Electronic computing is approaching physical silicon limits. A quiet revolution in optoelectronics is launching light-based quantum accelerators into industrial scale.",
      content: "For over six decades, silicon semiconductors have scaled according to Moore's Law. However, as transistor gates shrink toward single-atom width, thermal dissipation and quantum tunneling present insurmountable physical barriers. To sustain the demands of massive AI training clusters, the industry is looking beyond electrons.\n\nEnter quantum photonic computing. By routing photons through silicon micro-channels, these chips perform tensor operations at the speed of light with near-zero heat generation. Today, leading fabrication facilities have announced the first commercially viable manufacturing line for high-density photonic accelerators, marking the end of the experimental phase.\n\nThe system integrates indium phosphide lasers directly onto standard CMOS silicon wafers, a feat once considered a manufacturing impossibility. Initial benchmarks from early developer clusters show a 10x throughput enhancement on matrix multiplications compared to current H100 electronic chips, with a staggering 92% reduction in power draw.\n\nGlobal hyperscalers are already pre-ordering production slots for 2027 installations. While standard compilers still need updates to fully support light-based logic, this transition represents the largest architectural paradigm shift in computing since the transition from vacuum tubes to solid-state transistors.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80",
      category: "Technology",
      author: "Dr. Aris Thorne",
      author_role: "Chief Technology Editor",
      author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      published_at: "2026-06-23T10:30:00Z",
      views: 41250,
      likes: 1280,
      trending: true,
      tags: ["Silicon Photonics", "Quantum Computing", "Next-Gen AI"],
      reading_time: 4,
      ai_summary: "This article discusses the commercialization of quantum photonic chips, which use light instead of electricity to perform calculations. By integrating laser sources onto traditional silicon wafers, manufacturers have bypassed the physical heating and speed limits of standard transistors. These light-based chips deliver 10x faster tensor calculations while consuming less than a tenth of the power of modern GPUs, representing a critical breakthrough for enterprise AI infrastructure.",
      key_takeaways: [
        "Traditional electronic silicon is hitting physical and thermal walls at the sub-nanometer level.",
        "Quantum photonic chips use light (photons) instead of electrons to perform high-speed calculations.",
        "The first commercial-grade optoelectronic fab production lines have officially gone live.",
        "Early benchmarks indicate a 10x performance gain and a 92% reduction in electricity demand."
      ],
      sentiment: {
        positive: 78,
        neutral: 18,
        negative: 4,
        label: "Highly Optimistic"
      },
      comments: []
    };
  }
}

async function getRelatedArticles(category: string, currentId: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/articles?category=${category}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.filter((art: any) => art.id !== currentId).slice(0, 3);
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleData(id);
  return {
    title: `${article.title} | Aether News`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = await getArticleData(id);
  const related = await getRelatedArticles(article.category, id);

  return <ArticleClient article={article} relatedArticles={related} />;
}
