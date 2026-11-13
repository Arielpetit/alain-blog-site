import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { countUnreadMessages, getProfile } from "@/lib/db";
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
  const [profile, unread] = await Promise.all([getProfile(), countUnreadMessages()]);
  return (
    <AdminShell name={profile.name} email={user.email ?? ""} unread={unread} logout={logout}>
      {children}
      <Toast />
    </AdminShell>
  );
}
