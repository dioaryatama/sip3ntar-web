"use client";

import { motion } from "framer-motion";
import { Download, FileText, Search, Calendar, Filter } from "lucide-react";
import { useState } from "react";

interface Peraturan {
  id: number;
  nomor: string;
  judul: string;
  kategori: "RTRW" | "RDTR" | "Perda" | "Perkada" | "Teknis";
  tahun: number;
  ukuran: string;
  gradient: string;
  file: string;
}

const daftarPeraturan: Peraturan[] = [
  {
    id: 1,
    nomor: "RANPERBUP 2023",
    judul: "RDTR Pantai Labu - Beringin",
    kategori: "RDTR",
    tahun: 2023,
    ukuran: "7.9 MB",
    gradient: "from-blue-700 to-cyan-700",
    file: "documents/ranperbup-rdtr-pantai-labu-beringin-2023.pdf",
  },
  {
    id: 2,
    nomor: "Perbup No. 38 Tahun 2025",
    judul:
      "RDTR Kecamatan Percut Sei Tuan & Kawasan Industri Labuhan Deli 2025-2045",
    kategori: "RDTR",
    tahun: 2025,
    ukuran: "33.2 MB",
    gradient: "from-emerald-700 to-teal-700",
    file: "documents/perbup-rdtr-percut-labuhan-deli-2025-2045.pdf",
  },
  {
    id: 3,
    nomor: "Perda RTRW 2021-2041",
    judul: "RTRW Kabupaten Deli Serdang Tahun 2021-2041",
    kategori: "RTRW",
    tahun: 2021,
    ukuran: "29.1 MB",
    gradient: "from-amber-700 to-orange-700",
    file: "documents/perda-rtrw-2021-2041.pdf",
  },
  {
    id: 4,
    nomor: "Perbup No. 16 Tahun 2023",
    judul: "RDTR Batang Kuis",
    kategori: "RDTR",
    tahun: 2023,
    ukuran: "52 MB",
    gradient: "from-indigo-700 to-blue-700",
    file: "documents/perbup-rdtr-batang-kuis-2023.pdf",
  },
  {
    id: 5,
    nomor: "Perbup No. 17 Tahun 2023",
    judul: "RDTR Patumbak",
    kategori: "RDTR",
    tahun: 2023,
    ukuran: "48 MB",
    gradient: "from-purple-700 to-pink-700",
    file: "documents/perbup-rdtr-patumbak-2023.pdf",
  },
];

const kategoriList = ["Semua", "RTRW", "RDTR", "Perda", "Perkada", "Teknis"];

export function RegulationDownload() {
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop()!;
    link.click();
  };

  const filteredPeraturan = daftarPeraturan.filter((p) => {
    const matchKategori =
      selectedKategori === "Semua" || p.kategori === selectedKategori;
    const matchSearch =
      p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nomor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchSearch;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 py-20 px-4">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* SEARCH & FILTER */}
        <motion.div
          className="mb-12 bg-white/95 rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari peraturan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700 text-sm">Kategori:</span>
            {kategoriList.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setSelectedKategori(kategori)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedKategori === kategori
                    ? "bg-gradient-to-r from-blue-700 to-purple-700 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {kategori}
              </button>
            ))}
          </div>
        </motion.div>

        {/* CONTENT LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPeraturan.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="h-full bg-white/95 rounded-2xl p-6 shadow-xl border border-white/50">
                <div className="flex gap-4">
                  <div
                    className={`bg-gradient-to-br ${p.gradient} p-4 rounded-xl shadow-lg`}
                  >
                    <FileText className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-grow">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded-full mb-2">
                      {p.kategori}
                    </span>

                    <h3 className="text-gray-900 mb-2">{p.judul}</h3>
                    <p className="text-sm text-gray-600 mb-3">{p.nomor}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                      <div className="flex gap-1 items-center">
                        <Calendar className="w-4 h-4" /> {p.tahun}
                      </div>
                      <div className="flex gap-1 items-center">
                        <FileText className="w-4 h-4" /> {p.ukuran}
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleDownload(p.file)}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.03 }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r ${p.gradient} text-white rounded-xl`}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
