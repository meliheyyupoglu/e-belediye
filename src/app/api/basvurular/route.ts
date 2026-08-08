import { NextResponse } from "next/server";
import { basvuruEkle, EMPTY_STATS, getStats, tumBasvurulariGetir } from "@/lib/db";
import { sendBasvuruEmail, sendSmsNotification } from "@/lib/email";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departman = searchParams.get("departman") || undefined;
    if (searchParams.get("stats") === "1") {
      const stats = await getStats().catch(() => EMPTY_STATS);
      return NextResponse.json(stats);
    }
    const basvurular = await tumBasvurulariGetir(departman);
    return NextResponse.json(basvurular);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let tc_no = "", ad_soyad = "", telefon = "", email = "";
    let departman = "", konu = "", detay = "";
    let belge_dosya = "", belge_url = "";

    if (contentType.includes("multipart/form-data")) {
      const fd = await request.formData();
      tc_no = String(fd.get("tc_no") || "");
      ad_soyad = String(fd.get("ad_soyad") || "");
      telefon = String(fd.get("telefon") || "");
      email = String(fd.get("email") || "");
      departman = String(fd.get("departman") || "");
      konu = String(fd.get("konu") || "");
      detay = String(fd.get("detay") || "");
      const file = fd.get("belge") as File | null;
      if (file && file.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`basvurular/${Date.now()}_${file.name}`, file, { access: "public" });
        belge_dosya = file.name;
        belge_url = blob.url;
      } else if (file && file.size > 0) {
        belge_dosya = file.name;
      }
    } else {
      const body = await request.json();
      ({ tc_no, ad_soyad, telefon, email, departman, konu, detay, belge_dosya } = body);
    }

    const telClean = String(telefon).replace(/[\s\-()]/g, "");
    const valid =
      /^\d{11}$/.test(tc_no) && ad_soyad?.trim() && konu?.trim() &&
      detay?.trim() && /^\d{10,11}$/.test(telClean);

    if (!valid) {
      return NextResponse.json({ error: "Lütfen zorunlu alanları eksiksiz doldurun." }, { status: 400 });
    }

    const id = await basvuruEkle({
      tc_no, ad_soyad: ad_soyad.trim(), telefon: telefon.trim(),
      email: email?.trim(), departman, konu: konu.trim(), detay: detay.trim(),
      belge_dosya, belge_url,
    });

    if (email) {
      await sendBasvuruEmail({ to: email, adSoyad: ad_soyad, basvuruId: id, departman, konu });
    }
    await sendSmsNotification(
      telefon,
      `Dörtyol Belediyesi: Başvurunuz alındı. Takip No: #${id}`
    );

    return NextResponse.json({ id, message: "Başvuru alındı" });
  } catch (error) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Başvuru kaydedilemedi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
