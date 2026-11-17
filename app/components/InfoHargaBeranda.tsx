
"use client";

import { useEffect, useState } from "react";

type InformasiHarga = {
  hargaPerLiter: number;
  rasioJelantahPerLiter: number;
  tanggalBerlaku: string;
};

export default function InfoHargaBeranda() {
  const [harga, setHarga] = useState<InformasiHarga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function ambilHarga() {
      try {
        const response = await fetch("/api/harga", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil informasi harga.");
        }

        const hasil = await response.json();
        setHarga(hasil.data);
      } catch (err) {
        console.error("Gagal mengambil harga:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    ambilHarga();
  }, []);

  const formatRupiah = (nominal: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(nominal);

  const formatAngka = (angka: number) =>
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 2,
    }).format(angka);

  return (
    <section className="bg-[#edf3e6] py-16 md:py-20">
      <div className="container-page">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-700">
            Informasi Penukaran
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-green-950 md:text-4xl">
            Harga Penukaran Minyak Jelantah
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-green-900/70">
            Dapatkan informasi harga dan rasio penukaran minyak jelantah
            yang berlaku di MinyCycle.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-green-100 bg-white p-10 text-center">
            <p className="text-sm text-green-800">
              Memuat informasi harga...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <p className="font-semibold text-red-700">
              Informasi harga gagal dimuat.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Silakan muat ulang halaman beberapa saat lagi.
            </p>
          </div>
        ) : !harga ? (
          <div className="rounded-2xl border border-green-100 bg-white p-8 text-center">
            <p className="font-semibold text-green-950">
              Informasi harga belum tersedia.
            </p>
            <p className="mt-2 text-sm text-green-900/70">
              Silakan hubungi admin untuk mengetahui informasi penukaran.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {/* PENUKARAN UANG */}
            <div className="rounded-2xl border border-green-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="6" width="18" height="13" rx="2" />
                  <path d="M3 10h18" />
                  <circle cx="12" cy="14" r="2" />
                  <path d="M7 6V4h10v2" />
                </svg>
              </div>

              <p className="text-sm font-semibold text-green-800">
                Penukaran Uang
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-green-950">
                {formatRupiah(harga.hargaPerLiter)}
              </h3>

              <p className="mt-2 text-sm text-green-900/65">
                Harga per liter minyak jelantah.
              </p>
            </div>

            {/* PENUKARAN MINYAK GORENG */}
            <div className="rounded-2xl border border-green-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 3h6" />
                  <path d="M10 3v3l-2 2v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8l-2-2V3" />
                  <path d="M8 10h8" />
                  <path d="M10 14h4" />
                </svg>
              </div>

              <p className="text-sm font-semibold text-green-800">
                Penukaran Minyak Goreng
              </p>

              <h3 className="mt-2 text-3xl font-extrabold text-green-950">
                {formatAngka(harga.rasioJelantahPerLiter)} Liter
              </h3>

              <p className="mt-2 text-sm text-green-900/65">
                Minyak jelantah untuk mendapatkan 1 liter minyak goreng baru.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/info-jualminyak"
            className="inline-flex items-center gap-2 rounded-full bg-green-800 px-7 py-3.5 text-sm font-bold !text-white transition hover:bg-green-700"
          >
            Lihat Informasi Penukaran <span>→</span>
          </a>

          {!loading && harga && (
            <p className="mt-4 text-xs text-green-900/50">
              Informasi harga mengikuti ketentuan terbaru MinyCycle.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
