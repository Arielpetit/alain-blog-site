import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Liens e-mail Supabase au format « token_hash » (récupération, invitation).
 * Modèle d'e-mail conseillé (Authentication > Emails > Reset password) :
 * {{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/admin/compte
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next") ?? "/admin";
  const safeNext = next.startsWith("/admin") ? next : "/admin";

  if (token_hash && type) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      const dest = new URL(safeNext, url.origin);
      if (type === "recovery") dest.searchParams.set("reinit", "1");
      return NextResponse.redirect(dest);
    }
  }
  return NextResponse.redirect(new URL("/admin/connexion?erreur=lien", url.origin));
}
