
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const konfirmasi = body.konfirmasi;

    // Validasi input
    if (!email || !password || !konfirmasi) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter." },
        { status: 400 }
      );
    }

    if (password !== konfirmasi) {
      return NextResponse.json(
        { message: "Konfirmasi password tidak sama." },
        { status: 400 }
      );
    }

    // Cari pengguna berdasarkan email
    const pengguna = await prisma.user.findUnique({
      where: { email },
    });

    if (!pengguna) {
      return NextResponse.json(
        { message: "Email tidak terdaftar." },
        { status: 404 }
      );
    }

    if (!pengguna.aktif) {
      return NextResponse.json(
        { message: "Akun kamu sedang dinonaktifkan oleh admin." },
        { status: 403 }
      );
    }

    // Enkripsi password baru
    const passwordHash = await bcrypt.hash(password, 12);

    // Simpan password baru ke database
    await prisma.user.update({
      where: { id: pengguna.id },
      data: {
        passwordHash,
      },
    });

    return NextResponse.json({
      message: "Password berhasil diperbarui. Silakan login kembali.",
    });
  } catch (error) {
    console.error("Lupa password error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
