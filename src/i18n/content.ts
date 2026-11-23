import type { Article, Conference, Profile, Publication } from "@/lib/types";
import type { Locale } from "./config";

/** Valeur traduite si disponible et non vide, sinon valeur d'origine (français). */
function pick<T>(base: T, tr: T | undefined): T {
  if (tr === undefined || tr === null) return base;
  if (typeof tr === "string" && !tr.trim()) return base;
  if (Array.isArray(tr) && tr.length === 0) return base;
  return tr;
}

export function localizeArticle(a: Article, lang: Locale): Article & { translated: boolean } {
  const en = lang === "en" ? a.i18n?.en : undefined;
  if (!en) return { ...a, category: lang === "en" && a.category === "Analyse" ? "Analysis" : a.category, translated: lang === "fr" };
  return {
    ...a,
    title: pick(a.title, en.title),
    excerpt: pick(a.excerpt, en.excerpt),
    content: pick(a.content, en.content),
    category: pick(a.category === "Analyse" ? "Analysis" : a.category, en.category),
    translated: !!en.content?.trim(),
  };
}

export function localizePublication(p: Publication, lang: Locale): Publication & { summary: string } {
  const summary = p.i18n?.fr?.summary ?? "";
  const en = lang === "en" ? p.i18n?.en : undefined;
  if (!en) return { ...p, summary };
  return {
    ...p,
    title: pick(p.title, en.title),
    abstract: pick(p.abstract, en.abstract),
    venue: pick(p.venue, en.venue),
    summary: pick(summary, en.summary),
  };
}

export function localizeConference(c: Conference, lang: Locale): Conference & { videos: { title: string; url: string; poster?: string }[]; photos: { url: string; caption?: string }[] } {
  const photos = c.i18n?.fr?.photos ?? [];
  const videos = (c.i18n?.fr?.videos ?? []).map((v) => ({ title: lang === "en" && v.titleEn ? v.titleEn : v.title, url: v.url, poster: v.poster }));
  const en = lang === "en" ? c.i18n?.en : undefined;
  if (!en) return { ...c, videos, photos };
  return {
    ...c,
    videos,
    photos,
    title: pick(c.title, en.title),
    event: pick(c.event, en.event),
    location: pick(c.location, en.location),
    role: pick(c.role, en.role),
    description: pick(c.description, en.description),
  };
}

export function localizeProfile(p: Profile, lang: Locale): Profile {
  const en = lang === "en" ? p.en : undefined;
  if (!en) return p;
  return {
    ...p,
    title: pick(p.title, en.title),
    tagline: pick(p.tagline, en.tagline),
    bioShort: pick(p.bioShort, en.bioShort),
    bioLong: pick(p.bioLong, en.bioLong),
    institution: pick(p.institution, en.institution),
    stats: pick(p.stats, en.stats),
    expertise: pick(p.expertise, en.expertise),
    education: pick(p.education, en.education),
    experience: pick(p.experience, en.experience),
    distinctions: pick(p.distinctions, en.distinctions),
  };
}
