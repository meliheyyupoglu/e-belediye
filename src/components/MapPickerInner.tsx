"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { DORTYOL_CENTER } from "@/lib/harita";
import { getAvailablePresets, getMapTileConfig, type MapTilePreset } from "@/lib/map-tiles";
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
  compact?: boolean;
  readOnly?: boolean;
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
    map.flyTo([lat, lng], 18, { duration: 0.6 });
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
  compact = false,
  readOnly = false,
  className = "",
}: Props) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tilePreset, setTilePreset] = useState<MapTilePreset>("osm");
  const tiles = useMemo(() => getMapTileConfig(tilePreset), [tilePreset]);
  const availablePresets = useMemo(() => getAvailablePresets(), []);

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

  const wrapperClass = compact
    ? `map-full min-h-[160px] max-h-[200px] ${className}`
    : fullHeight
      ? `map-full ${className}`
      : `map-picker rounded-xl border border-gray-200 shadow-sm ${className}`;

  const mapMinHeight = compact ? 160 : fullHeight ? 420 : 256;

  if (!mounted) {
    return (
      <div
        className={
          compact
            ? "map-full min-h-[160px] bg-gray-100 animate-pulse"
            : fullHeight
              ? "map-full min-h-[420px] bg-gray-100 animate-pulse"
              : "map-picker bg-gray-100 animate-pulse"
        }
      />
    );
  }

  return (
    <div className={`relative ${fullHeight || compact ? "h-full min-h-0" : ""}`}>
      {(fullHeight || compact) && !readOnly && (
        <button
          type="button"
          onClick={locateMe}
          disabled={geoLoading}
          className="absolute right-3 top-3 z-[1000] rounded-lg bg-white px-3 py-2 text-xs font-semibold text-primary shadow-md hover:bg-gray-50 disabled:opacity-50"
        >
          {geoLoading ? "Konum alınıyor..." : "Konumumu Bul"}
        </button>
      )}
      {fullHeight && availablePresets.length > 1 && !compact && (
        <div className="absolute left-3 bottom-3 z-[1000] flex rounded-lg bg-white p-1 shadow-md ring-1 ring-black/5">
          {availablePresets.map((key) => {
            const cfg = getMapTileConfig(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTilePreset(key)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  tilePreset === key
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cfg.label ?? key}
              </button>
            );
          })}
        </div>
      )}
      <div className={wrapperClass}>
        <MapContainer
          center={center}
          zoom={value ? 18 : 16}
          style={{ height: "100%", width: "100%", minHeight: mapMinHeight }}
          scrollWheelZoom
          zoomControl
        >
          <TileLayer
            key={tilePreset}
            attribution={tiles.attribution}
            url={tiles.url}
            maxZoom={tiles.maxZoom ?? 19}
            subdomains={tiles.subdomains}
          />
          <MapResizeFix />
          {!readOnly && <ClickHandler onChange={handleLocationChange} />}
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
