import { NextResponse } from "next/server";
import { fetchFootballNews } from "@/lib/news";

export async function GET() {
  try {
    const articles = await fetchFootballNews();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return NextResponse.json({ articles: [], error: "Failed to load news" }, { status: 500 });
  }
}