
"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";

type StatusHarga = "Aktif" | "Terjadwal" | "Nonaktif";

type RiwayatHarga = {
  id: number;
  tanggalBerlaku: string;
  hargaPerLiter: string | number;
  rasioJelantahPerLiter: string | number;
  catatan: string | null;
  status: StatusHarga;
  admin: {
    nama: string;
  };
};

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

export default function HargaAdmin() {
  const [harga, setHarga] = useState("");
  const [rasio, setRasio] = useState("3");
  const [tanggalEfektif, setTanggalEfektif] = useState("");
  const [catatan, setCatatan] = useState("");

  const [riwayat, setRiwayat] = useState<RiwayatHarga[]>([]);

  const [loading, setLoading] = useState(true);
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");
  const [jenisPesan, setJenisPesan] = useState<"sukses" | "error">(
    "sukses"
  );

  const ambilRiwayat = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/harga", {
        cache: "no-store",
      });

      const hasil = await response.json();

      if (!response.ok) {
        throw new Error(hasil.message || "Gagal mengambil data harga.");
      }

      setRiwayat(hasil.data || []);

      if (hasil.data?.length > 0) {
        const hargaTerbaru = hasil.data.find(
          (item: RiwayatHarga) => item.status === "Aktif"
        );

        if (hargaTerbaru) {
          setRasio(String(hargaTerbaru.rasioJelantahPerLiter));
        }
      }
    } catch (error) {
      setJenisPesan("error");
      setPesan(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilRiwayat();
  }, [ambilRiwayat]);

  async function simpanHarga() {
    const nilaiHarga = Number(harga);
    const nilaiRasio = Number(rasio);

    if (!Number.isFinite(nilaiHarga) || nilaiHarga <= 0) {
      setJenisPesan("error");
      setPesan("Masukkan harga yang valid.");
      return;
    }

    if (!Number.isFinite(nilaiRasio) || nilaiRasio <= 0) {
      setJenisPesan("error");
      setPesan("Rasio penukaran harus lebih dari 0.");
      return;
    }

    if (!tanggalEfektif) {
      setJenisPesan("error");
      setPesan("Tanggal berlaku efektif harus diisi.");
      return;
    }

    if (!catatan.trim()) {
      setJenisPesan("error");
      setPesan("Catatan perubahan harga harus diisi.");
      return;
    }

    try {
      setSedangMenyimpan(true);
      setPesan("");

      const response = await fetch("/api/admin/harga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          harga: nilaiHarga,
          rasioJelantahPerLiter: nilaiRasio,
          tanggalEfektif,
          catatan: catatan.trim(),
        }),
      });

      const hasil = await response.json();

      if (!response.ok) {
        throw new Error(hasil.message || "Gagal menyimpan harga.");
      }

      setJenisPesan("sukses");
      setPesan("Harga dan rasio penukaran berhasil disimpan!");

      setHarga("");
      setTanggalEfektif("");
      setCatatan("");

      await ambilRiwayat();
    } catch (error) {
      setJenisPesan("error");
      setPesan(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan harga."
      );
    } finally {
      setSedangMenyimpan(false);
    }
  }

  // Mengambil harga yang benar-benar sedang berlaku
  const hargaAktif = riwayat.find(
    (item) => item.status === "Aktif"
  );

  return (
    <main className="min-h-screen bg-[#F7F9F6]">
      <AdminNavbar />

      <div className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#285B3E]">
          Harga dan Rasio Penukaran
        </h1>

        {/* INFORMASI YANG BERLAKU */}
        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Harga Minyak Jelantah Saat Ini
            </p>

            <p className="mt-2 text-3xl font-bold text-[#285B3E]">
              {hargaAktif
                ? formatRupiah(Number(hargaAktif.hargaPerLiter))
                : "Belum ditentukan"}

              {hargaAktif && (
                <span className="ml-2 text-sm font-medium text-gray-500">
                  / Liter
                </span>
              )}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Rasio Penukaran Minyak Goreng
            </p>

            <p className="mt-2 text-3xl font-bold text-[#285B3E]">
              {hargaAktif
                ? `${Number(hargaAktif.rasioJelantahPerLiter)} : 1`
                : "3 : 1"}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Liter jelantah : liter minyak goreng baru
            </p>
          </div>
        </section>

        {hargaAktif && (
          <p className="mb-6 text-xs text-gray-500">
            Pengaturan terakhir berlaku sejak{" "}
            {formatTanggal(hargaAktif.tanggalBerlaku)}
          </p>
        )}

        {/* FORM KELOLA HARGA */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            Kelola Harga dan Rasio Penukaran
          </h2>

          <p className="mb-6 text-sm text-gray-500">
            Atur harga pembelian minyak jelantah dan rasio
            penukaran minyak goreng baru.
          </p>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Harga Minyak Jelantah per Liter (Rp)
            </label>

            <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-[#285B3E]">
              <span className="flex items-center border-r border-gray-300 bg-gray-100 px-4 text-sm font-semibold text-gray-600">
                Rp
              </span>

              <input
                type="number"
                min="1"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="Contoh: 7500"
                className="w-full px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Rasio Minyak Jelantah untuk 1 Liter Minyak Goreng Baru
            </label>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={rasio}
                onChange={(e) => setRasio(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#285B3E]"
              />

              <span className="shrink-0 text-sm font-semibold text-gray-600">
                : 1 Liter
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Contoh: masukkan 3 jika 3 liter minyak jelantah
              ditukar dengan 1 liter minyak goreng baru.
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tanggal Berlaku Efektif
            </label>

            <input
              type="date"
              value={tanggalEfektif}
              onChange={(e) => setTanggalEfektif(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#285B3E]"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Catatan Keterangan Perubahan
            </label>

            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Misal: Penyesuaian harga dan rasio penukaran"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#285B3E]"
            />
          </div>

          {pesan && (
            <p
              className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
                jenisPesan === "sukses"
                  ? "bg-green-50 text-[#285B3E]"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {pesan}
            </p>
          )}

          <button
            onClick={simpanHarga}
            disabled={sedangMenyimpan}
            className="w-full rounded-lg bg-[#285B3E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1D4630] disabled:opacity-50"
          >
            {sedangMenyimpan ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </section>

        {/* RIWAYAT */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
          <h2 className="mb-5 text-lg font-semibold text-gray-800">
            Riwayat Penetapan Harga dan Rasio
          </h2>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Memuat riwayat...
            </p>
          ) : riwayat.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Belum ada riwayat penetapan.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                <thead className="bg-[#E8EEE8] text-[#285B3E]">
                  <tr>
                    <th className="px-4 py-4">Tanggal Efektif</th>
                    <th className="px-4 py-4">Harga / Liter</th>
                    <th className="px-4 py-4">Rasio Minyak Goreng</th>
                    <th className="px-4 py-4">Catatan</th>
                    <th className="px-4 py-4">Admin</th>
                    <th className="px-4 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {riwayat.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 text-gray-700"
                    >
                      <td className="px-4 py-5">
                        {formatTanggal(item.tanggalBerlaku)}
                      </td>

                      <td className="px-4 py-5 font-medium">
                        {formatRupiah(Number(item.hargaPerLiter))}
                      </td>

                      <td className="px-4 py-5">
                        {Number(item.rasioJelantahPerLiter)} : 1
                      </td>

                      <td className="px-4 py-5">
                        {item.catatan || "-"}
                      </td>

                      <td className="px-4 py-5">
                        {item.admin.nama}
                      </td>

                      <td className="px-4 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "Aktif"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Terjadwal"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
