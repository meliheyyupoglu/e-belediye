"use client";

import { useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { DORTYOL_CENTER } from "@/lib/harita";
import { getHaritaSikayetById } from "@/lib/harita";
import { getMapTileConfig } from "@/lib/map-tiles";
import { getAdminMapDemoData } from "@/lib/seed-data";
import type { Basvuru, KesintiBolgesi } from "@/lib/db";
import "leaflet/dist/leaflet.css";

const TIP_COLORS: Record<string, string> = {
  su_kesintisi: "#3b82f6",
  elektrik: "#eab308",
  bozuk_yol: "#f97316",
};

const KESINTI_COLORS: Record<string, string> = {
  su: "#3b82f6",
  su_kesintisi: "#3b82f6",
  elektrik: "#eab308",
};

function makeIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function kesintiEtiketi(tip: string) {
  if (tip === "su" || tip === "su_kesintisi") return "Su kesintisi";
  return "Elektrik kesintisi";
}

function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize({ animate: false });
    fix();
    const t1 = setTimeout(fix, 100);
    const t2 = setTimeout(fix, 400);
    window.addEventListener("resize", fix);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", fix);
    };
  }, [map]);
  return null;
}

export default function AdminMap() {
  const demo = useMemo(() => getAdminMapDemoData(), []);
  const [basvurular, setBasvurular] = useState<Basvuru[]>(demo.basvurular);
  const [kesintiler, setKesintiler] = useState<KesintiBolgesi[]>(demo.kesintiler);
  const [demoMod, setDemoMod] = useState(true);
  const [loading, setLoading] = useState(true);
  const tiles = useMemo(() => getMapTileConfig("carto"), []);

  useEffect(() => {
    async function yukle() {
      try {
        const [bRes, kRes] = await Promise.all([
          fetch("/api/basvurular?geo=1", { credentials: "include" }),
          fetch("/api/kesinti"),
        ]);

        let yeniBasvurular = demo.basvurular;
        let yeniKesintiler = demo.kesintiler;
        let canli = false;

        if (bRes.ok) {
          const data = await bRes.json();
          if (Array.isArray(data) && data.length > 0) {
            yeniBasvurular = data;
            canli = true;
          }
        }

        if (kRes.ok) {
          const data = await kRes.json();
          if (Array.isArray(data) && data.length > 0) {
            yeniKesintiler = data;
          }
        }

        setBasvurular(yeniBasvurular);
        setKesintiler(yeniKesintiler);
        setDemoMod(!canli);
      } catch {
        setBasvurular(demo.basvurular);
        setKesintiler(demo.kesintiler);
        setDemoMod(true);
      } finally {
        setLoading(false);
      }
    }
    yukle();
  }, [demo]);

  const haritaBasvurular = basvurular.filter((b) => b.lat != null && b.lng != null);

  if (loading) {
    return <div className="h-[480px] rounded-xl bg-gray-100 animate-pulse border border-gray-200" />;
  }

  return (
    <div>
      {demoMod && (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Örnek şikayet verileri gösteriliyor ({haritaBasvurular.length} kayıt, {kesintiler.length} kesinti bölgesi).
        </p>
      )}
      <div className="flex flex-wrap gap-4 mb-3 text-xs text-gray-600">
        {Object.entries(TIP_COLORS).map(([tip, color]) => (
          <span key={tip} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full border border-white shadow" style={{ background: color }} />
            {getHaritaSikayetById(tip)?.label || tip}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-blue-400 opacity-50" />
          Kesinti bölgesi
        </span>
      </div>
      <div className="admin-map rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <MapContainer
          center={[DORTYOL_CENTER.lat, DORTYOL_CENTER.lng]}
          zoom={13}
          className="h-[480px] w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution={tiles.attribution}
            url={tiles.url}
            maxZoom={tiles.maxZoom ?? 20}
            subdomains={tiles.subdomains}
          />
          <MapResizeFix />
          {kesintiler.map((k) => (
            <Circle
              key={`k-${k.id}`}
              center={[k.lat, k.lng]}
              radius={400}
              pathOptions={{
                color: KESINTI_COLORS[k.tip] || "#6b7280",
                fillColor: KESINTI_COLORS[k.tip] || "#6b7280",
                fillOpacity: 0.15,
                weight: 2,
              }}
            >
              <Popup>
                <strong>{k.mahalle}</strong>
                <br />
                {kesintiEtiketi(k.tip)}
                {k.aciklama && (
                  <>
                    <br />
                    {k.aciklama}
                  </>
                )}
              </Popup>
            </Circle>
          ))}
          {haritaBasvurular.map((b) => {
            const color = TIP_COLORS[b.basvuru_tipi || ""] || "#6b7280";
            return (
              <Marker key={b.id} position={[b.lat!, b.lng!]} icon={makeIcon(color)}>
                <Popup>
                  <strong>
                    #{b.id} — {b.konu}
                  </strong>
                  <br />
                  {getHaritaSikayetById(b.basvuru_tipi || "")?.label || b.basvuru_tipi || "Genel"}
                  <br />
                  {b.adres || b.cadde_sokak || "—"}
                  <br />
                  <span className="text-gray-500">{b.durum}</span>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
