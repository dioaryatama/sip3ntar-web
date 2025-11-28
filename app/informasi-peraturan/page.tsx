import Navbar from "../component/Navbar";
import { RegulationDownload } from "../component/RegulationDownload";

export default function DocumentPage() {
  return (
    <>
      <div className="h-full w-screen grid grid-rows-[auto_1fr]">
        <Navbar />
        <RegulationDownload />
      </div>
    </>
  );
}
