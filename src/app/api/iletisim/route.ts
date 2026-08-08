import { NextResponse } from "next/server";
import { iletisimEkle } from "@/lib/db";
import { sendIletisimEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { ad_soyad, email, telefon, konu, mesaj } = await request.json();
    if (!ad_soyad?.trim() || !email?.trim() || !konu?.trim() || !mesaj?.trim()) {
      return NextResponse.json({ error: "Tüm zorunlu alanları doldurun." }, { status: 400 });
    }
    const id = await iletisimEkle({
      ad_soyad: ad_soyad.trim(),
      email: email.trim(),
      telefon: telefon?.trim(),
      konu: konu.trim(),
      mesaj: mesaj.trim(),
    });
    await sendIletisimEmail({ adSoyad: ad_soyad, email, konu, mesaj });
    return NextResponse.json({ id, message: "Mesajınız iletildi." });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Mesaj gönderilemedi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
