import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

let client: SupabaseClient | undefined;

/**
 * Client serveur avec la clé secrète : contourne la RLS.
 * Utilisé uniquement côté serveur (lectures publiques et écritures
 * après vérification de l'administrateur).
 */
export function supabaseAdmin() {
  if (!client) {
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!SUPABASE_URL || !key) throw new Error("Variables Supabase manquantes (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY).");
    client = createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}
