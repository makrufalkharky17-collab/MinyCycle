
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function getUserSession() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("minycycle_session")?.value;

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

    if (payload.role !== "USER" || !payload.sub) {
      return null;
    }

    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    // Periksa status akun langsung dari database
    const pengguna = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nama: true,
        aktif: true,
      },
    });

    // Tolak sesi jika pengguna tidak ditemukan atau dinonaktifkan
    if (!pengguna || !pengguna.aktif) {
      return null;
    }

    return {
      id: pengguna.id,
      nama: pengguna.nama,
      role: "USER" as const,
    };
  } catch {
    return null;
  }
}
