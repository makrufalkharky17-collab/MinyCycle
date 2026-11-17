
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const menu = [
  { nama: "Dashboard", link: "/admin", icon: "▦" },
  { nama: "Pengajuan", link: "/admin/pengajuan", icon: "▤" },
  { nama: "Manajemen Harga", link: "/admin/harga", icon: "◇" },
  {
    nama: "Laporan Pelayanan",
    link: "/admin/laporan-pelayanan",
    icon: "▥",
  },
];

const submenuManajemen = [
  {
    nama: "Manajemen Admin",
    link: "/admin/management-admin",
    icon: "♙",
  },
  {
    nama: "Manajemen User",
    link: "/admin/management-user",
    icon: "♧",
  },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [manajemenTerbuka, setManajemenTerbuka] = useState(
    submenuManajemen.some((item) => pathname.startsWith(item.link))
  );
  const [sedangLogout, setSedangLogout] = useState(false);

  const manajemenAktif = submenuManajemen.some(
    (item) => pathname === item.link
  );

  async function handleLogout() {
    if (sedangLogout) return;

    setSedangLogout(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout gagal.");
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout admin error:", error);
      alert("Tidak dapat logout. Silakan coba lagi.");
      setSedangLogout(false);
    }
  }

  function tutupMenu() {
    setMenuTerbuka(false);
  }

  return (
    <>
      {/* TOMBOL MOBILE */}
      <button
        type="button"
        onClick={() => setMenuTerbuka(!menuTerbuka)}
        className="fixed left-4 top-4 z-[70] flex h-11 w-11 items-center justify-center rounded-xl border border-green-100 bg-white text-2xl text-[#176B45] shadow-lg transition hover:bg-green-50 lg:hidden"
        aria-label="Buka navigasi admin"
      >
        {menuTerbuka ? "×" : "☰"}
      </button>

      {/* BACKDROP MOBILE */}
      {menuTerbuka && (
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={tutupMenu}
          className="fixed inset-0 z-[55] bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[270px] flex-col border-r border-[#DCEDE0] bg-gradient-to-b from-[#F4FBF5] via-white to-[#EAF7ED] shadow-xl shadow-green-950/5 transition-transform duration-300 lg:translate-x-0 ${
          menuTerbuka ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="border-b border-[#DCEDE0] px-6 py-6">
          <Link
            href="/admin"
            onClick={tutupMenu}
            className="flex items-center gap-2"
          >
            <span className="text-3xl text-[#29965B]">♻</span>

            <span className="text-xl font-extrabold tracking-tight text-[#176B45]">
              MinyCycle<span className="text-[#56C477]">.</span>
            </span>
          </Link>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-100 bg-[#E3F8E9] px-4 py-2 text-xs font-extrabold tracking-wide text-[#168348]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#2DCB70]" />
            ADMIN PANEL
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#82958A]">
            Menu Utama
          </p>

          <nav className="space-y-2">
            {menu.map((item) => {
              const aktif =
                item.link === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.link);

              return (
                <Link
                  key={item.link}
                  href={item.link}
                  onClick={tutupMenu}
                  aria-current={aktif ? "page" : undefined}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-200 ${
                    aktif
                      ? "bg-gradient-to-r from-[#176B45] to-[#238653] !text-white shadow-lg shadow-green-900/15"
                      : "text-[#315C46] hover:bg-[#E1F4E5] hover:text-[#176B45]"
                  }`}
                >
                  {aktif && (
                    <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#75E69A]" />
                  )}

                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xl transition ${
                      aktif
                        ? "!bg-white/15 !text-white"
                        : "bg-[#E5F4E8] text-[#238653] group-hover:bg-white"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span
                    className={`relative z-10 ${
                      aktif ? "!text-white" : ""
                    }`}
                  >
                    {item.nama}
                  </span>

                  {aktif && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#8CF0A9]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* MANAJEMEN */}
          <div className="mt-9">
            <p className="mb-4 px-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#82958A]">
              Pengelolaan
            </p>

            <button
              type="button"
              onClick={() => setManajemenTerbuka(!manajemenTerbuka)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition ${
                manajemenAktif
                  ? "bg-[#DDF3E3] text-[#176B45]"
                  : "text-[#315C46] hover:bg-[#E1F4E5] hover:text-[#176B45]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E5F4E8] text-lg text-[#238653]">
                  ⚙
                </span>
                Manajemen
              </span>

              <span className="text-xs text-[#238653]">
                {manajemenTerbuka ? "▲" : "▼"}
              </span>
            </button>

            {manajemenTerbuka && (
              <div className="ml-5 mt-2 space-y-1 border-l-2 border-[#BDE5C8] pl-3">
                {submenuManajemen.map((item) => {
                  const aktif = pathname === item.link;

                  return (
                    <Link
                      key={item.link}
                      href={item.link}
                      onClick={tutupMenu}
                      aria-current={aktif ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                        aktif
                          ? "bg-[#176B45] !text-white shadow-md shadow-green-900/10"
                          : "text-[#496B56] hover:bg-[#E1F4E5] hover:text-[#176B45]"
                      }`}
                    >
                      <span
                        className={`text-base ${
                          aktif ? "!text-white" : ""
                        }`}
                      >
                        {item.icon}
                      </span>

                      <span className={aktif ? "!text-white" : ""}>
                        {item.nama}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* PROFIL DAN LOGOUT */}
        <div className="border-t border-[#DCEDE0] bg-white/70 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl border border-[#D9EEDD] bg-gradient-to-r from-[#E8F8EC] to-[#F4FBF5] p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#176B45] to-[#36A66A] text-xl text-white shadow-md">
              ♙
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-[#176B45]">
                Admin MinyCycle
              </p>
              <p className="text-xs font-medium text-[#789080]">
                Administrator
              </p>
            </div>

            <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#31C875] ring-4 ring-green-100" />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={sedangLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-100 bg-[#FFF0EF] px-4 py-3 text-sm font-extrabold text-[#D94B4B] transition hover:border-red-200 hover:bg-[#FFE1DF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-lg">↪</span>
            {sedangLogout ? "Sedang Logout..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
