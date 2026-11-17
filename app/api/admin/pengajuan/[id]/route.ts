import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { StatusPengajuan } from "@prisma/client";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: Context
) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const pengajuanId = Number(id);

    if (!Number.isInteger(pengajuanId) || pengajuanId <= 0) {
      return NextResponse.json(
        { message: "ID pengajuan tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const pengajuan = await prisma.pengajuan.findUnique({
      where: { id: pengajuanId },
    });

    if (!pengajuan) {
      return NextResponse.json(
        { message: "Pengajuan tidak ditemukan." },
        { status: 404 }
      );
    }

    const { aksi } = body;

    let statusBaru: StatusPengajuan;
    let keterangan = "";

    const dataUpdate: Record<string, unknown> = {};

    if (aksi === "SETUJUI") {
      if (pengajuan.status !== "DATA_DITERIMA") {
        return NextResponse.json(
          { message: "Pengajuan tidak dapat disetujui pada status ini." },
          { status: 400 }
        );
      }

      statusBaru = "PENJEMPUTAN";
      keterangan = "Pengajuan disetujui dan menunggu penjemputan.";

    } else if (aksi === "TOLAK") {
      if (pengajuan.status !== "DATA_DITERIMA") {
        return NextResponse.json(
          { message: "Pengajuan tidak dapat ditolak pada status ini." },
          { status: 400 }
        );
      }

      const alasan = String(body.alasan ?? "").trim();
      const penjelasan = String(body.penjelasan ?? "").trim();

      if (!alasan || !penjelasan) {
        return NextResponse.json(
          { message: "Alasan dan penjelasan penolakan wajib diisi." },
          { status: 400 }
        );
      }

      statusBaru = "TIDAK_VALID";
      keterangan = penjelasan;

      dataUpdate.alasanPenolakan = alasan;
      dataUpdate.penjelasanPenolakan = penjelasan;

    } else if (aksi === "SELESAIKAN") {
      if (
        !["PENJEMPUTAN", "PENGECEKAN", "PEMBAYARAN"].includes(
          pengajuan.status
        )
      ) {
        return NextResponse.json(
          { message: "Pengajuan belum siap diselesaikan." },
          { status: 400 }
        );
      }

      const volumeRiil = Number(body.volumeRiil);
      const namaPetugas = String(body.namaPetugas ?? "").trim();

      if (
        !Number.isFinite(volumeRiil) ||
        volumeRiil <= 0 ||
        !namaPetugas
      ) {
        return NextResponse.json(
          { message: "Volume riil dan nama petugas wajib diisi." },
          { status: 400 }
        );
      }

      // Mengambil pengaturan harga dan rasio terbaru.
      const harga = await prisma.harga.findFirst({
        orderBy: {
          tanggalBerlaku: "desc",
        },
      });

      if (!harga) {
        return NextResponse.json(
          { message: "Pengaturan harga atau rasio belum tersedia." },
          { status: 400 }
        );
      }

      if (pengajuan.jenisPenukaran === "UANG") {
        const hargaPerLiter = Number(harga.hargaPerLiter);

        if (
          !Number.isFinite(hargaPerLiter) ||
          hargaPerLiter <= 0
        ) {
          return NextResponse.json(
            { message: "Harga beli per liter tidak valid." },
            { status: 400 }
          );
        }

        const totalPembayaran = volumeRiil * hargaPerLiter;

        statusBaru = "SELESAI";

        keterangan =
          `Penukaran selesai. Volume riil ${volumeRiil} liter. ` +
          `Pembayaran Rp${totalPembayaran.toLocaleString("id-ID")}.`;

        dataUpdate.volumeRiil = volumeRiil;
        dataUpdate.namaPetugas = namaPetugas;
        dataUpdate.hargaPerLiter = hargaPerLiter;
        dataUpdate.totalPembayaran = totalPembayaran;

      } else if (pengajuan.jenisPenukaran === "MINYAK_GORENG") {
        const rasio = Number(harga.rasioJelantahPerLiter);

        if (!Number.isFinite(rasio) || rasio <= 0) {
          return NextResponse.json(
            { message: "Rasio penukaran minyak goreng tidak valid." },
            { status: 400 }
          );
        }

        const hasilHitung = volumeRiil / rasio;

        // Pembulatan ke bawah dengan kelipatan 0,5 liter.
        const jumlahMinyakGoreng =
          Math.floor(hasilHitung * 2) / 2;

        if (jumlahMinyakGoreng <= 0) {
          return NextResponse.json(
            {
              message:
                "Volume minyak jelantah belum mencukupi untuk mendapatkan minyak goreng.",
            },
            { status: 400 }
          );
        }

        statusBaru = "SELESAI";

        keterangan =
          `Penukaran selesai. Volume jelantah ${volumeRiil} liter. ` +
          `Rasio ${rasio}:1. ` +
          `Hasil perhitungan ${hasilHitung.toFixed(2)} liter. ` +
          `Minyak goreng yang diberikan ${jumlahMinyakGoreng.toFixed(1)} liter.`;

        dataUpdate.volumeRiil = volumeRiil;
        dataUpdate.namaPetugas = namaPetugas;
        dataUpdate.rasioJelantahPerLiter = rasio;
        dataUpdate.hasilHitungMinyakGoreng = hasilHitung;
        dataUpdate.jumlahMinyakGoreng = jumlahMinyakGoreng;

      } else {
        return NextResponse.json(
          { message: "Jenis penukaran tidak dikenali." },
          { status: 400 }
        );
      }

    } else {
      return NextResponse.json(
        { message: "Aksi tidak dikenali." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.pengajuan.update({
        where: { id: pengajuanId },
        data: {
          ...dataUpdate,
          status: statusBaru,
        },
      }),

      prisma.riwayatStatus.create({
        data: {
          pengajuanId,
          adminId: admin.id,
          status: statusBaru,
          keterangan,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Pengajuan berhasil diperbarui.",
      status: statusBaru,
    });

  } catch (error) {
    console.error("PATCH admin pengajuan error:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui pengajuan." },
      { status: 500 }
    );
  }
}