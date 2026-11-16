import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";
import { isAllowedAdmin } from "./admins";

export type AdminIdentity = { id: string; email: string };

/**
 * Vérifie la session via getClaims() : signature du JWT contrôlée localement
 * (clés asymétriques ES256 du projet), sans aller-retour réseau vers Supabase.
 * Mis en cache pour toute la durée d'une requête (layout + page + actions).
 */
export const getAdminUser = cache(async (): Promise<AdminIdentity | null> => {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const email = typeof claims?.email === "string" ? claims.email : null;
  return claims?.sub && isAllowedAdmin(email) ? { id: claims.sub, email: email! } : null;
});

/** À appeler au début de chaque page et Server Action d'administration. */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/connexion");
  return user;
}

/** Profil complet (dernière connexion…) : un appel réseau, réservé à « Mon compte ». */
export async function getAdminAccount() {
  await requireAdmin();
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
