const NEWSDATA_BASE_URL = "https://newsdata.io/api/1/news";

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

function encodeId(url: string) {
  return Buffer.from(url).toString("base64url");
}

export function decodeId(id: string) {
  return Buffer.from(id, "base64url").toString("utf-8");
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80", // stadium
  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80", // pitch
  "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80", // ball on grass
  "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80", // action shot
  "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1200&q=80", // players
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80", // crowd/stadium
  "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=1200&q=80", // goal net
  "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80", // dribbling
  "https://images.unsplash.com/photo-1524015368236-b3c9c775a4c0?auto=format&fit=crop&w=1200&q=80", // training
  "https://images.unsplash.com/photo-1600679472233-57ec37c85d0d?auto=format&fit=crop&w=1200&q=80", // floodlights
];

function getFallbackImage(seed: string): string {
  // Deterministic pick based on the article URL so the same article
  // always gets the same fallback image (avoids flicker between requests).
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // keep it a 32-bit int
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