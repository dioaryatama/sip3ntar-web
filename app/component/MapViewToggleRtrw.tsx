"use client";

import { useState } from "react";
import ClientMapWrapperRtrw from "./ClientMapWrapperRtrw";

export default function MapViewToggleRtrw() {
  const [currentView, setCurrentView] = useState<"default" | "satellite">(
    "default"
  );

  const toggleView = () => {
    setCurrentView((prevView) =>
      prevView === "default" ? "satellite" : "default"
    );
  };

  return (
    <div className="relative h-full w-full">
      {/* Tombol beralih tampilan */}
      <button
        onClick={toggleView}
        className="absolute top-4 right-4 z-[1001] bg-white p-2 rounded-md shadow-md text-sm font-semibold hover:bg-gray-100"
      >
        {currentView === "default" ? "Tampilan Satelit" : "Tampilan Peta"}
      </button>

      {/* Wrapper Peta */}
      <ClientMapWrapperRtrw viewType={currentView} scrollWheelZoom={true} />
    </div>
  );
}
