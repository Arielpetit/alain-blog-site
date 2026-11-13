import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/db";
import { SITE_URL } from "@/lib/utils";
import { localePath } from "@/i18n/config";

export const dynamic = "force-dynamic";

const PAGES = ["/", "/a-propos", "/publications", "/articles", "/conferences", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const entry = (path: string, extra: Partial<MetadataRoute.Sitemap[number]> = {}) => ({
    url: `${SITE_URL}${localePath("fr", path)}`,
    alternates: { languages: { fr: `${SITE_URL}${localePath("fr", path)}`, en: `${SITE_URL}${localePath("en", path)}` } },
    ...extra,
  });
  return [
    ...PAGES.map((p) => entry(p, { changeFrequency: "weekly", priority: p === "/" ? 1 : 0.8 })),
    ...articles.map((a) => entry(`/articles/${a.slug}`, { lastModified: a.updatedAt, priority: 0.7 })),
  ];
}
