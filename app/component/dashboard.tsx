// app/page.tsx
"use client";
import ClientMapWrapper from "./ClientMapWrapper";
import MapViewToggle from "./MapViewToggle";
import Head from "next/head"; // Atau gunakan metadata di layout.tsx

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>GIS Dashboard</title>
        <meta
          name="description"
          content="Geographic Information System dashboard"
        />
      </Head>

      {/* Kontainer Utama: Flexbox, Tinggi Layar Penuh, Lebar Penuh, Overflow Tersembunyi */}
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Konten Utama (Peta) */}
        <main className="flex-grow relative flex flex-col">
          {/* Header Peta (Search, Icons Kanan Atas) */}

          {/* Area Peta */}
          <div className="flex-grow relative h-full w-full">
            <MapViewToggle />
            <ClientMapWrapper />
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
