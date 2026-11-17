import Footer from "../components/foter";
import Link from "next/link";
import Navbar from "../components/Navbar";
const dampak = [
  {
    nomor: "01",
    judul: "Mencemari Sumber Air",
    deskripsi:
      "Minyak jelantah yang masuk ke saluran air dapat mengganggu kualitas air dan membahayakan kehidupan organisme.",
  },
  {
    nomor: "02",
    judul: "Merusak Kualitas Tanah",
    deskripsi:
      "Minyak yang meresap ke tanah dapat mengganggu sifat tanah dan memengaruhi lingkungan di sekitarnya.",
  },
  {
    nomor: "03",
    judul: "Mengganggu Ekosistem",
    deskripsi:
      "Pencemaran minyak dapat mengganggu keseimbangan ekosistem dan kehidupan makhluk hidup.",
  },
];

const langkah = [
  {
    nomor: "1",
    judul: "Dinginkan Minyak",
    deskripsi:
      "Tunggu hingga minyak bekas benar-benar dingin sebelum dipindahkan.",
    gambar: "/image/minyak-dingin.jpg",
  },
  {
    nomor: "2",
    judul: "Saring Jika Diperlukan",
    deskripsi:
      "Pisahkan sisa makanan agar minyak lebih mudah disimpan dan ditangani.",
    gambar: "/image/minyak-disaring.jpg",
  },
  {
    nomor: "3",
    judul: "Simpan dalam Wadah Tertutup",
    deskripsi:
      "Gunakan botol atau wadah yang kuat, bersih, dan tidak mudah bocor.",
    gambar: "/image/minyak-bekas.jpg",
  },
  {
    nomor: "4",
    judul: "Kumpulkan dan Salurkan",
    deskripsi:
      "Serahkan minyak jelantah ke tempat pengumpulan atau layanan penukaran yang tersedia.",
    gambar: "/image/2.jpg",
  },
];

const hasilOlahan = [
  {
    judul: "Sabun",
    deskripsi:
      "Minyak jelantah yang telah melalui proses pengolahan yang tepat dapat dimanfaatkan sebagai bahan baku sabun.",
    gambar: "/image/sabun.jpg",
  },
  {
    judul: "Lilin",
    deskripsi:
      "Minyak jelantah dapat dimanfaatkan dalam formulasi lilin tertentu melalui proses pengolahan yang sesuai.",
    gambar: "/image/lilin.jpg",
  },
  {
    judul: "Bahan Baku Industri",
    deskripsi:
      "Minyak jelantah dapat disalurkan kepada pengolah untuk dimanfaatkan sebagai bahan baku sesuai kebutuhan industri.",
    gambar: "/image/industri.jpg",
  },
];

