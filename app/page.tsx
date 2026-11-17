import Footer from "./components/foter";
import Link from "next/link";
import Navbar from "./components/Navbar";
import InfoHargaBeranda from "./components/InfoHargaBeranda";

const steps = [
  {
    number: "01",
    title: "Kumpulkan Jelantah",
    description:
      "Setelah digunakan, dinginkan minyak jelantah lalu simpan dalam wadah tertutup.",
  },
  {
    number: "02",
    title: "Isi Formulir Penjualan",
    description:
      "Lengkapi formulir di website dengan informasi jumlah minyak dan lokasi kamu.",
  },
  {
    number: "03",
    title: "Konfirmasi Penyerahan",
    description:
      "Tim kami akan menghubungimu untuk mengonfirmasi jadwal penyerahan.",
  },
  {
    number: "04",
    title: "Terima Pembayaran",
    description:
      "Setelah minyak diperiksa dan ditimbang, pembayaran dilakukan sesuai ketentuan.",
  },
];

const impacts = [
  {
    number: "01",
    title: "Mencemari Sumber Air",
    description:
      "Minyak yang masuk ke saluran air dapat mengganggu kualitas air dan kehidupan organisme.",
  },
  {
    number: "02",
    title: "Merusak Kualitas Tanah",
    description:
      "Pembuangan minyak sembarangan dapat memengaruhi kondisi tanah dan pertumbuhan tanaman.",
  },
  {
    number: "03",
    title: "Mengganggu Ekosistem",
    description:
      "Pencemaran minyak dapat mengganggu keseimbangan ekosistem dan kehidupan makhluk hidup.",
  },
];

