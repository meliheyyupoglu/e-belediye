import { NextResponse } from "next/server";
import { CITIZEN_COOKIE } from "@/lib/citizen-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CITIZEN_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
