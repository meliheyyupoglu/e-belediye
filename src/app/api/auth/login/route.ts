import { NextResponse } from "next/server";
import { COOKIE_NAME, MAX_AGE, createSessionToken, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
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
