import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        nama: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Data pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Data pengguna berhasil diambil.",
      data: user,
    });
  } catch (error) {
    console.error("Periksa session error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}