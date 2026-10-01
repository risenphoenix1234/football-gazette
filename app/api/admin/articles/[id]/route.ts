import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.FPL_BACKEND_URL;
const KEY = process.env.FPL_BACKEND_ADMIN_KEY;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const res = await fetch(`${BACKEND}/api/articles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-key": KEY! },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${BACKEND}/api/articles/${id}`, {
    method: "DELETE",
    headers: { "x-admin-key": KEY! },
  });
  if (res.status === 204) return new NextResponse(null, { status: 204 });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}