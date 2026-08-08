export type AddressFormat = "detailed" | "road";

export interface ParsedAddress {
  il: string;
  ilce: string;
  mahalle: string;
  caddeSokak: string;
  binaNo: string;
  formatted: string;
}

interface NominatimAddress {
  state?: string;
  province?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  road?: string;
  pedestrian?: string;
  footway?: string;
  house_number?: string;
}

export interface NominatimResult {
  address?: NominatimAddress;
  display_name?: string;
}

function normalizeMahalle(raw: string): string {
  if (!raw) return "";
  if (/mahalle/i.test(raw)) return raw;
  return `${raw} Mahallesi`;
}

export function parseNominatimAddress(data: NominatimResult): Omit<ParsedAddress, "formatted"> {
  const addr = data.address || {};

  const il = addr.province || addr.state || "Hatay";
  const ilce = addr.town || addr.city || addr.village || "Dörtyol";
  const mahalle = normalizeMahalle(
    addr.suburb || addr.neighbourhood || addr.quarter || ""
  );
  const caddeSokak = addr.road || addr.pedestrian || addr.footway || "";
  const binaNo = addr.house_number || "";

  return { il, ilce, mahalle, caddeSokak, binaNo };
}

export function formatAddress(
  parts: Omit<ParsedAddress, "formatted">,
  mode: AddressFormat
): ParsedAddress {
  const segments: string[] = [parts.il, parts.ilce];

  if (parts.mahalle) segments.push(parts.mahalle);
  if (parts.caddeSokak) segments.push(parts.caddeSokak);
  if (mode === "detailed" && parts.binaNo) {
    segments.push(`Bina No ${parts.binaNo}`);
  }

  return {
    ...parts,
    formatted: segments.filter(Boolean).join(" "),
  };
}

export async function reverseGeocodeAddress(
  lat: number,
  lng: number,
  mode: AddressFormat
): Promise<ParsedAddress | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "json");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("zoom", mode === "detailed" ? "18" : "17");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "tr");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "e-belediye-dortyol/1.0 (belediye sikayet sistemi)",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as NominatimResult;
  const parts = parseNominatimAddress(data);
  const formatted = formatAddress(parts, mode);

  if (!formatted.mahalle && !formatted.caddeSokak && data.display_name) {
    return {
      ...formatted,
      formatted: data.display_name.split(",").slice(0, mode === "detailed" ? 5 : 4).join(" ").trim(),
    };
  }

  return formatted;
}
