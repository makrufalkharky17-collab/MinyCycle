const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function tanya(pertanyaan) {
  return new Promise((resolve) => {
    rl.question(pertanyaan, resolve);
  });
}

async function buatAdmin() {
  try {
    console.log("\n=== PEMBUATAN ADMIN MINYCYCLE ===\n");

    const nama = (await tanya("Nama admin: ")).trim();
    const email = (await tanya("Email admin: ")).trim().toLowerCase();
    const password = await tanya("Password admin: ");

    if (!nama || !email || !password) {
      console.log("\nSemua data wajib diisi.");
      return;
    }

    if (password.length < 8) {
      console.log("\nPassword minimal 8 karakter.");
      return;
    }

    const adminLama = await prisma.admin.findUnique({
      where: { email },
    });

    if (adminLama) {
      console.log("\nEmail tersebut sudah terdaftar sebagai admin.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: {
        nama,
        email,
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });

    console.log("\nAdmin berhasil dibuat!");
    console.log("Nama  :", admin.nama);
    console.log("Email :", admin.email);
    console.log("Role  :", admin.role);
  } catch (error) {
    console.error("\nGagal membuat admin:", error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

buatAdmin();