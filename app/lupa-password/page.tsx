
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LupaPasswordPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPesan("");
    setBerhasil(false);

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const konfirmasi = String(formData.get("konfirmasi") || "");

    if (password.length < 8) {
      setPesan("Password minimal harus 8 karakter.");
      return;
    }

    if (password !== konfirmasi) {
      setPesan("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/lupa-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          konfirmasi,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setPesan(result.message || "Gagal mengubah password.");
        return;
      }

      setBerhasil(true);
      setPesan("Password berhasil diperbarui. Silakan login kembali.");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setPesan("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f6] px-4 py-10">
      <div className="w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white px-7 py-9 shadow-sm sm:px-10">
        <Link href="/" className="mb-7 flex items-center justify-center gap-2">
          <span className="text-3xl text-green-700">♻</span>
          <span className="text-xl font-extrabold text-green-950">
            Miny<span className="text-green-600">Cycle</span>
          </span>
        </Link>

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-800 text-3xl text-green-800">
            ↻
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
            Lupa Password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Masukkan email akun kamu dan buat password baru.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Alamat Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Masukkan email terdaftar"
              autoComplete="email"
              required
              disabled={loading || berhasil}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Password Baru
            </label>

            <input
              type="password"
              name="password"
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading || berhasil}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Konfirmasi Password Baru
            </label>

            <input
              type="password"
              name="konfirmasi"
              placeholder="Ulangi password baru"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading || berhasil}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
            />
          </div>

          {pesan && (
            <div
              role="alert"
              className={`rounded-lg px-4 py-3 text-sm ${
                berhasil
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {pesan}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || berhasil}
            className="w-full rounded-lg bg-gray-950 px-4 py-3 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Ubah Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-green-800 hover:underline"
          >
            ← Kembali ke Login
          </Link>
        </div>
      </div>
    </main>
  );
}
