import navbarLogo from "@/app/assets/images/LOGO_NAVBAR.png";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className=" bg-background/95 backdrop-blur border-b border-border ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img
              src={navbarLogo.src}
              alt="Logo Dinas Cipta Karya dan Tata Ruang Kabupaten Deli Serdang"
              className="h-12 w-auto object-contain drop-shadow-2xl"
            />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/rtrw"
            className="text-sm text-foreground hover:text-primary transition"
          >
            Peta RTRW
          </Link>
          <Link
            href="/rdtr"
            className="text-sm text-foreground hover:text-primary transition"
          >
            Peta RDTR
          </Link>
          <Link
            href="/informasi-peraturan"
            className="text-sm text-foreground hover:text-primary transition"
          >
            Informasi Peraturan Lainnya
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
