
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

    // MENCARI AKUN ADMIN
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Email atau password admin salah." },
        { status: 401 }
      );
    }

    // MEMERIKSA STATUS AKUN
    if (!admin.aktif) {
      return NextResponse.json(
        {
          message:
            "Akun admin kamu sedang dinonaktifkan. Silakan hubungi Super Admin.",
        },
        { status: 403 }
      );
    }

    // MEMERIKSA PASSWORD
    const passwordCocok = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordCocok) {
      return NextResponse.json(
        { message: "Email atau password admin salah." },
        { status: 401 }
      );
    }

    // MEMBUAT SESSION ADMIN
    const secret = process.env.SESSION_SECRET;

    if (!secret) {
      throw new Error("SESSION_SECRET belum diatur.");
    }

    const secretKey = new TextEncoder().encode(secret);

    const token = await new SignJWT({
      role: "ADMIN",
      nama: admin.nama,
      email: admin.email,
      adminRole: admin.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(admin.id.toString())
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const response = NextResponse.json({
      message: "Login admin berhasil.",
      data: {
        id: admin.id,
        nama: admin.nama,
        email: admin.email,
        role: admin.role,
      },
    });

    response.cookies.set("minycycle_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login admin error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
