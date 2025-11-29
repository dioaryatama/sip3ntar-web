"use client";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  Marker,
  Popup,
} from "react-leaflet";
import { useState } from "react";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import type { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import btJson from "@/public/RENCANA_POLA_RUANG_BATANGKUIS_AR.json";
import lbJson from "@/public/RENCANA_POLA_RUANG_LABUHANDELIPERCUTSEITUAN_AR.json";
import brJson from "@/public/RENCANA_POLA_RUANG_PANTAILABUBERINGIN_AR.json";
import ptJson from "@/public/RENCANA_POLA_RUANG_PATUMBAK_AR.json";

import { style } from "./style";
import GroupControl from "./GroupControl";
import LatLngMarkerForm from "./LatLngMarkerForm";

// JSON to type-safe
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

// UTIL random color generator
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
  const [selectedLayers, setSelectedLayers] = useState<string[]>(geojsonTypes);

  const [inputMarker, setInputMarker] = useState<[number, number] | null>(null);

  const handleInputMarker = (lat: number, lng: number) => {
    setInputMarker([lat, lng]);
  };

  const defaultMarkerIcon = new L.Icon({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41], // ukuran icon
    iconAnchor: [12, 41], // titik dasar icon tepat di koordinat
    popupAnchor: [0, -41], // popup muncul di atas kepala marker
  });

  const toggleLayer = (key: string) => {
    setSelectedLayers((prev) =>
      prev.includes(key) ? prev.filter((l) => l !== key) : [...prev, key]
    );
  };

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
    layer.on("click", (e: any) => {
      const p = feature?.properties;
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);

      const rows = `
          <tr><td style="font-weight:800;">${p.NAMOBJ ?? "-"}</td></tr>
          <tr><td>${p.WADMPR ?? "-"}</td></tr>
          <tr><td>${p.WADMKK ?? "-"}</td></tr>
          <tr><td>${p.WADMKC ?? "-"}</td></tr>
          <tr><td>Latitude: ${lat} / Longitude: ${lng}</td></tr>
      `;

      const popupContent = `
      <div style="max-height:250px; overflow:auto;">
        <table style="width:100%; border-collapse: collapse; font-size:14px;">
          ${rows}
        </table>
      </div>`;

      layer.bindPopup(popupContent).openPopup();
    });

    layer.on("mouseover", () => {
      (layer as L.Path).setStyle({ weight: 2, color: "#000", fillOpacity: 1 });
      (layer as L.Path).bringToFront();
    });

    layer.on("mouseout", () => {
      (layer as L.Path).setStyle({ weight: 0, fillOpacity: 0.8 });
    });
  };

  const onCreated = (e: any) => {
    const layer = e.layer;

    let coords = "";
    if (layer.getLatLng) {
      const { lat, lng } = layer.getLatLng();
      coords = `Latitude: ${lat}<br/>Longitude: ${lng}`;
    } else if (layer.getLatLngs) {
      const latlngs = layer.getLatLngs()[0] || layer.getLatLngs();
      coords = latlngs
        .map((c: any, i: number) => `Point ${i + 1}: ${c.lat} , ${c.lng}`)
        .join("<br/>");
    }

    layer.bindPopup(`<b>Koordinat</b><br/>${coords}`).openPopup();
  };

  return (
    <>
      <LatLngMarkerForm onSubmit={handleInputMarker} />
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%" }}
      >
        <TileLayer
          url={
            viewType === "satellite"
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        {/* Single Group Control */}
        <GroupControl
          groups={[
            {
              title: "Pola Ruang",
              layers: [
                {
                  key: "lb",
                  label: "Kecamatan Labuhan Deli - Percut Sei Tuan",
                  checked: selectedLayers.includes("lb"),
                },
                {
                  key: "bt",
                  label: "Kecamatan Batang Kuis",
                  checked: selectedLayers.includes("bt"),
                },
                {
                  key: "br",
                  label: "Kecamatan Pantai Labu – Beringin",
                  checked: selectedLayers.includes("br"),
                },
                {
                  key: "pt",
                  label: "Kecamatan Patumbak",
                  checked: selectedLayers.includes("pt"),
                },
              ],
            },
            {
              title: "Data Tematik",
              layers: [
                {
                  key: "rb",
                  label: "Rawan Bencana (Segera Hadir)",
                  checked: selectedLayers.includes("rb"),
                },
                {
                  key: "lsd",
                  label: "LSD & LBS (Segera Hadir)",
                  checked: selectedLayers.includes("lsd"),
                },
                {
                  key: "ch",
                  label: "Curah Hujan (Segera Hadir)",
                  checked: selectedLayers.includes("ch"),
                },
                {
                  key: "gg",
                  label: "Geologi (Segera Hadir)",
                  checked: selectedLayers.includes("gg"),
                },
              ],
            },
          ]}
          onToggle={toggleLayer}
        />

        {/* Render GeoJSON directly */}
        {selectedLayers.includes("lb") && (
          <GeoJSON
            data={layerMap.lb}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}
        {selectedLayers.includes("bt") && (
          <GeoJSON
            data={layerMap.bt}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}
        {selectedLayers.includes("br") && (
          <GeoJSON
            data={layerMap.br}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}
        {selectedLayers.includes("pt") && (
          <GeoJSON
            data={layerMap.pt}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Drawing tools */}
        <FeatureGroup>
          <EditControl
            position="topleft"
            onCreated={onCreated}
            draw={{
              rectangle: true,
              polygon: true,
              circle: true,
              circlemarker: false,
              polyline: true,
              marker: {
                icon: new L.Icon({
                  iconRetinaUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                  iconUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                  shadowUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [0, -41],
                }),
              },
            }}
          />
        </FeatureGroup>
        {inputMarker && (
          <Marker position={inputMarker} icon={defaultMarkerIcon}>
            <Popup>
              Latitude: {inputMarker[0]} <br />
              Longtitude: {inputMarker[1]}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default MapComponent;
