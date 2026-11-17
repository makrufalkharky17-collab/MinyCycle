"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthCardProps = {
  mode: "register" | "login" | "admin";
};

export default function AuthCard({ mode }: AuthCardProps) {
  const isRegister = mode === "register";
  const isAdmin = mode === "admin";
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPesan("");
    setBerhasil(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const nama = String(formData.get("nama") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const konfirmasi = String(formData.get("konfirmasi") || "");
    const noWhatsapp = String(formData.get("noWhatsapp") || "");
    const alamat = String(formData.get("alamat") || "");

    if (password !== konfirmasi) {
      setPesan("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password, noWhatsapp, alamat }),
      });

      const result = await response.json();

      if (!response.ok) {
        setPesan(result.message || "Registrasi gagal.");
        return;
      }

      setBerhasil(true);
      setPesan("Registrasi berhasil! Silakan login menggunakan akun kamu.");
      form.reset();
    } catch {
      setPesan("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function prosesLogin(
    event: React.FormEvent<HTMLFormElement>,
    admin: boolean
  ) {
    event.preventDefault();
    setLoading(true);
    setPesan("");
    setBerhasil(false);

    try {
      const formData = new FormData(event.currentTarget);
      const endpoint = admin ? "/api/admin/login" : "/api/auth/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const hasil = await response.json();

      if (!response.ok) {
        setPesan(hasil.message || (admin ? "Login admin gagal." : "Login gagal."));
        return;
      }

      setBerhasil(true);
      setPesan("Login berhasil. Mengalihkan halaman...");
      
      router.push(admin ? "/admin" : "/status-penukaran");
      router.refresh();
    } catch {
      setPesan("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    await prosesLogin(event, false);
  }

  async function handleAdminLogin(event: React.FormEvent<HTMLFormElement>) {
    await prosesLogin(event, true);
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
            ♙
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
            {isRegister ? "Daftar Akun" : isAdmin ? "Login Admin" : "Login Akun"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isAdmin
              ? "Jadilah admin yang amanah dan bermanfaat."
              : "Mulailah perjalanan berkelanjutan Anda hari ini."}
          </p>
        </div>

        <div className="mt-7 flex justify-center">
          <div className="flex rounded-lg border border-gray-300 p-1">
            <Link
              href={isRegister ? "/register" : "/login"}
              className={`rounded-md px-5 py-2 text-sm font-semibold transition ${
                !isAdmin ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              User
            </Link>

            <Link
              href="/admin/login"
              className={`rounded-md px-5 py-2 text-sm font-semibold transition ${
                isAdmin ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Admin
            </Link>
          </div>
        </div>

         <form
          className="mt-6 space-y-4"
          onSubmit={isRegister ? handleRegister : isAdmin ? handleAdminLogin : handleLogin}
        >
          {isRegister && (
            <>
              <div>
                <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nama
                </label>
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  autoComplete="name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label htmlFor="noWhatsapp" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nomor WhatsApp
                </label>
                <input
                  id="noWhatsapp"
                  name="noWhatsapp"
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  autoComplete="tel"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label htmlFor="alamat" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <textarea
                  id="alamat"
                  name="alamat"
                  placeholder="Masukkan alamat lengkap"
                  autoComplete="street-address"
                  required
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Alamat email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Masukkan alamat email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 8 : undefined}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

           {isRegister && (
            <div>
              <label htmlFor="konfirmasi" className="mb-1.5 block text-sm font-medium text-gray-700">
                Konfirmasi password
              </label>
              <input
                id="konfirmasi"
                name="konfirmasi"
                type="password"
                placeholder="Ulangi password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </div>
          )}

          {!isRegister && (
            <div className="flex items-center justify-between gap-3 text-xs text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="ingat" className="h-4 w-4 accent-green-800" />
                Ingatkan saya
              </label>

              {!isAdmin && (
                <Link href="/lupa-password" className="font-medium hover:text-green-700">
                  Lupa password?
                </Link>
              )}
            </div>
          )}

          {pesan && (
            <div
              role="alert"
              className={`rounded-lg px-4 py-3 text-sm ${
                berhasil ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
              }`}
            >
              {pesan}
            </div>
          )}

          {isRegister && berhasil && (
            <Link href="/login" className="block text-center text-sm font-bold text-green-800 hover:underline">
              Login sekarang →
            </Link>
          )}

          <button
            type="submit"
            disabled={loading || berhasil}
            className="mt-3 w-full rounded-lg bg-gray-950 px-4 py-3 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Memproses..."
              : berhasil
                ? isRegister ? "Registrasi Berhasil" : "Berhasil"
                : isRegister ? "Daftar Sekarang" : "Login"}
          </button>
        </form>

        {isRegister ? (
          <p className="mt-5 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-green-800 hover:underline">
              Login di sini
            </Link>
          </p>
        ) : isAdmin ? (
          <p className="mt-5 text-center text-sm leading-6 text-gray-600">
            Halaman khusus pengelola MinyCycle.
          </p>
        ) : (
          <p className="mt-5 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-green-800 hover:underline">
              Daftar sekarang
            </Link>
          </p>
        )}

        <div className="mt-7 border-t border-gray-100 pt-5 text-center">
          <Link href="/" className="text-sm font-medium text-gray-500 transition hover:text-green-800">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}