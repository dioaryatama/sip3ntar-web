"use client";

import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { FeatureCollection } from "geojson";

import btJson from "@/public/RENCANA_POLA_RUANG_BATANGKUIS_AR.json";
import lbJson from "@/public/RENCANA_POLA_RUANG_LABUHANDELIPERCUTSEITUAN_AR.json";
import brJson from "@/public/RENCANA_POLA_RUANG_PANTAILABUBERINGIN_AR.json";
import ptJson from "@/public/RENCANA_POLA_RUANG_PATUMBAK_AR.json";
import { style } from "./style";

// JSON type-safe
const bt = btJson as FeatureCollection;
const lb = lbJson as FeatureCollection;
const br = brJson as FeatureCollection;
const pt = ptJson as FeatureCollection;

// Fix Leaflet marker default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

export type LayerType = "lb" | "bt" | "br" | "pt";

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  viewType?: "default" | "satellite";
  geojsonTypes: LayerType[];
}

// UTIL: Random color generator
const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("9a" + value.toString(16)).substr(-2);
  }
  return color;
};

const MapComponent: React.FC<MapProps> = ({
  center = [3.527058, 98.786712],
  zoom = 10,
  scrollWheelZoom = true,
  viewType = "default",
  geojsonTypes,
}) => {
  const layerMap: Record<LayerType, FeatureCollection> = { lb, bt, br, pt };

  const getFeatureStyle = (feature: any) => {
    const featureName =
      feature?.properties?.NAMOBJ || String(feature?.id) || "default";

    const matchedStyle = style.find((s) => s.name === featureName);

    return {
      weight: 0,
      fillColor: matchedStyle
        ? matchedStyle.fillColor
        : stringToColor(featureName),
      fillOpacity: matchedStyle ? 0.8 : 0.4,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on("click", () => {
      const p = feature?.properties;
      const rows = `
          <tr>
            <td style="text-color:#000; text-transform: uppercase; font-weight:800; padding:4px; border-bottom:1px solid #ddd;">
              ${p.NAMOBJ ?? "-"}
            </td>
            </tr>
            <tr>
            <td style="padding:4px; border-bottom:1px solid #ddd;">
              ${p.WADMPR ?? "-"}
            </td>
            </tr>
            <tr>
            <td style="padding:4px; border-bottom:1px solid #ddd;">
              ${p.WADMKK ?? "-"}
            </td>
            </tr>
            <tr>
            <td style="padding:4px; border-bottom:1px solid #ddd;">
              ${p.WADMKC ?? "-"}
            </td>
            </tr>
            <tr>
            <td style="padding:4px; border-bottom:1px solid #ddd;">
              ${p.WADMKD ?? "-"}
            </td>
          </tr>`;

      const popupContent = `
      <div style="max-height:250px; overflow:auto;">
        <table style="width:100%; border-collapse: collapse; font-size:14px;">
          ${rows}
        </table>
      </div>`;

      layer.bindPopup(popupContent).openPopup();
    });

    // Hover effect
    layer.on("mouseover", () => {
      // cast ke L.Path agar TypeScript tidak error
      const pathLayer = layer as L.Path;
      pathLayer.setStyle({
        weight: 2,
        color: "#000", // border highlight biru
        fillOpacity: 1,
      });
      pathLayer.bringToFront();
    });

    layer.on("mouseout", () => {
      const pathLayer = layer as L.Path;
      pathLayer.setStyle({
        weight: 0,
        fillOpacity: 0.8, // sesuai style awal
      });
    });
  };

  console.log("MapComponent rendering with layers:", geojsonTypes);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url={
          viewType === "satellite"
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />

      {/* Layers Control */}
      <LayersControl position="topleft">
        {/* Overlay LB */}
        <LayersControl.Overlay
          name="RDTR LABUHAN DELI - PERCUT SEI TUAN TAHUN  2025-2045"
          checked={geojsonTypes.includes("lb")}
        >
          <GeoJSON
            data={layerMap.lb}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        </LayersControl.Overlay>

        {/* Overlay BT */}
        <LayersControl.Overlay
          name="RDTR BATANG KUIS TAHUN 2023-2043"
          checked={geojsonTypes.includes("bt")}
        >
          <GeoJSON
            data={layerMap.bt}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        </LayersControl.Overlay>

        {/* Overlay BR */}
        <LayersControl.Overlay
          name="RDTR PANTAI LABU - BERINGIN TAHUN 2023-2043"
          checked={geojsonTypes.includes("br")}
        >
          <GeoJSON
            data={layerMap.br}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        </LayersControl.Overlay>

        {/* Overlay PT */}
        <LayersControl.Overlay
          name="RDTR PATUMBAK 2023-2043"
          checked={geojsonTypes.includes("pt")}
        >
          <GeoJSON
            data={layerMap.pt}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;
