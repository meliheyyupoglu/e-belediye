import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { getDashboardStats } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "İstatistikler alınamadı" }, { status: 500 });
  }
}
