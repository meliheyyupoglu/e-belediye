import { NextResponse } from "next/server";
import { reverseGeocodeAddress, type AddressFormat } from "@/lib/geocode";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const format = (searchParams.get("format") || "detailed") as AddressFormat;

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: "Geçersiz koordinat" }, { status: 400 });
    }

    const address = await reverseGeocodeAddress(lat, lng, format === "road" ? "road" : "detailed");
    if (!address) {
      return NextResponse.json({ error: "Adres bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Adres alınamadı" }, { status: 500 });
  }
}
