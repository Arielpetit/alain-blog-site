import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, Calendar, ExternalLink, FileDown, Mail, Search, Tag, Users } from "lucide-react";
import { getProfile, getPublications } from "@/lib/db";
import { citations, scholarUrl } from "@/lib/citation";
import { SITE_URL } from "@/lib/utils";
import { CitationBox } from "@/components/site/CitationBox";
import { Markdown } from "@/components/site/Markdown";
import { ShareButtons } from "@/components/site/ShareButtons";
import { Portrait } from "@/components/site/Portrait";
import { Reveal } from "@/components/site/Reveal";
import { SocialLinks } from "@/components/site/SocialLinks";
import { isLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeProfile, localizePublication } from "@/i18n/content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ lang: string; id: string }> };

async function load(params: Props["params"]) {
  const { lang: l, id } = await params;
  const lang: Locale = isLocale(l) ? l : "fr";
  const all = (await getPublications()).map((p) => localizePublication(p, lang));
  return { lang, all, pub: all.find((p) => p.id === id) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pub, lang } = await load(params);
  if (!pub) return {};
  return {
    title: pub.title,
    description: pub.abstract || `${pub.authors} — ${pub.venue}`,
    alternates: { canonical: localePath(lang, `/publications/${pub.id}`) },
  };
}

export default async function PublicationPage({ params }: Props) {
  const { lang, all, pub } = await load(params);
  if (!pub) notFound();
  const t = getDictionary(lang);
  const profile = localizeProfile(await getProfile(), lang);
  const path = localePath(lang, `/publications/${pub.id}`);
  const related = all
    .filter((p) => p.id !== pub.id)
    .sort((a, b) => Number(b.type === pub.type) - Number(a.type === pub.type) || b.year - a.year)
    .slice(0, 3);

  const meta = [
    { icon: Users, label: t.publications.metaAuthors, value: pub.authors },
    { icon: BookOpen, label: t.publications.metaVenue, value: pub.venue },
    { icon: Calendar, label: t.publications.metaYear, value: String(pub.year) },
    { icon: Tag, label: t.publications.metaType, value: t.publications.types[pub.type] },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": pub.type === "ouvrage" ? "Book" : pub.type === "these" ? "Thesis" : "ScholarlyArticle",
    name: pub.title,
    author: pub.authors,
    datePublished: String(pub.year),
    abstract: pub.abstract,
    publisher: pub.venue,
    url: `${SITE_URL}${path}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className="relative overflow-hidden bg-navy-deep text-white">
        <div aria-hidden className="grain absolute inset-0" />
        <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="container-page relative max-w-5xl py-10 sm:py-14 md:py-20">
          <Link href={localePath(lang, "/publications")} className="group inline-flex animate-fade-in items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden /> {t.publications.backToList}
          </Link>
          <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-2">
            <span className="badge bg-accent/20 text-accent">{t.publications.types[pub.type]}</span>
            <span className="badge bg-white/10 text-white/80">{pub.year}</span>
          </div>
          <h1 className="mt-4 animate-fade-up text-[1.5rem] font-semibold leading-tight [animation-delay:80ms] sm:mt-5 sm:text-[2rem] md:text-5xl">{pub.title}</h1>
          <p className="mt-3 animate-fade-up text-sm text-white/70 [animation-delay:160ms] sm:mt-4 sm:text-base md:text-lg">
            {pub.authors} — <em>{pub.venue}</em>
          </p>
          {(pub.pdfUrl || pub.link) && (
            <div className="mt-6 flex animate-fade-up flex-col gap-2 [animation-delay:240ms] sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-2.5">
              {pub.pdfUrl && (
                <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent px-5 py-2.5 sm:px-6 sm:py-3">
                  <FileDown className="size-4" aria-hidden /> {t.publications.readPaper} (PDF)
                </a>
              )}
              {pub.link && (
                <a href={pub.link} target="_blank" rel="noopener noreferrer" className="btn border border-white/20 bg-white/5 px-5 py-2.5 text-white hover:bg-white/15 sm:px-6 sm:py-3">
                  <ExternalLink className="size-4" aria-hidden /> {t.publications.issuePage}
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="container-page grid grid-cols-1 max-w-5xl grid-cols-1 gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-10">
          {pub.abstract && (
            <Reveal>
              <h2 className="text-xl font-semibold text-ink sm:text-2xl">{t.publications.abstract}</h2>
              <p className="mt-3 font-serif text-base leading-relaxed text-ink/85 sm:mt-4 sm:text-lg md:text-xl">{pub.abstract}</p>
            </Reveal>
          )}

          {pub.summary && (
            <Reveal className="border-t border-line pt-10">
              <h2 className="text-xl font-semibold text-ink sm:text-2xl">{t.publications.summaryTitle}</h2>
              <Markdown className="no-dropcap mt-4" lang={lang}>{pub.summary}</Markdown>
            </Reveal>
          )}

          <Reveal>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {meta.map(({ icon: Icon, label, value }) => (
                <div key={label} className="card flex items-start gap-3 p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-dark">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-muted">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal>
            <CitationBox formats={citations(pub)} labels={{ title: t.publications.citeTitle, copy: t.common.copy, copied: t.publications.cited }} />
          </Reveal>

          <ShareButtons title={pub.title} path={path} lang={lang} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal variant="right" className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{t.publications.access}</p>
            <div className="mt-4 grid gap-2">
              {pub.pdfUrl && (
                <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent w-full whitespace-normal text-center">
                  <FileDown className="size-4" aria-hidden /> {t.publications.downloadPdf}
                </a>
              )}
              {pub.link && (
                <a href={pub.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full whitespace-normal text-center">
                  <ExternalLink className="size-4" aria-hidden /> {t.publications.external}
                </a>
              )}
              <a href={scholarUrl(pub)} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full whitespace-normal text-center">
                <Search className="size-4" aria-hidden /> {t.publications.scholar}
              </a>
              {!pub.pdfUrl && (
                <>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{t.publications.noPdf}</p>
                  <Link
                    href={localePath(lang, `/contact?objet=${encodeURIComponent(`${t.publications.requestCopy} — ${pub.title}`)}`)}
                    className="btn btn-ghost w-full justify-start px-0 text-accent-dark hover:bg-transparent"
                  >
                    <Mail className="size-4" aria-hidden /> {t.publications.requestCopy}
                  </Link>
                </>
              )}
            </div>
          </Reveal>

          <Reveal variant="right" delay={100} className="card p-5">
            <div className="flex items-center gap-3">
              <Portrait name={profile.name} photo={profile.photo} avatar className="size-11 text-sm" />
              <div className="min-w-0">
                <p className="truncate font-serif font-semibold text-ink">{profile.name}</p>
                <p className="truncate text-xs text-muted">{profile.title}</p>
              </div>
            </div>
            <SocialLinks socials={profile.socials} email={profile.email} className="mt-4" />
          </Reveal>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface py-14 md:py-20">
          <div className="container-page max-w-5xl">
            <h2 className="text-2xl font-semibold text-ink md:text-3xl">{t.publications.related}</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 90} className="h-full">
                  <Link href={localePath(lang, `/publications/${p.id}`)} className="card hover-lift group flex h-full flex-col p-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted">
                      {p.year} · {t.publications.types[p.type]}
                    </span>
                    <span className="mt-2 flex-1 font-serif text-lg font-semibold leading-snug text-ink group-hover:text-accent-dark">{p.title}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-dark">
                      {t.publications.details} <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
