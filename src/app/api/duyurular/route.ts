import { NextResponse } from "next/server";
import {
  duyuruEkle,
  duyuruGuncelle,
  duyuruSil,
  tumDuyurulariGetir,
} from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const duyurular = await tumDuyurulariGetir();
    return NextResponse.json(duyurular);
  } catch (e) {
    console.error(e);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, summary, content, date, category, href } = body;
    if (!title?.trim() || !summary?.trim()) {
      return NextResponse.json({ error: "Başlık ve özet zorunlu." }, { status: 400 });
    }
    const id = await duyuruEkle({
      title: title.trim(),
      summary: summary.trim(),
      content: content?.trim() || summary.trim(),
      date: date || new Date().toISOString().slice(0, 10),
      category: category || "duyuru",
      href: href || "",
    });
    return NextResponse.json({ id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Duyuru eklenemedi" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    await duyuruGuncelle(id, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "0", 10);
    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    await duyuruSil(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
}
