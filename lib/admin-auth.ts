
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("minycycle_admin_session")?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.SESSION_SECRET;

    if (!secret) {
      throw new Error("SESSION_SECRET belum diatur.");
    }

    const secretKey = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (
      payload.role !== "ADMIN" ||
      !payload.sub ||
      !payload.adminRole
    ) {
      return null;
    }

    // MEMERIKSA ADMIN DI DATABASE
    const admin = await prisma.admin.findUnique({
      where: {
        id: Number(payload.sub),
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        aktif: true,
      },
    });

    // MEMASTIKAN AKUN MASIH ADA DAN AKTIF
    if (!admin || !admin.aktif) {
      return null;
    }

    return {
      id: admin.id,
      nama: admin.nama,
      email: admin.email,
      role: admin.role,
    };
  } catch (error) {
    console.error("Admin session error:", error);
    return null;
  }
}
