import { getProfile, getPublicationById } from "@/lib/db";
import { brandImage, OG_SIZE } from "@/lib/og";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeProfile, localizePublication } from "@/i18n/content";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Publication";

export default async function Image({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang: l, id } = await params;
  const lang = isLocale(l) ? l : "fr";
  const [raw, profile] = await Promise.all([getPublicationById(id), getProfile()]);
  const p = localizeProfile(profile, lang);
  const pub = raw ? localizePublication(raw, lang) : null;
  const t = getDictionary(lang);
  const title = pub ? (pub.title.length > 110 ? `${pub.title.slice(0, 107)}…` : pub.title) : p.name;
  return brandImage({
    eyebrow: pub ? `${t.publications.types[pub.type]} · ${pub.year}` : t.nav.brandLine,
    title,
    subtitle: pub ? pub.venue.split(" — ")[0].replace(/^[^(]*\(([^)]+)\),\s*/, "$1, ").replace(/,\s*pp?\..*$/, "") : p.title,
    footer: p.name,
  });
}
