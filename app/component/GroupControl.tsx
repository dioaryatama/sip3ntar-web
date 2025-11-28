"use client";

import React, { useState, useEffect } from "react";
import { FaLayerGroup } from "react-icons/fa";

interface Props {
  groups: {
    title: string;
    layers: { key: string; label: string; checked: boolean }[];
  }[];
  onToggle: (key: string) => void;
}

export default function GroupControl({ groups, onToggle }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) setCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "80px",
        right: isMobile ? "10px" : "10px",
        zIndex: 9999,
        background: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        width: isMobile ? "auto" : "300px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Tombol collapse untuk tampilan mobile */}
      {isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: "100%",
            color: "white",
            padding: "6px",
            borderRadius: "6px",
            marginBottom: "6px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          <FaLayerGroup color="#000" size={20} />
        </button>
      )}

      {/* Konten layer (hidden saat collapsed di mobile) */}
      {!collapsed && (
        <>
          {groups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: "10px" }}>
              <strong
                style={{
                  fontWeight: "700",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {group.title}
              </strong>

              {group.layers.map((layer) => (
                <label
                  key={layer.key}
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginBottom: "3px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={layer.checked}
                    onChange={() => onToggle(layer.key)}
                  />
                  {layer.label}
                </label>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
