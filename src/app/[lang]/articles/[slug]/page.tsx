import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Languages } from "lucide-react";
import { getArticleBySlug, getArticles, getProfile } from "@/lib/db";
import { formatDate, readingTime, SITE_URL } from "@/lib/utils";
import { extractToc, Markdown } from "@/components/site/Markdown";
import { ShareButtons } from "@/components/site/ShareButtons";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { TableOfContents } from "@/components/site/TableOfContents";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Portrait } from "@/components/site/Portrait";
import { Reveal } from "@/components/site/Reveal";
import { isLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeArticle, localizeProfile } from "@/i18n/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; slug: string }> };

async function resolve(params: Props["params"]) {
  const { lang: l, slug } = await params;
  const lang: Locale = isLocale(l) ? l : "fr";
  return { lang, slug };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await resolve(params);
  const raw = await getArticleBySlug(slug);
  if (!raw) return { title: getDictionary(lang).articles.notFound };
  const article = localizeArticle(raw, lang);
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: localePath(lang, `/articles/${article.slug}`),
      languages: { fr: `/articles/${article.slug}`, en: `/en/articles/${article.slug}` },
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      modifiedTime: article.updatedAt,
      ...(article.cover ? { images: [article.cover] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { lang, slug } = await resolve(params);
  const t = getDictionary(lang);
  const [raw, rawAll, rawProfile] = await Promise.all([getArticleBySlug(slug), getArticles(), getProfile()]);
  if (!raw) notFound();

  const article = localizeArticle(raw, lang);
  const all = rawAll.map((a) => localizeArticle(a, lang));
  const profile = localizeProfile(rawProfile, lang);
  const toc = extractToc(article.content);
  const index = all.findIndex((a) => a.id === article.id);
  const newer = index > 0 ? all[index - 1] : undefined;
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;
  const related = all
    .filter((a) => a.id !== article.id)
    .map((a) => ({ a, score: (a.category === article.category ? 2 : 0) + a.tags.filter((tag) => article.tags.includes(tag)).length }))
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map((x) => x.a);
  const path = localePath(lang, `/articles/${article.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    inLanguage: lang,
    datePublished: article.date,
    dateModified: article.updatedAt,
    image: article.cover || undefined,
    author: { "@type": "Person", name: profile.name, jobTitle: profile.title },
    mainEntityOfPage: `${SITE_URL}${path}`,
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <article>
        <header className="relative overflow-hidden border-b border-line bg-gradient-to-b from-accent-soft/60 to-paper">
          <div className="container-page max-w-4xl pb-12 pt-10 md:pb-16 md:pt-14">
            <Link href={localePath(lang, "/articles")} className="group inline-flex animate-fade-in items-center gap-1.5 text-sm text-muted hover:text-ink">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden /> {t.articles.all}
            </Link>
            <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <Link href={localePath(lang, `/articles?categorie=${encodeURIComponent(article.category)}`)} className="badge transition-colors hover:bg-accent hover:text-white">
                {article.category}
              </Link>
              <time dateTime={article.date}>{formatDate(article.date, undefined, lang)}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden /> {readingTime(article.content)} {t.common.minRead}
              </span>
            </div>
            <h1 className="mt-4 animate-fade-up text-[1.7rem] font-semibold leading-[1.15] text-ink [animation-delay:80ms] sm:mt-5 sm:text-[2.3rem] md:text-[3.4rem]">
              {article.title}
            </h1>
            <p className="mt-4 animate-fade-up text-base leading-relaxed text-muted [animation-delay:160ms] sm:mt-5 sm:text-lg md:text-xl">{article.excerpt}</p>
            <div className="mt-8 flex animate-fade-up flex-col gap-5 [animation-delay:240ms] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Portrait name={profile.name} photo={profile.photo} avatar className="size-11 text-sm" />
                <div className="text-sm">
                  <p className="font-medium text-ink">{profile.name}</p>
                  <p className="text-muted">{profile.title}</p>
                </div>
              </div>
              <ShareButtons title={article.title} path={path} lang={lang} />
            </div>
          </div>
        </header>

        {article.cover && (
          <div className="container-page max-w-5xl pt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.cover} alt="" className="aspect-[2/1] w-full animate-clip-up rounded-3xl object-cover shadow-xl shadow-navy/10 [animation-delay:200ms]" />
          </div>
        )}

        <div className="container-page grid grid-cols-1 max-w-6xl gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0 max-w-3xl">
            {!article.translated && (
              <p className="mb-8 flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted">
                <Languages className="size-4 shrink-0 text-accent" aria-hidden /> {t.common.translationMissing}
              </p>
            )}
            <Markdown lang={article.translated ? lang : "fr"}>{article.content}</Markdown>

            {article.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2" aria-label={t.articles.tags}>
                {article.tags.map((tag) => (
                  <li key={tag}>
                    <Link href={localePath(lang, `/articles?q=${encodeURIComponent(tag)}`)} className="chip text-sm">
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Reveal className="card mt-12 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
              <Portrait name={profile.name} photo={profile.photo} avatar className="size-16 shrink-0 text-xl" />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-dark">{t.articles.aboutAuthor}</p>
                <p className="mt-1 font-serif text-xl font-semibold text-ink">{profile.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{profile.bioShort}</p>
              </div>
              <Link href={localePath(lang, "/contact")} className="btn btn-outline shrink-0">{t.articles.discuss}</Link>
            </Reveal>

            {(newer || older) && (
              <nav aria-label={t.articles.pagination} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {older ? (
                  <Link href={localePath(lang, `/articles/${older.slug}`)} className="card hover-lift group p-5">
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden /> {t.articles.previous}
                    </span>
                    <p className="mt-2 font-serif font-semibold leading-snug text-ink group-hover:text-accent-dark">{older.title}</p>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}
                {newer && (
                  <Link href={localePath(lang, `/articles/${newer.slug}`)} className="card hover-lift group p-5 sm:text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      {t.articles.next} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                    <p className="mt-2 font-serif font-semibold leading-snug text-ink group-hover:text-accent-dark">{newer.title}</p>
                  </Link>
                )}
              </nav>
            )}
          </div>

          {toc.length > 1 && (
            <aside className="hidden lg:block">
              <TableOfContents items={toc} title={t.articles.toc} />
            </aside>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface py-16 md:py-24">
          <div className="container-page">
            <Reveal>
              <p className="eyebrow">{t.home.articlesEyebrow}</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink sm:mt-3 sm:text-3xl md:text-4xl">{t.articles.related}</h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((a, i) => (
                <Reveal key={a.id} delay={i * 100} className="h-full">
                  <ArticleCard article={a} lang={lang} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
