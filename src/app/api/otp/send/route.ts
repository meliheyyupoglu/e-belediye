import { NextResponse } from "next/server";
import { basvuruGecmisiGetir, otpKaydet } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function otpHedef(tc_no: string, telefon: string): string {
  const tel = telefon.replace(/[\s\-()]/g, "");
  return `${tc_no}:${tel}`;
}

function otpUret(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  try {
    const { tc_no, telefon, email } = await request.json();

    if (!/^\d{11}$/.test(tc_no)) {
      return NextResponse.json({ error: "Geçerli bir TC kimlik numarası girin." }, { status: 400 });
    }

    const telClean = String(telefon || "").replace(/[\s\-()]/g, "");
    if (!/^\d{10,11}$/.test(telClean)) {
      return NextResponse.json({ error: "Geçerli bir telefon numarası girin." }, { status: 400 });
    }

    const basvurular = await basvuruGecmisiGetir(tc_no, telefon);
    const emailFromDb = basvurular.find((b) => b.email?.trim())?.email?.trim();
    const hedefEmail = email?.trim() || emailFromDb;

    if (!hedefEmail) {
      return NextResponse.json(
        { error: "OTP göndermek için e-posta adresi girin veya kayıtlı başvurunuzda e-posta bulunmalıdır." },
        { status: 400 }
      );
    }

    const kod = otpUret();
    const hedef = otpHedef(tc_no, telefon);
    await otpKaydet(hedef, kod, "gecmis");

    const result = await sendOtpEmail({ to: hedefEmail, kod });
    if (!result.sent) {
      return NextResponse.json(
        { error: "OTP e-postası gönderilemedi. E-posta yapılandırmasını kontrol edin.", devKod: process.env.NODE_ENV === "development" ? kod : undefined },
        { status: 503 }
      );
    }

    return NextResponse.json({
      message: "Doğrulama kodu e-posta adresinize gönderildi.",
      maskedEmail: hedefEmail.replace(/(.{2}).*(@.*)/, "$1***$2"),
    });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "OTP gönderilemedi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
