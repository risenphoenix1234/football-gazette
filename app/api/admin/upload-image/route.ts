import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.FPL_BACKEND_URL;
const KEY = process.env.FPL_BACKEND_ADMIN_KEY;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const res = await fetch(`${BACKEND}/api/articles/upload-image`, {
    method: "POST",
    headers: { "x-admin-key": KEY! },
    body: formData,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}