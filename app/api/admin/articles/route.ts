import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.FPL_BACKEND_URL;
const KEY = process.env.FPL_BACKEND_ADMIN_KEY;

export async function GET() {
  const res = await fetch(`${BACKEND}/api/articles`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${BACKEND}/api/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": KEY! },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}