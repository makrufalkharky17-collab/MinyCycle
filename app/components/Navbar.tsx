
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NavbarProps = {
  transparent?: boolean;
};

type User = {
  id: number;
  nama: string;
  email: string;
  noWhatsapp?: string | null;
};

export default function Navbar({
  transparent = false,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Mengambil informasi pengguna yang sedang login
  useEffect(() => {
    async function ambilDataUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const hasil = await response.json();
        setUser(hasil.data);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        setUser(null);
      }
    }

    ambilDataUser();
  }, [pathname]);

  // Mengatur navbar saat halaman discroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Menutup popup saat berpindah halaman
  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Fungsi logout
  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout gagal.");
      }

      setUser(null);
      setProfileOpen(false);
      setMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const isTransparent = transparent && !scrolled;

  const links = [
    { label: "Beranda", href: "/" },
    { label: "Edukasi", href: "/edukasi" },
    { label: "Jual Minyak", href: "/info-jualminyak" },
    { label: "Status Penukaran", href: "/status-penukaran" },
  ];

  return (
    <header
      className={`${
        transparent ? "fixed inset-x-0 top-0" : "sticky top-0"
      } z-50 w-full transition-all duration-300 ${
        isTransparent
          ? "bg-transparent text-white"
          : "border-b border-green-100 bg-white/95 text-green-950 shadow-sm backdrop-blur-md"
      }`}
    >
      <nav className="container-page flex min-h-[76px] items-center justify-between gap-5">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span
            className={`text-3xl ${
              isTransparent ? "text-lime-300" : "text-green-600"
            }`}
          >
            ♻
          </span>

          <span className="text-xl font-extrabold tracking-tight">
            Miny
            <span
              className={
                isTransparent ? "text-lime-300" : "text-green-600"
              }
            >
              Cycle
            </span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`border-b-2 pb-2 pt-2 text-sm font-semibold transition ${
                  isTransparent
                    ? isActive
                      ? "border-lime-300 text-lime-300"
                      : "border-transparent text-white hover:border-lime-300 hover:text-lime-300"
                    : isActive
                      ? "border-green-700 text-green-700"
                      : "border-transparent text-green-950 hover:border-green-500 hover:text-green-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Profil / Daftar Login Desktop */}
        <div className="relative hidden md:block">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Buka profil pengguna"
                aria-expanded={profileOpen}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-lg font-bold transition ${
                  isTransparent
                    ? "border-white/70 bg-white/10 text-white hover:bg-white/20"
                    : "border-green-700 bg-green-50 text-green-800 hover:bg-green-100"
                }`}
              >
                {user.nama.charAt(0).toUpperCase()}
              </button>

              {/* Popup Profil */}
              {profileOpen && (
                <div className="absolute right-0 top-14 z-[60] w-[320px] overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 text-gray-900 shadow-xl">
                  <div className="rounded-xl bg-[#EDF3E6] px-4 py-6 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#285B3E] text-3xl font-bold text-white">
                      {user.nama.charAt(0).toUpperCase()}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-gray-900">
                      {user.nama}
                    </h3>

                    <p className="mt-1 break-all text-sm text-gray-600">
                      {user.email}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loading}
                    className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    <span className="text-lg">↪</span>
                    {loading ? "Sedang keluar..." : "Logout"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full bg-green-800 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-green-700"
            >
              Daftar/Login
            </Link>
          )}
        </div>

        {/* Tombol Menu HP */}
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition md:hidden ${
            isTransparent
              ? "border-white/50 text-white hover:bg-white/10"
              : "border-green-800/30 text-green-950 hover:bg-green-50"
          }`}
        >
          {menuOpen ? "Tutup" : "Menu"}
        </button>
      </nav>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="mx-4 mb-4 flex flex-col gap-1 rounded-2xl bg-white p-4 text-green-950 shadow-xl md:hidden">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg border-b-2 px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "border-green-700 bg-green-50 text-green-700"
                    : "border-transparent hover:bg-green-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {user ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
              <div className="bg-[#EDF3E6] p-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#285B3E] text-2xl font-bold text-white">
                  {user.nama.charAt(0).toUpperCase()}
                </div>

                <p className="mt-2 font-bold text-gray-900">
                  {user.nama}
                </p>

                <p className="mt-1 break-all text-sm text-gray-600">
                  {user.email}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {user.noWhatsapp}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <span className="text-lg">↪</span>
                {loading ? "Sedang keluar..." : "Logout"}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-green-800 px-4 py-3 text-center text-sm font-semibold !text-white"
            >
              Daftar/Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
