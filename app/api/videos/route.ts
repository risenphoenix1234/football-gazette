import { NextResponse } from "next/server";
import { getFootballVideos } from "@/lib/youtube";

export async function GET() {
  try {
    const videos = await getFootballVideos();
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json({ videos: [], error: "Failed to load videos" }, { status: 500 });
  }
}