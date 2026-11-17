
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e2e8da] bg-white">
      <div className="container-page grid gap-8 py-8 sm:py-10 md:grid-cols-2 lg:grid-cols-3">
        {/* LOGO DAN DESKRIPSI */}
        <div>
          
<Link href="/" className="flex items-center gap-2">
  <span className="text-2xl text-green-700">♻</span>
  <span className="text-xl font-extrabold tracking-tight text-[#245B43]">
    Miny<span className="text-[#78C58A]">Cycle</span>
  </span>
</Link>


          <p className="mt-3 max-w-sm text-sm leading-6 text-[#536657]">
            Selamatkan lingkungan, ubah jelantah menjadi manfaat.
          </p>
        </div>

        {/* NAVIGASI */}
        <div>
          <h3 className="font-bold text-[#203b2d]">Jelajahi</h3>

          <div className="mt-3 flex flex-col items-start gap-3 text-sm text-[#536657]">
            <Link href="/" className="hover:text-[#285b3e]">
              Beranda
            </Link>

            <Link href="/edukasi" className="hover:text-[#285b3e]">
              Edukasi
            </Link>

            <Link href="/info-jualminyak" className="hover:text-[#285b3e]">
              Jual Minyak
            </Link>

            <Link href="/status-penukaran" className="hover:text-[#285b3e]">
              Status Penukaran
            </Link>
          </div>
        </div>

        {/* AJAKAN */}
        <div>
          <h3 className="font-bold text-[#203b2d]">
            Mari Jaga Lingkungan
          </h3>

          <p className="mt-3 text-sm leading-6 text-[#536657]">
            Setiap langkah kecil dalam mengelola minyak jelantah dapat
            membantu mengurangi pencemaran lingkungan.
          </p>
        </div>
      </div>

      {/* HAK CIPTA */}
      <div className="border-t border-[#e2e8da] px-4 py-4 text-center text-xs text-[#718071] sm:text-sm">
        © {new Date().getFullYear()} MinyCycle. Bersama menjaga lingkungan.
      </div>
    </footer>
  );
}
