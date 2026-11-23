import type { Metadata } from "next";
import { getProfile } from "@/lib/db";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type Options = {
  lang: Locale;
  /** Chemin interne (français), ex. « /publications/abc ». */
  path: string;
  title?: string;
  description: string;
  type?: "website" | "article" | "profile";
  images?: string[];
  publishedTime?: string;
  modifiedTime?: string;
};

/** Liens canonique + hreflang d'une page (évite que toutes les pages se déclarent « accueil »). */
export function pageAlternates(lang: Locale, path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localePath(lang, path),
    languages: { fr: localePath("fr", path), en: localePath("en", path), "x-default": localePath("fr", path) },
  };
}

/** Métadonnées complètes d'une page : titre, description, canonique, hreflang, Open Graph et Twitter. */
export async function buildMetadata({ lang, path, title, description, type = "website", images, publishedTime, modifiedTime }: Options): Promise<Metadata> {
  const profile = await getProfile();
  const t = getDictionary(lang);
  const fullTitle = title ? `${title} · ${profile.name}` : undefined;
  const ogTitle = fullTitle ?? profile.name;
  // Image de partage : celle de la page si elle en a une, sinon la carte générée du site.
  const shareImages = images?.length ? images : [localePath(lang, "/opengraph-image")];
  return {
    ...(title ? { title } : {}),
    description,
    alternates: pageAlternates(lang, path),
    openGraph: {
      type,
      url: localePath(lang, path),
      siteName: profile.name,
      locale: t.meta.locale,
      alternateLocale: lang === "en" ? "fr_FR" : "en_US",
      title: ogTitle,
      description,
      images: shareImages,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: shareImages },
  };
}
