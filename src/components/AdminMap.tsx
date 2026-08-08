"use client";

import { useEffect, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { DORTYOL_CENTER } from "@/lib/harita";
import { getHaritaSikayetById } from "@/lib/harita";
import type { Basvuru, KesintiBolgesi } from "@/lib/db";
import "leaflet/dist/leaflet.css";

const TIP_COLORS: Record<string, string> = {
  su_kesintisi: "#3b82f6",
  elektrik: "#eab308",
  bozuk_yol: "#f97316",
};

const KESINTI_COLORS: Record<string, string> = {
  su: "#3b82f6",
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

export default function AdminMap() {
  const [basvurular, setBasvurular] = useState<Basvuru[]>([]);
  const [kesintiler, setKesintiler] = useState<KesintiBolgesi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function yukle() {
      const [bRes, kRes] = await Promise.all([
        fetch("/api/basvurular?geo=1"),
        fetch("/api/kesinti"),
      ]);
      setBasvurular(await bRes.json());
      setKesintiler(await kRes.json());
      setLoading(false);
    }
    yukle();
  }, []);

  if (loading) {
    return <div className="h-[480px] rounded-xl bg-gray-100 animate-pulse border border-gray-200" />;
  }

  return (
    <div>
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
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
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
                {k.tip === "su" ? "Su kesintisi" : "Elektrik kesintisi"}
                {k.aciklama && <><br />{k.aciklama}</>}
              </Popup>
            </Circle>
          ))}
          {basvurular.map((b) => {
            if (b.lat == null || b.lng == null) return null;
            const color = TIP_COLORS[b.basvuru_tipi || ""] || "#6b7280";
            return (
              <Marker
                key={b.id}
                position={[b.lat, b.lng]}
                icon={makeIcon(color)}
              >
                <Popup>
                  <strong>#{b.id} — {b.konu}</strong>
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
