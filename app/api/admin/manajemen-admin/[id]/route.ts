import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

// MENGUBAH STATUS ADMIN
export async function PATCH(
  request: Request,
  { params }: Context
) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Silakan login sebagai admin." },
        { status: 401 }
      );
    }

    if (session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { message: "Hanya Super Admin yang dapat mengubah status admin." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const adminId = Number(id);

    if (!Number.isInteger(adminId) || adminId <= 0) {
      return NextResponse.json(
        { message: "ID admin tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (typeof body.aktif !== "boolean") {
      return NextResponse.json(
        { message: "Status admin tidak valid." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Admin tidak ditemukan." },
        { status: 404 }
      );
    }

    if (admin.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { message: "Status Super Admin tidak dapat diubah melalui fitur ini." },
        { status: 403 }
      );
    }

    const adminDiperbarui = await prisma.admin.update({
      where: { id: adminId },
      data: {
        aktif: body.aktif,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        aktif: true,
      },
    });

    return NextResponse.json({
      message: "Status admin berhasil diperbarui.",
      data: adminDiperbarui,
    });
  } catch (error) {
    console.error("PATCH manajemen admin error:", error);

    return NextResponse.json(
      { message: "Gagal mengubah status admin." },
      { status: 500 }
    );
  }
}