"use client";

import { useState } from "react";

interface Props {
  onSubmit: (lat: number, lng: number) => void;
}

export default function LatLngMarkerForm({ onSubmit }: Props) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (!isNaN(latNum) && !isNaN(lngNum)) {
      onSubmit(latNum, lngNum);
    } else {
      alert("Input koordinat tidak valid!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute top-90 right-4 z-[999] bg-white p-3 shadow-md rounded-md space-y-2 w-74"
    >
      <h3 className="font-bold text-sm">Input Koordinat</h3>
      <input
        type="text"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Longitude"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-2 rounded font-semibold"
      >
        Tampilkan Marker
      </button>
    </form>
  );
}
