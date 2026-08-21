// lib/youtube.ts
const YOUTUBE_BASE = "https://www.googleapis.com/youtube/v3";

export type FootballVideo = {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  publishedAt: string;
};

const TOP_LEAGUE_KEYWORDS =
  /epl|laliga|real madrid|barcelona|atletico madrid|serie a|juventus|inter milan|ac milan|napoli|bayern munich|borussia dortmund|ligue 1|psg|paris saint-germain|uefa champions league|uefa|europa league|arsenal|liverpool|manchester city|manchester united|chelsea|tottenham|newcastle/i;

const EXCLUDE_KEYWORDS =
  /assam|papare|indian super league|isl |i-league|regional league|amateur|youth league|schoolboy|fifa \d|efootball|pes \d|video game/i;

export async function getFootballVideos(limit = 10): Promise<FootballVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("Missing YOUTUBE_API_KEY environment variable");

  const params = new URLSearchParams({
    key: apiKey,
    part: "snippet",
    type: "video",
    order: "date",
    q: '"Premier League" OR "Champions League" OR "La Liga" OR "Serie A" highlights',
    maxResults: "25", // pull extra so filtering still leaves enough
    relevanceLanguage: "en",
    videoDuration: "medium",
  });

  const res = await fetch(`${YOUTUBE_BASE}/search?${params.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`YouTube request failed: ${res.status}`);
  const data = await res.json();

  const filtered = (data.items ?? [])
    .filter((item: any) => item.id?.videoId)
    .filter((item: any) => {
      const text = `${item.snippet.title} ${item.snippet.channelTitle}`;
      return TOP_LEAGUE_KEYWORDS.test(text) && !EXCLUDE_KEYWORDS.test(text);
    });

  return filtered.slice(0, limit).map((item: any): FootballVideo => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    channel: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));
}