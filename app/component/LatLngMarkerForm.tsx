"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  onSubmit: (lat: number, lng: number) => void;
}

type InputMode = "decimal" | "dms";

export default function LatLngMarkerForm({ onSubmit }: Props) {
  // State untuk visibilitas form (Buka/Tutup)
  const [isOpen, setIsOpen] = useState(false);

  const [mode, setMode] = useState<InputMode>("decimal");

  // State untuk Decimal
  const [latDec, setLatDec] = useState("");
  const [lngDec, setLngDec] = useState("");

  // State untuk DMS (Latitude)
  const [latD, setLatD] = useState("");
  const [latM, setLatM] = useState("");
  const [latS, setLatS] = useState("");
  const [latDir, setLatDir] = useState<"N" | "S">("N");

  // State untuk DMS (Longitude)
  const [lngD, setLngD] = useState("");
  const [lngM, setLngM] = useState("");
  const [lngS, setLngS] = useState("");
  const [lngDir, setLngDir] = useState<"E" | "W">("E");

  const convertDMSToDecimal = (
    degrees: number,
    minutes: number,
    seconds: number,
    direction: string
  ) => {
    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (direction === "S" || direction === "W") {
      decimal = decimal * -1;
    }
    return decimal;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalLat = 0;
    let finalLng = 0;

    if (mode === "decimal") {
      finalLat = parseFloat(latDec);
      finalLng = parseFloat(lngDec);
    } else {
      const dLat = parseFloat(latD || "0");
      const mLat = parseFloat(latM || "0");
      const sLat = parseFloat(latS || "0");

      const dLng = parseFloat(lngD || "0");
      const mLng = parseFloat(lngM || "0");
      const sLng = parseFloat(lngS || "0");

      if (mLat >= 60 || sLat >= 60 || mLng >= 60 || sLng >= 60) {
        alert("Menit dan Detik tidak boleh lebih dari 60!");
        return;
      }

      finalLat = convertDMSToDecimal(dLat, mLat, sLat, latDir);
      finalLng = convertDMSToDecimal(dLng, mLng, sLng, lngDir);
    }

    if (!isNaN(finalLat) && !isNaN(finalLng)) {
      onSubmit(finalLat, finalLng);
      // Opsional: Tutup form setelah submit agar peta terlihat luas
      // setIsOpen(false);
    } else {
      alert("Input koordinat tidak valid!");
    }
  };

  // JIKA TERTUTUP (MINIMIZED)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-14 z-[1000] bg-white text-gray-700 p-2.5 rounded-md shadow-md border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 font-semibold text-sm"
        title="Cari Koordinat"
      >
        <Search className="w-5 h-5 text-emerald-600" />
        <span className="hidden sm:inline">Cari Koordinat</span>
      </button>
    );
  }

  // JIKA TERBUKA (EXPANDED)
  return (
    <div className="absolute top-4 left-14 z-[999999] w-80 sm:w-80 bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl border border-white/50 transition-all animate-in fade-in slide-in-from-top-4 duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-gray-800 text-sm">Input Koordinat</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-4">
        {/* Tabs Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          <button
            type="button"
            onClick={() => setMode("decimal")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "decimal"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Desimal
          </button>
          <button
            type="button"
            onClick={() => setMode("dms")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "dms"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            DMS
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "decimal" ? (
            // --- INPUT DECIMAL ---
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="3.58..."
                  value={latDec}
                  onChange={(e) => setLatDec(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="98.67..."
                  value={lngDec}
                  onChange={(e) => setLngDec(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm bg-white"
                />
              </div>
            </div>
          ) : (
            // --- INPUT DMS ---
            <div className="space-y-3">
              {/* Latitude DMS */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  Latitude (Lintang)
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="D"
                    className="w-1/4 px-1 py-2 border rounded-md text-sm text-center"
                    value={latD}
                    onChange={(e) => setLatD(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="M"
                    className="w-1/4 px-1 py-2 border rounded-md text-sm text-center"
                    value={latM}
                    onChange={(e) => setLatM(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="S"
                    className="w-1/4 px-1 py-2 border rounded-md text-sm text-center"
                    value={latS}
                    onChange={(e) => setLatS(e.target.value)}
                  />
                  <select
                    className="w-1/4 px-0 py-2 border rounded-md text-sm bg-gray-50 text-center"
                    value={latDir}
                    onChange={(e) => setLatDir(e.target.value as "N" | "S")}
                  >
                    <option value="N">N</option>
                    <option value="S">S</option>
                  </select>
                </div>
              </div>

              {/* Longitude DMS */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  Longitude (Bujur)
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="D"
                    className="w-1/4 px-1 py-2 border rounded-md text-sm text-center"
                    value={lngD}
                    onChange={(e) => setLngD(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="M"
                    className="w-1/4 px-1 py-2 border rounded-md text-sm text-center"
                    value={lngM}
                    onChange={(e) => setLngM(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="S"
                    className="w-1/4 px-1 py-2 border rounded-md text-sm text-center"
                    value={lngS}
                    onChange={(e) => setLngS(e.target.value)}
                  />
                  <select
                    className="w-1/4 px-0 py-2 border rounded-md text-sm bg-gray-50 text-center"
                    value={lngDir}
                    onChange={(e) => setLngDir(e.target.value as "E" | "W")}
                  >
                    <option value="E">E</option>
                    <option value="W">W</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Navigation className="w-4 h-4" />
            Tampilkan Marker
          </button>
        </form>
      </div>
    </div>
  );
}
