// lib/news.ts (replaces existing file)
import { cache } from "react";

const NEWSDATA_BASE_URL = "https://newsdata.io/api/1/news";
const BACKEND = process.env.FPL_BACKEND_URL;

export type NewsArticle = {
  id: string;
  category: string;
  title: string;
  author: string;
  source: string; 
  image: string;
  avatar: string | null;
  description: string;
  content: string;
  url: string;
  publishedAt: string;
};

// Extra detail-page-only fields, layered on top of NewsArticle.
export type ArticleDetail = NewsArticle & {
  isOwn: boolean;
  bodyHtml?: string; // rich HTML body, only present for our own articles
  tags?: string[];
};

function encodeId(url: string) {
  return Buffer.from(url).toString("base64url");
}

export function decodeId(id: string) {
  return Buffer.from(id, "base64url").toString("utf-8");
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524015368236-b3c9c775a4c0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600679472233-57ec37c85d0d?auto=format&fit=crop&w=1200&q=80",
];

function getFallbackImage(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
}

function isPaidPlaceholder(content: string | null | undefined): boolean {
  if (!content) return false;
  return /only available in paid plans|paid plan|subscribe to access/i.test(content);
}

export async function fetchFootballNews(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) throw new Error("Missing NEWSDATA_API_KEY environment variable");

  const params = new URLSearchParams({
    apikey: apiKey,
    category: "sports",
    language: "en",
    qInTitle: "Premier League OR EPL OR football OR Arsenal OR Liverpool OR \"Man City\" OR Chelsea OR \"Man United\"",
  });

  const res = await fetch(`${NEWSDATA_BASE_URL}?${params.toString()}`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) throw new Error(`NewsData request failed: ${res.status}`);
  const data = await res.json();

  const FOOTBALL_KEYWORDS = /premier league|epl|football|soccer|arsenal|liverpool|chelsea|man city|man united|tottenham|newcastle|striker|midfielder|goalkeeper|transfer/i;

  return (data.results ?? [])
    .filter((a: any) => FOOTBALL_KEYWORDS.test(a.title + " " + (a.description ?? "")))
    .map((article: any, index: number): NewsArticle => ({
      id: encodeId(article.link),
      category: article.source_name?.toUpperCase() ?? "FOOTBALL",
      title: article.title,
      author: article.creator?.[0] ?? article.source_name ?? "Unknown",
      source: article.source_name ?? "News",
      image: article.image_url || getFallbackImage(article.link ?? article.title ?? String(index)),
      avatar: null,
      description: article.description ?? "",
      content: isPaidPlaceholder(article.content) ? "" : (article.content ?? ""),
      url: article.link,
      publishedAt: article.pubDate,
    }));
}

export async function fetchFootballNewsById(id: string): Promise<NewsArticle | null> {
  const targetUrl = decodeId(id);
  const articles = await fetchFootballNews();
  return articles.find((a) => a.url === targetUrl) ?? null;
}

// --- Our own articles (from the Express/SQLite backend) ---

// Turns a headline into a URL-friendly slug, e.g.
// "Arsenal beat Chelsea 3-1!" -> "arsenal-beat-chelsea-3-1"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

// Builds the public URL for one of our own articles, e.g.
// /news/own-8-arsenal-beat-chelsea-3-1
export function ownArticlePath(id: number, title: string): string {
  const slug = slugify(title);
  return slug ? `/news/own-${id}-${slug}` : `/news/own-${id}`;
}

// Pulls the numeric id out of "own-8" or "own-8-arsenal-beat-chelsea".
// Old links without the title part keep working.
export function parseOwnId(slug: string): string | null {
  const match = slug.match(/^own-(\d+)(?:-|$)/);
  return match ? match[1] : null;
}

type OwnArticle = {
  id: number;
  title: string;
  category: string;
  author: string;
  excerpt: string;
  body: string;
  image: string | null;
  status: "draft" | "published";
  tags: string[];
  date: string;
};

// Used by the homepage news feed — mapped into the same NewsArticle shape
// everything else already expects. `url` points at our own internal
// detail route rather than an external site.
export async function fetchOwnPublishedArticles(): Promise<NewsArticle[]> {
  if (!BACKEND) return [];

  try {
    const res = await fetch(`${BACKEND}/api/articles?status=published`, {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const articles: OwnArticle[] = await res.json();

    return articles.map((a): NewsArticle => ({
      id: `own-${a.id}`,
      category: a.category || "Football Gazette",
      title: a.title,
      author: a.author,
      source: "Football Gazette",
      // `a.image` is already an absolute URL (set at upload time in the
      // admin dashboard) — no need to prefix with BACKEND here anymore.
      image: a.image || getFallbackImage(`own-${a.id}`),
      avatar: null,
      description: a.excerpt,
      content: "",
      url: ownArticlePath(a.id, a.title),
      publishedAt: a.date,
    }));
  } catch (err) {
    console.error("Failed to fetch own articles:", err);
    return [];
  }
}

async function fetchOwnArticleById(numericId: string): Promise<ArticleDetail | null> {
  if (!BACKEND) return null;

  try {
    const res = await fetch(`${BACKEND}/api/articles/${numericId}`, { cache: "no-store" });
    if (!res.ok) return null;

    const a: OwnArticle = await res.json();
    if (a.status !== "published") return null; // don't leak drafts via a guessed URL

    return {
      id: `own-${a.id}`,
      category: a.category || "Football Gazette",
      title: a.title,
      author: a.author,
      source: "Football Gazette",
      image: a.image || getFallbackImage(`own-${a.id}`),
      avatar: null,
      description: a.excerpt,
      content: "",
      url: ownArticlePath(a.id, a.title),
      publishedAt: a.date, // already a formatted display string, not ISO
      isOwn: true,
      bodyHtml: a.body,
      tags: a.tags,
    };
  } catch (err) {
    console.error("Failed to fetch own article by id:", err);
    return null;
  }
}

// Single entry point the detail page calls — figures out whether the slug
// refers to one of our own articles or an external one, and fetches
// accordingly. Wrapped in React's cache() so generateMetadata and the page
// itself share one fetch per request instead of hitting the backend twice.
export const getArticleDetail = cache(
  async (id: string): Promise<ArticleDetail | null> => {
    if (id.startsWith("own-")) {
      const numericId = parseOwnId(id);
      if (!numericId) return null;
      return fetchOwnArticleById(numericId);
    }

    const article = await fetchFootballNewsById(id);
    if (!article) return null;
    return { ...article, isOwn: false };
  }
);

// Returns up to `limit` other articles (mixing our own + external), excluding
// the one currently being viewed. Used for a "More News" section at the
// bottom of the article detail page.
export async function getMoreNews(excludeId: string, limit = 4): Promise<NewsArticle[]> {
  const [own, external] = await Promise.all([
    fetchOwnPublishedArticles(),
    fetchFootballNews().catch(() => []),
  ]);

  const combined = [...own, ...external].filter((a) => a.id !== excludeId);

  // Simple shuffle so the same 4 don't show every time
  const shuffled = [...combined].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit);
}