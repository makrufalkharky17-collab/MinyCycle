"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type Pengajuan = {
  id: number;
  nama: string;
  whatsapp: string;
  jumlah: string;
  jenis: string;
  alamat: string;
  status: string;
};

export default function PengajuanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.currentTarget);

  try {
    const response = await fetch("/api/pengajuan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jumlah: formData.get("jumlah"),
        jenis: formData.get("jenis"),
        alamat: formData.get("alamat"),
      }),
    });

    const hasil = await response.json();

    if (!response.ok) {
      alert(hasil.message || "Pengajuan gagal dikirim.");
      return;
    }

    alert("Pengajuan berhasil dikirim!");
    router.push("/status-penukaran");
    router.refresh();
  } catch (error) {
    console.error("Pengajuan error:", error);
    alert("Tidak dapat terhubung ke server.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F9F5] px-4 pb-16 pt-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#6B956F]">
              Layanan MinyCycle
            </p>

            <h1 className="text-3xl font-bold text-[#285B3E] md:text-4xl">
              Form Pengajuan Penjemputan
            </h1>

            <p className="mt-3 text-gray-600">
              Isi formulir berikut dengan data yang benar untuk mengajukan
              penjemputan minyak jelantah.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl bg-white p-6 shadow-md md:p-8"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                required
                placeholder="Masukkan nama lengkap"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#285B3E]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                required
                placeholder="Contoh: 08xxxxxxxxxx"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#285B3E]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Perkiraan Jumlah Minyak Jelantah
              </label>
              <input
                type="number"
                name="jumlah"
                min="1"
                step="0.1"
                required
                placeholder="Contoh: 5 liter"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#285B3E]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Pilihan Penukaran
              </label>
              <select
                name="jenis"
                required
                defaultValue=""
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#285B3E]"
              >
                <option value="" disabled>
                  Pilih jenis penukaran
                </option>
                <option value="Uang">Uang</option>
                <option value="Minyak goreng">Minyak goreng</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Alamat Penjemputan
              </label>
              <textarea
                name="alamat"
                required
                rows={4}
                placeholder="Masukkan alamat lengkap penjemputan"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#285B3E]"
              />
            </div>

            <div className="rounded-lg bg-[#F0F5EE] p-4 text-sm text-gray-600">
              Pastikan minyak jelantah sudah disimpan dalam wadah tertutup
              dan alamat penjemputan sudah benar.
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full rounded-full border border-[#285B3E] px-6 py-3 font-semibold text-[#285B3E] transition hover:bg-[#F0F5EE]"
              >
                Kembali
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#285B3E] px-6 py-3 font-semibold text-white transition hover:bg-[#1D4630] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Mengirim..." : "Kirim Pengajuan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}