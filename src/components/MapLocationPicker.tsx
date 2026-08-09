"use client";

import dynamic from "next/dynamic";
import type { AddressFormat } from "@/lib/geocode";
import type { MapLocation } from "./MapPickerInner";

const MapPickerInner = dynamic(() => import("./MapPickerInner"), {
  ssr: false,
  loading: () => (
    <div className="h-72 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
  ),
});

interface Props {
  value: MapLocation | null;
  onChange: (loc: MapLocation) => void;
  onGeocodeLoading?: (loading: boolean) => void;
  mapLabel?: string;
  addressFormat?: AddressFormat;
  fullHeight?: boolean;
  className?: string;
}

export default function MapLocationPicker(props: Props) {
  return <MapPickerInner {...props} />;
}

export type { MapLocation };
