import { getProfile } from "@/lib/db";
import { brandImage, OG_SIZE } from "@/lib/og";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeProfile } from "@/i18n/content";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Dr Alain Bienvenu Gnassoumari";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang = isLocale(l) ? l : "fr";
  const p = localizeProfile(await getProfile(), lang);
  return brandImage({
    eyebrow: getDictionary(lang).nav.brandLine,
    title: p.name,
    subtitle: p.title,
    footer: p.institution,
  });
}
