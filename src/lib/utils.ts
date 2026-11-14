export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
  lang: "fr" | "en" = "fr",
) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { timeZone: "UTC", ...opts }).format(d);
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function initials(name: string) {
  const parts = name.replace(/^(Dr\.?|Pr\.?|Prof\.?)\s+/i, "").split(/\s+/).filter(Boolean);
  // Première et dernière initiale (prénom + nom de famille).
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Nom court pour les espaces réduits : « Dr Alain Bienvenu X » → « Dr Alain X ». */
export function shortName(name: string) {
  const m = name.match(/^((?:Dr|Pr|Prof)\.?\s+)?(.*)$/i);
  const prefix = m?.[1] ?? "";
  const parts = (m?.[2] ?? name).split(/\s+/).filter(Boolean);
  return parts.length > 2 ? `${prefix}${parts[0]} ${parts[parts.length - 1]}` : name;
}
