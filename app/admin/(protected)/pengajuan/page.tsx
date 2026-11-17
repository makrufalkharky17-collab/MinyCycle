
"use client";

import { useCallback, useEffect, useState } from "react";

type StatusDatabase =
  | "DATA_DITERIMA"
  | "PENJEMPUTAN"
  | "PENGECEKAN"
  | "PEMBAYARAN"
  | "SELESAI"
  | "TIDAK_VALID";

type Pengajuan = {
  id: number;
  createdAt: string;
  jumlahLiter: string | number;
  jenisPenukaran: "UANG" | "MINYAK_GORENG";
  alamatPenjemputan: string;
  status: StatusDatabase;
  volumeRiil: string | number | null;
  namaPetugas: string | null;
  hargaPerLiter: string | number | null;
  totalPembayaran: string | number | null;
  rasioJelantahPerLiter?: string | number | null;
  hasilHitungMinyakGoreng?: string | number | null;
  jumlahMinyakGoreng?: string | number | null;
  alasanPenolakan: string | null;
  penjelasanPenolakan: string | null;
  user: {
    id: number;
    nama: string;
    email: string;
    noWhatsapp: string;
    alamat: string;
  };
};

type PopupJenis = "review" | "penolakan" | "transaksi" | null;

const pilihanAlasan = [
  "Lokasi di luar jangkauan operasional",
  "Data alamat tidak lengkap",
  "Nomor WhatsApp tidak aktif",
  "Minyak tidak memenuhi ketentuan",
  "Pengajuan tidak sesuai ketentuan",
  "Lainnya",
];

const daftarFilter = [
  "Semua Status",
  "Menunggu Review",
  "Penjemputan",
  "Selesai",
  "Ditolak",
];

function formatRupiah(angka: number) {
  return "Rp " + angka.toLocaleString("id-ID");
}

