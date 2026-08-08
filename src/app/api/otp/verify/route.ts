import { NextResponse } from "next/server";
import { otpGecerliMi } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function otpHedef(tc_no: string, telefon: string): string {
  const tel = telefon.replace(/[\s\-()]/g, "");
  return `${tc_no}:${tel}`;
}

export async function POST(request: Request) {
  try {
    const { tc_no, telefon, otp } = await request.json();

    if (!/^\d{11}$/.test(tc_no)) {
      return NextResponse.json({ error: "Geçerli bir TC kimlik numarası girin." }, { status: 400 });
    }

    const telClean = String(telefon || "").replace(/[\s\-()]/g, "");
    if (!/^\d{10,11}$/.test(telClean)) {
      return NextResponse.json({ error: "Geçerli bir telefon numarası girin." }, { status: 400 });
    }

    if (!/^\d{6}$/.test(String(otp || ""))) {
      return NextResponse.json({ error: "6 haneli doğrulama kodunu girin." }, { status: 400 });
    }

    const hedef = otpHedef(tc_no, telefon);
    const valid = await otpGecerliMi(hedef, String(otp), "gecmis");

    if (!valid) {
      return NextResponse.json({ valid: false, error: "Geçersiz veya süresi dolmuş kod." }, { status: 400 });
    }

    return NextResponse.json({ valid: true, message: "Doğrulama başarılı." });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Doğrulama yapılamadı";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