const services = [
  {
    title: "Edukasi",
    description:
      "Pelajari bahaya minyak jelantah dan cara pengelolaan yang benar.",
    href: "/edukasi",
    button: "Selengkapnya",
    image: "/image/hero-minycycle.png",
    position: "left",
  },
  {
    title: "Ajukan Penukaran",
    description:
      "Jual minyak jelantah dengan mudah melalui formulir pengajuan.",
    href: "/pengajuan",
    button: "Selengkapnya",
    image: "/image/hero-minycycle.png",
    position: "center",
  },
  {
    title: "Status Penukaran",
    description:
      "Lihat perkembangan pengajuan penukaran minyak jelantah kamu.",
    href: "/status-penukaran",
    button: "Selengkapnya",
    image: "/image/hero-minycycle.png",
    position: "right",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#fbfcf7]">
      {/* HERO */}
      <section className="relative isolate min-h-[570px] md:min-h-[640px]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage: "url('/image/hero.png')",
          }}
        />

        {/* OVERLAY GELAP */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071f16]/85 via-[#0b2d1e]/65 to-[#071f16]/25" />

        <Navbar transparent />

        <div className="container-page flex min-h-[570px] items-center pb-12 pt-28 md:min-h-[640px]">
          <div className="max-w-[500px]">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-lime-300">
              Langkah Kecil untuk Bumi
            </p>

            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-[58px]">
              Jangan Buang Jelantahmu,
              <span className="mt-1 block text-lime-400">
                Ubah Jadi Manfaat untuk Bumi!
              </span>
            </h1>

            <p className="mt-5 max-w-[420px] text-sm leading-6 text-white/90 sm:text-base">
              Minyak jelantah bukan sekadar limbah, tetapi peluang untuk
              menciptakan lingkungan yang lebih bersih dan masa depan yang
              lebih baik.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/pengajuan"
                className="inline-flex items-center gap-2 rounded-full bg-green-800 px-7 py-4 font-semibold !text-white transition hover:bg-green-700"
              >
                Jual Minyak Jelantah <span>→</span>
              </Link>

              <Link
  href="/edukasi"
  className="inline-flex items-center rounded-full border border-white/80 bg-white/20 px-5 py-3 text-sm font-bold !text-white shadow-md transition hover:bg-white/30"
>
  Pelajari Dampaknya
</Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-[#fbfcf7] to-transparent" />
      </section>

      {/* CARA KERJA MINYCYCLE */}
      <section id="cara-kerja" className="bg-[#fafbf6] py-16 md:py-20">
        <div className="container-page">
          {/* JUDUL DAN DESKRIPSI */}
          <div className="mb-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
              Cara Kerja MinyCycle
            </p>

            <h2 className="text-3xl font-extrabold text-green-950 md:text-4xl">
              4 Langkah Mudah Menukar Minyak Jelantah
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-green-900/70">
              Ikuti empat langkah sederhana untuk mengelola minyak jelantah
              dengan lebih bertanggung jawab.
            </p>
          </div>

          {/* EMPAT KOTAK LANGKAH */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* LANGKAH 1 */}
            <div className="rounded-2xl border border-green-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-7 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-100 font-bold text-green-900">
                  01
                </span>

                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-800"
                  >
                    <path d="M9 3h6" />
                    <path d="M10 3v3l-3 3v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9l-3-3V3" />
                    <path d="M7 10h10" />
                  </svg>
                </span>
              </div>

              <h3 className="mb-3 text-lg font-bold text-green-950">
                Kumpulkan Jelantah
              </h3>

              <p className="text-sm leading-7 text-green-900/70">
                Setelah digunakan, dinginkan minyak jelantah lalu simpan dalam
                wadah tertutup.
              </p>
            </div>

            {/* LANGKAH 2 */}
            <div className="rounded-2xl border border-green-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-7 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-100 font-bold text-green-900">
                  02
                </span>

                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8M8 17h8" />
                  </svg>
                </span>
              </div>

              <h3 className="mb-3 text-lg font-bold text-green-950">
                Isi Formulir Penjualan
              </h3>

              <p className="text-sm leading-7 text-green-900/70">
                Lengkapi formulir di website dengan informasi jumlah minyak
                dan lokasi kamu.
              </p>
            </div>

            {/* LANGKAH 3 */}
            <div className="rounded-2xl border border-green-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-7 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-100 font-bold text-green-900">
                  03
                </span>

                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m11 17 2 2 4-4" />
                    <path d="M12 12H9a4 4 0 0 0-4 4v3" />
                    <path d="M7 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
                    <path d="m14 11 2-2 3 3" />
                  </svg>
                </span>
              </div>

              <h3 className="mb-3 text-lg font-bold text-green-950">
                Konfirmasi Penyerahan
              </h3>

              <p className="text-sm leading-7 text-green-900/70">
                Tim kami akan menghubungimu untuk mengonfirmasi jadwal
                penyerahan.
              </p>
            </div>

            {/* LANGKAH 4 */}
            <div className="rounded-2xl border border-green-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-7 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-100 font-bold text-green-900">
                  04
                </span>

                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7.5 4.2 9 2l1.5 2.2" />
                    <path d="M9 2v5H4" />
                    <path d="M16.5 19.8 15 22l-1.5-2.2" />
                    <path d="M15 22v-5h5" />
                    <path d="M4 7a8 8 0 0 1 13.5-2" />
                    <path d="M20 17a8 8 0 0 1-13.5 2" />
                  </svg>
                </span>
              </div>

              <h3 className="mb-3 text-lg font-bold text-green-950">
                Minyak Siap Didaur Ulang
              </h3>

              <p className="text-sm leading-7 text-green-900/70">
                Minyak ditimbang dan kompensasi diberikan sesuai ketentuan.
              </p>
            </div>
          </div>
        </div>
      </section>

{/* INFORMASI HARGA */}
<InfoHargaBeranda />

      {/* SLOGAN */}
      <section className="bg-[#edf3e6] py-10 md:py-14">
        <div className="container-page grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-800">
              Setiap Liter Berarti
            </p>

            <h2 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight text-green-950 sm:text-4xl">
              Kecil di Tanganmu,
              <br />
              Besar untuk Bumi.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-green-950/75">
              Setiap minyak jelantah yang dikumpulkan dengan benar adalah
              bagian dari upaya mengurangi pencemaran dan menjaga lingkungan.
            </p>
          </div>

          <div
            role="img"
            aria-label="Minyak jelantah yang siap dikumpulkan"
            className="min-h-[220px] rounded-2xl bg-cover bg-center md:min-h-[260px]"
            style={{
              backgroundImage: "url('/image/1.jpg')",
            }}
          />
        </div>
      </section>

      {/* DAMPAK LINGKUNGAN */}
      <section className="bg-[#fafbf6] py-10 md:py-14">
        <div className="container-page grid items-center gap-7 lg:grid-cols-[0.9fr_1.5fr]">
          <div
            role="img"
            aria-label="Ilustrasi lingkungan yang tercemar"
            className="min-h-[260px] rounded-2xl bg-cover bg-center md:min-h-[300px]"
            style={{
              backgroundImage: "url('/image/gambar-tercemar.png')",
            }}
          />

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-800">
              Kenali Dampaknya
            </p>

            <h2 className="mt-2 max-w-xl text-2xl font-extrabold leading-tight text-green-950 sm:text-3xl">
              Mengapa Jelantah Tidak Boleh Dibuang Sembarangan?
            </h2>

            <p className="mt-3 text-sm leading-6 text-green-950/70">
              Minyak jelantah yang dibuang ke tanah atau saluran air dapat
              menimbulkan pencemaran. Karena itu, minyak bekas perlu
              dikumpulkan dan disalurkan melalui pengelolaan yang tepat.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
              {impacts.map((impact, index) => (
                <div
                  key={impact.number}
                  className={`${
                    index > 0
                      ? "sm:border-l sm:border-green-900/20 sm:pl-4"
                      : ""
                  }`}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-800">
  {index === 0 && (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.5S5 10 5 14a7 7 0 0 0 14 0c0-4-7-11.5-7-11.5Z" />
    </svg>
  )}

  {index === 1 && (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22v-9" />
      <path d="M12 13C5 13 4 8 4 4c5 0 9 2 9 8" />
      <path d="M12 17c0-5 3-8 8-8 0 5-3 8-8 8Z" />
    </svg>
  )}

  {index === 2 && (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12c3-5 9-7 15-4l3 4-3 4c-6 3-12 1-15-4Z" />
      <path d="M3 12H1" />
      <circle cx="16" cy="10" r="1" />
      <path d="M8 8 6 5M8 16l-2 3" />
    </svg>
  )}
</div>

                  <h3 className="text-sm font-bold text-green-950">
                    {impact.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-green-950/70">
                    {impact.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LAYANAN KAMI */}
      <section className="bg-[#fafbf6] py-10 md:py-14">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-800">
            Layanan Kami
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-green-950 sm:text-3xl">
            Mulai Langkahmu Bersama MinyCycle
          </h2>

          <p className="mt-3 text-sm leading-6 text-green-950/70">
            Pelajari, ajukan penukaran, dan pantau pengajuanmu dari satu tempat.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="overflow-hidden rounded-2xl border border-green-900/10 bg-white transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="grid h-full grid-cols-1 sm:grid-cols-[42%_58%] md:grid-cols-1 lg:grid-cols-[42%_58%]">
                  <div
                    role="img"
                    aria-label={service.title}
                    className="min-h-[160px] bg-cover bg-center sm:min-h-full md:min-h-[170px] lg:min-h-full"
                    style={{
                      backgroundImage: `url('${
                        index === 0
                          ? "/image/foto tumbuhan.jpg"
                          : index === 1
                            ? "/image/2.jpg"
                            : "/image/3.jpg"
                      }')`,
                      backgroundPosition: "center",
                    }}
                  />

                  <div className="p-4">
                    <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f2d9] text-sm font-bold text-green-900">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="text-base font-bold text-green-950">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-green-950/65">
                      {service.description}
                    </p>

                    <Link
                      href={service.href}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-green-800 transition hover:text-green-600"
                    >
                      {service.button} <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MISI KAMI */}
      <section className="bg-[#fafbf6] py-3">
        <div className="container-page">
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-[#eaf1e3] px-5 py-7 text-center sm:px-10 md:flex-row md:gap-10">
            <span className="text-4xl text-green-700" aria-hidden="true">
              ❧
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-800">
                Misi Kami
              </p>

              <h2 className="mt-2 text-lg font-bold leading-relaxed text-green-950 sm:text-xl">
                “Bersama kita kurangi kerusakan alam
                <br className="hidden sm:block" /> dari langkah kecil di rumah tangga.”
              </h2>
            </div>

            <span
              className="rotate-180 text-4xl text-green-700"
              aria-hidden="true"
            >
              ❧
            </span>
          </div>
        </div>
      </section>

      {/* AJAKAN */}
      <section className="bg-[#fafbf6] py-4 pb-10 md:pb-14">
        <div className="container-page">
          <div
            className="rounded-2xl bg-cover bg-center px-6 py-8 sm:px-10 md:py-10"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(10,55,39,0.92), rgba(10,55,39,0.65)), url('/image/hero-minycycle.png')",
            }}
          >
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">
                  Ayo Beraksi Sekarang
                </p>

                <h2 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                  Mulai dari Rumah, untuk Masa Depan yang Lebih Baik.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">
                  Jangan tunggu nanti untuk peduli. Kumpulkan minyak
                  jelantahmu dan salurkan melalui proses yang lebih
                  bertanggung jawab.
                </p>
              </div>

              <Link
               href="/pengajuan"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-lime-300 px-6 py-3.5 text-sm font-bold !text-green-950 transition hover:bg-lime-200"
              >
                Jual Minyak Jelantah <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}