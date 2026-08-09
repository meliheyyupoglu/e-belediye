"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { DORTYOL_CENTER } from "@/lib/harita";
import { getMapTileConfig } from "@/lib/map-tiles";
import type { AddressFormat } from "@/lib/geocode";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const pinIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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
  onGeocodeLoading?: (loading: boolean) => void;
  addressFormat?: AddressFormat;
  fullHeight?: boolean;
  className?: string;
}

function ClickHandler({ onChange }: { onChange: (loc: MapLocation) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
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

function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 17, { duration: 0.6 });
  }, [lat, lng, map]);
  return null;
}

async function fetchAddress(lat: number, lng: number, format: AddressFormat) {
  const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}&format=${format}`);
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

export default function MapPickerInner({
  value,
  onChange,
  onGeocodeLoading,
  addressFormat = "detailed",
  fullHeight = false,
  className = "",
}: Props) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tiles = useMemo(() => getMapTileConfig(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLocationChange(loc: MapLocation) {
    onChange(loc);
    onGeocodeLoading?.(true);
    setGeoLoading(true);
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
    onGeocodeLoading?.(false);
    setGeoLoading(false);
  }

  function locateMe() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleLocationChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const center: [number, number] = value
    ? [value.lat, value.lng]
    : [DORTYOL_CENTER.lat, DORTYOL_CENTER.lng];

  const wrapperClass = fullHeight
    ? `map-full ${className}`
    : `map-picker rounded-xl border border-gray-200 shadow-sm ${className}`;

  if (!mounted) {
    return (
      <div className={fullHeight ? "map-full min-h-[420px] bg-gray-100 animate-pulse" : "map-picker bg-gray-100 animate-pulse"} />
    );
  }

  return (
    <div className={`relative ${fullHeight ? "h-full min-h-[420px]" : ""}`}>
      {fullHeight && (
        <button
          type="button"
          onClick={locateMe}
          disabled={geoLoading}
          className="absolute right-3 top-3 z-[1000] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-primary shadow-md hover:bg-gray-50 disabled:opacity-50"
        >
          {geoLoading ? "Konum alınıyor..." : "Konumumu Bul"}
        </button>
      )}
      <div className={wrapperClass}>
        <MapContainer
          center={center}
          zoom={value ? 17 : 15}
          style={{ height: "100%", width: "100%", minHeight: fullHeight ? 420 : 256 }}
          scrollWheelZoom
          zoomControl
        >
          <TileLayer
            attribution={tiles.attribution}
            url={tiles.url}
            maxZoom={tiles.maxZoom ?? 20}
            subdomains={tiles.subdomains}
          />
          <MapResizeFix />
          <ClickHandler onChange={handleLocationChange} />
          {value && (
            <>
              <FlyToMarker lat={value.lat} lng={value.lng} />
              <Marker position={[value.lat, value.lng]} icon={pinIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">Seçilen Konum</p>
                    <p className="mt-1 text-gray-600 max-w-[200px]">
                      {value.adres || (geoLoading ? "Adres alınıyor..." : "Adres yükleniyor...")}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
