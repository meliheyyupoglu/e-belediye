import { NextResponse } from "next/server";
import {
  CITIZEN_COOKIE,
  CITIZEN_MAX_AGE,
  createCitizenSessionToken,
  verifyPasswordHash,
} from "@/lib/citizen-auth";
import { kullaniciGetirByTc } from "@/lib/db";

export async function POST(request: Request) {
  const { tc_no = "", sifre = "" } = await request.json();
  const tc = String(tc_no).trim();

  if (!/^\d{11}$/.test(tc)) {
    return NextResponse.json({ error: "Geçerli TC kimlik no girin." }, { status: 400 });
  }

  const user = await kullaniciGetirByTc(tc);
  if (!user || !verifyPasswordHash(String(sifre), user.sifre_hash)) {
    return NextResponse.json({ error: "TC kimlik no veya şifre hatalı." }, { status: 401 });
  }

  const token = createCitizenSessionToken(user.id);
  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, ad_soyad: user.ad_soyad, email: user.email },
  });
  res.cookies.set(CITIZEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CITIZEN_MAX_AGE,
    path: "/",
  });
  return res;
}
