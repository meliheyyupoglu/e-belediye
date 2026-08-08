import { verifySessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export function requireAdmin(request: Request): NextResponse | null {
  const token = request.headers.get("cookie")?.match(/admin_session=([^;]+)/)?.[1];
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }
  return null;
}

export function getAdminDepartmanFromEnv(): string | null {
  return process.env.ADMIN_DEPARTMAN || null;
}
