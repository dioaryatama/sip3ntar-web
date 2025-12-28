"use client";

import { useState } from "react";
import ClientMapWrapper from "./ClientMapWrapper";

export default function MapViewToggle() {
  const [currentView, setCurrentView] = useState<"default" | "satellite">(
    "default"
  );

  const toggleView = () => {
    setCurrentView((prev) => (prev === "default" ? "satellite" : "default"));
  };

  return (
    <div className="relative h-full w-full">
      {/* Toggle Button */}
      <button
        onClick={toggleView}
        className="absolute top-4 right-4 z-[1001]
          bg-white rounded-lg shadow-md
          p-3 md:px-4 md:py-2
          flex items-center gap-2
          hover:bg-gray-100 transition"
        aria-label="Toggle Map View"
      >
        {/* Icon */}
        {currentView === "default" ? (
          /* Satellite Icon */
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
            />
          </svg>
        ) : (
          /* Map Icon */
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.832L9 7m0 13l6-3m-6 3V7m6 10l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.553-.832L15 7m0 10V7m0 0L9 7"
            />
          </svg>
        )}

        {/* Text (Desktop only) */}
        <span className="hidden md:inline text-sm font-semibold">
          {currentView === "default" ? "Tampilan Satelit" : "Tampilan Peta"}
        </span>
      </button>

      {/* Map */}
      <ClientMapWrapper viewType={currentView} scrollWheelZoom={true} />
    </div>
  );
}
