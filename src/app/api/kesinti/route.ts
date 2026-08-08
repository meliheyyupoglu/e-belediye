import { NextResponse } from "next/server";
import { kesintiBolgeleriGetir } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tip = searchParams.get("tip") || undefined;
    const bolgeler = await kesintiBolgeleriGetir(tip);
    return NextResponse.json(bolgeler);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}
