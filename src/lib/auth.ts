import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";
import { isAllowedAdmin } from "./admins";

export async function getAdminUser() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user && isAllowedAdmin(data.user.email) ? data.user : null;
}

/** À appeler au début de chaque page et Server Action d'administration. */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/connexion");
  return user;
}
