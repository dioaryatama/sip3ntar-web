"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

export function UnderDevelopment() {
  return (
    <div className="relative min-h-full bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 flex items-center justify-center px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 md:p-16 shadow-2xl border border-white/50 max-w-3xl mx-auto">
          {/* Icon */}
          <motion.div
            className="inline-flex mb-8"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <div className="bg-gradient-to-br from-amber-700 to-orange-700 p-6 rounded-2xl shadow-lg">
              <Wrench className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.h1
            className="text-gray-900 text-2xl md:text-4xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Fitur ini sedang dalam proses pengembangan
          </motion.h1>

          {/* Additional subtle decoration */}
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-700 via-purple-700 to-orange-700 rounded-full mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          ></motion.div>
        </div>
      </motion.div>
    </div>
  );
}
