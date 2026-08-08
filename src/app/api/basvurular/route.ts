import { NextResponse } from "next/server";
import { basvuruEkle, getStats, tumBasvurulariGetir } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departman = searchParams.get("departman") || undefined;
    const statsOnly = searchParams.get("stats") === "1";

    if (statsOnly) {
      const stats = await getStats();
      return NextResponse.json(stats);
    }

    const basvurular = await tumBasvurulariGetir(departman);
    return NextResponse.json(basvurular);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Veritabani hatasi" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tc_no, ad_soyad, telefon, departman, konu, detay, belge_dosya } =
      body;

    const telClean = String(telefon || "").replace(/[\s\-()]/g, "");
    const valid =
      /^\d{11}$/.test(tc_no) &&
      ad_soyad?.trim() &&
      konu?.trim() &&
      detay?.trim() &&
      /^\d{10,11}$/.test(telClean);

    if (!valid) {
      return NextResponse.json(
        { error: "Lutfen zorunlu alanlari eksiksiz doldurun." },
        { status: 400 }
      );
    }

    const id = await basvuruEkle({
      tc_no,
      ad_soyad: ad_soyad.trim(),
      telefon: telefon.trim(),
      departman,
      konu: konu.trim(),
      detay: detay.trim(),
      belge_dosya: belge_dosya || "",
    });

    return NextResponse.json({ id, message: "Basvuru alindi" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Basvuru kaydedilemedi" },
      { status: 500 }
    );
  }
}
