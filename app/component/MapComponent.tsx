"use client";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// IMPORT TURF UNTUK SPATIAL QUERY
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

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

// --- HELPER: GENERATE POPUP CONTENT (Supaya bisa dipakai di Click & Input) ---
const generatePopupContent = (properties: any, lat: string | number, lng: string | number) => {
  const p = properties;
  
  // Logika LP2B
  let infoLp2b = "";
  if (p.LP2B_2 && p.LP2B_2 !== "Tidak Ada" && p.LP2B_2 !== "" && p.LP2B_2 !== null) {
    infoLp2b = `
      <tr>
        <td style="padding-top: 5px; padding-bottom: 5px;">
          <span style="background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid #10b981;">
            🌾 Kawasan LP2B
          </span>
        </td>
      </tr>
    `;
  }

  const rows = `
      <tr><td style="font-weight:800; font-size: 1.1em;">${p.NAMOBJ ?? "-"}</td></tr>
      ${infoLp2b}
      <tr><td style="border-top: 1px solid #eee; padding-top: 5px;">${p.WADMPR ?? "-"}</td></tr>
      <tr><td>${p.WADMKK ?? "-"}</td></tr>
      <tr><td>${p.WADMKC ?? "-"}</td></tr>
      <tr><td style="font-size: 0.85em; color: #666; padding-top: 8px;">Lat: ${lat}, Long: ${lng}</td></tr>
  `;

  return `
  <div style="max-height:250px; overflow:auto; min-width: 200px;">
    <table style="width:100%; border-collapse: collapse; font-size:14px;">
      ${rows}
    </table>
  </div>`;
};

// Komponen Pembantu untuk menggeser peta ke Marker Input
function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 16, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

const MapComponent: React.FC<MapProps> = ({
  center = [3.527058, 98.786712],
  zoom = 10,
  scrollWheelZoom = true,
  viewType = "default",
  geojsonTypes,
}) => {
  const [selectedLayers, setSelectedLayers] = useState<string[]>(geojsonTypes);
  const [inputMarker, setInputMarker] = useState<[number, number] | null>(null);
  const [markerPopupHtml, setMarkerPopupHtml] = useState<string>(""); // State untuk konten popup marker

  const layerMap: Record<LayerType, FeatureCollection> = { lb, bt, br, pt };

  const handleInputMarker = (lat: number, lng: number) => {
    setInputMarker([lat, lng]);

    // --- LOGIKA PENCARIAN SPASIAL (POINT IN POLYGON) ---
    const turfPoint = point([lng, lat]); // Turf menggunakan format [lng, lat]
    let foundFeature: any = null;

    // Loop semua layer yang aktif
    for (const layerKey of selectedLayers) {
        const featureCollection = layerMap[layerKey as LayerType];
        if (!featureCollection) continue;

        // Loop semua feature dalam layer
        for (const feature of featureCollection.features) {
            if (feature.geometry) {
                // Cek apakah titik ada di dalam polygon ini
                // Perlu casting tipe geometry agar turf menerimanya
                try {
                   if (booleanPointInPolygon(turfPoint, feature.geometry as any)) {
                       foundFeature = feature;
                       break; // Ketemu! Stop loop feature
                   }
                } catch (err) {
                   // Ignore error jika geometry invalid
                }
            }
        }
        if (foundFeature) break; // Ketemu! Stop loop layer
    }

    if (foundFeature) {
        // Jika ketemu, generate popup lengkap
        const htmlContent = generatePopupContent(foundFeature.properties, lat, lng);
        setMarkerPopupHtml(htmlContent);
    } else {
        // Jika tidak ketemu (misal di laut/luar wilayah), tampilkan koordinat saja
        setMarkerPopupHtml(`<b>Lokasi Diluar Pola Ruang</b><br/>Lat: ${lat}<br/>Lng: ${lng}`);
    }
  };

  const defaultMarkerIcon = new L.Icon({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  const toggleLayer = (key: string) => {
    setSelectedLayers((prev) =>
      prev.includes(key) ? prev.filter((l) => l !== key) : [...prev, key]
    );
  };

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

      // Gunakan fungsi helper yang sama
      const popupContent = generatePopupContent(p, lat, lng);
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
        <FlyToLocation coords={inputMarker} />

        <TileLayer
          url={
            viewType === "satellite"
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        <GroupControl
          groups={[
            {
              title: "Pola Ruang",
              layers: [
                { key: "lb", label: "Kecamatan Labuhan Deli - Percut Sei Tuan", checked: selectedLayers.includes("lb") },
                { key: "bt", label: "Kecamatan Batang Kuis", checked: selectedLayers.includes("bt") },
                { key: "br", label: "Kecamatan Pantai Labu – Beringin", checked: selectedLayers.includes("br") },
                { key: "pt", label: "Kecamatan Patumbak", checked: selectedLayers.includes("pt") },
              ],
            },
            {
              title: "Data Tematik",
              layers: [
                { key: "rb", label: "Rawan Bencana (Segera Hadir)", checked: selectedLayers.includes("rb") },
                { key: "lsd", label: "LSD & LBS (Segera Hadir)", checked: selectedLayers.includes("lsd") },
                { key: "ch", label: "Curah Hujan (Segera Hadir)", checked: selectedLayers.includes("ch") },
                { key: "gg", label: "Geologi (Segera Hadir)", checked: selectedLayers.includes("gg") },
              ],
            },
          ]}
          onToggle={toggleLayer}
        />

        {selectedLayers.includes("lb") && layerMap.lb && (
          <GeoJSON data={layerMap.lb} style={getFeatureStyle} onEachFeature={onEachFeature} />
        )}
        {selectedLayers.includes("bt") && layerMap.bt && (
          <GeoJSON data={layerMap.bt} style={getFeatureStyle} onEachFeature={onEachFeature} />
        )}
        {selectedLayers.includes("br") && layerMap.br && (
          <GeoJSON data={layerMap.br} style={getFeatureStyle} onEachFeature={onEachFeature} />
        )}
        {selectedLayers.includes("pt") && layerMap.pt && (
          <GeoJSON data={layerMap.pt} style={getFeatureStyle} onEachFeature={onEachFeature} />
        )}

        <FeatureGroup>
          <EditControl
            position="topleft"
            onCreated={onCreated}
            draw={{
              rectangle: true, polygon: true, circle: true,
              circlemarker: false, polyline: true,
              marker: { icon: defaultMarkerIcon },
            }}
          />
        </FeatureGroup>

        {/* INPUT MARKER dengan POPUP DINAMIS */}
        {inputMarker && (
          <Marker position={inputMarker} icon={defaultMarkerIcon}>
             {/* Gunakan dangerouslySetInnerHTML karena kita merender string HTML tabel */}
            <Popup>
                <div dangerouslySetInnerHTML={{ __html: markerPopupHtml }} />
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  );
};

export default MapComponent;