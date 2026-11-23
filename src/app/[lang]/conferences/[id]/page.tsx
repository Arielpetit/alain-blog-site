import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ExternalLink, MapPin, PlayCircle, Presentation, UserRound, Users } from "lucide-react";
import { getConferences } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { DateBlock } from "@/components/site/ConferenceItem";
import { ConferenceItem } from "@/components/site/ConferenceItem";
import { PhotoGallery } from "@/components/site/PhotoGallery";
import { VideoGallery } from "@/components/site/VideoGallery";
import { ShareButtons } from "@/components/site/ShareButtons";
import { Reveal } from "@/components/site/Reveal";
import { isLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeConference } from "@/i18n/content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ lang: string; id: string }> };

async function load(params: Props["params"]) {
  const { lang: l, id } = await params;
  const lang: Locale = isLocale(l) ? l : "fr";
  const all = (await getConferences()).map((c) => localizeConference(c, lang));
  return { lang, all, conf: all.find((c) => c.id === id) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conf, lang } = await load(params);
  if (!conf) return {};
  return buildMetadata({
    lang,
    path: `/conferences/${conf.id}`,
    title: conf.title,
    description: conf.description || `${conf.event} — ${conf.location}`,
    type: "article",
    images: conf.image ? [conf.image] : undefined,
  });
}

export default async function ConferencePage({ params }: Props) {
  const { lang, all, conf } = await load(params);
  if (!conf) notFound();
  const t = getDictionary(lang);
  const c = t.conferences;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = conf.date >= today;
  const photos = [...(conf.image ? [{ url: conf.image, caption: undefined as string | undefined }] : []), ...conf.photos].filter((p, i, a) => a.findIndex((x) => x.url === p.url) === i);
  const others = all.filter((x) => x.id !== conf.id).slice(0, 2);
  const path = localePath(lang, `/conferences/${conf.id}`);

  const info = [
    { icon: Calendar, label: c.infoDate, value: formatDate(conf.date, undefined, lang) },
    { icon: Users, label: c.infoEvent, value: conf.event },
    { icon: MapPin, label: c.infoPlace, value: conf.location },
    { icon: UserRound, label: c.infoRole, value: conf.role },
  ].filter((i) => i.value);
  const isVideoLink = /youtu\.?be/.test(conf.link);

  return (
    <>
      <header className="relative isolate overflow-hidden bg-navy-deep text-white">
        {conf.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={conf.image} alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full animate-ken-burns object-cover object-[center_22%] opacity-30" />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/50" />
        <div className="container-page max-w-5xl py-10 sm:py-14 md:py-20">
          <Link href={localePath(lang, "/conferences")} className="group inline-flex animate-fade-in items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden /> {c.backToList}
          </Link>
          <div className="mt-7 flex animate-fade-up flex-wrap items-center gap-2">
            <span className="badge bg-accent/20 text-accent">{conf.role}</span>
            {upcoming && <span className="badge bg-white/15 text-white">{t.common.upcoming}</span>}
          </div>
          <h1 className="mt-4 max-w-3xl animate-fade-up text-[1.55rem] font-semibold leading-tight [animation-delay:80ms] sm:text-4xl md:text-5xl">{conf.title}</h1>
          <p className="mt-3 animate-fade-up text-sm text-white/75 [animation-delay:160ms] sm:text-base md:text-lg">
            {conf.event} · {conf.location}
          </p>
          <div className="mt-6 flex animate-fade-up items-center gap-4 [animation-delay:220ms]">
            <DateBlock date={conf.date} upcoming lang={lang} />
          </div>
        </div>
      </header>

      <div className="container-page grid max-w-5xl grid-cols-1 gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-12">
          {conf.description && (
            <Reveal>
              <h2 className="text-xl font-semibold text-ink sm:text-2xl">{c.about}</h2>
              <p className="mt-3 text-base leading-relaxed text-ink/85 sm:text-lg">{conf.description}</p>
            </Reveal>
          )}

          {conf.videos.length > 0 && (
            <Reveal>
              <h2 className="mb-4 text-xl font-semibold text-ink sm:text-2xl">
                {c.videos} <span className="text-base font-normal text-muted">({conf.videos.length})</span>
              </h2>
              <VideoGallery videos={conf.videos} closeLabel={t.nav.closeMenu} />
            </Reveal>
          )}

          {photos.length > 0 && (
            <Reveal>
              <h2 className="mb-4 text-xl font-semibold text-ink sm:text-2xl">
                {c.photos} <span className="text-base font-normal text-muted">({photos.length})</span>
              </h2>
              <PhotoGallery photos={photos} alt={conf.title} labels={{ close: t.nav.closeMenu, prev: c.prevPhoto, next: c.nextPhoto }} />
            </Reveal>
          )}

          <ShareButtons title={conf.title} path={path} lang={lang} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal variant="right" className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{c.info}</p>
            <dl className="mt-4 space-y-4">
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
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

          {(conf.link || conf.slidesUrl) && (
            <Reveal variant="right" delay={100} className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{c.resources}</p>
              <div className="mt-4 grid gap-2">
                {conf.link && (
                  <a href={conf.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full whitespace-normal text-center">
                    {isVideoLink ? <PlayCircle className="size-4" aria-hidden /> : <ExternalLink className="size-4" aria-hidden />} {isVideoLink ? c.video : c.program}
                  </a>
                )}
                {conf.slidesUrl && (
                  <a href={conf.slidesUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full whitespace-normal text-center">
                    <Presentation className="size-4" aria-hidden /> {c.slides}
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </aside>
      </div>

      {others.length > 0 && (
        <section className="border-t border-line bg-surface py-12 sm:py-16">
          <div className="container-page max-w-5xl">
            <h2 className="text-xl font-semibold text-ink sm:text-2xl">{c.others}</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {others.map((o, i) => (
                <Reveal key={o.id} delay={i * 90} className="h-full">
                  <ConferenceItem conf={o} lang={lang} upcoming={o.date >= today} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
