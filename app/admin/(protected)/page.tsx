
import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatAngka(nilai: number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(nilai);
}

function formatRupiah(nilai: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

export default async function AdminPage() {
  const sekarang = new Date();

  const awalEnamBulan = new Date(
    sekarang.getFullYear(),
    sekarang.getMonth() - 5,
    1
  );

  const awalBulanBerikutnya = new Date(
    sekarang.getFullYear(),
    sekarang.getMonth() + 1,
    1
  );

  const [
    totalPengajuan,
    menungguReview,
    minyakTerkumpul,
    hargaAktif,
    pengajuanSelesai,
  ] = await Promise.all([
    prisma.pengajuan.count(),

    prisma.pengajuan.count({
      where: {
        status: "DATA_DITERIMA",
      },
    }),

    prisma.pengajuan.aggregate({
      where: {
        status: "SELESAI",
      },
      _sum: {
        jumlahLiter: true,
      },
    }),

    prisma.harga.findFirst({
      where: {
        tanggalBerlaku: {
          lte: sekarang,
        },
      },
      orderBy: [
        { tanggalBerlaku: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        hargaPerLiter: true,
      },
    }),

    prisma.pengajuan.findMany({
      where: {
        status: "SELESAI",
        updatedAt: {
          gte: awalEnamBulan,
          lt: awalBulanBerikutnya,
        },
      },
      select: {
        jumlahLiter: true,
        updatedAt: true,
      },
    }),
  ]);

  const totalLiter = Number(
    minyakTerkumpul._sum.jumlahLiter ?? 0
  );

  const hargaPerLiter = hargaAktif
    ? Number(hargaAktif.hargaPerLiter)
    : null;

  const laporan = Array.from({ length: 6 }, (_, index) => {
    const tanggal = new Date(
      sekarang.getFullYear(),
      sekarang.getMonth() - 5 + index,
      1
    );

    return {
      bulan: tanggal.toLocaleDateString("id-ID", {
        month: "short",
      }),
      tahun: tanggal.getFullYear(),
      nomorBulan: tanggal.getMonth(),
      jumlah: 0,
    };
  });

  pengajuanSelesai.forEach((item) => {
    const bulan = laporan.find(
      (data) =>
        data.tahun === item.updatedAt.getFullYear() &&
        data.nomorBulan === item.updatedAt.getMonth()
    );

    if (bulan) {
      bulan.jumlah += Number(item.jumlahLiter);
    }
  });

  const jumlahMaksimal = Math.max(
    ...laporan.map((item) => item.jumlah),
    1
  );

  const ringkasan = [
    {
      judul: "Total Pengajuan",
      nilai: formatAngka(totalPengajuan),
      keterangan: "Lihat semua data",
      warna:
        "border-t-[#38B66A] from-[#F0FFF4] to-white",
      aksen: "text-[#168348]",
      link: "/admin/pengajuan",
    },
    {
      judul: "Menunggu Review",
      nilai: formatAngka(menungguReview),
      keterangan: "Perlu review data",
      warna:
        "border-t-[#E9AA37] from-[#FFF9E9] to-white",
      aksen: "text-[#B77913]",
      link: "/admin/pengajuan",
    },
    {
      judul: "Minyak Terkumpul",
      nilai: `${formatAngka(totalLiter)} Liter`,
      keterangan: "Total minyak terkumpul",
      warna:
        "border-t-[#28B8A4] from-[#EDFFFC] to-white",
      aksen: "text-[#138D80]",
      link: "/admin/laporan-pelayanan",
    },
    {
      judul: "Harga Minyak Aktif",
      nilai:
        hargaPerLiter !== null
          ? formatRupiah(hargaPerLiter)
          : "Belum diatur",
      keterangan: "Harga per liter",
      warna:
        "border-t-[#8C79D8] from-[#F5F1FF] to-white",
      aksen: "text-[#6954B8]",
      link: "/admin/harga",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F2F8F3] text-[#203D2D]">
      <section className="mx-auto max-w-[1600px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10">
        {/* HEADER DASHBOARD */}
        <div className="relative mb-9 overflow-hidden rounded-3xl bg-gradient-to-r from-[#145B3A] via-[#19764A] to-[#27965D] p-7 text-white shadow-lg shadow-green-900/10 sm:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 right-48 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-sm font-bold tracking-[0.18em] text-green-100">
              ADMIN PANEL
            </p>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Dashboard MinyCycle
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-green-50 sm:text-base">
              Selamat datang! Pantau dan kelola aktivitas penukaran
              minyak jelantah melalui halaman ini.
            </p>

            <div className="mt-6 h-1.5 w-20 rounded-full bg-[#9BE7B0]" />
          </div>
        </div>

        {/* KARTU RINGKASAN */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ringkasan.map((item) => (
            <Link
              key={item.judul}
              href={item.link}
              className={`group relative overflow-hidden rounded-2xl border border-gray-100 border-t-4 bg-gradient-to-br ${item.warna} p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-white/60 transition duration-300 group-hover:scale-125" />

              <div className="relative z-10">
                <p className="text-sm font-semibold text-[#64776B]">
                  {item.judul}
                </p>

                <h2 className={`mt-7 text-3xl font-extrabold tracking-tight sm:text-4xl ${item.aksen}`}>
                  {item.nilai}
                </h2>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#607568]">
                    {item.keterangan}
                  </span>

                  <span className={`text-lg font-bold transition group-hover:translate-x-1 ${item.aksen}`}>
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* LAPORAN DIAGRAM BATANG */}
        <div className="mt-9 overflow-hidden rounded-3xl border border-[#E2EEE5] bg-white shadow-sm">
          <div className="border-b border-[#E5F0E7] bg-gradient-to-r from-[#E9F8ED] to-[#F5FBF6] px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#39915C]">
                  Statistik Pengumpulan
                </p>

                <h2 className="mt-2 text-xl font-extrabold text-[#214E35] sm:text-2xl">
                  Laporan Pengumpulan Minyak Jelantah
                </h2>

                <p className="mt-2 text-sm text-[#74877A]">
                  Jumlah minyak jelantah yang berhasil dikumpulkan
                  dalam enam bulan terakhir.
                </p>
              </div>

              <span className="rounded-full border border-[#CDE8D3] bg-white px-4 py-2 text-xs font-bold text-[#398454]">
                6 Bulan Terakhir
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex h-72 items-end gap-4 border-b border-l border-[#DDE9E0] bg-gradient-to-t from-[#F7FCF8] to-white px-3 pb-0 pt-5 sm:gap-8 sm:px-8">
              {laporan.map((item) => {
                const tinggi =
                  item.jumlah > 0
                    ? Math.max(
                        8,
                        (item.jumlah / jumlahMaksimal) * 100
                      )
                    : 0;

                return (
                  <div
                    key={`${item.tahun}-${item.nomorBulan}`}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  >
                    <span className="mb-2 text-center text-xs font-bold text-[#397A50]">
                      {formatAngka(item.jumlah)}
                    </span>

                    <div
                      className="w-full max-w-16 rounded-t-xl bg-gradient-to-t from-[#20834D] to-[#75C98B] shadow-sm transition-all duration-300 hover:from-[#145B3A] hover:to-[#43A96B]"
                      style={{ height: `${tinggi}%` }}
                    />

                    <span className="mt-3 text-xs font-semibold text-[#718477]">
                      {item.bulan}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#819187]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#38A765]" />
              Data berdasarkan waktu pembaruan pengajuan yang telah
              selesai (Liter).
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
