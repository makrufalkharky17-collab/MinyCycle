import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminNavbar from "./components/AdminNavbar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7]">
      <AdminNavbar />

      <main className="min-h-screen pt-16 lg:ml-[270px] lg:pt-0">
        {children}
      </main>
    </div>
  );
}