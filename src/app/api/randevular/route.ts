import { NextResponse } from "next/server";
import { randevuEkle, tumRandevulariGetir } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const randevular = await tumRandevulariGetir();
    return NextResponse.json(randevular);
  } catch (e) {
    console.error(e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tc_no, ad_soyad, telefon, email, departman, konu, randevu_tarihi, randevu_saati } = body;

    const telClean = String(telefon || "").replace(/[\s\-()]/g, "");
    const valid =
      /^\d{11}$/.test(tc_no) &&
      ad_soyad?.trim() &&
      /^\d{10,11}$/.test(telClean) &&
      departman?.trim() &&
      konu?.trim() &&
      randevu_tarihi &&
      randevu_saati;

    if (!valid) {
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları eksiksiz doldurun." }, { status: 400 });
    }

    const randevuDate = new Date(`${randevu_tarihi}T${randevu_saati}`);
    if (isNaN(randevuDate.getTime()) || randevuDate < new Date()) {
      return NextResponse.json({ error: "Geçerli bir gelecek tarih ve saat seçin." }, { status: 400 });
    }

    const id = await randevuEkle({
      tc_no,
      ad_soyad: ad_soyad.trim(),
      telefon: telefon.trim(),
      email: email?.trim(),
      departman: departman.trim(),
      konu: konu.trim(),
      randevu_tarihi,
      randevu_saati,
    });

    return NextResponse.json({ id, message: "Randevunuz alındı." });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Randevu oluşturulamadı";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
