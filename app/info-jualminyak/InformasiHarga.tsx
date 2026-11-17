"use client";

import { useEffect, useState } from "react";

type HargaAktif = {
  hargaPerLiter: number;
  rasioJelantahPerLiter: number;
  tanggalBerlaku: string;
};

export default function InformasiHarga() {
  const [harga, setHarga] = useState<HargaAktif | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function ambilHarga() {
      try {
        const response = await fetch("/api/harga");
        const result = await response.json();

        if (!response.ok) {
          throw new Error("Gagal mengambil harga");
        }

        setHarga(result.data);
      } catch (error) {
        console.error("Gagal mengambil informasi harga:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    ambilHarga();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Harga Minyak Jelantah */}
      <div className="bg-white rounded-2xl border border-[#E5EDE5] p-6 shadow-sm">
        <div className="text-3xl mb-4">💰</div>

        <h3 className="text-lg font-bold text-[#285B3E] mb-2">
          Harga Minyak Jelantah
        </h3>

        {loading ? (
          <p className="text-gray-500">Memuat harga...</p>
        ) : error ? (
          <p className="text-red-500">Gagal memuat informasi harga.</p>
        ) : harga ? (
          <>
            <p className="text-3xl font-bold text-[#285B3E]">
              Rp {harga.hargaPerLiter.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Per liter minyak jelantah
            </p>
          </>
        ) : (
          <p className="text-gray-500">
            Informasi harga belum tersedia.
          </p>
        )}
      </div>

      {/* Rasio Minyak Goreng */}
      <div className="bg-white rounded-2xl border border-[#E5EDE5] p-6 shadow-sm">
        <div className="text-3xl mb-4">🛢️</div>

        <h3 className="text-lg font-bold text-[#285B3E] mb-2">
          Penukaran Minyak Goreng
        </h3>

        {loading ? (
          <p className="text-gray-500">Memuat rasio...</p>
        ) : error ? (
          <p className="text-red-500">Gagal memuat informasi rasio.</p>
        ) : harga ? (
          <>
            <p className="text-3xl font-bold text-[#285B3E]">
              {harga.rasioJelantahPerLiter} : 1
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Liter jelantah untuk mendapatkan 1 liter minyak goreng
            </p>
          </>
        ) : (
          <p className="text-gray-500">
            Informasi rasio belum tersedia.
          </p>
        )}
      </div>
    </div>
  );
}