
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";

type Status =
  | "Data Diterima"
  | "Penjemputan / Pengantaran"
  | "Pengecekan & Penimbangan"
  | "Pembayaran"
  | "Selesai"
  | "Tidak Valid";

type Pengajuan = {
  id: number;
  nama: string;
  whatsapp: string;
  jumlah: string;
  jenis: string;
  alamat: string;
  status: Status;
  alasan?: string;
  penjelasanPenolakan?: string | null;
  volumeRiil?: string | null;
  namaPetugas?: string | null;
  hargaPerLiter?: string | null;
  totalPembayaran?: string | null;
};

const tahapan: Status[] = [
  "Data Diterima",
  "Penjemputan / Pengantaran",
  "Pengecekan & Penimbangan",
  "Pembayaran",
  "Selesai",
];

const keterangan: Record<Status, string> = {
  "Data Diterima": "Pengajuan kamu sudah diterima oleh MinyCycle.",
  "Penjemputan / Pengantaran":
    "Tim MinyCycle sedang mengatur proses penjemputan minyak jelantah.",
  "Pengecekan & Penimbangan":
    "Minyak jelantah sedang diperiksa dan ditimbang oleh petugas.",
  Pembayaran: "Proses pembayaran sedang dilakukan oleh petugas.",
  Selesai: "Proses penukaran minyak jelantah telah selesai.",
  "Tidak Valid":
    "Pengajuan tidak dapat diproses. Silakan perhatikan alasan penolakan.",
};

function formatRupiah(nilai: string | null | undefined) {
  if (!nilai) return "-";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(nilai));
}

