
"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";

type Admin = {
  id: number;
  nama: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  aktif: boolean;
  createdAt: string;
};

export default function ManajemenAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [error, setError] = useState("");

  const [modalTambah, setModalTambah] = useState(false);
  const [namaBaru, setNamaBaru] = useState("");
  const [emailBaru, setEmailBaru] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");

  // MENGAMBIL DATA ADMIN
  const ambilAdmin = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/manajemen-admin", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data admin.");
      }

      setAdmins(result.data || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilAdmin();
  }, [ambilAdmin]);

  // MENAMBAHKAN ADMIN
  const tambahAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setMenyimpan(true);

      const response = await fetch("/api/admin/manajemen-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: namaBaru,
          email: emailBaru,
          password: passwordBaru,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan admin.");
      }

      alert(result.message || "Admin berhasil ditambahkan!");

      setNamaBaru("");
      setEmailBaru("");
      setPasswordBaru("");
      setModalTambah(false);

      await ambilAdmin();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menambahkan admin."
      );
    } finally {
      setMenyimpan(false);
    }
  };

  // MENGUBAH STATUS ADMIN
  const ubahStatusAdmin = async (admin: Admin) => {
    if (admin.role === "SUPER_ADMIN") {
      alert("Status Super Admin tidak dapat diubah.");
      return;
    }

    const statusBaru = !admin.aktif;

    const konfirmasi = confirm(
      `Yakin ingin ${
        statusBaru ? "mengaktifkan" : "menonaktifkan"
      } akun ${admin.nama}?`
    );

    if (!konfirmasi) return;

    try {
      const response = await fetch(
        `/api/admin/manajemen-admin/${admin.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aktif: statusBaru,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengubah status admin.");
      }

      alert(result.message || "Status admin berhasil diperbarui.");

      await ambilAdmin();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengubah status admin."
      );
    }
  };

  // FORMAT TANGGAL
  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // PENCARIAN ADMIN
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.nama.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalAdmin = admins.length;
  const adminAktif = admins.filter((admin) => admin.aktif).length;
  const adminNonaktif = admins.filter((admin) => !admin.aktif).length;

  return (
    <>
    

      <main className="min-h-screen bg-[#f7f9f7] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* JUDUL HALAMAN */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
                Manajemen Admin
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Kelola akun admin MinyCycle.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalTambah(true)}
              className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              + Tambah Admin
            </button>
          </div>

          {/* PESAN ERROR */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}

              <button
                type="button"
                onClick={ambilAdmin}
                className="ml-2 font-bold underline"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* RINGKASAN */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total Admin
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {totalAdmin}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Seluruh akun admin
              </p>
            </div>

            <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Admin Aktif
              </p>
              <h2 className="mt-3 text-3xl font-bold text-green-700">
                {adminAktif}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Akun berstatus aktif
              </p>
            </div>

            <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Admin Nonaktif
              </p>
              <h2 className="mt-3 text-3xl font-bold text-orange-600">
                {adminNonaktif}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Akun berstatus nonaktif
              </p>
            </div>
          </div>

          {/* DAFTAR ADMIN */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Daftar Admin
              </h2>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:max-w-xs"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">No</th>
                    <th className="px-5 py-4 font-semibold">Nama</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">
                      Terdaftar Pada
                    </th>
                    <th className="px-5 py-4 font-semibold">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-10 text-center text-gray-500"
                      >
                        Memuat data admin...
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin, index) => (
                      <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">{index + 1}</td>

                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {admin.nama}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {admin.email}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              admin.role === "SUPER_ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {admin.role === "SUPER_ADMIN"
                              ? "Super Admin"
                              : "Admin"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              admin.aktif
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {admin.aktif ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {formatTanggal(admin.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          {admin.role === "SUPER_ADMIN" ? (
                            <span className="text-xs text-gray-400">
                              Tidak tersedia
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => ubahStatusAdmin(admin)}
                              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                admin.aktif
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-green-50 text-green-700 hover:bg-green-100"
                              }`}
                            >
                              {admin.aktif ? "Nonaktifkan" : "Aktifkan"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}

                  {!loading && filteredAdmins.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-10 text-center text-gray-500"
                      >
                        Admin tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
              Menampilkan {filteredAdmins.length} dari {totalAdmin} data admin
            </div>
          </div>
        </div>
      </main>

      {/* MODAL TAMBAH ADMIN */}
      {modalTambah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Tambah Admin
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Masukkan informasi admin baru.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalTambah(false)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={tambahAdmin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={namaBaru}
                  onChange={(e) => setNamaBaru(e.target.value)}
                  placeholder="Masukkan nama admin"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={emailBaru}
                  onChange={(e) => setEmailBaru(e.target.value)}
                  placeholder="contoh@minycycle.id"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <p className="text-xs text-gray-500">
                Akun baru otomatis mendapatkan role Admin dan status Aktif.
              </p>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalTambah(false)}
                  disabled={menyimpan}
                  className="w-1/2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={menyimpan}
                  className="w-1/2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {menyimpan ? "Menyimpan..." : "Simpan Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
