
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

// MENGAMBIL DATA PENGAJUAN DAN HARGA TERBARU
export async function GET() {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const [pengajuan, hargaTerbaru] = await Promise.all([
      prisma.pengajuan.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              nama: true,
              email: true,
              noWhatsapp: true,
              alamat: true,
            },
          },
          riwayatStatus: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              admin: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
      }),

      prisma.harga.findFirst({
        orderBy: [
          {
            tanggalBerlaku: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      }),
    ]);

    return NextResponse.json({
      message: "Data pengajuan berhasil diambil.",
      data: pengajuan,

      // Harga pembelian minyak jelantah
      hargaPerLiter: hargaTerbaru
        ? Number(hargaTerbaru.hargaPerLiter)
        : null,

      // Rasio penukaran minyak goreng
      rasioJelantahPerLiter: hargaTerbaru
        ? Number(hargaTerbaru.rasioJelantahPerLiter)
        : null,
    });
  } catch (error) {
    console.error("GET admin pengajuan error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data pengajuan." },
      { status: 500 }
    );
  }
}
