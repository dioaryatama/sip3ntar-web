"use client";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect, useCallback } from "react";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import type { FeatureCollection } from "geojson";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet.pattern";

import btJson from "@/public/RENCANA_POLA_RUANG_AR.json";
import kecamatanJson from "@/public/nama_kecamatan.json";

import { styleRtrw } from "./styleRtrw";
import GroupControl from "./GroupControl";
import LatLngMarkerForm from "./LatLngMarkerForm";

// --- TYPE DEFINITIONS ---
const bt = btJson as FeatureCollection;
const kecamatan = kecamatanJson as FeatureCollection;

declare global {
  interface Window {
    bukaAturan: (lat: number, lng: number, namaZona: string) => void;
  }
}

// Fix Leaflet marker default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

export type LayerType = "bt" | "kecamatan";

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  viewType?: "default" | "satellite";
  geojsonTypes: LayerType[];
}

// --- DATA ATURAN ZONASI ---
const getZoningRules = (zona: string): string => {
  if (zona === "Kawasan Permukiman Perkotaan") {
    return `
      <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5;">
          <h4 style="margin-bottom: 10px; color: #d9534f; border-bottom: 2px solid #d9534f; padding-bottom:5px;">
             RTRW: ${zona}
          </h4>
          <p><strong>Pasal 60 Ayat 2: Kawasan Permukiman Perkotaan</strong></p>
          
          <strong>a. Kegiatan yang diperbolehkan:</strong>
          <ol type="1" style="padding-left: 20px; margin-top: 5px; margin-bottom: 10px;">
              <li>Kegiatan permukiman kepadatan sedang dan kepadatan tinggi;</li>
              <li>Penyediaan jalur dan ruang evakuasi bencana;</li>
              <li>Pengembangan sumber daya air;</li>
              <li>Pengembangan sarana dan prasarana wilayah;</li>
              <li>Perkantoran pemerintahan/swasta dan pusat bisnis.</li>
          </ol>

          <strong>b. Kegiatan diperbolehkan bersyarat:</strong>
          <ol type="1" style="padding-left: 20px; margin-top: 5px; margin-bottom: 10px;">
              <li>Industri mikro, kecil, dan menengah yang ramah lingkungan;</li>
              <li>Kegiatan pariwisata yang bersinergi dengan kawasan permukiman;</li>
              <li>Pembangunan menara telekomunikasi.</li>
          </ol>
      </div>
    `;
  }
  if (zona === "Kawasan Permukiman Perdesaan") {
    return `
      <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5;">
          <h4 style="margin-bottom: 10px; color: #d9534f; border-bottom: 2px solid #d9534f; padding-bottom:5px;">
             RTRW: ${zona}
          </h4>
          <p><strong>Pasal 60 Ayat 3: Kawasan Permukiman Perdesaan</strong></p>
          
          <strong>a. Kegiatan yang diperbolehkan:</strong>
          <ol type="1" style="padding-left: 20px; margin-top: 5px; margin-bottom: 10px;">
              <li>Kegiatan permukiman dengan kepadatan rendah hingga sedang</li>
              <li>Penyediaan jalur dan ruang evakuasi bencana</li>
              <li>Kegiatan perdagangan dan jasa skala lokal</li>
              <li>Penyediaan sarana dan prasarana minimum meliputi ruang terbuka hijau/taman, sarana transportasi umum, sarana kesehatan, pendidikan, olahraga, pemerintahan, dan utilitas sesuai kebutuhan</li>
          </ol>

          <strong>b. Kegiatan diperbolehkan bersyarat:</strong>
          <ol type="1" style="padding-left: 20px; margin-top: 5px; margin-bottom: 10px;">
              <li>Kegiatan pariwisata</li>
              <li>Industri mikro, kecil dan menengah yang ramah lingkungan</li>
              <li>Kegiatan pertanian</li>
          </ol>
          <strong>c. kegiatan yang tidak diperbolehkan, meliputi kegiatan yang dapat menimbulkan penurunan fungsi kawasan</strong>
      </div>
    `;
  }
  if (zona === "Kawasan Tanaman Pangan") {
    return `
      <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5;">
          <h4 style="margin-bottom: 10px; color: #d9534f; border-bottom: 2px solid #d9534f; padding-bottom:5px;">
             RTRW: ${zona}
          </h4>
          <p><strong>Pasal 57 Ayat 2: Kawasan Tanaman Pangan</strong></p>
          
          <strong>a. Kegiatan yang diperbolehkan:</strong>
          <ol type="1" style="padding-left: 20px; margin-top: 5px; margin-bottom: 10px;">
              <li>Pengembangan sarana dan prasarana pendukung pengembangan pertanian tanaman pangan dengan memperhatikan daya dukung kawasan.</li>
              <li>Kegiatan budidaya tanaman pangan.</li>
              <li>Aktifitas pendukung pertanian.</li>
              <li>Kegiatan pariwisata berbasis pertanian.</li>
              <li>Kegiatan pelestarian sumber daya air.</li>
              <li>Kegiatan perikanan budidaya.</li>
              <li>Pengembangan teknik konservasi lahan pertanian yang bersifat ramah lingkungan dan berkelanjutan.</li>
          </ol>

          <strong>b. Kegiatan diperbolehkan bersyarat:</strong>
          <ol type="1" style="padding-left: 20px; margin-top: 5px; margin-bottom: 10px;">
              <li>Kegiatan permukiman berkepadatan rendah yang mendukung fungsi kawasan</li>
              <li>kegiatan industri pengolahan hasil pertanian tanaman pangan dan hortikultura</li>
              <li>diperbolehkan terbatas tanaman tahunan/perkebunan dan kebun campuran/ladang</li>
              <li>kegiatan pengembangan prasarana wilayah</li>
              <li>kegiatan pertambangan yang tidak mengganggu dan merubah fungsi kawasan pertanian tanaman pangan</li>
              <li>kegiatan peternakan unggas, ternak kecil (kecuali babi), dan ternak besar yang tidak mencemari lingkungan</li>
          </ol>
          <strong>c. Kegiatan yang tidak diperbolehkan, meliputi:</strong>
          <ol type="1" style="padding-left: 20px; margin-top: 5px; margin-bottom: 10px;">
              <li>pengembangan kegiatan yang berpotensi mengganggu fungsi kawasan pertanian tanaman pangan</li>
              <li>mendirikan bangunan yang mengganggu dan memutus saluran irigasi</li>
              <li>alih fungsi lahan yang telah ditetapkan sebagai Kawasan Pertanian Pangan Berkelanjutan (KP2B) kecuali untuk bangunan sistem jaringan prasarana</li>
      </div>
    `;
  }
  return `<p>Aturan untuk <strong>${zona}</strong> belum tersedia.</p>`;
};

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

