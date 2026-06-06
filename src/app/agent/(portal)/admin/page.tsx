import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listUsers } from "@/lib/admins";
import { AdminManager } from "@/components/portal/AdminManager";

export const metadata: Metadata = { title: "Akun Admin" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin") redirect("/agent/dashboard");

  const users = listUsers();

  return (
    <div className="px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
      <AdminManager initialUsers={users} />
    </div>
  );
}
