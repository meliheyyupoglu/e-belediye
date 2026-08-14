import { NextResponse } from "next/server";
import { getCitizenUserId } from "@/lib/citizen-auth";
import { bildirimleriGetir } from "@/lib/db";

export async function GET() {
  const userId = await getCitizenUserId();
  if (!userId) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }
  const list = await bildirimleriGetir(userId);
  const okunmamis = list.filter((b) => !b.okundu).length;
  return NextResponse.json({ bildirimler: list, okunmamis });
}
