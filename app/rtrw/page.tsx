import MapViewToggleRtrw from "../component/MapViewToggleRtrw";
import Navbar from "../component/Navbar";
import { UnderDevelopment } from "../component/UnderDevelopment";

export default function RtrwPage() {
  return (
    <>
      <div className="h-screen w-screen grid grid-rows-[auto_1fr]">
        <Navbar />
        {/* <UnderDevelopment /> */}
        <MapViewToggleRtrw />
      </div>
    </>
  );
}
