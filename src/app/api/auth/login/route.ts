import { NextResponse } from "next/server";
import { COOKIE_NAME, MAX_AGE, createSessionToken, verifyAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const { username = "", password = "" } = await request.json();
  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre" }, { status: 401 });
  }
  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}