export default function EdukasiPage() {
  return (

    <main className="overflow-hidden bg-[#fafbf6] text-[#203b2d]">
       <Navbar transparent />
     
{/* HERO EDUKASI */}
<section
  className="relative flex min-h-[480px] items-center bg-cover bg-center sm:min-h-[560px] lg:min-h-[620px]"
  style={{
    backgroundImage:
      "linear-gradient(90deg, rgba(10,55,39,0.88), rgba(10,55,39,0.35)), url('/image/hero2.png')",
  }}
>
  <div className="container-page py-16 sm:py-20">
    <div className="max-w-2xl text-white">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#dcebcf]">
        Edukasi Lingkungan MinyCycle
      </p>

      <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
        Kenali Jelantahmu,
        <br />
        Selamatkan Lingkunganmu!
      </h1>

      <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
        Pelajari bahaya minyak jelantah dan cara mengelolanya dengan benar.
        Bersama MinyCycle, ubah kebiasaan kecil menjadi langkah nyata untuk
        menjaga lingkungan.
      </p>

      <Link
        href="#cara-mengelola"
        className="mt-7 inline-flex items-center justify-center rounded-full bg-[#090a08] px-6 py-3 font-semibold text-[#245b43] transition hover:bg-white"
      >
        Pelajari Sekarang →
      </Link>
    </div>
  </div>
</section>


      {/* PENGERTIAN JELANTAH */}
      <section className="container-page grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#66845b] sm:text-sm">
            Kenali Lebih Dekat
          </p>

          <h2 className="text-2xl font-bold sm:text-3xl">
            Apa Itu Minyak Jelantah?
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#536657] sm:text-base">
            Minyak jelantah adalah minyak goreng bekas yang telah digunakan
            untuk mengolah makanan. Setelah digunakan berulang kali,
            kualitas minyak dapat menurun sehingga perlu dikelola dengan
            tepat.
          </p>

          <p className="mt-3 text-sm leading-7 text-[#536657] sm:text-base">
            Namun, minyak jelantah tidak harus berakhir menjadi limbah yang
            mencemari lingkungan. Jika dikumpulkan dan disalurkan melalui
            proses yang sesuai, minyak ini masih dapat dimanfaatkan untuk
            pengolahan lebih lanjut.
          </p>
        </div>

        <div
          role="img"
          aria-label="Ilustrasi minyak jelantah dalam wadah"
          className="min-h-[230px] rounded-2xl bg-cover bg-center sm:min-h-[320px]"
          style={{
            backgroundImage: "url('/image/minyak.jpg')",
          }}
        />
      </section>

      
{/* BAHAYA MINYAK JELANTAH */}
<section className="bg-[#edf4e8] py-20">
  <div className="container-page">
    <div className="mx-auto max-w-3xl text-center">
      <p className="font-bold uppercase tracking-[0.2em] text-green-700">
        Dampak bagi Lingkungan
      </p>

      <h2 className="mt-4 text-3xl font-extrabold text-green-950 sm:text-4xl">
        Bahaya Minyak Jelantah bagi Lingkungan
      </h2>

      <p className="mt-5 text-lg leading-8 text-gray-600">
        Membuang minyak jelantah sembarangan dapat menimbulkan berbagai
        masalah lingkungan. Kenali dampaknya agar kita lebih bijak
        dalam mengelolanya.
      </p>
    </div>

    <div className="mt-14 grid gap-7 md:grid-cols-3">
      {[
        {
          nomor: "01",
          judul: "Mencemari Sumber Air",
          deskripsi:
            "Minyak jelantah yang masuk ke saluran air dapat mengganggu kualitas air dan membahayakan kehidupan organisme.",
          gambar: "/image/saluran-tercemar.jpg",
        },
        {
          nomor: "02",
          judul: "Merusak Kualitas Tanah",
          deskripsi:
            "Minyak yang meresap ke tanah dapat mengganggu sifat tanah dan memengaruhi lingkungan di sekitarnya.",
          gambar: "/image/tanah-tercemar.jpg",
        },
        {
          nomor: "03",
          judul: "Mengganggu Ekosistem",
          deskripsi:
            "Pencemaran minyak dapat mengganggu keseimbangan ekosistem dan kehidupan makhluk hidup.",
          gambar: "/image/ekosistem-tercemar.jpg",
        },
      ].map((item) => (
        <article
          key={item.nomor}
          className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative h-56 overflow-hidden">
            <img
              src={item.gambar}
              alt={item.judul}
              className="h-full w-full object-cover transition duration-500 hover:scale-105"
            />
            <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white font-extrabold text-green-900 shadow">
              {item.nomor}
            </span>
          </div>

          <div className="p-7">
            <h3 className="text-xl font-bold text-green-950">
              {item.judul}
            </h3>
            <p className="mt-4 leading-7 text-gray-600">
              {item.deskripsi}
            </p>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>


      {/* CARA MENGELOLA */}
      <section
        id="cara-mengelola"
        className="container-page scroll-mt-24 py-12 sm:py-16"
      >
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#66845b] sm:text-sm">
            Langkah Sederhana
          </p>

          <h2 className="text-2xl font-bold sm:text-3xl">
            Cara Mengelola Minyak Jelantah
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#536657] sm:text-base">
            Kelola minyak jelantah dengan cara yang benar agar lebih aman
            disimpan dan tidak mencemari lingkungan.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {langkah.map((item) => (
            <article
              key={item.nomor}
              className="overflow-hidden rounded-2xl border border-[#e2e8da] bg-white"
            >
              <div className="relative">
                <div
                  role="img"
                  aria-label={item.judul}
                  className="h-40 bg-cover bg-center sm:h-44"
                  style={{
                    backgroundImage: `url('${item.gambar}')`,
                  }}
                />

                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[#285b3e] shadow">
                  {item.nomor}
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-bold">{item.judul}</h3>
                <p className="mt-2 text-sm leading-6 text-[#536657]">
                  {item.deskripsi}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-6 flex max-w-2xl items-start gap-4 rounded-2xl border border-[#e5d7bd] bg-[#fff8e9] p-5">
          <span className="text-2xl" aria-hidden="true">
            ⚠️
          </span>
          <div>
            <h3 className="font-bold">Jangan Membuang Jelantah Sembarangan!</h3>
            <p className="mt-2 text-sm leading-6 text-[#665640]">
              Hindari membuang minyak jelantah ke wastafel, selokan, sungai,
              atau tanah. Simpan dalam wadah tertutup dan salurkan ke tempat
              pengumpulan yang sesuai.
            </p>
          </div>
        </div>
      </section>

      {/* HASIL DAUR ULANG */}
      <section className="bg-[#f0f4e9] py-12 sm:py-16">
        <div className="container-page">
          <div className="mb-8 max-w-2xl sm:mb-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#66845b] sm:text-sm">
              Dari Limbah Menjadi Manfaat
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Jelantah Bisa Diolah Menjadi Apa?
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#536657] sm:text-base">
              Dengan proses pengolahan yang sesuai, minyak jelantah dapat
              menjadi bahan baku untuk berbagai produk yang bermanfaat.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hasilOlahan.map((item) => (
              <article
                key={item.judul}
                className="overflow-hidden rounded-2xl border border-[#e0e8d9] bg-white"
              >
                <div
                  role="img"
                  aria-label={item.judul}
                  className="h-44 bg-cover bg-center sm:h-52"
                  style={{
                    backgroundImage: `url('${item.gambar}')`,
                  }}
                />

                <div className="p-5">
                  <h3 className="text-lg font-bold">{item.judul}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#536657]">
                    {item.deskripsi}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AJAKAN */}
      <section className="container-page py-12 sm:py-16">
        <div
          className="rounded-2xl bg-cover bg-center px-5 py-10 text-center text-white sm:px-10 sm:py-14"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,57,39,0.9), rgba(15,57,39,0.84)), url('/image/banner-minycycle.png')",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dcebcf] sm:text-sm">
            Mulai dari Hal Kecil
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold sm:text-3xl">
            Perubahan Besar Berawal dari Kebiasaan Sederhana
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
            Mulai dari rumah sendiri. Kumpulkan minyak jelantah dan salurkan
            melalui MinyCycle untuk mendukung pengelolaan limbah yang lebih
            bertanggung jawab.
          </p>

          <Link
            href="/pengajuan"
           className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold !text-[#285b3e] transition hover:bg-[#edf3e6] sm:text-base"
          >
            Jual Minyak Jelantah Sekarang →
          </Link>
        </div>
      </section>

     <Footer />
    </main>
  );
}
