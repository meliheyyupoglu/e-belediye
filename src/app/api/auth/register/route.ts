import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/citizen-auth";
import { kullaniciGetirByTc, kullaniciKaydet } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tc_no = String(body.tc_no || "").trim();
    const ad_soyad = String(body.ad_soyad || "").trim();
    const telefon = String(body.telefon || "").trim();
    const email = String(body.email || "").trim();
    const sifre = String(body.sifre || "");

    if (!/^\d{11}$/.test(tc_no)) {
      return NextResponse.json({ error: "Geçerli 11 haneli TC kimlik no girin." }, { status: 400 });
    }
    if (!ad_soyad || ad_soyad.length < 3) {
      return NextResponse.json({ error: "Ad soyad en az 3 karakter olmalı." }, { status: 400 });
    }
    if (!telefon || telefon.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Geçerli telefon numarası girin." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Geçerli e-posta adresi girin." }, { status: 400 });
    }
    if (sifre.length < 6) {
      return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });
    }

    const existing = await kullaniciGetirByTc(tc_no);
    if (existing) {
      return NextResponse.json({ error: "Bu TC kimlik numarası ile kayıtlı kullanıcı var." }, { status: 409 });
    }

    const id = await kullaniciKaydet({
      tc_no,
      ad_soyad,
      telefon,
      email,
      sifre_hash: hashPassword(sifre),
    });

    const { bildirimEkle } = await import("@/lib/db");
    await bildirimEkle({
      kullanici_id: id,
      baslik: "Hoş geldiniz!",
      mesaj: "e-Belediye hesabınız oluşturuldu. Başvurularınızı buradan takip edebilirsiniz.",
      tip: "hosgeldin",
    });

    return NextResponse.json({ ok: true, id, message: "Kayıt başarılı. Giriş yapabilirsiniz." });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Kayıt işlemi başarısız." }, { status: 500 });
  }
}