export default function StatusPenukaranPage() {
  const router = useRouter();

  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [pesanError, setPesanError] = useState("");

  const [kategori, setKategori] = useState<"aktif" | "riwayat">("aktif");

  const [pengajuanTerpilih, setPengajuanTerpilih] =
    useState<Pengajuan | null>(null);

  useEffect(() => {
    async function ambilPengajuan() {
      try {
        const response = await fetch("/api/pengajuan", {
          method: "GET",
          cache: "no-store",
        });

        const hasil = await response.json();

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            hasil.message || "Gagal mengambil data pengajuan."
          );
        }

        setPengajuan(hasil.data);
      } catch (error) {
        console.error("Ambil pengajuan error:", error);
        setPesanError("Data pengajuan gagal dimuat. Silakan coba lagi.");
      } finally {
        setMemuat(false);
      }
    }

    ambilPengajuan();
  }, [router]);

  const pengajuanAktif = pengajuan.filter(
    (item) =>
      item.status !== "Selesai" &&
      item.status !== "Tidak Valid"
  );

  const riwayatPengajuan = pengajuan.filter(
    (item) =>
      item.status === "Selesai" ||
      item.status === "Tidak Valid"
  );

  const daftarTampil =
    kategori === "aktif" ? pengajuanAktif : riwayatPengajuan;

  const lihatProses = (item: Pengajuan) => {
    setPengajuanTerpilih(item);
  };

  const kembaliKeDaftar = () => {
    setPengajuanTerpilih(null);
  };

  const indeksStatus = pengajuanTerpilih
    ? tahapan.indexOf(pengajuanTerpilih.status)
    : -1;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F9F5] px-4 pb-16 pt-28">
        <div className="mx-auto max-w-6xl">
          {!pengajuanTerpilih ? (
            <>
              <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#6B956F]">
                    Layanan MinyCycle
                  </p>

                  <h1 className="text-3xl font-bold text-[#285B3E] md:text-4xl">
                    Status Penukaran
                  </h1>

                  <p className="mt-2 text-gray-600">
                    Pantau perkembangan pengajuan minyak jelantah kamu.
                  </p>
                </div>

                <Link
  href="/pengajuan"
  className="rounded-full bg-[#285B3E] px-6 py-3 text-center text-sm font-semibold !text-white transition hover:bg-[#1D4630]"
>
  + Buat Pengajuan Baru
</Link>
              </div>

              <div className="mb-6 flex gap-3 border-b border-gray-200">
                <button
                  onClick={() => setKategori("aktif")}
                  className={`border-b-2 px-5 py-3 text-sm font-semibold transition ${
                    kategori === "aktif"
                      ? "border-[#285B3E] text-[#285B3E]"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Pengajuan Aktif ({pengajuanAktif.length})
                </button>

                <button
                  onClick={() => setKategori("riwayat")}
                  className={`border-b-2 px-5 py-3 text-sm font-semibold transition ${
                    kategori === "riwayat"
                      ? "border-[#285B3E] text-[#285B3E]"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  Riwayat ({riwayatPengajuan.length})
                </button>
              </div>

              <div className="space-y-4">
                {memuat ? (
                  <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                    <p className="text-gray-500">
                      Memuat data pengajuan...
                    </p>
                  </div>
                ) : pesanError ? (
                  <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                    <p className="text-red-600">{pesanError}</p>

                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 rounded-full bg-[#285B3E] px-6 py-2 text-sm font-semibold text-white"
                    >
                      Coba Lagi
                    </button>
                  </div>
                ) : daftarTampil.length === 0 ? (
                  <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                    <h2 className="text-lg font-bold text-[#285B3E]">
                      Belum Ada Pengajuan
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {kategori === "aktif"
                        ? "Kamu belum memiliki pengajuan yang sedang diproses."
                        : "Riwayat penukaran kamu masih kosong."}
                    </p>

                    <Link
  href="/pengajuan"
  className="mt-5 inline-block rounded-full bg-[#285B3E] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[#1D4630]"
>
  Buat Pengajuan
</Link>
                  </div>
                ) : (
                  daftarTampil.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white p-5 shadow-sm md:p-6"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <p className="text-sm text-gray-500">
                            ID Pengajuan: #{item.id}
                          </p>

                          <h2 className="mt-1 text-lg font-bold text-[#285B3E]">
                            {item.jumlah} Liter Minyak Jelantah
                          </h2>

                          <p className="mt-1 text-sm text-gray-600">
                            Pilihan penukaran: {item.jenis}
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            {item.alamat}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                          <span
                            className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${
                              item.status === "Selesai"
                                ? "bg-green-100 text-green-700"
                                : item.status === "Tidak Valid"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status}
                          </span>

                          <button
                            onClick={() => lihatProses(item)}
                            className="rounded-full border border-[#285B3E] px-5 py-2 text-sm font-semibold text-[#285B3E] transition hover:bg-[#285B3E] hover:text-white"
                          >
                            Lihat Proses
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-3xl">
              <button
                onClick={kembaliKeDaftar}
                className="mb-6 text-sm font-semibold text-[#285B3E] hover:underline"
              >
                ← Kembali ke Daftar Pengajuan
              </button>

              <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#6B956F]">
                  Detail Pengajuan
                </p>

                <h1 className="mt-2 text-2xl font-bold text-[#285B3E]">
                  Proses Penukaran
                </h1>

                <div className="mt-6 grid gap-4 rounded-xl bg-[#F7F9F5] p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">Nama</p>
                    <p className="font-semibold text-gray-800">
                      {pengajuanTerpilih.nama}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Nomor WhatsApp
                    </p>
                    <p className="font-semibold text-gray-800">
                      {pengajuanTerpilih.whatsapp}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Jumlah Minyak Awal
                    </p>
                    <p className="font-semibold text-gray-800">
                      {pengajuanTerpilih.jumlah} Liter
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Pilihan Penukaran
                    </p>
                    <p className="font-semibold text-gray-800">
                      {pengajuanTerpilih.jenis}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500">
                      Alamat Penjemputan
                    </p>
                    <p className="font-semibold text-gray-800">
                      {pengajuanTerpilih.alamat}
                    </p>
                  </div>
                </div>

                <h2 className="mb-6 mt-8 text-lg font-bold text-[#285B3E]">
                  Tahapan Penukaran
                </h2>

                {pengajuanTerpilih.status === "Tidak Valid" ? (
                  <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    <p className="font-bold">
                      Pengajuan Tidak Valid
                    </p>
                    <p className="mt-2">
                      {pengajuanTerpilih.alasan || keterangan["Tidak Valid"]}
                    </p>
                    {pengajuanTerpilih.penjelasanPenolakan && (
                      <p className="mt-2">
                        {pengajuanTerpilih.penjelasanPenolakan}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {tahapan.map((tahap, index) => {
                      const selesai = indeksStatus >= index;

                      return (
                        <div key={tahap} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                                selesai
                                  ? "bg-[#285B3E] text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {selesai ? "✓" : index + 1}
                            </div>

                            {index !== tahapan.length - 1 && (
                              <div
                                className={`mt-2 h-12 w-0.5 ${
                                  indeksStatus > index
                                    ? "bg-[#285B3E]"
                                    : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>

                          <div className="pt-1">
                            <h3
                              className={`font-semibold ${
                                selesai
                                  ? "text-[#285B3E]"
                                  : "text-gray-400"
                              }`}
                            >
                              {tahap}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              {keterangan[tahap]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {pengajuanTerpilih.status === "Selesai" && (
                  <div className="mt-8 rounded-xl border border-[#DCE9DC] bg-[#F3F8F1] p-5">
                    <h2 className="text-lg font-bold text-[#285B3E]">
                      Detail Hasil Penukaran
                    </h2>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-600">
                          Volume hasil penimbangan
                        </span>
                        <strong className="text-gray-800">
                          {pengajuanTerpilih.volumeRiil ?? "-"} Liter
                        </strong>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-600">
                          Nama petugas
                        </span>
                        <strong className="text-gray-800">
                          {pengajuanTerpilih.namaPetugas || "-"}
                        </strong>
                      </div>

                      {pengajuanTerpilih.jenis === "Uang" && (
                        <>
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-600">
                              Harga per liter
                            </span>
                            <strong className="text-gray-800">
                              {formatRupiah(
                                pengajuanTerpilih.hargaPerLiter
                              )}
                            </strong>
                          </div>

                          <div className="border-t border-[#DCE9DC] pt-3">
                            <div className="flex justify-between gap-4">
                              <span className="font-semibold text-[#285B3E]">
                                Total pembayaran
                              </span>
                              <strong className="text-lg text-[#285B3E]">
                                {formatRupiah(
                                  pengajuanTerpilih.totalPembayaran
                                )}
                              </strong>
                            </div>
                          </div>
                        </>
                      )}

                      {pengajuanTerpilih.jenis === "Minyak goreng" && (
                        <p className="mt-3 rounded-lg bg-white p-3 text-gray-600">
                          Penukaran dilakukan dalam bentuk minyak goreng,
                          bukan pembayaran uang.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
