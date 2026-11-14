import { ExternalLink, MapPin, PlayCircle, Presentation } from "lucide-react";
import type { Conference } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

function DateBlock({ date, upcoming, lang, className }: { date: string; upcoming?: boolean; lang: Locale; className?: string }) {
  return (
    <div
      className={cn(
        "flex w-16 shrink-0 flex-col items-center justify-center rounded-xl py-3 text-center sm:w-20",
        upcoming ? "bg-primary text-primary-fg" : "bg-accent-soft text-accent-dark",
        className,
      )}
    >
      <span className="font-serif text-2xl font-semibold leading-none sm:text-3xl">{formatDate(date, { day: "2-digit" }, lang)}</span>
      <span className="mt-1 text-[0.7rem] font-medium uppercase tracking-wider">{formatDate(date, { month: "short" }, lang).replace(".", "")}</span>
      <span className={cn("text-[0.7rem]", upcoming ? "opacity-70" : "text-accent-dark/70")}>{new Date(date).getUTCFullYear()}</span>
    </div>
  );
}

export function ConferenceItem({ conf, upcoming, lang }: { conf: Conference; upcoming?: boolean; lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <article
      className={cn(
        "card hover-lift group flex h-full flex-col overflow-hidden",
        upcoming && "border-accent/40",
      )}
    >
      {conf.image && (
        <div className="relative aspect-[16/9] overflow-hidden bg-navy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={conf.image} alt={conf.title} loading="lazy" className="img-zoom h-full w-full object-cover object-[center_22%]" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent" />
          <DateBlock date={conf.date} upcoming={upcoming} lang={lang} className="absolute bottom-3 left-4 shadow-lg sm:bottom-4 sm:left-6" />
        </div>
      )}
      <div className="flex flex-1 gap-5 p-5 sm:p-6">
        {!conf.image && <DateBlock date={conf.date} upcoming={upcoming} lang={lang} className="self-start" />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">{conf.role}</span>
            {upcoming && <span className="badge badge-primary">{t.common.upcoming}</span>}
          </div>
          <h3 className="mt-2.5 text-lg font-semibold leading-snug text-ink sm:text-xl">{conf.title}</h3>
          <p className="mt-1 text-sm font-medium text-ink/75">{conf.event}</p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="size-3.5" aria-hidden /> {conf.location}
          </p>
          {conf.description && <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{conf.description}</p>}
          {(conf.link || conf.slidesUrl) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {conf.link && (
                <a href={conf.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  {/youtu\.?be/.test(conf.link) ? <PlayCircle className="size-3.5" aria-hidden /> : <ExternalLink className="size-3.5" aria-hidden />}
                  {/youtu\.?be/.test(conf.link) ? t.conferences.video : t.conferences.program}
                </a>
              )}
              {conf.slidesUrl && (
                <a href={conf.slidesUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <Presentation className="size-3.5" aria-hidden /> {t.conferences.slides}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
