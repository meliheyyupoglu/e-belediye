import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { initDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Demo başvuru/randevu verilerini yükler (henüz yoksa). */
export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    await initDb();
    return NextResponse.json({ ok: true, message: "Demo veriler kontrol edildi / yüklendi." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed işlemi başarısız" }, { status: 500 });
  }
}
