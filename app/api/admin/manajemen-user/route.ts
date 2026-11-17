import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

// MENGAMBIL SELURUH DATA USER
export async function GET() {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        noWhatsapp: true,
        alamat: true,
        aktif: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Data pengguna berhasil diambil.",
      users,
    });
  } catch (error) {
    console.error("GET manajemen user error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data pengguna." },
      { status: 500 }
    );
  }
}