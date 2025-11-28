// app/page.tsx
"use client";
import ClientMapWrapper from "./ClientMapWrapper";
import MapViewToggle from "./MapViewToggle";
import Head from "next/head"; // Atau gunakan metadata di layout.tsx

const Dashboard = () => {
  return (
    <>
      <div className="flex h-full w-full overflow-hidden">
        <main className="flex-grow relative flex flex-col">
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
