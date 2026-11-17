
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    // Mengambil seluruh transaksi yang sudah selesai
    const pengajuan = await prisma.pengajuan.findMany({
      where: {
        status: "SELESAI",
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        user: {
          select: {
            nama: true,
            email: true,
          },
        },
      },
    });

    // Mengubah Decimal Prisma menjadi number
    const data = pengajuan.map((item) => ({
      id: item.id,
      pelanggan: item.user.nama,
      email: item.user.email,
      jenisPenukaran: item.jenisPenukaran,
      volume: Number(item.volumeRiil ?? 0),
      harga: Number(item.hargaPerLiter ?? 0),
      totalPembayaran: Number(item.totalPembayaran ?? 0),
      rasioJelantahPerLiter: Number(
        item.rasioJelantahPerLiter ?? 0
      ),
      jumlahMinyakGoreng: Number(
        item.jumlahMinyakGoreng ?? 0
      ),
      tanggal: item.updatedAt,
      petugas: item.namaPetugas || "-",
      alamatPenjemputan: item.alamatPenjemputan,
    }));

    // Total seluruh minyak jelantah yang berhasil dikumpulkan
    const totalVolume = data.reduce(
      (total, item) => total + item.volume,
      0
    );

    // Total pembayaran hanya untuk penukaran uang
    const totalPembayaran = data.reduce(
      (total, item) =>
        item.jenisPenukaran === "UANG"
          ? total + item.totalPembayaran
          : total,
      0
    );

    // Menghitung jumlah masing-masing jenis penukaran
    const totalPenukaranUang = data.filter(
      (item) => item.jenisPenukaran === "UANG"
    ).length;

    const totalPenukaranMinyakGoreng = data.filter(
      (item) => item.jenisPenukaran === "MINYAK_GORENG"
    ).length;

    return NextResponse.json({
      message: "Laporan pelayanan berhasil diambil.",
      ringkasan: {
        totalTransaksi: data.length,
        totalVolume,
        totalPembayaran,
        totalPenukaranUang,
        totalPenukaranMinyakGoreng,
      },
      data,
    });
  } catch (error) {
    console.error("GET laporan pelayanan error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil laporan pelayanan." },
      { status: 500 }
    );
  }
}
