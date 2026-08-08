import { NextResponse } from "next/server";
import { abonelikEkle } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const trimmed = email?.trim();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    const ok = await abonelikEkle(trimmed);
    if (!ok) {
      return NextResponse.json(
        { error: "Abonelik kaydedilemedi. Bu e-posta zaten kayıtlı olabilir." },
        { status: 409 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Abonelik işlemi başarısız." }, { status: 500 });
  }
}
