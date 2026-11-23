import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";
import { isAllowedAdmin } from "@/lib/admins";
import { internalEnPath } from "@/i18n/config";

const PUBLIC_ADMIN = ["/admin/connexion", "/admin/auth"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ---------- Administration : session Supabase ---------- */
  if (pathname.startsWith("/admin")) {
    const headers = new Headers(req.headers);
    headers.set("x-locale", "fr");
    let res = NextResponse.next({ request: { headers } });

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: { headers } });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    });
    // Vérification locale du JWT (rafraîchit la session si nécessaire).
    const { data: claimsData } = await supabase.auth.getClaims();
    const claims = claimsData?.claims;
    const data = { user: claims?.sub ? { email: typeof claims.email === "string" ? claims.email : undefined } : null };

    if (PUBLIC_ADMIN.some((p) => pathname.startsWith(p))) return res;
    if (!data.user || !isAllowedAdmin(data.user.email)) {
      const url = new URL("/admin/connexion", req.url);
      url.searchParams.set("next", pathname);
      if (data.user) url.searchParams.set("erreur", "non-autorise");
      return NextResponse.redirect(url);
    }
    return res;
  }

  /* ---------- Site public : langue ---------- */
  // Les images de partage générées par Next vivent sous /fr/… : les servir telles quelles.
  if (/^\/fr\/(opengraph|twitter)-image\/?$/.test(pathname)) return NextResponse.next();

  // /fr/... → URL canonique sans préfixe
  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const lang = isEn ? "en" : "fr";
  const rest = isEn ? internalEnPath(pathname.slice(3) || "/") : pathname;

  const headers = new Headers(req.headers);
  headers.set("x-locale", lang);
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${rest === "/" ? "" : rest}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Exclut les fichiers statiques et les routes techniques (rss.xml, sitemap.xml…).
  matcher: ["/((?!_next/|api/|favicon|icon|apple-icon|.*\\..*).*)"],
};
