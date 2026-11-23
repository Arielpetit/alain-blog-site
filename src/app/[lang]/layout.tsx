import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getProfile } from "@/lib/db";
import { SITE_URL } from "@/lib/utils";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeProfile } from "@/i18n/content";

type Params = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const p = localizeProfile(await getProfile(), lang);
  const t = getDictionary(lang);
  const description =
    lang === "en"
      ? `${p.name} — ${p.title}, ${p.institution}. Publications, analysis and contact: public financial governance, financial litigation and control of public property in Cameroon.`
      : `${p.name} — ${p.title}, ${p.institution}. Publications, analyses et contact : gouvernance financière publique, contentieux financier et contrôle des biens publics au Cameroun.`;
  return {
    title: { default: `${p.name} — ${p.title}`, template: `%s · ${p.name}` },
    description,
    applicationName: p.name,
    authors: [{ name: p.name, url: SITE_URL }],
    creator: p.name,
    keywords:
      lang === "en"
        ? ["public finance", "public financial governance", "financial litigation", "public law", "Cameroon", "University of Dschang", p.name]
        : ["finances publiques", "gouvernance financière publique", "contentieux financier", "droit public", "Cameroun", "Université de Dschang", p.name],
    openGraph: {
      type: "profile",
      locale: t.meta.locale,
      alternateLocale: lang === "en" ? "fr_FR" : "en_US",
      url: localePath(lang, "/"),
      siteName: p.name,
      title: `${p.name} — ${p.title}`,
      description,
    },
    twitter: { card: "summary_large_image", title: `${p.name} — ${p.title}`, description },
    alternates: {
      types: { "application/rss+xml": `${SITE_URL}/rss.xml` },
    },
  };
}

export default async function SiteLayout({ children, params }: Params & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const profile = localizeProfile(await getProfile(), lang);
  const t = getDictionary(lang);
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenu" className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50">
        {t.nav.skip}
      </a>
      <Header name={profile.name} tagline={t.nav.brandLine} lang={lang} t={t.nav} />
      <main id="contenu" className="flex-1">{children}</main>
      <Footer profile={profile} lang={lang} t={t} />
    </div>
  );
}
