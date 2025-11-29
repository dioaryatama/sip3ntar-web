import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dinas Cipta Karya dan Tata Ruang Kab. Deli Serdang",
  description:
    "Layanan perencanaan tata ruang profesional untuk pembangunan kota yang terencana dan berkelanjutan",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico", // ✔ path public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