// --- KOMPONEN PENGENDALI EVENT MAP ---
const MapEvents = ({
  activeLatLng,
  setWindowPosition,
  setActiveLatLng,
  setRuleContent
}: {
  activeLatLng: { lat: number; lng: number } | null;
  setWindowPosition: (pos: { x: number; y: number }) => void;
  setActiveLatLng: (latlng: { lat: number; lng: number } | null) => void;
  setRuleContent: (c: string) => void;
}) => {
  const map = useMap();

  const updatePosition = useCallback(() => {
    if (activeLatLng) {
      const point = map.latLngToContainerPoint([activeLatLng.lat, activeLatLng.lng]);
      setWindowPosition({ x: point.x + 20, y: point.y - 100 });
    }
  }, [map, activeLatLng, setWindowPosition]);

  useMapEvents({
    move: () => updatePosition(),
    zoom: () => updatePosition(),
  });

  useEffect(() => {
    window.bukaAturan = (lat: number, lng: number, namaZona: string) => {
      const content = getZoningRules(namaZona);
      setActiveLatLng({ lat, lng });
      setRuleContent(content);
      
      const point = map.latLngToContainerPoint([lat, lng]);
      setWindowPosition({ x: point.x + 20, y: point.y - 100 });
    };

    return () => {
      // @ts-ignore
      delete window.bukaAturan;
    };
  }, [map, setActiveLatLng, setRuleContent, setWindowPosition]);

  return null;
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
  const [patterns, setPatterns] = useState<{ [key: string]: string }>({});

  const [ruleContent, setRuleContent] = useState<string | null>(null);
  const [activeLatLng, setActiveLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [windowPosition, setWindowPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleInputMarker = (lat: number, lng: number) => {
    setInputMarker([lat, lng]);
  };

  const defaultMarkerIcon = new L.Icon({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  useEffect(() => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("style", "position: absolute; left: -9999px;");

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    pattern.setAttribute("id", "transportasiPattern");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", "10");
    pattern.setAttribute("height", "10");
    pattern.setAttribute("patternTransform", "rotate(45)");

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", "0");
    line.setAttribute("y2", "10");
    line.setAttribute("stroke", "#c41e3a");
    line.setAttribute("stroke-width", "3");
    pattern.appendChild(line);

    const greenPattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    greenPattern.setAttribute("id", "testPattern");
    greenPattern.setAttribute("patternUnits", "userSpaceOnUse");
    greenPattern.setAttribute("width", "12");
    greenPattern.setAttribute("height", "12");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "4");
    circle.setAttribute("cy", "4");
    circle.setAttribute("r", "2");
    circle.setAttribute("fill", "#000");

    greenPattern.appendChild(circle);
    defs.appendChild(greenPattern);
    defs.appendChild(pattern);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    setPatterns({
      transportasi: "url(#transportasiPattern)",
      test: "url(#testPattern)",
    });

    return () => {
      if(document.body.contains(svg)) document.body.removeChild(svg);
    };
  }, []);

  const toggleLayer = (key: string) => {
    setSelectedLayers((prev) =>
      prev.includes(key) ? prev.filter((l) => l !== key) : [...prev, key]
    );
  };

  const layerMap: Record<LayerType, FeatureCollection> = { bt, kecamatan };

  // --- STYLE KHUSUS KECAMATAN (Hanya Garis + Transparan) ---
  const getKecamatanStyle = (feature: any) => {
    return {
      weight: 2,
      color: "#333",
      dashArray: '10, 5',
      fillColor: "transparent",
      fillOpacity: 0, 
    };
  };

  const getFeatureStyle = (feature: any) => {
    const featureName = feature?.properties?.NAMOBJ || String(feature?.id) || "default";
    const isKawasanTransportasi = featureName.toLowerCase().includes("/");
    const isTest = featureName.toLowerCase().includes("kawasan transportasi");

    if (isKawasanTransportasi) {
      return {
        weight: 1,
        color: "#c41e3a",
        fillColor: patterns.transportasi || "#c41e3a",
        fillOpacity: 1,
      };
    }
    if (isTest) {
      return {
        weight: 1,
        color: "#000",
        fillColor: patterns.test || "#000",
        fillOpacity: 1,
      };
    }
    const matchedStyle = styleRtrw.find((s) => s.name === featureName);
    return {
      weight: 0,
      fillColor: matchedStyle ? matchedStyle.fillColor : stringToColor(featureName),
      fillOpacity: matchedStyle ? 0.8 : 0.4,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on("click", (e: any) => {
      const p = feature?.properties;
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      const namaObjek = p.NAMOBJ || "-";

      let tombolAturan = "";
      
      if (namaObjek.trim() === "Kawasan Permukiman Perkotaan" || namaObjek.trim() === "Kawasan Permukiman Perdesaan" || namaObjek.trim() === "Kawasan Tanaman Pangan") {
         tombolAturan = `
            <tr>
                <td style="padding-top: 10px;">
                    <button 
                        onclick="window.bukaAturan(${lat}, ${lng}, '${namaObjek}')"
                        style="width: 100%; padding: 8px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                        📜 Lihat Aturan Zonasi
                    </button>
                </td>
            </tr>
         `;
      }

      const rows = `
          <tr><td style="font-weight:800;">${p.NAMOBJ ?? "-"}</td></tr>
          <tr><td>${p.WADMPR ?? "-"}</td></tr>
          <tr><td>${p.WADMKK ?? "-"}</td></tr>
          <tr><td>${p.WADMKC ?? "-"}</td></tr>
          <tr><td>Lat: ${lat} / Lng: ${lng}</td></tr>
          ${tombolAturan}
      `;

      const popupContent = `
      <div style="max-height:250px; overflow:auto; min-width: 200px;">
        <table style="width:100%; border-collapse: collapse; font-size:14px;">
          ${rows}
        </table>
      </div>`;

      layer.bindPopup(popupContent, { autoClose: false }).openPopup();
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

  const handleCloseRule = () => {
    setActiveLatLng(null);
    setRuleContent(null);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <LatLngMarkerForm onSubmit={handleInputMarker} />
      
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={
            viewType === "satellite"
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        
        <MapEvents 
          activeLatLng={activeLatLng}
          setWindowPosition={setWindowPosition}
          setActiveLatLng={setActiveLatLng}
          setRuleContent={setRuleContent}
        />

        <GroupControl
          groups={[
            {
              title: "RTRW",
              layers: [
                {
                  key: "bt",
                  label: "Pola Ruang",
                  checked: selectedLayers.includes("bt"),
                },
                {
                  key: "kecamatan",
                  label: "Batas Kecamatan",
                  checked: selectedLayers.includes("kecamatan"),
                },
                {
                  key: "br",
                  label: "Struktur Ruang (Segera Hadir)",
                  checked: selectedLayers.includes("br"),
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
                {
                  key: "kp2",
                  label: "KP2B (Segera Hadir)",
                  checked: selectedLayers.includes("kp2"),
                },
              ],
            },
          ]}
          onToggle={toggleLayer}
        />

        {/* LAYER BAWAH: Pola Ruang */}
        {selectedLayers.includes("bt") && (
          <GeoJSON
            data={layerMap.bt}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* LAYER ATAS: Kecamatan dengan Label */}
        {selectedLayers.includes("kecamatan") && (
          <GeoJSON
            data={layerMap.kecamatan}
            style={getKecamatanStyle}
            interactive={false} // <--- TAMBAHAN PENTING: Agar klik tembus ke bawah & cursor tidak berubah
            onEachFeature={(feature, layer) => {
                // Ambil data dari atribut KECAMATAN
                const labelText = feature.properties?.KECAMATAN || feature.properties?.NAMOBJ || "";
                
                // --- BAGIAN POPUP DIHAPUS ---
                // layer.bindPopup(...) -> Hapus baris ini agar tidak ada aksi klik
                
                // Label Permanen (Tampil Terus) - Tetap ada
                if (labelText) {
                   layer.bindTooltip(labelText, {
                      permanent: true, 
                      direction: "center",
                      className: "label-kecamatan"
                   });
                }
            }}
          />
        )}

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
                icon: defaultMarkerIcon,
              },
            }}
          />
        </FeatureGroup>
        
        {inputMarker && (
          <Marker position={inputMarker} icon={defaultMarkerIcon}>
            <Popup>
              
              <div style={{ textAlign: "center", minWidth: "120px" }}>
                <p style={{ margin: "0 0 8px 0", fontWeight: "bold", fontSize: "12px" }}>
                  📍 Lokasi Input
                </p>
                <p style={{ margin: "0 0 10px 0", fontSize: "11px" }}>
                  Lat: {inputMarker[0]}<br />
                  Lng: {inputMarker[1]}
                </p>
                <button
                  onClick={() => setInputMarker(null)}
                  style={{
                    backgroundColor: "#e74c3c", // Warna merah
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: "bold"
                  }}
                >
                  🗑️ Hapus Marker
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* STICKY WINDOW */}
      {activeLatLng && ruleContent && (
        <div
            style={{
                position: "absolute",
                left: `${windowPosition.x}px`, 
                top: `${windowPosition.y}px`,
                width: "300px",
                maxHeight: "350px",
                backgroundColor: "white",
                zIndex: 9999,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
        >
            <div style={{
                padding: "8px 12px",
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h3 style={{margin:0, fontSize:"13px", fontWeight:"bold", color:"#333"}}>Aturan Zonasi</h3>
                <button 
                    onClick={handleCloseRule}
                    style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: "#999"
                    }}
                >
                    ✕
                </button>
            </div>

            <div 
                style={{
                    padding: "12px",
                    overflowY: "auto",
                    fontSize: "13px",
                    color: "#333"
                }}
                dangerouslySetInnerHTML={{ __html: ruleContent }} 
            />
        </div>
      )}
    </div>
  );
};

export default MapComponent;