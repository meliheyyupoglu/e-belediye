/** Harita karo katmanları */

export interface MapTileConfig {
  url: string;
  attribution: string;
  maxZoom?: number;
  subdomains?: string;
  label?: string;
}

export type MapTilePreset = "osm" | "osm-de" | "carto";

export const MAP_TILE_PRESETS: Record<MapTilePreset, MapTileConfig> = {
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    subdomains: "abc",
    label: "Standart",
  },
  "osm-de": {
    url: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    label: "Detaylı",
  },
  carto: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20,
    subdomains: "abcd",
    label: "Modern",
  },
};

export function getMapTileConfig(preset: MapTilePreset = "osm"): MapTileConfig {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (mapboxToken) {
    return {
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
      attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; OpenStreetMap',
      maxZoom: 20,
      label: "Mapbox",
    };
  }

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (maptilerKey) {
    return {
      url: `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${maptilerKey}`,
      attribution: '&copy; MapTiler &copy; OpenStreetMap',
      maxZoom: 20,
      label: "MapTiler",
    };
  }

  return MAP_TILE_PRESETS[preset];
}

export function getAvailablePresets(): MapTilePreset[] {
  if (
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAPTILER_KEY
  ) {
    return ["osm"];
  }
  return ["osm", "osm-de", "carto"];
}
