import { NextResponse } from "next/server";
import { fetchFootballNews, fetchOwnPublishedArticles } from "@/lib/news";

export async function GET() {
  try {
    const [own, external] = await Promise.all([
      fetchOwnPublishedArticles(),
      fetchFootballNews().catch((err) => {
        console.error("Failed to fetch external news:", err);
        return [];
      }),
    ]);

    // Our own articles lead the feed, external news fills in after.
    return NextResponse.json({ articles: [...own, ...external] });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return NextResponse.json({ articles: [], error: "Failed to load news" }, { status: 500 });
  }
}