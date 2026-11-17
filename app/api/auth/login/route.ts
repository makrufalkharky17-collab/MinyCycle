
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const pengguna = await prisma.user.findUnique({
      where: { email },
    });

    if (!pengguna) {
      return NextResponse.json(
        { message: "Email atau password salah." },
        { status: 401 }
      );
    }

    // Memeriksa apakah akun pengguna masih aktif
    if (!pengguna.aktif) {
      return NextResponse.json(
        {
          message:
            "Akun kamu sedang dinonaktifkan oleh admin. Silakan hubungi admin MinyCycle.",
        },
        { status: 403 }
      );
    }

    const passwordCocok = await bcrypt.compare(
      password,
      pengguna.passwordHash
    );

    if (!passwordCocok) {
      return NextResponse.json(
        { message: "Email atau password salah." },
        { status: 401 }
      );
    }

    const secret = process.env.SESSION_SECRET;

    if (!secret) {
      throw new Error("SESSION_SECRET belum diatur.");
    }

    const secretKey = new TextEncoder().encode(secret);

    const token = await new SignJWT({
      role: "USER",
      nama: pengguna.nama,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(pengguna.id.toString())
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const response = NextResponse.json({
      message: "Login berhasil.",
      data: {
        id: pengguna.id,
        nama: pengguna.nama,
        email: pengguna.email,
      },
    });

    response.cookies.set("minycycle_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
