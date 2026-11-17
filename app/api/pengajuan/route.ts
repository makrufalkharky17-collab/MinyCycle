
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const jumlah = Number(body.jumlah);
    const alamat = String(body.alamat ?? "").trim();
    const jenis = body.jenis;

    if (!Number.isFinite(jumlah) || jumlah <= 0) {
      return NextResponse.json(
        { message: "Jumlah minyak harus lebih dari 0 liter." },
        { status: 400 }
      );
    }

    if (!alamat) {
      return NextResponse.json(
        { message: "Alamat penjemputan wajib diisi." },
        { status: 400 }
      );
    }

    let jenisPenukaran: "UANG" | "MINYAK_GORENG";

    if (jenis === "Uang") {
      jenisPenukaran = "UANG";
    } else if (jenis === "Minyak goreng") {
      jenisPenukaran = "MINYAK_GORENG";
    } else {
      return NextResponse.json(
        { message: "Pilihan penukaran tidak valid." },
        { status: 400 }
      );
    }

    const pengajuan = await prisma.pengajuan.create({
      data: {
        userId: user.id,
        jumlahLiter: jumlah,
        jenisPenukaran,
        alamatPenjemputan: alamat,
        riwayatStatus: {
          create: {
            status: "DATA_DITERIMA",
            keterangan: "Pengajuan berhasil diterima oleh MinyCycle.",
          },
        },
      },
      select: {
        id: true,
        jumlahLiter: true,
        jenisPenukaran: true,
        alamatPenjemputan: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Pengajuan berhasil dikirim.",
        data: pengajuan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Pengajuan error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const daftarPengajuan = await prisma.pengajuan.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            nama: true,
            noWhatsapp: true,
          },
        },
        riwayatStatus: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const statusMap: Record<string, string> = {
      DATA_DITERIMA: "Data Diterima",
      PENJEMPUTAN: "Penjemputan / Pengantaran",
      PENGECEKAN: "Pengecekan & Penimbangan",
      PEMBAYARAN: "Pembayaran",
      SELESAI: "Selesai",
      TIDAK_VALID: "Tidak Valid",
    };

    const data = daftarPengajuan.map((item) => {
      const statusTerakhir = item.riwayatStatus[0];

      return {
        id: item.id,
        nama: item.user.nama,
        whatsapp: item.user.noWhatsapp,
        jumlah: item.jumlahLiter.toString(),
        jenis:
          item.jenisPenukaran === "UANG"
            ? "Uang"
            : "Minyak goreng",
        alamat: item.alamatPenjemputan,

        status: statusMap[item.status] ?? "Data Diterima",

        alasan:
          item.alasanPenolakan ??
          statusTerakhir?.keterangan ??
          "",

        penjelasanPenolakan: item.penjelasanPenolakan,

        // Detail transaksi
        volumeRiil: item.volumeRiil?.toString() ?? null,
        namaPetugas: item.namaPetugas,
        hargaPerLiter: item.hargaPerLiter?.toString() ?? null,
        totalPembayaran: item.totalPembayaran?.toString() ?? null,

        createdAt: item.createdAt,
      };
    });

    return NextResponse.json({
      message: "Data pengajuan berhasil diambil.",
      data,
    });
  } catch (error) {
    console.error("Ambil pengajuan error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
