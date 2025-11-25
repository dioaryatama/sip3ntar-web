import { Button } from "@/components/ui/button";
import {
  MapPin,
  Building2,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">
              Dinas Tata Ruang
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#layanan"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Layanan
            </a>
            <a
              href="#tentang"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Tentang
            </a>
            <a
              href="#kontak"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Kontak
            </a>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Hubungi Kami
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered like Greenleaf */}
      <section className="relative overflow-hidden bg-background py-24 md:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-block">
            <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full">
              Membangun Masa Depan Kota
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
            Perencanaan Tata Ruang untuk Kota Berkelanjutan
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Kami berkomitmen menciptakan ruang kota yang terencana,
            berkelanjutan, dan meningkatkan kualitas hidup masyarakat melalui
            perencanaan tata ruang yang komprehensif.
          </p>

          <div className="pt-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 rounded-full px-8"
            >
              Ajukan Permohonan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Image Grid Section - Like Greenleaf */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { color: "bg-primary", icon: "🌿" },
              { color: "bg-accent", icon: "🏗️" },
              { color: "bg-primary/80", icon: "🌍" },
              { color: "bg-accent/80", icon: "🏙️" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${item.color} rounded-2xl aspect-square flex items-center justify-center text-5xl md:text-6xl shadow-lg hover:shadow-xl transition-shadow`}
              >
                {item.icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Centered like Greenleaf */}
      <section id="tentang" className="bg-background py-24 md:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-sm font-medium text-primary">Tentang Kami</span>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
            Kami adalah tim profesional yang berkomitmen membangun kota
            berkelanjutan
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dinas Tata Ruang bertanggung jawab merencanakan, mengatur, dan
            mengawasi penggunaan ruang untuk menciptakan lingkungan yang
            teratur, aman, dan berkelanjutan bagi seluruh masyarakat.
          </p>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full bg-transparent"
          >
            Pelajari Lebih Lanjut
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Services Section - Horizontal cards */}
      <section id="layanan" className="bg-white py-24 md:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-sm font-medium text-primary">
              Layanan Kami
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Panduan Anda untuk Pembangunan Kota
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kami membantu mewujudkan visi pembangunan Anda dengan layanan tata
              ruang yang komprehensif dan profesional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 ">
            {[
              {
                title: "Perencanaan Tata Ruang",
                description:
                  "Perencanaan komprehensif untuk pengembangan wilayah yang terstruktur, berkelanjutan, dan sesuai dengan visi pembangunan kota jangka panjang.",
                icon: MapPin,
              },
              {
                title: "Izin Mendirikan Bangunan",
                description:
                  "Proses perizinan yang transparan, efisien, dan sesuai dengan standar teknis untuk memastikan setiap pembangunan memenuhi regulasi yang berlaku.",
                icon: Building2,
              },
              {
                title: "Konsultasi Teknis",
                description:
                  "Layanan konsultasi profesional dari tim ahli untuk proyek pembangunan dan pengembangan lahan dengan solusi yang inovatif.",
                icon: FileText,
              },
              {
                title: "Partisipasi Masyarakat",
                description:
                  "Program keterlibatan masyarakat yang aktif dalam proses perencanaan tata ruang untuk memastikan pembangunan sesuai kebutuhan lokal.",
                icon: Users,
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-[#F3F6F4] rounded-2xl p-8  hover:shadow-lg transition-shadow"
              >
                <service.icon className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-background py-24 md:py-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-sm font-medium text-primary">
              Mengapa Memilih Kami
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Keunggulan Layanan Kami
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Profesional Berpengalaman",
                description:
                  "Tim ahli dengan pengalaman puluhan tahun di bidang perencanaan tata ruang dan pembangunan kota.",
              },
              {
                title: "Proses Transparan",
                description:
                  "Sistem perizinan yang jelas, terukur, dan dapat dilacak secara real-time untuk kemudahan Anda.",
              },
              {
                title: "Berkelanjutan",
                description:
                  "Komitmen penuh terhadap pembangunan yang ramah lingkungan dan berkelanjutan untuk generasi mendatang.",
              },
            ].map((benefit, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-24 md:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Siap Memulai Proyek Anda?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
            Hubungi kami hari ini untuk konsultasi gratis dan pelajari bagaimana
            kami dapat membantu mewujudkan visi pembangunan Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full"
            >
              Hubungi Kami Sekarang
            </Button>
            <Button
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent border rounded-full"
            >
              Lihat Portofolio
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-foreground text-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold">Dinas Tata Ruang</span>
              </div>
              <p className="text-sm opacity-75 leading-relaxed">
                Membangun masa depan kota yang berkelanjutan dan sejahtera untuk
                semua
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <a href="#" className="hover:opacity-100 transition">
                    Perencanaan Tata Ruang
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition">
                    Izin Mendirikan Bangunan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition">
                    Konsultasi Teknis
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <a href="#" className="hover:opacity-100 transition">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition">
                    Berita
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-100 transition">
                    Karir
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>Telepon: (021) 1234-5678</li>
                <li>Email: info@dinastataruang.go.id</li>
                <li>Alamat: Jl. Pembangunan No. 1</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2025 Dinas Tata Ruang. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
