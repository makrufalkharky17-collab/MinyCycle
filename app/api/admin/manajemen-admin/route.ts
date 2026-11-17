import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

// MENGAMBIL DAFTAR ADMIN
export async function GET() {
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
        { message: "Hanya Super Admin yang dapat mengakses fitur ini." },
        { status: 403 }
      );
    }

    const admins = await prisma.admin.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        aktif: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Data admin berhasil diambil.",
      data: admins,
    });
  } catch (error) {
    console.error("GET manajemen admin error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data admin." },
      { status: 500 }
    );
  }
}

// MENAMBAHKAN ADMIN
export async function POST(request: Request) {
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
        { message: "Hanya Super Admin yang dapat menambahkan admin." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const nama = body.nama?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!nama || !email || !password) {
      return NextResponse.json(
        { message: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const emailSudahAda = await prisma.admin.findUnique({
      where: { email },
    });

    if (emailSudahAda) {
      return NextResponse.json(
        { message: "Email tersebut sudah terdaftar." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const adminBaru = await prisma.admin.create({
      data: {
        nama,
        email,
        passwordHash,
        role: "ADMIN",
        aktif: true,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        aktif: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Admin berhasil ditambahkan.",
        data: adminBaru,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST manajemen admin error:", error);

    return NextResponse.json(
      { message: "Gagal menambahkan admin." },
      { status: 500 }
    );
  }
}