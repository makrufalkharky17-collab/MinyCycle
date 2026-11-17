
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { nama, email, password, noWhatsapp, alamat } = body;

    // Memeriksa semua data wajib
    if (!nama || !email || !password || !noWhatsapp || !alamat) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    // Memeriksa format email
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValid) {
      return NextResponse.json(
        { message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    // Memeriksa panjang password
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter." },
        { status: 400 }
      );
    }

    // Memeriksa apakah email sudah terdaftar
    const emailAda = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (emailAda) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    // Mengamankan password dengan bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    // Menyimpan pengguna ke database
    const pengguna = await prisma.user.create({
      data: {
        nama: nama.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        noWhatsapp: noWhatsapp.trim(),
        alamat: alamat.trim(),
      },
      select: {
        id: true,
        nama: true,
        email: true,
        noWhatsapp: true,
        alamat: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Registrasi berhasil.",
        data: pengguna,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registrasi error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
