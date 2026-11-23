import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getConferences } from "@/lib/db";
import { PAGE_IMAGES, PageHeader } from "@/components/site/PageHeader";
import { ConferenceItem } from "@/components/site/ConferenceItem";
import { Reveal } from "@/components/site/Reveal";
import { langFromParams, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeConference } from "@/i18n/content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await langFromParams(params);
  const t = getDictionary(lang).conferences;
  return buildMetadata({ lang, path: "/conferences", title: t.title, description: t.description });
}

export default async function ConferencesPage({ params }: Props) {
  const lang = await langFromParams(params);
  const t = getDictionary(lang);
  const all = (await getConferences()).map((c) => localizeConference(c, lang));
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = all.filter((c) => c.date >= today).reverse();
  const past = all.filter((c) => c.date < today);
  const byYear = past.reduce<Record<string, typeof past>>((acc, c) => {
    (acc[c.date.slice(0, 4)] ||= []).push(c);
    return acc;
  }, {});

  return (
    <>
      <PageHeader eyebrow={t.conferences.eyebrow} title={t.conferences.title} description={t.conferences.description} image={PAGE_IMAGES.conferences} />
      <div className="container-page py-10 sm:py-14 md:py-20">
        {upcoming.length > 0 && (
          <section aria-labelledby="a-venir" className="mb-20">
            <Reveal>
              <h2 id="a-venir" className="flex items-center gap-3 text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
                {t.conferences.upcoming}
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
                </span>
              </h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {upcoming.map((c, i) => (
                <Reveal key={c.id} delay={i * 120} className="h-full">
                  <ConferenceItem conf={c} lang={lang} upcoming />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="passees">
          <Reveal>
            <h2 id="passees" className="text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">{t.conferences.past}</h2>
          </Reveal>
          {past.length === 0 && <p className="mt-6 text-muted">{t.conferences.nonePast}</p>}
          {Object.keys(byYear)
            .sort((a, b) => b.localeCompare(a))
            .map((year) => (
              <div key={year} className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[7rem_1fr]">
                <Reveal variant="left">
                  <p className="font-serif text-3xl font-semibold text-accent-dark sm:text-4xl md:sticky md:top-28">{year}</p>
                </Reveal>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {byYear[year].map((c, i) => (
                    <Reveal key={c.id} delay={i * 80} className="h-full">
                      <ConferenceItem conf={c} lang={lang} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
        </section>

        <Reveal className="card mt-14 flex flex-col items-start gap-4 p-5 sm:mt-20 sm:gap-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between md:p-10">
          <div>
            <p className="font-serif text-xl font-semibold text-ink sm:text-2xl md:text-3xl">{t.conferences.inviteTitle}</p>
            <p className="mt-1.5 text-muted">{t.conferences.inviteText}</p>
          </div>
          <Link
            href={localePath(lang, `/contact?objet=${encodeURIComponent(t.conferences.inviteSubject)}`)}
            className="btn btn-primary shrink-0 px-5 py-2.5 sm:px-6 sm:py-3"
          >
            {t.conferences.inviteButton} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </>
  );
}
