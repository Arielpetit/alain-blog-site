import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getProfile } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { Toast } from "@/components/admin/Toast";
import { logout } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration" },
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const profile = await getProfile();
  return (
    <AdminShell name={profile.name} email={user.email ?? ""} logout={logout}>
      {children}
      <Toast />
    </AdminShell>
  );
}
