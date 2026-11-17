
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

// VALIDASI ID USER
async function validasiUserId(params: Context["params"]) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

// GET DETAIL USER DAN RIWAYAT PENGAJUAN
export async function GET(
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

    const userId = await validasiUserId(params);

    if (!userId) {
      return NextResponse.json(
        { message: "ID pengguna tidak valid." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nama: true,
        email: true,
        noWhatsapp: true,
        alamat: true,
        aktif: true,
        createdAt: true,
        pengajuan: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            jumlahLiter: true,
            volumeRiil: true,
            jenisPenukaran: true,
            status: true,
            totalPembayaran: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const totalLiter = user.pengajuan.reduce(
      (total, item) =>
        total + Number(item.volumeRiil ?? item.jumlahLiter),
      0
    );

    return NextResponse.json({
      message: "Detail pengguna berhasil diambil.",
      user: {
        ...user,
        totalLiter,
        pengajuan: user.pengajuan.map((item) => ({
          ...item,
          jumlahLiter: Number(item.jumlahLiter),
          volumeRiil:
            item.volumeRiil === null
              ? null
              : Number(item.volumeRiil),
          totalPembayaran:
            item.totalPembayaran === null
              ? null
              : Number(item.totalPembayaran),
        })),
      },
    });
  } catch (error) {
    console.error("GET detail user error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail pengguna." },
      { status: 500 }
    );
  }
}

// PATCH MENGAKTIFKAN / MENONAKTIFKAN USER
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

    const userId = await validasiUserId(params);

    if (!userId) {
      return NextResponse.json(
        { message: "ID pengguna tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (typeof body.aktif !== "boolean") {
      return NextResponse.json(
        { message: "Status pengguna tidak valid." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        aktif: body.aktif,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        aktif: true,
      },
    });

    return NextResponse.json({
      message: `Pengguna berhasil ${
        body.aktif ? "diaktifkan" : "dinonaktifkan"
      }.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH manajemen user error:", error);

    return NextResponse.json(
      { message: "Gagal mengubah status pengguna." },
      { status: 500 }
    );
  }
}

// DELETE MENGHAPUS USER
export async function DELETE(
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

    const userId = await validasiUserId(params);

    if (!userId) {
      return NextResponse.json(
        { message: "ID pengguna tidak valid." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pengajuan: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    // JAGA RIWAYAT TRANSAKSI AGAR TIDAK HILANG
    if (user.pengajuan.length > 0) {
      return NextResponse.json(
        {
          message:
            "Pengguna tidak dapat dihapus karena memiliki riwayat pengajuan. Silakan nonaktifkan akunnya.",
        },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "Pengguna berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE manajemen user error:", error);

    return NextResponse.json(
      { message: "Gagal menghapus pengguna." },
      { status: 500 }
    );
  }
}
