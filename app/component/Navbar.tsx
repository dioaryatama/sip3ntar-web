"use client";

import { useState } from "react";
import navbarLogo from "@/app/assets/images/LOGO_NAVBAR.png";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-background/95 backdrop-blur border-b border-border relative z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src={navbarLogo.src}
              alt="Logo Dinas Cipta Karya dan Tata Ruang Kabupaten Deli Serdang"
              className="h-12 w-auto object-contain drop-shadow-2xl"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/rtrw"
              className="text-sm hover:text-primary transition"
            >
              Peta RTRW
            </Link>
            <Link
              href="/rdtr"
              className="text-sm hover:text-primary transition"
            >
              Peta RDTR
            </Link>
            <Link
              href="/informasi-peraturan"
              className="text-sm hover:text-primary transition"
            >
              Informasi Peraturan Lainnya
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[999999] md:hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-72 bg-background shadow-2xl p-6 space-y-6 animate-slideIn">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setIsOpen(false)} aria-label="Close Menu">
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <Link href="/rtrw" onClick={() => setIsOpen(false)}>
                Peta RTRW
              </Link>
              <Link href="/rdtr" onClick={() => setIsOpen(false)}>
                Peta RDTR
              </Link>
              <Link
                href="/informasi-peraturan"
                onClick={() => setIsOpen(false)}
              >
                Informasi Peraturan Lainnya
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
