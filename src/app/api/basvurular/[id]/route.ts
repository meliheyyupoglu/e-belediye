import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { basvuruDurumGuncelle, basvuruSorgulaId } from "@/lib/db";
import { sendStatusChangeEmail } from "@/lib/email";
import { DURUMLAR } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Gecersiz ID" }, { status: 400 });
    }
    const basvuru = await basvuruSorgulaId(id);
    if (!basvuru) {
      return NextResponse.json({ error: "Bulunamadi" }, { status: 404 });
    }
    return NextResponse.json(basvuru);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Veritabani hatasi" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const { durum, notlar, atanan, ic_not } = body;

    if (!(DURUMLAR as readonly string[]).includes(durum)) {
      return NextResponse.json({ error: "Gecersiz durum" }, { status: 400 });
    }

    const mevcut = await basvuruSorgulaId(id);
    if (!mevcut) {
      return NextResponse.json({ error: "Bulunamadi" }, { status: 404 });
    }

    const ok = await basvuruDurumGuncelle(id, durum, notlar || "", atanan, ic_not);
    if (!ok) {
      return NextResponse.json({ error: "Bulunamadi" }, { status: 404 });
    }

    if (mevcut.durum !== durum && mevcut.email) {
      await sendStatusChangeEmail({
        to: mevcut.email,
        adSoyad: mevcut.ad_soyad,
        basvuruId: id,
        eskiDurum: mevcut.durum,
        yeniDurum: durum,
        konu: mevcut.konu,
      });
    }

    return NextResponse.json({ message: "Guncellendi" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Guncelleme hatasi" }, { status: 500 });
  }
}
