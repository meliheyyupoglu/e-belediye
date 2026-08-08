import { NextResponse } from "next/server";
import { duyuruGetir } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const duyuru = await duyuruGetir(parseInt(params.id, 10));
    if (!duyuru) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(duyuru);
  } catch (e) {
    return NextResponse.json({ error: "Hata" }, { status: 500 });
  }
}
