
"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";

type DataTransaksi = {
  id: number;
  pelanggan: string;
  email: string;
  jenisPenukaran: "UANG" | "MINYAK_GORENG";
  volume: number;
  harga: number;
  totalPembayaran: number;
  rasioJelantahPerLiter: number;
  jumlahMinyakGoreng: number;
  tanggal: string;
  petugas: string;
  alamatPenjemputan: string;
};

type Ringkasan = {
  totalTransaksi: number;
  totalVolume: number;
  totalPembayaran: number;
  totalPenukaranUang: number;
  totalPenukaranMinyakGoreng: number;
};

function formatRupiah(angka: number) {
  return "Rp " + angka.toLocaleString("id-ID");
}

function formatTanggal(tanggal: string) {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LaporanPelayanan() {
  const [dataTransaksi, setDataTransaksi] = useState<DataTransaksi[]>([]);

  const [ringkasan, setRingkasan] = useState<Ringkasan>({
    totalTransaksi: 0,
    totalVolume: 0,
    totalPembayaran: 0,
    totalPenukaranUang: 0,
    totalPenukaranMinyakGoreng: 0,
  });

  const [loading, setLoading] = useState(true);
  const [pesanError, setPesanError] = useState("");

  const ambilLaporan = useCallback(async () => {
    try {
      setLoading(true);
      setPesanError("");

      const response = await fetch("/api/admin/laporan-pelayanan", {
        cache: "no-store",
      });

      const hasil = await response.json();

      if (!response.ok) {
        throw new Error(
          hasil.message || "Gagal mengambil laporan pelayanan."
        );
      }

      setDataTransaksi(hasil.data || []);
      setRingkasan(
        hasil.ringkasan || {
          totalTransaksi: 0,
          totalVolume: 0,
          totalPembayaran: 0,
          totalPenukaranUang: 0,
          totalPenukaranMinyakGoreng: 0,
        }
      );
    } catch (error) {
      setPesanError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil laporan."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilLaporan();
  }, [ambilLaporan]);

  function exportCSV() {
    if (dataTransaksi.length === 0) {
      alert("Belum ada data transaksi untuk diekspor.");
      return;
    }

    const judulKolom = [
      "ID Transaksi",
      "Pelanggan",
      "Email",
      "Jenis Penukaran",
      "Volume Riil (Liter)",
      "Harga per Liter",
      "Total Pembayaran",
      "Rasio Penukaran",
      "Jumlah Minyak Goreng (Liter)",
      "Tanggal Selesai",
      "Petugas",
      "Alamat Penjemputan",
    ];

    const barisData = dataTransaksi.map((item) => [
      item.id,
      item.pelanggan,
      item.email,
      item.jenisPenukaran === "UANG"
        ? "Uang"
        : "Minyak Goreng",
      item.volume,
      item.harga,
      item.totalPembayaran,
      item.rasioJelantahPerLiter,
      item.jumlahMinyakGoreng,
      formatTanggal(item.tanggal),
      item.petugas,
      item.alamatPenjemputan,
    ]);

    const isiCSV = [judulKolom, ...barisData]
      .map((baris) =>
        baris
          .map((nilai) =>
            `"${String(nilai ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const file = new Blob(
      ["\uFEFF" + isiCSV],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "laporan-minycycle.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#F7F9F6]">
    

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* JUDUL DAN TOMBOL EXPORT */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-[#285B3E]">
            Laporan Pengumpulan &amp; Service Log Pelayanan
          </h1>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={ambilLaporan}
              disabled={loading}
              className="rounded-lg border border-[#285B3E] px-4 py-3 text-sm font-semibold text-[#285B3E] transition hover:bg-green-50 disabled:opacity-50"
            >
              {loading ? "Memuat..." : "Refresh Data"}
            </button>

            <button
              onClick={exportCSV}
              disabled={loading || dataTransaksi.length === 0}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#285B3E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4630] disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>

              Export Data (CSV)
            </button>
          </div>
        </div>

        {/* PESAN ERROR */}
        {pesanError && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {pesanError}
          </div>
        )}

        {/* RINGKASAN LAPORAN */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Transaksi Selesai
            </p>
            <p className="mt-2 text-2xl font-bold text-[#285B3E]">
              {ringkasan.totalTransaksi}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Minyak Terkumpul
            </p>
            <p className="mt-2 text-2xl font-bold text-[#285B3E]">
              {ringkasan.totalVolume.toLocaleString("id-ID")} Liter
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Pembayaran
            </p>
            <p className="mt-2 text-2xl font-bold text-[#285B3E]">
              {formatRupiah(ringkasan.totalPembayaran)}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Penukaran Minyak Goreng
            </p>
            <p className="mt-2 text-2xl font-bold text-[#285B3E]">
              {ringkasan.totalPenukaranMinyakGoreng} Transaksi
            </p>
          </div>
        </div>

        {/* TABEL LAPORAN */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-800">
              Riwayat Transaksi Selesai
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Data pengumpulan minyak jelantah yang telah diselesaikan.
            </p>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Memuat data laporan...
            </p>
          ) : dataTransaksi.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">
              Belum ada transaksi yang selesai.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
                <thead className="bg-[#E8EEE8] text-[#285B3E]">
                  <tr>
                    <th className="px-4 py-4">ID Transaksi</th>
                    <th className="px-4 py-4">Pelanggan</th>
                    <th className="px-4 py-4">Jenis Penukaran</th>
                    <th className="px-4 py-4">Volume Riil</th>
                    <th className="px-4 py-4">Harga/Liter</th>
                    <th className="px-4 py-4">Hasil Penukaran</th>
                    <th className="px-4 py-4">Tanggal Selesai</th>
                    <th className="px-4 py-4">Petugas</th>
                  </tr>
                </thead>

                <tbody>
                  {dataTransaksi.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 text-gray-700 transition hover:bg-gray-50"
                    >
                      <td className="px-4 py-5 font-semibold text-gray-800">
                        MC-{String(item.id).padStart(3, "0")}
                      </td>

                      <td className="px-4 py-5">
                        <p className="font-medium">{item.pelanggan}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.email}
                        </p>
                      </td>

                      <td className="px-4 py-5">
                        {item.jenisPenukaran === "UANG"
                          ? "Uang"
                          : "Minyak Goreng"}
                      </td>

                      <td className="px-4 py-5 whitespace-nowrap">
                        {item.volume} Liter
                      </td>

                      <td className="px-4 py-5 whitespace-nowrap">
                        {item.jenisPenukaran === "UANG"
                          ? formatRupiah(item.harga)
                          : "-"}
                      </td>

                      <td className="px-4 py-5 whitespace-nowrap font-semibold text-[#285B3E]">
                        {item.jenisPenukaran === "UANG"
                          ? formatRupiah(item.totalPembayaran)
                          : `${item.jumlahMinyakGoreng} Liter Minyak Goreng`}
                      </td>

                      <td className="px-4 py-5 whitespace-nowrap">
                        {formatTanggal(item.tanggal)}
                      </td>

                      <td className="px-4 py-5">
                        {item.petugas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-gray-200 px-5 py-4 text-sm text-gray-500">
            Menampilkan {dataTransaksi.length} transaksi selesai.
          </div>
        </section>
      </div>
    </main>
  );
}
