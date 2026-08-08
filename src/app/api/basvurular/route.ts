import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { basvuruEkle, caddeSikayetSayisi, EMPTY_STATS, geoBasvurulariGetir, getStats, tumBasvurulariGetir } from "@/lib/db";
import { sendBasvuruEmail, sendSmsNotification } from "@/lib/email";
import { getHaritaSikayetById, isInDortyolBounds } from "@/lib/harita";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departman = searchParams.get("departman") || undefined;
    if (searchParams.get("geo") === "1") {
      const auth = requireAdmin(request);
      if (auth) return auth;
      const basvurular = await geoBasvurulariGetir();
      return NextResponse.json(basvurular);
    }
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
    let basvuru_tipi = "", adres = "", cadde_sokak = "";
    let lat: number | null = null;
    let lng: number | null = null;

    if (contentType.includes("multipart/form-data")) {
      const fd = await request.formData();
      tc_no = String(fd.get("tc_no") || "");
      ad_soyad = String(fd.get("ad_soyad") || "");
      telefon = String(fd.get("telefon") || "");
      email = String(fd.get("email") || "");
      departman = String(fd.get("departman") || "");
      konu = String(fd.get("konu") || "");
      detay = String(fd.get("detay") || "");
      basvuru_tipi = String(fd.get("basvuru_tipi") || "");
      adres = String(fd.get("adres") || "");
      cadde_sokak = String(fd.get("cadde_sokak") || "");
      const latStr = fd.get("lat");
      const lngStr = fd.get("lng");
      if (latStr && lngStr) {
        lat = parseFloat(String(latStr));
        lng = parseFloat(String(lngStr));
      }
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
      ({
        tc_no, ad_soyad, telefon, email, departman, konu, detay, belge_dosya,
        basvuru_tipi, adres, cadde_sokak,
      } = body);
      if (body.lat != null && body.lng != null) {
        lat = Number(body.lat);
        lng = Number(body.lng);
      }
    }

    const telClean = String(telefon).replace(/[\s\-()]/g, "");
    const valid =
      /^\d{11}$/.test(tc_no) && ad_soyad?.trim() && konu?.trim() &&
      detay?.trim() && /^\d{10,11}$/.test(telClean);

    if (!valid) {
      return NextResponse.json({ error: "Lütfen zorunlu alanları eksiksiz doldurun." }, { status: 400 });
    }

    if (basvuru_tipi) {
      const tip = getHaritaSikayetById(basvuru_tipi);
      if (!tip) {
        return NextResponse.json({ error: "Geçersiz şikayet tipi." }, { status: 400 });
      }
      departman = tip.departman;
      konu = tip.konu;
      if (tip.requireMap && (lat === null || lng === null || isNaN(lat) || isNaN(lng))) {
        return NextResponse.json({ error: "Haritadan konum seçmeniz gerekiyor." }, { status: 400 });
      }
      if (tip.showCaddeSokak && !cadde_sokak.trim() && (lat === null || lng === null)) {
        return NextResponse.json({ error: "Haritadan konum seçin veya cadde/sokak adı yazın." }, { status: 400 });
      }
      if (lat !== null && lng !== null && !isInDortyolBounds(lat, lng)) {
        return NextResponse.json({ error: "Konum Dörtyol ilçe sınırları dışında." }, { status: 400 });
      }
      if (basvuru_tipi === "bozuk_yol" && !belge_dosya && !belge_url) {
        return NextResponse.json({ error: "Bozuk yol bildirimi için fotoğraf yüklemeniz zorunludur." }, { status: 400 });
      }
    }

    const id = await basvuruEkle({
      tc_no, ad_soyad: ad_soyad.trim(), telefon: telefon.trim(),
      email: email?.trim(), departman, konu: konu.trim(), detay: detay.trim(),
      belge_dosya, belge_url,
      basvuru_tipi: basvuru_tipi || undefined,
      lat, lng, adres: adres.trim(), cadde_sokak: cadde_sokak.trim(),
    });

    if (email) {
      await sendBasvuruEmail({ to: email, adSoyad: ad_soyad, basvuruId: id, departman, konu });
    }
    await sendSmsNotification(
      telefon,
      `Dörtyol Belediyesi: Başvurunuz alındı. Takip No: #${id}`
    );

    let oncelikli = false;
    if (basvuru_tipi === "bozuk_yol" && cadde_sokak.trim()) {
      const sayi = await caddeSikayetSayisi(cadde_sokak.trim());
      oncelikli = sayi >= 5;
    }

    return NextResponse.json({
      id,
      message: "Başvuru alındı",
      oncelikli,
      oncelikMesaj: oncelikli ? "Bu cadde/sokak için çok sayıda şikayet var — öncelikli işleme alınacaktır." : undefined,
    });
  } catch (error) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Başvuru kaydedilemedi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