function formatTanggal(tanggal: string) {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLiter(angka: number) {
  return angka.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function namaStatus(status: StatusDatabase) {
  switch (status) {
    case "DATA_DITERIMA":
      return "Menunggu Review";
    case "PENJEMPUTAN":
    case "PENGECEKAN":
    case "PEMBAYARAN":
      return "Penjemputan";
    case "SELESAI":
      return "Selesai";
    case "TIDAK_VALID":
      return "Ditolak";
    default:
      return status;
  }
}

function warnaStatus(status: string) {
  switch (status) {
    case "Menunggu Review":
      return "border border-amber-200 bg-amber-50 text-amber-700";
    case "Penjemputan":
      return "border border-sky-200 bg-sky-50 text-sky-700";
    case "Selesai":
      return "border border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Ditolak":
      return "border border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border border-gray-200 bg-gray-50 text-gray-700";
  }
}

const inputClass =
  "w-full rounded-xl border border-[#DCE9DF] bg-white px-4 py-3 text-sm text-[#294B36] outline-none transition placeholder:text-gray-400 focus:border-[#39A66B] focus:ring-4 focus:ring-green-100";

const labelClass =
  "mb-2 block text-sm font-bold text-[#365B43]";

const buttonPrimary =
  "rounded-xl bg-gradient-to-r from-[#176B45] to-[#27965D] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondary =
  "rounded-xl border border-[#DCE9DF] bg-white px-5 py-3 text-sm font-bold text-[#45644F] transition hover:bg-[#F0F8F1]";

export default function PengajuanAdmin() {
  const [daftarPengajuan, setDaftarPengajuan] = useState<Pengajuan[]>([]);

  const [hargaPerLiter, setHargaPerLiter] = useState<number | null>(null);
  const [rasioJelantahPerLiter, setRasioJelantahPerLiter] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [pesanError, setPesanError] = useState("");

  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [pencarian, setPencarian] = useState("");

  const [pengajuanTerpilih, setPengajuanTerpilih] =
    useState<Pengajuan | null>(null);

  const [popup, setPopup] = useState<PopupJenis>(null);

  const [alasanPenolakan, setAlasanPenolakan] = useState(
    pilihanAlasan[0]
  );

  const [penjelasanPenolakan, setPenjelasanPenolakan] = useState("");

  const [volumeRiil, setVolumeRiil] = useState("");
  const [namaPetugas, setNamaPetugas] = useState("");
  const [pesanAksi, setPesanAksi] = useState("");

  // Perhitungan transaksi Uang
  const totalPembayaran =
    Number(volumeRiil) > 0 && hargaPerLiter !== null
      ? Number(volumeRiil) * hargaPerLiter
      : 0;

  // Perhitungan transaksi Minyak Goreng
  const hasilHitungMinyakGoreng =
    Number(volumeRiil) > 0 &&
    rasioJelantahPerLiter !== null &&
    rasioJelantahPerLiter > 0
      ? Number(volumeRiil) / rasioJelantahPerLiter
      : 0;

  const jumlahMinyakGoreng =
    Math.floor(hasilHitungMinyakGoreng * 2) / 2;

  // Mengambil data pengajuan dari database
  const ambilData = useCallback(async () => {
    try {
      setLoading(true);
      setPesanError("");

      const response = await fetch("/api/admin/pengajuan", {
        cache: "no-store",
      });

      const hasil = await response.json();

      if (!response.ok) {
        throw new Error(
          hasil.message || "Gagal mengambil data pengajuan."
        );
      }

      setDaftarPengajuan(hasil.data || []);

      setHargaPerLiter(
        hasil.hargaPerLiter === null
          ? null
          : Number(hasil.hargaPerLiter)
      );

      setRasioJelantahPerLiter(
        hasil.rasioJelantahPerLiter === null ||
          hasil.rasioJelantahPerLiter === undefined
          ? null
          : Number(hasil.rasioJelantahPerLiter)
      );
    } catch (error) {
      setPesanError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilData();
  }, [ambilData]);

  // Filter dan pencarian pengajuan
  const dataTampil = daftarPengajuan.filter((item) => {
    const status = namaStatus(item.status);

    const cocokStatus =
      filterStatus === "Semua Status" || status === filterStatus;

    const kataKunci = pencarian.toLowerCase();

    const cocokPencarian =
      item.user.nama.toLowerCase().includes(kataKunci) ||
      item.user.noWhatsapp.toLowerCase().includes(kataKunci) ||
      item.alamatPenjemputan.toLowerCase().includes(kataKunci);

    return cocokStatus && cocokPencarian;
  });

  function bukaPopup(jenis: PopupJenis, item: Pengajuan) {
    setPengajuanTerpilih(item);
    setPopup(jenis);
    setPesanAksi("");

    setAlasanPenolakan(
      item.alasanPenolakan || pilihanAlasan[0]
    );

    setPenjelasanPenolakan(item.penjelasanPenolakan || "");
    setVolumeRiil(item.volumeRiil?.toString() || "");
    setNamaPetugas(item.namaPetugas || "");
  }

  function tutupPopup() {
    setPopup(null);
    setPengajuanTerpilih(null);
    setPenjelasanPenolakan("");
    setVolumeRiil("");
    setNamaPetugas("");
    setPesanAksi("");
  }

  // Mengirim aksi ke API
  async function kirimAksi(body: Record<string, unknown>) {
    if (!pengajuanTerpilih) return;

    try {
      setSedangMemproses(true);
      setPesanAksi("");

      const response = await fetch(
        `/api/admin/pengajuan/${pengajuanTerpilih.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const hasil = await response.json();

      if (!response.ok) {
        throw new Error(
          hasil.message || "Gagal memperbarui pengajuan."
        );
      }

      tutupPopup();
      await ambilData();
    } catch (error) {
      setPesanAksi(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan."
      );
    } finally {
      setSedangMemproses(false);
    }
  }

  function setujuiPengajuan() {
    kirimAksi({ aksi: "SETUJUI" });
  }

  function tolakPengajuan() {
    if (!penjelasanPenolakan.trim()) {
      setPesanAksi("Penjelasan penolakan wajib diisi.");
      return;
    }

    kirimAksi({
      aksi: "TOLAK",
      alasan: alasanPenolakan,
      penjelasan: penjelasanPenolakan,
    });
  }

  // Menyelesaikan transaksi Uang maupun Minyak Goreng
  function selesaikanTransaksi() {
    if (!pengajuanTerpilih) return;

    if (Number(volumeRiil) <= 0 || !namaPetugas.trim()) {
      setPesanAksi("Volume riil dan nama petugas wajib diisi.");
      return;
    }

    if (
      pengajuanTerpilih.jenisPenukaran === "UANG" &&
      hargaPerLiter === null
    ) {
      setPesanAksi("Harga beli per liter belum tersedia.");
      return;
    }

    if (
      pengajuanTerpilih.jenisPenukaran === "MINYAK_GORENG" &&
      (rasioJelantahPerLiter === null ||
        rasioJelantahPerLiter <= 0)
    ) {
      setPesanAksi("Rasio penukaran minyak goreng belum tersedia.");
      return;
    }

    if (
      pengajuanTerpilih.jenisPenukaran === "MINYAK_GORENG" &&
      jumlahMinyakGoreng <= 0
    ) {
      setPesanAksi(
        "Volume minyak jelantah belum mencukupi untuk mendapatkan minyak goreng."
      );
      return;
    }

    kirimAksi({
      aksi: "SELESAIKAN",
      volumeRiil: Number(volumeRiil),
      namaPetugas: namaPetugas.trim(),
    });
  }

  return (
    <main className="min-h-screen bg-[#F2F8F3] text-[#203D2D]">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10">

        {/* HEADER */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#145B3A] via-[#19764A] to-[#27965D] p-7 text-white shadow-lg shadow-green-900/10 sm:p-9">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 right-48 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-xs font-bold tracking-[0.18em] text-green-100">
              PENGELOLAAN DATA
            </p>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Pengajuan Penukaran
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-green-50 sm:text-base">
              Kelola pengajuan pelanggan, periksa data, dan proses
              penukaran minyak jelantah MinyCycle.
            </p>

            <div className="mt-6 h-1.5 w-20 rounded-full bg-[#9BE7B0]" />
          </div>
        </div>

        {/* RINGKASAN JUMLAH DATA */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#DDEDE0] border-l-4 border-l-[#38B66A] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">
              Total Pengajuan
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#168348]">
              {daftarPengajuan.length}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Seluruh data pengajuan
            </p>
          </div>

          <div className="rounded-2xl border border-[#DDEDE0] border-l-4 border-l-[#E9AA37] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">
              Menunggu Review
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#B77913]">
              {daftarPengajuan.filter(
                (item) => item.status === "DATA_DITERIMA"
              ).length}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Pengajuan perlu diperiksa
            </p>
          </div>

          <div className="rounded-2xl border border-[#DDEDE0] border-l-4 border-l-[#28B8A4] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">
              Pengajuan Selesai
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#138D80]">
              {daftarPengajuan.filter(
                (item) => item.status === "SELESAI"
              ).length}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Transaksi telah diselesaikan
            </p>
          </div>
        </div>

        {/* FILTER DAN PENCARIAN */}
        <div className="mb-6 rounded-2xl border border-[#E0ECE3] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-[#245D3C]">
              Daftar Pengajuan
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Cari dan filter data pengajuan pelanggan.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-xs">
              <label className={labelClass}>
                Filter Status
              </label>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={inputClass}
              >
                {daftarFilter.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:max-w-md">
              <label className={labelClass}>
                Pencarian Pelanggan
              </label>

              <input
                type="text"
                value={pencarian}
                onChange={(e) => setPencarian(e.target.value)}
                placeholder="Cari nama, nomor WhatsApp, atau alamat..."
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-[#DDEDE0] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#DCEDE0] border-t-[#27965D]" />
            <p className="font-semibold text-[#45644F]">
              Memuat data pengajuan...
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Mohon tunggu sebentar.
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && pesanError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-bold">Gagal Memuat Data</p>
            <p className="mt-1">{pesanError}</p>

            <button
              onClick={ambilData}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* TABEL PENGAJUAN */}
        {!loading && !pesanError && (
          <div className="overflow-hidden rounded-2xl border border-[#E0ECE3] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5F0E7] bg-gradient-to-r from-[#E9F8ED] to-[#F5FBF6] px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-extrabold text-[#245D3C]">
                  Data Pelanggan
                </h2>
                <p className="mt-1 text-xs text-[#74877A]">
                  Menampilkan {dataTampil.length} dari {daftarPengajuan.length} pengajuan
                </p>
              </div>

              <span className="rounded-full border border-[#CDE8D3] bg-white px-4 py-2 text-xs font-bold text-[#398454]">
                Data Pengajuan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
                <thead className="bg-[#EDF7EF] text-[#285B3E]">
                  <tr>
                    <th className="px-5 py-4 font-extrabold">ID / Tanggal</th>
                    <th className="px-5 py-4 font-extrabold">Nama Pelanggan</th>
                    <th className="px-5 py-4 font-extrabold">Nomor WhatsApp</th>
                    <th className="px-5 py-4 font-extrabold">Alamat Penjemputan</th>
                    <th className="px-5 py-4 font-extrabold">Status</th>
                    <th className="px-5 py-4 text-center font-extrabold">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {dataTampil.map((item) => {
                    const status = namaStatus(item.status);

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-[#EAF0EB] text-[#405B49] transition hover:bg-[#F4FAF5]"
                      >
                        <td className="px-5 py-5">
                          <p className="font-extrabold text-[#245D3C]">
                            MC-{item.id.toString().padStart(3, "0")}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {formatTanggal(item.createdAt)}
                          </p>
                        </td>

                        <td className="px-5 py-5 font-bold text-[#315C46]">
                          {item.user.nama}
                        </td>

                        <td className="px-5 py-5 text-gray-600">
                          {item.user.noWhatsapp}
                        </td>

                        <td className="max-w-xs px-5 py-5 leading-relaxed text-gray-600">
                          {item.alamatPenjemputan}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${warnaStatus(status)}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-center">
                          {item.status === "DATA_DITERIMA" && (
                            <button
                              onClick={() => bukaPopup("review", item)}
                              className="rounded-lg border border-[#B9DFC4] bg-[#EAF8EE] px-3 py-2 text-xs font-bold text-[#176B45] transition hover:bg-[#D8F1DF]"
                            >
                              Review Data
                            </button>
                          )}

                          {[
                            "PENJEMPUTAN",
                            "PENGECEKAN",
                            "PEMBAYARAN",
                          ].includes(item.status) && (
                            <button
                              onClick={() => bukaPopup("transaksi", item)}
                              className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                            >
                              Proses Transaksi
                            </button>
                          )}

                          {item.status === "SELESAI" && (
                            <span className="font-bold text-emerald-700">
                              Selesai
                            </span>
                          )}

                          {item.status === "TIDAK_VALID" && (
                            <button
                              onClick={() => bukaPopup("penolakan", item)}
                              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                            >
                              Cek Alasan
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {dataTampil.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-14 text-center"
                      >
                        <p className="font-bold text-[#45644F]">
                          Tidak ada pengajuan yang ditemukan.
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          Coba ubah kata kunci atau filter status.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* POPUP REVIEW DATA */}
      {popup === "review" && pengajuanTerpilih && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#DCE9DF] bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#39915C]">
                  Pemeriksaan Data
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-[#245D3C]">
                  Review Pengajuan
                </h2>
              </div>

              <button
                onClick={tutupPopup}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 transition hover:bg-rose-50 hover:text-rose-600"
              >
                ×
              </button>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 rounded-2xl bg-[#F3F9F4] p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">ID Pengajuan</p>
                <p className="mt-1 font-bold text-[#245D3C]">
                  MC-{pengajuanTerpilih.id.toString().padStart(3, "0")}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Tanggal Masuk</p>
                <p className="mt-1 font-semibold text-gray-700">
                  {formatTanggal(pengajuanTerpilih.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Nama Pelanggan</p>
                <p className="mt-1 font-semibold text-gray-700">
                  {pengajuanTerpilih.user.nama}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Nomor WhatsApp</p>
                <p className="mt-1 font-semibold text-gray-700">
                  {pengajuanTerpilih.user.noWhatsapp}
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-2xl border border-[#E0ECE3] p-4">
              <p className="text-xs font-semibold text-gray-500">
                Alamat Penjemputan
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {pengajuanTerpilih.alamatPenjemputan}
              </p>
            </div>

            <div className="mb-5 rounded-2xl border border-[#CDE8D3] bg-[#F3F9F4] p-4">
              <p className="text-xs font-semibold text-gray-500">
                Estimasi Volume Minyak
              </p>

              <p className="mt-1 text-2xl font-extrabold text-[#176B45]">
                {pengajuanTerpilih.jumlahLiter} Liter
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Jenis penukaran:{" "}
                {pengajuanTerpilih.jenisPenukaran === "UANG"
                  ? "Uang"
                  : "Minyak Goreng"}
              </p>
            </div>

            <p className="mb-4 text-center text-sm font-bold text-[#365B43]">
              Apakah data pengajuan ini valid?
            </p>

            {pesanAksi && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {pesanAksi}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setPopup("penolakan");
                  setPesanAksi("");
                }}
                disabled={sedangMemproses}
                className={`${buttonSecondary} flex-1`}
              >
                Tidak, Tolak
              </button>

              <button
                onClick={setujuiPengajuan}
                disabled={sedangMemproses}
                className={`${buttonPrimary} flex-1`}
              >
                {sedangMemproses ? "Memproses..." : "Ya, Setujui"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP PENOLAKAN */}
      {popup === "penolakan" && pengajuanTerpilih && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#DCE9DF] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  Informasi Pengajuan
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-[#245D3C]">
                  {pengajuanTerpilih.status === "TIDAK_VALID"
                    ? "Alasan Penolakan"
                    : "Tolak Pengajuan"}
                </h2>
              </div>

              <button
                onClick={tutupPopup}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 transition hover:bg-rose-50 hover:text-rose-600"
              >
                ×
              </button>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-gray-500">
              {pengajuanTerpilih.status === "TIDAK_VALID"
                ? "Berikut alasan pengajuan ini ditolak."
                : "Tentukan alasan penolakan agar pelanggan mengetahui informasi pengajuannya."}
            </p>

            <label className={labelClass}>
              Alasan Penolakan
            </label>

            {pengajuanTerpilih.status === "TIDAK_VALID" ? (
              <div className="mb-5 rounded-xl border border-[#E0ECE3] bg-[#F7FAF7] p-4 text-sm text-gray-700">
                {pengajuanTerpilih.alasanPenolakan || "-"}
              </div>
            ) : (
              <select
                value={alasanPenolakan}
                onChange={(e) => setAlasanPenolakan(e.target.value)}
                className={`${inputClass} mb-5`}
              >
                {pilihanAlasan.map((alasan) => (
                  <option key={alasan} value={alasan}>
                    {alasan}
                  </option>
                ))}
              </select>
            )}

            <label className={labelClass}>
              Penjelasan Alasan
            </label>

            {pengajuanTerpilih.status === "TIDAK_VALID" ? (
              <div className="mb-5 rounded-xl border border-[#E0ECE3] bg-[#F7FAF7] p-4 text-sm leading-relaxed text-gray-700">
                {pengajuanTerpilih.penjelasanPenolakan || "-"}
              </div>
            ) : (
              <textarea
                value={penjelasanPenolakan}
                onChange={(e) =>
                  setPenjelasanPenolakan(e.target.value)
                }
                placeholder="Tuliskan penjelasan alasan penolakan..."
                rows={4}
                className={`${inputClass} mb-5 resize-y`}
              />
            )}

            {pesanAksi && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {pesanAksi}
              </p>
            )}

            {pengajuanTerpilih.status === "TIDAK_VALID" ? (
              <button
                onClick={tutupPopup}
                className={`${buttonSecondary} w-full`}
              >
                Tutup
              </button>
            ) : (
              <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  onClick={() => {
                    setPopup("review");
                    setPesanAksi("");
                  }}
                  className={buttonSecondary}
                >
                  Batal
                </button>

                <button
                  onClick={tolakPengajuan}
                  disabled={
                    !penjelasanPenolakan.trim() ||
                    sedangMemproses
                  }
                  className="rounded-xl bg-gradient-to-r from-[#C94C4C] to-[#E15C5C] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sedangMemproses
                    ? "Menyimpan..."
                    : "Simpan Penolakan"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP TRANSAKSI */}
      {popup === "transaksi" && pengajuanTerpilih && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#DCE9DF] bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#39915C]">
                  Pengelolaan Transaksi
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-[#245D3C]">
                  Proses Transaksi
                </h2>
              </div>

              <button
                onClick={tutupPopup}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 transition hover:bg-rose-50 hover:text-rose-600"
              >
                ×
              </button>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 rounded-2xl bg-[#F3F9F4] p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">
                  Nama Pelanggan
                </p>
                <p className="mt-1 text-sm font-bold text-[#315C46]">
                  {pengajuanTerpilih.user.nama}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Estimasi Volume
                </p>
                <p className="mt-1 text-sm font-bold text-[#315C46]">
                  {pengajuanTerpilih.jumlahLiter} Liter
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Jenis Penukaran
                </p>
                <p className="mt-1 text-sm font-bold text-[#315C46]">
                  {pengajuanTerpilih.jenisPenukaran === "UANG"
                    ? "Uang"
                    : "Minyak Goreng"}
                </p>
              </div>

              {pengajuanTerpilih.jenisPenukaran === "UANG" ? (
                <div>
                  <p className="text-xs text-gray-500">
                    Tarif Beli / Liter
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#315C46]">
                    {hargaPerLiter === null
                      ? "Harga belum tersedia"
                      : formatRupiah(hargaPerLiter)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-500">
                    Rasio Penukaran
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#315C46]">
                    {rasioJelantahPerLiter === null
                      ? "Rasio belum tersedia"
                      : `${formatLiter(rasioJelantahPerLiter)} : 1`}
                  </p>
                </div>
              )}
            </div>

            {/* INPUT VOLUME RIIL */}
            <label className={labelClass}>
              Volume Riil Minyak Terukur (Liter)
            </label>

            <input
              type="number"
              min="0.1"
              step="0.01"
              value={volumeRiil}
              onChange={(e) => setVolumeRiil(e.target.value)}
              placeholder="Masukkan volume hasil penimbangan"
              className={`${inputClass} mb-5`}
            />

            {/* HASIL TRANSAKSI UANG */}
            {pengajuanTerpilih.jenisPenukaran === "UANG" && (
              <div className="mb-5 rounded-2xl border border-[#BFE4CA] bg-gradient-to-br from-[#EAF8EE] to-white p-5">
                <p className="text-sm font-semibold text-[#52725C]">
                  Total Pembayaran
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#176B45]">
                  {formatRupiah(totalPembayaran)}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {volumeRiil || 0} Liter ×{" "}
                  {hargaPerLiter === null
                    ? "-"
                    : formatRupiah(hargaPerLiter)}
                </p>
              </div>
            )}

            {/* HASIL TRANSAKSI MINYAK GORENG */}
            {pengajuanTerpilih.jenisPenukaran === "MINYAK_GORENG" && (
              <div className="mb-5 rounded-2xl border border-[#BFE4CA] bg-gradient-to-br from-[#EAF8EE] to-white p-5">
                <h3 className="mb-4 font-extrabold text-[#245D3C]">
                  Hasil Perhitungan Penukaran
                </h3>

                {rasioJelantahPerLiter === null ? (
                  <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
                    Rasio penukaran belum tersedia. Silakan atur rasio melalui menu Harga.
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-600">
                          Volume jelantah
                        </span>
                        <span className="font-bold text-[#315C46]">
                          {volumeRiil || "0"} Liter
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-600">
                          Rasio penukaran
                        </span>
                        <span className="font-bold text-[#315C46]">
                          {formatLiter(rasioJelantahPerLiter)} : 1
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-600">
                          Hasil perhitungan
                        </span>
                        <span className="font-bold text-[#315C46]">
                          {formatLiter(hasilHitungMinyakGoreng)} Liter
                        </span>
                      </div>
                    </div>

                    <div className="my-4 border-t border-dashed border-[#B8CDB9]" />

                    <p className="text-sm font-semibold text-gray-600">
                      Minyak goreng yang diberikan
                    </p>

                    <p className="mt-1 text-3xl font-extrabold text-[#176B45]">
                      {formatLiter(jumlahMinyakGoreng)} Liter
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Jumlah dibulatkan ke bawah dengan kelipatan 0,5 liter.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* NAMA PETUGAS */}
            <label className={labelClass}>
              Nama Petugas Penjemput
            </label>

            <input
              type="text"
              value={namaPetugas}
              onChange={(e) => setNamaPetugas(e.target.value)}
              placeholder="Masukkan nama petugas"
              className={`${inputClass} mb-5`}
            />

            {pesanAksi && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {pesanAksi}
              </p>
            )}

            <button
              onClick={selesaikanTransaksi}
              disabled={
                Number(volumeRiil) <= 0 ||
                !namaPetugas.trim() ||
                (pengajuanTerpilih.jenisPenukaran === "UANG" &&
                  hargaPerLiter === null) ||
                (pengajuanTerpilih.jenisPenukaran === "MINYAK_GORENG" &&
                  (rasioJelantahPerLiter === null ||
                    rasioJelantahPerLiter <= 0 ||
                    jumlahMinyakGoreng <= 0)) ||
                sedangMemproses
              }
              className={`${buttonPrimary} w-full`}
            >
              {sedangMemproses
                ? "Memproses..."
                : "Update Status Selesai"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
