const NEWS_API_KEY = process.env.NEWSAPI_KEY!;
const BASE_URL = "[newsapi.org](https://newsapi.org/v2/everything)";

export async function fetchFootballNews() {
  const url = new URL(BASE_URL);
  url.searchParams.set("q", "football OR soccer");
  url.searchParams.set("language", "en");
  url.searchParams.set("pageSize", "10");
  const res = await fetch(url.toString(), {
    headers: { "X-Api-Key": NEWS_API_KEY },
  });
  if (!res.ok) throw new Error("NewsAPI error");
  const json = await res.json();
  return json.articles as {
    title: string;
    description: string;
    content: string;
    urlToImage: string | null;
    publishedAt: string;
    source: { name: string };
  }[];
}
