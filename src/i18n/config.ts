export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const isLocale = (v: string | undefined | null): v is Locale => LOCALES.includes(v as Locale);

/**
 * Le français est servi sans préfixe (/articles), l'anglais sous /en (/en/articles).
 * Certaines routes ont un nom anglais : /a-propos ⇄ /en/about.
 */
export const EN_ALIASES: Record<string, string> = {
  "/a-propos": "/about",
};

/** Construit un lien vers une page interne dans la langue voulue. */
export function localePath(lang: Locale, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === "fr") return clean;
  const [pathname, query = ""] = clean.split("?");
  const alias = Object.entries(EN_ALIASES).find(([fr]) => pathname === fr || pathname.startsWith(`${fr}/`));
  const p = alias ? pathname.replace(alias[0], alias[1]) : pathname;
  return `/en${p === "/" ? "" : p}${query ? `?${query}` : ""}`;
}

/** Chemin interne (français) correspondant à une URL anglaise publique. */
export function internalEnPath(publicPath: string) {
  const alias = Object.entries(EN_ALIASES).find(([, en]) => publicPath === en || publicPath.startsWith(`${en}/`));
  return alias ? publicPath.replace(alias[1], alias[0]) : publicPath;
}

/** Retire le préfixe de langue d'un chemin public. */
export function stripLocale(pathname: string): { lang: Locale; path: string } {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { lang: "en", path: internalEnPath(pathname.slice(3) || "/") };
  }
  return { lang: "fr", path: pathname };
}

/** Résout la langue depuis les paramètres de route d'une page. */
export async function langFromParams(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}
