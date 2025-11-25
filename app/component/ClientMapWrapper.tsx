// components/ClientMapWrapper.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { LayerType } from "./MapComponent";

const DynamicMap = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat peta...</p>
      </div>
    </div>
  ),
});

interface ClientMapWrapperProps {
  center?: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  viewType?: "default" | "satellite";
}

const ClientMapWrapper: React.FC<ClientMapWrapperProps> = ({
  center,
  zoom,
  scrollWheelZoom,
  viewType,
}) => {
  const [visibleLayers, setVisibleLayers] = useState<LayerType[]>([
    "lb",
    "bt",
    "br",
    "pt",
  ]);

  const toggleLayer = (layer: LayerType) => {
    setVisibleLayers((prev) => {
      const newLayers = prev.includes(layer)
        ? prev.filter((l) => l !== layer)
        : [...prev, layer];
      return newLayers;
    });
  };

  const isLayerVisible = (layer: LayerType) => visibleLayers.includes(layer);

  return (
    <div className="relative w-full h-full">
      {/* KOMPOSISI MAP */}
      <div className="w-full h-screen">
        <DynamicMap
          center={center}
          zoom={zoom}
          scrollWheelZoom={scrollWheelZoom}
          viewType={viewType}
          geojsonTypes={visibleLayers}
        />
      </div>
    </div>
  );
};

export default ClientMapWrapper;
