// app/page.tsx

import ClientMapWrapper from "../component/ClientMapWrapper";
import MapViewToggle from "../component/MapViewToggle";
import Navbar from "../component/Navbar";

export default function RdtrPage() {
  return (
    <>
      <div className="h-screen w-screen grid grid-rows-[auto_1fr]">
        <Navbar />
        <MapViewToggle />
        {/* <ClientMapWrapper /> */}
      </div>
    </>
  );
}
