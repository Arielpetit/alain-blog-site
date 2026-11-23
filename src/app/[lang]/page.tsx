import type { Metadata } from "next";
import { shortName, SITE_URL } from "@/lib/utils";
import { pageAlternates } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, BookOpen, Landmark, Scale, ShieldCheck } from "lucide-react";
import { getArticles, getConferences, getProfile, getPublications } from "@/lib/db";
import { Portrait } from "@/components/site/Portrait";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArticleCard } from "@/components/site/ArticleCard";
import { PublicationItem } from "@/components/site/PublicationItem";
import { ConferenceItem } from "@/components/site/ConferenceItem";
import { SocialLinks } from "@/components/site/SocialLinks";
import { Reveal } from "@/components/site/Reveal";
import { CountUp } from "@/components/site/CountUp";
import { isLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeArticle, localizeConference, localizeProfile, localizePublication } from "@/i18n/content";

export const dynamic = "force-dynamic";

const EXPERTISE_ICONS = [Landmark, ShieldCheck, Scale, BookOpen];
const CTA_IMAGE = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1800&q=80&auto=format&fit=crop";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return { alternates: pageAlternates(isLocale(lang) ? lang : "fr", "/") };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang: Locale = isLocale(l) ? l : "fr";
  const t = getDictionary(lang);
  const [rawProfile, rawArticles, rawPubs, rawConfs] = await Promise.all([
    getProfile(),
    getArticles(),
    getPublications(),
    getConferences(),
  ]);
  const profile = localizeProfile(rawProfile, lang);
  const articles = rawArticles.map((a) => localizeArticle(a, lang));
  const publications = rawPubs.map((p) => localizePublication(p, lang));
  const conferences = rawConfs.map((c) => localizeConference(c, lang));

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = conferences.filter((c) => c.date >= today).reverse().slice(0, 2);
  const recentPast = conferences.filter((c) => c.date < today).slice(0, 2 - upcoming.length);
  const events = [...upcoming, ...recentPast];
  const featured = publications.filter((p) => p.featured);
  const featuredPubs = (featured.length ? featured : publications).slice(0, 3);
  const [leadArticle, ...otherArticles] = articles;
  const href = (p: string) => localePath(lang, p);
  const nameWords = profile.name.split(" ");
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    honorificPrefix: "Dr",
    jobTitle: profile.title,
    url: SITE_URL,
    image: profile.photo || undefined,
    email: profile.email || undefined,
    description: profile.bioShort,
    alumniOf: { "@type": "CollegeOrUniversity", name: "Université de Dschang" },
    knowsAbout: profile.expertise.map((e) => e.title),
    sameAs: [profile.socials.linkedin, profile.socials.x, profile.socials.facebook, profile.socials.scholar].filter(
      (u) => u && !/search|results|\?q=|\?query=/i.test(u),
    ),
  };

  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: SITE_URL,
    inLanguage: ["fr", "en"],
    publisher: { "@type": "Person", name: profile.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }} />
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-accent-soft/80 blur-3xl dark:bg-accent-soft/60" />
        <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 size-80 rounded-full bg-accent-soft/40 blur-3xl" />
        <div className="container-page relative grid grid-cols-1 items-center gap-12 pb-16 pt-8 sm:pb-20 sm:pt-12 md:pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-28 lg:pt-20">
          <div className="lg:col-span-7">
            <p className="eyebrow animate-fade-up">{profile.institution}</p>
            <h1 className="mt-4 text-[1.85rem] font-semibold leading-[1.06] text-ink [overflow-wrap:anywhere] min-[400px]:text-[2.1rem] sm:mt-5 sm:text-5xl lg:text-[3.3rem] xl:text-[3.9rem]">
              {nameWords.map((w, i) => (
                <span key={i} className="animate-word" style={{ animationDelay: `${120 + i * 110}ms` }}>
                  {w}
                  {i < nameWords.length - 1 && " "}
                </span>
              ))}
            </h1>
            <p className="mt-3 animate-fade-up text-base font-medium text-accent-dark [animation-delay:380ms] sm:mt-4 sm:text-lg md:text-xl">
              {profile.title}
            </p>
            <blockquote className="mt-5 max-w-xl animate-fade-up border-l-2 border-accent pl-4 font-serif text-[1.2rem] italic leading-snug text-ink/90 [animation-delay:460ms] sm:mt-7 sm:pl-5 sm:text-2xl md:text-[1.75rem]">
              {profile.tagline}
            </blockquote>
            <p className="mt-5 max-w-xl animate-fade-up text-[0.95rem] leading-relaxed text-muted [animation-delay:540ms] sm:mt-6 sm:text-base md:text-lg">
              {profile.bioShort}
            </p>
            <div className="mt-7 flex animate-fade-up flex-col gap-2.5 [animation-delay:620ms] sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link href={href("/publications")} className="btn btn-primary px-5 py-3 sm:px-6 sm:py-3.5">
                {t.home.discover} <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href={href("/a-propos")} className="btn btn-outline px-5 py-3 sm:px-6 sm:py-3.5">
                {t.home.myPath}
              </Link>
            </div>
            <SocialLinks socials={profile.socials} email={profile.email} className="mt-7 animate-fade-up [animation-delay:700ms] sm:mt-9" />
          </div>

          <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-md lg:col-span-5 lg:max-w-none">
            <div aria-hidden className="absolute -inset-3 translate-x-4 translate-y-4 animate-fade-in rounded-[1.75rem] border border-accent/40 [animation-delay:900ms]" />
            <div className="relative aspect-[4/5] animate-clip-up overflow-hidden rounded-3xl bg-navy shadow-2xl shadow-navy/25 [animation-delay:200ms]">
              {profile.photo || profile.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.photo || profile.heroImage}
                  alt={profile.photo ? profile.name : ""}
                  className="h-full w-full animate-ken-burns object-cover"
                />
              ) : (
                <Portrait name={profile.name} photo="" className="h-full w-full rounded-none" />
              )}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-navy-deep/65 via-transparent to-navy-deep/50" />
              <div className="absolute inset-x-5 top-5 flex animate-fade-up items-center gap-3 [animation-delay:1100ms]">
                <Portrait name={profile.name} photo={profile.photo} avatar className="size-11 text-sm ring-2 ring-white/70" />
                <div className="min-w-0 leading-tight text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.45)]">
                  <p className="truncate font-serif text-base font-semibold">{shortName(profile.name)}</p>
                  <p className="mt-0.5 truncate text-xs text-white/85">{profile.institution}</p>
                </div>
              </div>
            </div>
            {featuredPubs[0] && (
              <Link
                href={featuredPubs[0].link || featuredPubs[0].pdfUrl || href(`/publications/${featuredPubs[0].id}`)}
                target={featuredPubs[0].link || featuredPubs[0].pdfUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="card group absolute -bottom-8 -left-3 right-6 animate-fade-up p-4 shadow-xl shadow-navy/15 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-accent/50 sm:-left-10 sm:right-auto sm:max-w-xs [animation-delay:1250ms] dark:shadow-black/50"
              >
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-accent-dark">
                  {t.home.featuredPub} · {featuredPubs[0].year}
                </p>
                <p className="mt-1.5 line-clamp-2 font-serif text-[0.98rem] font-semibold leading-snug text-ink transition-colors group-hover:text-accent-dark">
                  {featuredPubs[0].title}
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ================= Chiffres clés ================= */}
      {profile.stats.length > 0 && (
        <section aria-label={t.home.keyFigures} className="container-page relative z-10">
          <Reveal variant="scale" className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy-deep shadow-2xl shadow-navy/20 dark:shadow-black/40">
            <div aria-hidden className="grain absolute inset-0 -z-10" />
            <div aria-hidden className="absolute -left-20 -top-24 -z-10 size-72 rounded-full bg-accent/20 blur-3xl" />
            <div aria-hidden className="absolute -bottom-28 right-0 -z-10 size-72 rounded-full bg-accent/10 blur-3xl" />
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {profile.stats.map((s, i) => (
                <div
                  key={s.label}
                  className={[
                    "group relative flex flex-col px-4 py-6 sm:px-8 sm:py-8 md:py-10",
                    i % 2 === 0 ? "border-r border-white/10" : "",
                    i < 2 ? "border-b border-white/10 lg:border-b-0" : "",
                    i === 1 ? "lg:border-r" : "",
                    i === 3 ? "lg:border-r-0" : "",
                  ].join(" ")}
                >
                  <dt className="order-2 mt-2 text-xs leading-snug text-white/65 sm:mt-3 sm:text-sm">{s.label}</dt>
                  <dd className="order-1 font-serif text-[2rem] font-semibold leading-none text-white sm:text-5xl lg:text-[3.4rem]">
                    <CountUp value={s.value} lang={lang} />
                  </dd>
                  <span aria-hidden className="order-3 mt-4 block h-px w-10 sm:mt-5 origin-left bg-accent transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-20" />
                </div>
              ))}
            </dl>
          </Reveal>
        </section>
      )}

      {/* ================= Expertise ================= */}
      <section className="container-page py-14 sm:py-20 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow={t.home.expertiseEyebrow}
            title={t.home.expertiseTitle}
            description={t.home.expertiseText}
            href={href("/a-propos")}
            linkLabel={t.home.expertiseLink}
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {profile.expertise.map((e, i) => {
            const Icon = EXPERTISE_ICONS[i % EXPERTISE_ICONS.length];
            return (
              <Reveal key={e.title} delay={i * 100} className="h-full">
                <div className="card hover-lift group relative h-full overflow-hidden p-5 sm:p-6">
                  <span aria-hidden className="absolute right-4 top-3 font-serif text-4xl font-semibold text-line transition-colors duration-500 group-hover:text-accent-soft sm:right-5 sm:top-4 sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative grid size-10 place-items-center rounded-xl bg-accent-soft sm:size-11 text-accent-dark transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-fg">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="relative mt-4 text-lg font-semibold text-ink sm:mt-6 sm:text-xl">{e.title}</h3>
                  <p className="relative mt-1.5 text-sm leading-relaxed text-muted sm:mt-2 sm:text-[0.95rem]">{e.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ================= Articles ================= */}
      {leadArticle && (
        <section className="border-y border-line bg-surface py-14 sm:py-20 md:py-28">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                eyebrow={t.home.articlesEyebrow}
                title={t.home.articlesTitle}
                description={t.home.articlesText}
                href={href("/articles")}
                linkLabel={t.home.articlesLink}
              />
            </Reveal>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[leadArticle, ...otherArticles].slice(0, 3).map((a, i) => (
                <Reveal key={a.id} delay={i * 110} className="h-full">
                  <ArticleCard article={a} lang={lang} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= Publications ================= */}
      {featuredPubs.length > 0 && (
        <section className="container-page py-14 sm:py-20 md:py-28">
          <Reveal>
            <SectionHeading eyebrow={t.home.pubsEyebrow} title={t.home.pubsTitle} href={href("/publications")} linkLabel={t.home.pubsLink} />
          </Reveal>
          <div className="divide-y divide-line border-y border-line">
            {featuredPubs.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <PublicationItem pub={p} lang={lang} showAbstract={false} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ================= Agenda ================= */}
      {events.length > 0 && (
        <section className="container-page pb-14 sm:pb-20 md:pb-28">
          <Reveal>
            <SectionHeading
              eyebrow={t.home.agendaEyebrow}
              title={upcoming.length ? t.home.agendaUpcoming : t.home.agendaRecent}
              href={href("/conferences")}
              linkLabel={t.home.agendaLink}
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {events.map((c, i) => (
              <Reveal key={c.id} delay={i * 120} className="h-full">
                <ConferenceItem conf={c} lang={lang} upcoming={c.date >= today} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ================= Appel à l'action ================= */}
      <section className="container-page">
        <Reveal variant="scale" className="relative isolate overflow-hidden rounded-3xl bg-navy px-5 py-12 text-center sm:rounded-[2rem] sm:px-12 sm:py-16 md:py-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CTA_IMAGE} alt="" aria-hidden loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/70 to-navy-deep/95" />
          <p className="eyebrow justify-center text-accent before:hidden">{t.home.ctaEyebrow}</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-[1.45rem] font-semibold leading-snug text-white sm:mt-4 sm:text-3xl md:text-[2.6rem] md:leading-tight">
            {t.home.ctaTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:mt-4 sm:text-base">{t.home.ctaText}</p>
          <Link href={href("/contact")} className="btn btn-accent mt-7 px-6 py-3 sm:mt-9 sm:px-7 sm:py-3.5">
            {t.home.ctaButton} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
