import { NextResponse } from "next/server";
import { getCitizenUserId } from "@/lib/citizen-auth";
import { kullaniciGetirById } from "@/lib/db";

export async function GET() {
  const userId = await getCitizenUserId();
  if (!userId) {
    return NextResponse.json({ authenticated: false });
  }
  const user = await kullaniciGetirById(userId);
  if (!user) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    user: { id: user.id, ad_soyad: user.ad_soyad, email: user.email, tc_no: user.tc_no },
  });
}
