
"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";

type Pengajuan = {
  id: number;
  jumlahLiter: number;
  volumeRiil: number | null;
  jenisPenukaran: "UANG" | "MINYAK_GORENG";
  status: string;
  totalPembayaran: number | null;
  createdAt: string;
};

type User = {
  id: number;
  nama: string;
  email: string;
  noWhatsapp: string;
  alamat: string;
  aktif: boolean;
  createdAt: string;
};

type DetailUser = User & {
  totalLiter: number;
  pengajuan: Pengajuan[];
};

export default function ManajemenUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [proses, setProses] = useState<number | null>(null);

  const [detailUser, setDetailUser] = useState<DetailUser | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // MENGAMBIL DATA USER
  const ambilUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/manajemen-user", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data pengguna.");
      }

      setUsers(data.users || []);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilUsers();
  }, []);

  // MELIHAT DETAIL USER
  const lihatDetail = async (id: number) => {
    try {
      setLoadingDetail(true);
      setDetailUser(null);

      const response = await fetch(
        `/api/admin/manajemen-user/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil detail pengguna.");
      }

      setDetailUser(data.user);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  // MENGUBAH STATUS USER
  const toggleStatus = async (user: User) => {
    const statusBaru = !user.aktif;

    const konfirmasi = window.confirm(
      `Apakah kamu yakin ingin ${
        statusBaru ? "mengaktifkan" : "menonaktifkan"
      } akun ${user.nama}?`
    );

    if (!konfirmasi) return;

    try {
      setProses(user.id);

      const response = await fetch(
        `/api/admin/manajemen-user/${user.id}`,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah status.");
      }

      await ambilUsers();
      alert(data.message);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    } finally {
      setProses(null);
    }
  };

  // MENGHAPUS USER
  const hapusUser = async (user: User) => {
    const konfirmasi = window.confirm(
      `Apakah kamu yakin ingin menghapus akun ${user.nama}?`
    );

    if (!konfirmasi) return;

    try {
      setProses(user.id);

      const response = await fetch(
        `/api/admin/manajemen-user/${user.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus pengguna.");
      }

      await ambilUsers();
      alert(data.message);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    } finally {
      setProses(null);
    }
  };

  // PENCARIAN USER
  const filteredUsers = users.filter(
    (user) =>
      user.nama.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.noWhatsapp.includes(search)
  );

  const totalUser = users.length;
  const userAktif = users.filter((user) => user.aktif).length;
  const userNonaktif = users.filter((user) => !user.aktif).length;

  // FORMAT TANGGAL
  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // FORMAT RUPIAH
  const formatRupiah = (jumlah: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(jumlah);
  };

  // LABEL STATUS
  const labelStatus = (status: string) => {
    const labels: Record<string, string> = {
      DATA_DITERIMA: "Data Diterima",
      PENJEMPUTAN: "Penjemputan",
      PENGECEKAN: "Pengecekan",
      PEMBAYARAN: "Pembayaran",
      SELESAI: "Selesai",
      TIDAK_VALID: "Tidak Valid",
    };

    return labels[status] || status;
  };

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-[#f7f9f7] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">

          {/* JUDUL */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
              Manajemen User
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Kelola data dan akun pengguna MinyCycle.
            </p>
          </div>

          {/* RINGKASAN */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total User
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                {totalUser}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Seluruh akun pengguna
              </p>
            </div>

            <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                User Aktif
              </p>
              <h2 className="mt-3 text-3xl font-bold text-green-700">
                {userAktif}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Akun dapat digunakan
              </p>
            </div>

            <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                User Nonaktif
              </p>
              <h2 className="mt-3 text-3xl font-bold text-orange-600">
                {userNonaktif}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Akun tidak aktif
              </p>
            </div>

          </div>

          {/* DAFTAR USER */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Daftar Pengguna
              </h2>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, email, atau WhatsApp..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:max-w-xs"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">

                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">No</th>
                    <th className="px-5 py-4 font-semibold">Nama</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">WhatsApp</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Tanggal Daftar</th>
                    <th className="px-5 py-4 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                        Memuat data pengguna...
                      </td>
                    </tr>
                  ) : filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">

                      <td className="px-5 py-4">{index + 1}</td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        {user.nama}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {user.noWhatsapp}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.aktif
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {user.aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatTanggal(user.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">

                          <button
                            type="button"
                            onClick={() => lihatDetail(user.id)}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Detail
                          </button>

                          <button
                            type="button"
                            disabled={proses === user.id}
                            onClick={() => toggleStatus(user)}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 ${
                              user.aktif
                                ? "bg-green-700 hover:bg-green-800"
                                : "bg-gray-500 hover:bg-gray-600"
                            }`}
                          >
                            {proses === user.id
                              ? "Memproses..."
                              : user.aktif
                                ? "Nonaktifkan"
                                : "Aktifkan"}
                          </button>

                          <button
                            type="button"
                            disabled={proses === user.id}
                            onClick={() => hapusUser(user)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                            title="Hapus pengguna"
                          >
                            🗑
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                  {!loading && filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                        {search
                          ? "Pengguna tidak ditemukan."
                          : "Belum ada pengguna terdaftar."}
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
              Menampilkan {filteredUsers.length} dari {totalUser} data pengguna
            </div>

          </div>
        </div>
      </main>

      {/* POPUP DETAIL USER */}
      {(loadingDetail || detailUser) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            if (!loadingDetail) setDetailUser(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            {loadingDetail ? (
              <div className="p-12 text-center text-gray-500">
                Memuat detail pengguna...
              </div>
            ) : detailUser && (
              <>
                {/* HEADER POPUP */}
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Detail Pengguna
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Informasi lengkap akun MinyCycle
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDetailUser(null)}
                    className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6 p-6">

                  {/* PROFIL */}
                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">
                        Informasi Profil
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          detailUser.aktif
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {detailUser.aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    <div className="grid gap-4 rounded-xl bg-gray-50 p-5 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-500">Nama Lengkap</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailUser.nama}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="mt-1 break-all font-semibold text-gray-800">
                          {detailUser.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">WhatsApp</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailUser.noWhatsapp}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Tanggal Daftar</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {formatTanggal(detailUser.createdAt)}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-500">Alamat</p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailUser.alamat}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* RINGKASAN PENUKARAN */}
                  <section>
                    <h3 className="mb-4 font-bold text-gray-900">
                      Ringkasan Penukaran
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-green-100 bg-green-50 p-5">
                        <p className="text-sm text-gray-600">
                          Total Minyak Terkumpul
                        </p>
                        <p className="mt-2 text-2xl font-bold text-green-800">
                          {detailUser.totalLiter.toLocaleString("id-ID")} Liter
                        </p>
                      </div>

                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                        <p className="text-sm text-gray-600">
                          Total Pengajuan
                        </p>
                        <p className="mt-2 text-2xl font-bold text-blue-800">
                          {detailUser.pengajuan.length}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* RIWAYAT PENGAJUAN */}
                  <section>
                    <h3 className="mb-4 font-bold text-gray-900">
                      Riwayat Penukaran Minyak
                    </h3>

                    {detailUser.pengajuan.length === 0 ? (
                      <div className="rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500">
                        Pengguna belum memiliki riwayat penukaran.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {detailUser.pengajuan.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-gray-200 p-4"
                          >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                              <div>
                                <p className="font-bold text-gray-800">
                                  Pengajuan #{item.id}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {formatTanggal(item.createdAt)}
                                </p>
                              </div>

                              <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                {labelStatus(item.status)}
                              </span>
                            </div>

                            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Jenis Penukaran
                                </p>
                                <p className="mt-1 font-semibold text-gray-800">
                                  {item.jenisPenukaran === "UANG"
                                    ? "Uang"
                                    : "Minyak Goreng"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">
                                  Jumlah Minyak
                                </p>
                                <p className="mt-1 font-semibold text-gray-800">
                                  {item.jumlahLiter} Liter
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500">
                                  Total Pembayaran
                                </p>
                                <p className="mt-1 font-semibold text-gray-800">
                                  {item.totalPembayaran !== null
                                    ? formatRupiah(item.totalPembayaran)
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                </div>

                <div className="border-t border-gray-100 p-5 text-right">
                  <button
                    type="button"
                    onClick={() => setDetailUser(null)}
                    className="rounded-lg bg-[#285B3E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e4630]"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
