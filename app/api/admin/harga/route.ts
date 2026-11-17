import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

// MENGAMBIL RIWAYAT HARGA
export async function GET() {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const data = await prisma.harga.findMany({
      orderBy: [
        { tanggalBerlaku: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        admin: {
          select: {
            nama: true,
          },
        },
      },
    });

    const sekarang = new Date();

    // Mencari harga terbaru yang sudah berlaku
    const hargaAktif = data.find(
      (item) =>
        new Date(item.tanggalBerlaku).getTime() <=
        sekarang.getTime()
    );

    // Menentukan status setiap riwayat harga
    const dataDenganStatus = data.map((item) => {
      const tanggalBerlaku = new Date(item.tanggalBerlaku);

      let status = "Nonaktif";

      if (tanggalBerlaku.getTime() > sekarang.getTime()) {
        status = "Terjadwal";
      } else if (hargaAktif && item.id === hargaAktif.id) {
        status = "Aktif";
      }

      return {
        ...item,
        status,
      };
    });

    return NextResponse.json({
      message: "Riwayat harga berhasil diambil.",
      data: dataDenganStatus,
    });
  } catch (error) {
    console.error("GET admin harga error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil riwayat harga." },
      { status: 500 }
    );
  }
}

// MENAMBAHKAN HARGA DAN RASIO PENUKARAN BARU
export async function POST(request: Request) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const harga = Number(body.harga);
    const rasioDikirim = body.rasioJelantahPerLiter;
    const catatan = body.catatan?.trim();

    const tanggalEfektif = new Date(
      `${body.tanggalEfektif}T00:00:00`
    );

    if (!Number.isFinite(harga) || harga <= 0) {
      return NextResponse.json(
        { message: "Harga harus lebih dari 0." },
        { status: 400 }
      );
    }

    if (!catatan) {
      return NextResponse.json(
        { message: "Catatan perubahan harga wajib diisi." },
        { status: 400 }
      );
    }

    if (
      !body.tanggalEfektif ||
      Number.isNaN(tanggalEfektif.getTime())
    ) {
      return NextResponse.json(
        { message: "Tanggal efektif tidak valid." },
        { status: 400 }
      );
    }

    let rasioJelantahPerLiter: number;

    if (
      rasioDikirim !== undefined &&
      rasioDikirim !== null &&
      rasioDikirim !== ""
    ) {
      rasioJelantahPerLiter = Number(rasioDikirim);

      if (
        !Number.isFinite(rasioJelantahPerLiter) ||
        rasioJelantahPerLiter <= 0
      ) {
        return NextResponse.json(
          { message: "Rasio penukaran harus lebih dari 0." },
          { status: 400 }
        );
      }
    } else {
      const hargaTerakhir = await prisma.harga.findFirst({
        orderBy: {
          tanggalBerlaku: "desc",
        },
      });

      rasioJelantahPerLiter = hargaTerakhir
        ? Number(hargaTerakhir.rasioJelantahPerLiter)
        : 3;
    }

    const hargaBaru = await prisma.harga.create({
      data: {
        hargaPerLiter: harga,
        rasioJelantahPerLiter,
        tanggalBerlaku: tanggalEfektif,
        catatan,
        adminId: admin.id,
      },
    });

    const sekarang = new Date();

    return NextResponse.json(
      {
        message: "Harga dan rasio penukaran berhasil disimpan.",
        data: {
          ...hargaBaru,
          status:
            tanggalEfektif.getTime() <= sekarang.getTime()
              ? "Aktif"
              : "Terjadwal",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST admin harga error:", error);

    return NextResponse.json(
      { message: "Gagal menyimpan harga dan rasio penukaran." },
      { status: 500 }
    );
  }
}