import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const harga = await prisma.harga.findFirst({
      where: {
        tanggalBerlaku: {
          lte: new Date(),
        },
      },
      orderBy: [
        {
          tanggalBerlaku: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        hargaPerLiter: true,
        rasioJelantahPerLiter: true,
        tanggalBerlaku: true,
      },
    });

    if (!harga) {
      return NextResponse.json({
        data: null,
      });
    }

    return NextResponse.json({
      data: {
        hargaPerLiter: Number(harga.hargaPerLiter),
        rasioJelantahPerLiter: Number(
          harga.rasioJelantahPerLiter
        ),
        tanggalBerlaku: harga.tanggalBerlaku,
      },
    });
  } catch (error) {
    console.error("GET harga publik error:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil informasi harga.",
      },
      { status: 500 }
    );
  }
}