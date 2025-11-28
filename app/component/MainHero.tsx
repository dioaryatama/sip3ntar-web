"use client";

import { FileText, Building2, ScrollText, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import welcomeImage from "@/app/assets/images/Banner_Popup.png";
import backgroundImage from "@/app/assets/images/BG_SIPENTAR.png";
import dinasLogo from "@/app/assets/images/LOGO_PEMKAB.png";
import sipNyarLogo from "@/app/assets/images/LOGO_SIPENTAR.png";
import Link from "next/link";
// import { ImageWithFallback } from "../figma/ImageWithFallback";

const menuItems = [
  {
    icon: Building2,
    title: "Informasi RTRW",
    gradient: "from-blue-700 to-cyan-700",
    bgGlow: "bg-blue-700/20",
    href: "/rtrw",
  },
  {
    icon: FileText,
    title: "Informasi RDTR",
    gradient: "from-purple-700 to-pink-700",
    bgGlow: "bg-purple-700/20",
    href: "/rdtr",
  },
  //   {
  //     icon: Satellite,
  //     title: "Peta Satelit",
  //     gradient: "from-emerald-700 to-teal-700",
  //     bgGlow: "bg-emerald-700/20",
  //   },
  //   {
  //     icon: Map,
  //     title: "Peta Tematik",
  //     gradient: "from-amber-700 to-orange-700",
  //     bgGlow: "bg-amber-700/20",
  //   },
  {
    icon: ScrollText,
    title: "Informasi Peraturan Lainnya",
    gradient: "from-indigo-700 to-blue-700",
    bgGlow: "bg-indigo-700/20",
    href: "/informasi-peraturan",
  },
];

export function MainHero() {
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

  const handleClosePopup = () => {
    setShowWelcomePopup(false);
  };

  return (
    <>
      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcomePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleClosePopup}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image container with max height */}
              <div className="relative max-h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
                {/* Close button */}
                <button
                  onClick={handleClosePopup}
                  className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 group"
                >
                  <X className="w-4 h-4 text-gray-700 group-hover:text-white" />
                </button>

                <img
                  src={welcomeImage.src}
                  alt="Selamat Datang di Website SIP3NTAR"
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-400 via-teal-300 to-green-300">
        {/* Background Image - Full Screen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={backgroundImage.src}
            alt="Deli Serdang Landscape"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logo Header */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-6 left-6 z-50 pointer-events-auto"
        >
          <img
            src={dinasLogo.src}
            alt="Logo Dinas Cipta Karya dan Tata Ruang Kabupaten Deli Serdang"
            className="h-20 md:h-32 w-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
          {/* Modern Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo SIP NYAR */}
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src={sipNyarLogo.src}
                alt="SIP NYAR Logo"
                className="h-32 md:h-40 w-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
            <motion.p
              className="text-gray-900 text-lg md:text-2xl max-w-4xl mx-auto px-6 drop-shadow-xl bg-white/90 backdrop-blur-md py-4 rounded-2xl border border-gray-200/50 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Sistem Informasi Perencanaan dan Pengendalian Pemanfaatan Ruang
              Interaktif
            </motion.p>
          </motion.div>
          {/* Modern Menu Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12 px-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={item.href}>
                    {/* Glow effect on hover */}
                    <div
                      className={`absolute inset-0 ${item.bgGlow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>

                    <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 transition-all duration-300">
                      <div className="flex flex-col items-center gap-4">
                        {/* Icon with gradient background */}
                        <div
                          className={`bg-gradient-to-br ${item.gradient} p-4 rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}
                        >
                          <Icon className="w-10 h-10 text-white" />
                        </div>

                        {/* Text */}
                        <span className="text-sm text-gray-800 text-center group-hover:text-gray-900 transition-colors">
                          {item.title}
                        </span>
                      </div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Modern Footer */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900/95 via-slate-900/95 to-gray-900/95 backdrop-blur-md text-white py-4 z-20 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="container mx-auto px-4">
            <p className="text-xs sm:text-sm text-center text-gray-300">
              © 2025 Dinas Cipta Karya dan Tata Ruang Kabupaten Deli Serdang
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
