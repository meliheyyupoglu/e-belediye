"use client";

import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { DORTYOL_CENTER } from "@/lib/harita";
import type { AddressFormat } from "@/lib/geocode";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapLocation {
  lat: number;
  lng: number;
  adres?: string;
  il?: string;
  ilce?: string;
  mahalle?: string;
  caddeSokak?: string;
  binaNo?: string;
}

interface Props {
  value: MapLocation | null;
  onChange: (loc: MapLocation) => void;
  mapLabel: string;
  addressFormat: AddressFormat;
}

function ClickHandler({ onChange }: { onChange: (loc: MapLocation) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

async function fetchAddress(lat: number, lng: number, format: AddressFormat) {
  const res = await fetch(
    `/api/geocode/reverse?lat=${lat}&lng=${lng}&format=${format}`
  );
  if (!res.ok) return null;
  return res.json() as Promise<{
    il: string;
    ilce: string;
    mahalle: string;
    caddeSokak: string;
    binaNo: string;
    formatted: string;
  }>;
}

function AddressDisplay({ location, format }: { location: MapLocation; format: AddressFormat }) {
  if (format === "detailed") {
    return (
      <div className="space-y-0.5">
        <p>{location.il} {location.ilce}</p>
        {location.mahalle && <p>{location.mahalle}</p>}
        {location.caddeSokak && (
          <p>
            {location.caddeSokak}
            {location.binaNo ? `, Bina No ${location.binaNo}` : ""}
          </p>
        )}
        {!location.mahalle && !location.caddeSokak && location.adres && (
          <p>{location.adres}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <p>{location.il || "Hatay"} {location.ilce || "Dörtyol"}</p>
      {location.mahalle && <p>{location.mahalle}</p>}
      {location.caddeSokak && <p>{location.caddeSokak}</p>}
      {!location.mahalle && !location.caddeSokak && location.adres && (
        <p>{location.adres}</p>
      )}
    </div>
  );
}

export default function MapPickerInner({ value, onChange, mapLabel, addressFormat }: Props) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  async function handleLocationChange(loc: MapLocation) {
    onChange(loc);
    setAddressLoading(true);
    const parsed = await fetchAddress(loc.lat, loc.lng, addressFormat);
    if (parsed) {
      onChange({
        ...loc,
        adres: parsed.formatted,
        il: parsed.il,
        ilce: parsed.ilce,
        mahalle: parsed.mahalle,
        caddeSokak: parsed.caddeSokak,
        binaNo: parsed.binaNo,
      });
    }
    setAddressLoading(false);
  }

  function locateMe() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleLocationChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const center: [number, number] = value
    ? [value.lat, value.lng]
    : [DORTYOL_CENTER.lat, DORTYOL_CENTER.lng];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="form-label mb-0">{mapLabel} *</label>
        <button
          type="button"
          onClick={locateMe}
          disabled={geoLoading}
          className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
        >
          {geoLoading ? "Konum alınıyor..." : "Konumumu Bul"}
        </button>
      </div>
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0">
        <MapContainer
          center={center}
          zoom={value ? 16 : 14}
          className="h-72 w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={handleLocationChange} />
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Haritaya tıklayarak konum seçin. Dörtyol ilçe sınırları içinde olmalıdır.
      </p>
      {value && (
        <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
          <span className="font-medium block mb-1">Seçilen adres:</span>
          {addressLoading ? (
            <span className="text-xs">Adres alınıyor...</span>
          ) : value.adres || value.mahalle || value.caddeSokak ? (
            <AddressDisplay location={value} format={addressFormat} />
          ) : (
            <span className="text-xs">{value.lat.toFixed(5)}, {value.lng.toFixed(5)}</span>
          )}
        </div>
      )}
    </div>
  );
}
