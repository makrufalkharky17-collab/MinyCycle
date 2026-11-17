
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/foter";
import InformasiHarga from "./InformasiHarga";

type NamaIkon =
  | "bottle"
  | "file"
  | "mail"
  | "truck"
  | "scale"
  | "wallet"
  | "home"
  | "money"
  | "leaf"
  | "phone"
  | "clock"
  | "sprout";

function Ikon({ nama }: { nama: NamaIkon }) {
  const properti = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (nama) {
    case "bottle":
      return (
        <svg {...properti}>
          <path d="M9 3h6" />
          <path d="M10 3v3l-2 2v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8l-2-2V3" />
          <path d="M8 10h8" />
        </svg>
      );

    case "file":
      return (
        <svg {...properti}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8M8 17h5" />
          <path d="m14 20 5-5 2 2-5 5-3 1Z" />
        </svg>
      );

    case "mail":
      return (
        <svg {...properti}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
          <path d="M3 17l5-4M21 17l-5-4" />
        </svg>
      );

    case "truck":
      return (
        <svg {...properti}>
          <path d="M3 7h11v11H3z" />
          <path d="M14 11h4l3 4v3h-7" />
          <circle cx="7.5" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M3 11h8M3 14h6" />
        </svg>
      );

    case "scale":
      return (
        <svg {...properti}>
          <path d="M12 3v3" />
          <path d="M5 6h14" />
          <path d="m5 6-4 7h8L5 6Z" />
          <path d="m19 6-4 7h8l-4-7Z" />
          <path d="M12 9v11" />
          <path d="M8 21h8" />
        </svg>
      );

    case "wallet":
      return (
        <svg {...properti}>
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M16 15h2" />
          <path d="M7 6V4h10v2" />
        </svg>
      );

    case "home":
      return (
        <svg {...properti}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v12h14V9" />
          <path d="M9 21v-7h6v7" />
        </svg>
      );

    case "money":
      return (
        <svg {...properti}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M6 9h.01M18 15h.01" />
        </svg>
      );

    case "leaf":
      return (
        <svg {...properti}>
          <path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-8 8-16Z" />
          <path d="M4 21c3-6 7-9 12-12" />
        </svg>
      );

    case "phone":
      return (
        <svg {...properti}>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.7L7.2 10a16 16 0 0 0 6.8 6.8l1.6-1.8a2 2 0 0 1 1.7-.6l3 .5a2 2 0 0 1 1.7 2Z" />
        </svg>
      );

    case "clock":
      return (
        <svg {...properti}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "sprout":
      return (
        <svg {...properti}>
          <path d="M12 22v-9" />
          <path d="M12 13C5 13 4 8 4 4c5 0 9 2 9 8" />
          <path d="M12 17c0-5 3-8 8-8 0 5-3 8-8 8Z" />
        </svg>
      );

    default:
      return null;
  }
}

const caraMenjual = [
  {
    nomor: "01",
    ikon: "bottle" as const,
    judul: "Siapkan Minyak Jelantah",
    deskripsi:
      "Dinginkan minyak jelantah terlebih dahulu, kemudian simpan dalam botol atau wadah tertutup yang tidak mudah bocor. Pastikan minyak tidak tercampur air atau sampah.",
  },
  {
    nomor: "02",
    ikon: "file" as const,
    judul: "Buat Pengajuan",
    deskripsi:
      "Klik tombol Ajukan Penjemputan, kemudian isi formulir yang tersedia. Masukkan nama lengkap, nomor WhatsApp, perkiraan jumlah minyak, pilihan penukaran, dan alamat penjemputan.",
  },
  {
    nomor: "03",
    ikon: "mail" as const,
    judul: "Kirim dan Tunggu Konfirmasi",
    deskripsi:
      "Periksa kembali data yang sudah diisi, lalu kirim pengajuan. Pengajuan akan diterima oleh MinyCycle dan kamu dapat memantau perkembangannya melalui halaman Status Penukaran.",
  },
  {
    nomor: "04",
    ikon: "truck" as const,
    judul: "Proses Penjemputan",
    deskripsi:
      "Setelah pengajuan dikonfirmasi, tim MinyCycle akan menghubungi kamu untuk mengatur jadwal penjemputan atau pengantaran minyak jelantah.",
  },
  {
    nomor: "05",
    ikon: "scale" as const,
    judul: "Pemeriksaan dan Penimbangan",
    deskripsi:
      "Petugas akan memeriksa kondisi minyak jelantah dan melakukan penimbangan untuk mengetahui jumlah minyak yang dapat diterima.",
  },
  {
    nomor: "06",
    ikon: "wallet" as const,
    judul: "Terima Hasil Penukaran",
    deskripsi:
      "Setelah pemeriksaan dan penimbangan selesai, kamu akan menerima pembayaran atau hasil penukaran sesuai pilihan dan ketentuan yang berlaku.",
  },
];

const keuntungan = [
  {
    ikon: "home" as const,
    judul: "Dijemput ke Rumah",
    deskripsi:
      "Tidak perlu repot membawa minyak jelantah ke tempat pengumpulan. Cukup ajukan penjemputan dari rumah.",
  },
  {
    ikon: "money" as const,
    judul: "Harga Lebih Jelas",
    deskripsi:
      "Informasi harga dapat dilihat sebelum mengajukan penukaran sehingga pengguna memiliki gambaran nilai minyaknya.",
  },
  {
    ikon: "scale" as const,
    judul: "Ditimbang Terlebih Dahulu",
    deskripsi:
      "Jumlah minyak diperiksa dan ditimbang sebelum pembayaran atau hasil penukaran ditentukan.",
  },
  {
    ikon: "leaf" as const,
    judul: "Lebih Peduli Lingkungan",
    deskripsi:
      "Minyak jelantah dikumpulkan untuk disalurkan ke proses pengelolaan yang sesuai, bukan dibuang sembarangan.",
  },
];

const persiapan = [
  "Dinginkan minyak sebelum dimasukkan ke wadah.",
  "Gunakan botol atau wadah tertutup yang tidak mudah bocor.",
  "Hindari mencampurkan minyak dengan air dan sampah lainnya.",
  "Pisahkan minyak dari sisa makanan atau kotoran.",
  "Pastikan perkiraan jumlah minyak sudah sesuai.",
  "Pastikan alamat dan nomor telepon yang dicantumkan benar.",
];

export default function JualMinyakPage() {
  return (
    <>
      <Navbar transparent />

      <main className="overflow-hidden">
        {/* HERO */}
        <section className="relative flex min-h-[600px] items-center bg-green-950">
          <img
            src="/image/hero3.jpg"
            alt="Pengumpulan minyak jelantah untuk didaur ulang"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-950/65 to-green-950/20" />

          <div className="container-page relative z-10 py-28">
            <div className="max-w-2xl text-white">
              <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium">
                Layanan Setor Minyak Jelantah
              </span>

              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Jelantahmu Punya Nilai,
                <span className="block text-lime-300">
                  Kami Jemput ke Rumah!
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
                Jangan biarkan minyak jelantah terbuang sia-sia.
                Setorkan minyak jelantah melalui MinyCycle, ajukan
                penjemputan, dan dapatkan hasil penukaran setelah
                minyak diperiksa dan ditimbang.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/pengajuan"
                  className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-7 py-4 font-bold text-green-950 transition hover:bg-lime-300"
                >
                  Ajukan Penjemputan →
                </Link>

                <Link
                  href="#cara-menjual"
                  className="inline-flex items-center rounded-full border border-white/60 px-7 py-4 font-bold text-white transition hover:bg-white/10"
                >
                  Pelajari Caranya
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
                <span>✓ Dijemput ke rumah</span>
                <span>✓ Ditimbang terlebih dahulu</span>
              </div>
            </div>
          </div>
        </section>

        {/* CARA MENYETORKAN */}
        <section
          id="cara-menjual"
          className="container-page scroll-mt-24 py-16 md:py-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
              Mudah dan Praktis
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-green-950 sm:text-4xl">
              Cara Menyetorkan Minyak Jelantah
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Ikuti enam langkah berikut untuk menyetorkan minyak
              jelantah melalui layanan MinyCycle, mulai dari
              mempersiapkan minyak hingga menerima hasil penukaran.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caraMenjual.map((item) => (
              <article
                key={item.nomor}
                className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-800 hover:shadow-[0_12px_30px_rgba(40,91,62,0.16)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-800">
                    <Ikon nama={item.ikon} />
                  </span>

                  <span className="text-2xl font-extrabold text-green-800">
                    {item.nomor}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-green-950">
                  {item.judul}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {item.deskripsi}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-green-900 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h3 className="text-xl font-bold text-white">
                Siap menyetorkan minyak jelantahmu?
              </h3>

              <p className="mt-2 leading-7 text-white/75">
                Isi formulir pengajuan untuk memulai proses penjemputan
                minyak jelantah.
              </p>
            </div>

            <Link
              href="/pengajuan"
              className="shrink-0 rounded-full bg-lime-400 px-6 py-3 font-bold text-green-950 transition hover:bg-lime-300"
            >
              Ajukan Penjemputan →
            </Link>
          </div>

          <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-6 sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-green-950">
                Sudah pernah membuat pengajuan?
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-600">
                Lihat perkembangan proses penjemputan dan riwayat
                penukaran minyak jelantahmu.
              </p>
            </div>

            <Link
              href="/status-penukaran"
              className="mt-4 inline-flex shrink-0 font-bold text-green-800 transition hover:text-green-600 sm:mt-0"
            >
              Lihat Status Penukaran →
            </Link>
          </div>
        </section>

        {/* INFORMASI HARGA */}
        <section className="bg-green-50 py-16 md:py-24">
          <div className="container-page grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                Transparan dan Jelas
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-green-950 sm:text-4xl">
                Informasi Harga dan Penukaran
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Ketahui informasi harga dan pilihan penukaran sebelum
                mengajukan pengumpulan minyak jelantah. MinyCycle
                menyediakan pilihan penukaran berupa uang maupun
                minyak goreng.
              </p>

              <p className="mt-4 leading-8 text-gray-600">
                Harga pembelian dan rasio penukaran ditetapkan oleh
                admin MinyCycle. Informasi akan diperbarui secara
                otomatis ketika admin melakukan perubahan.
              </p>

              <div className="mt-6 rounded-xl border-l-4 border-green-600 bg-white p-4">
                <p className="text-sm leading-7 text-green-900">
                  <strong>Perlu diketahui:</strong> jumlah akhir
                  pembayaran atau minyak goreng yang diterima
                  dihitung berdasarkan hasil pemeriksaan dan
                  penimbangan oleh petugas.
                </p>
              </div>
            </div>

            <InformasiHarga />
          </div>
        </section>

        {/* PERSIAPAN MINYAK */}
        <section className="container-page py-16 md:py-24">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                Sebelum Dijemput
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-green-950 sm:text-4xl">
                Persiapkan Minyak Jelantahmu
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Persiapan yang baik membantu proses penjemputan,
                pemeriksaan, dan penimbangan berjalan lebih mudah.
              </p>
            </div>

            <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
              <ul className="space-y-5">
                {persiapan.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                      ✓
                    </span>

                    <span className="leading-7 text-gray-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/edukasi"
                className="mt-7 inline-flex font-bold text-green-800 transition hover:text-green-600"
              >
                Pelajari pengelolaan jelantah →
              </Link>
            </div>
          </div>
        </section>

        {/* KENAPA MINYCYCLE */}
        <section className="bg-gradient-to-b from-white to-green-50 py-16 md:py-24">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                Pilihan yang Lebih Mudah
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-green-950 sm:text-4xl">
                Kenapa Harus Setor ke MinyCycle?
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Kami ingin membantu masyarakat mengelola minyak
                jelantah dengan cara yang praktis, jelas, dan lebih
                bertanggung jawab terhadap lingkungan.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {keuntungan.map((item) => (
                <article
                  key={item.judul}
                  className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-green-800">
                    <Ikon nama={item.ikon} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-green-950">
                    {item.judul}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {item.deskripsi}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* INFORMASI DAN BANTUAN */}
        <section className="container-page py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                Kami Siap Membantu
              </span>

              <h2 className="mt-3 text-3xl font-extrabold text-green-950 sm:text-4xl">
                Butuh Bantuan?
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Punya pertanyaan mengenai harga, pengajuan penukaran,
                penjemputan, atau pembayaran? Hubungi tim MinyCycle
                melalui informasi kontak resmi yang nantinya tersedia
                di sini.
              </p>

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
                Informasi kontak di bawah masih berupa contoh
                tampilan. Ganti dengan email dan nomor telepon resmi
                sebelum website dipublikasikan.
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex h-9 w-9 items-center text-green-800">
                  <Ikon nama="mail" />
                </div>

                <h3 className="mt-4 font-bold text-green-950">
                  Email
                </h3>

                <p className="mt-2 break-words text-sm text-gray-600">
                  MinyCycle@gmail.com
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Untuk pertanyaan dan informasi layanan.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex h-9 w-9 items-center text-green-800">
                  <Ikon nama="phone" />
                </div>

                <h3 className="mt-4 font-bold text-green-950">
                  Telepon / WhatsApp
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  0881 8881 0987
                </p>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Untuk menanyakan pengajuan dan jadwal penjemputan.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
                    <Ikon nama="clock" />
                  </div>

                  <div>
                    <h3 className="font-bold text-green-950">
                      Informasi Penjemputan
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      Jadwal penjemputan akan dikonfirmasi setelah
                      pengajuan diterima. Pastikan nomor telepon dan
                      alamat kamu benar agar tim dapat menghubungi
                      dengan mudah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA AKHIR */}
        <section className="container-page pb-16 md:pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-green-900 px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-green-700/50" />
            <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-lime-400/10" />

            <div className="relative mx-auto max-w-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lime-300">
                <Ikon nama="sprout" />
              </div>

              <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                Saatnya Jelantahmu Lebih Bermanfaat
              </h2>

              <p className="mt-5 leading-8 text-white/80">
                Mulai dari rumah, kumpulkan minyak jelantahmu, dan
                ajukan penjemputan melalui MinyCycle. Bersama, kita
                bisa mengambil langkah kecil untuk lingkungan yang
                lebih baik.
              </p>

              <Link
                href="/pengajuan"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime-400 px-7 py-4 font-bold text-green-950 transition hover:bg-lime-300"
              >
                Ajukan Penjemputan
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
