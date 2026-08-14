import { NextResponse } from "next/server";
import { getCitizenUserId } from "@/lib/citizen-auth";
import { bildirimOkundu } from "@/lib/db";

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getCitizenUserId();
  if (!userId) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }
  const id = parseInt(params.id, 10);
  if (!id) {
    return NextResponse.json({ error: "Geçersiz bildirim." }, { status: 400 });
  }
  const ok = await bildirimOkundu(id, userId);
  if (!ok) {
    return NextResponse.json({ error: "Bildirim bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
