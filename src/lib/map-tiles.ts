/** Harita karo katmanları — varsayılan: Carto Voyager (sokak isimleri daha okunaklı) */

export interface MapTileConfig {
  url: string;
  attribution: string;
  maxZoom?: number;
  subdomains?: string;
}

export function getMapTileConfig(): MapTileConfig {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (mapboxToken) {
    return {
      url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
      attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; OpenStreetMap',
      maxZoom: 20,
    };
  }

  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (maptilerKey) {
    return {
      url: `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${maptilerKey}`,
      attribution: '&copy; MapTiler &copy; OpenStreetMap',
      maxZoom: 20,
    };
  }

  // Ücretsiz, OSM tabanlı, sokak etiketleri daha belirgin
  return {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 20,
    subdomains: "abcd",
  };
}

/** Yedek karo — birincil katman yüklenmezse */
export function getMapTileFallback(): MapTileConfig {
  return {
    url: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  };
}
