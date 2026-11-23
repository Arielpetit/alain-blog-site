import Link from "next/link";
import { ArrowUpRight, Film, ImageIcon, MapPin } from "lucide-react";
import type { Conference } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function DateBlock({ date, upcoming, lang, className }: { date: string; upcoming?: boolean; lang: Locale; className?: string }) {
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

type WithMedia = Conference & { videos?: unknown[]; photos?: unknown[] };

export function ConferenceItem({ conf, upcoming, lang }: { conf: WithMedia; upcoming?: boolean; lang: Locale }) {
  const t = getDictionary(lang);
  const nVideos = conf.videos?.length ?? 0;
  const nPhotos = (conf.photos?.length ?? 0) + (conf.image ? 1 : 0);
  return (
    <article className={cn("card hover-lift group relative flex h-full flex-col overflow-hidden", upcoming && "border-accent/40")}>
      {conf.image && (
        <div className="relative aspect-[16/9] overflow-hidden bg-navy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={conf.image} alt="" loading="lazy" className="img-zoom h-full w-full object-cover object-[center_22%]" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent" />
          <DateBlock date={conf.date} upcoming={upcoming} lang={lang} className="absolute bottom-3 left-4 shadow-lg sm:bottom-4 sm:left-6" />
        </div>
      )}
      <div className="flex flex-1 gap-4 p-4 sm:gap-5 sm:p-6">
        {!conf.image && <DateBlock date={conf.date} upcoming={upcoming} lang={lang} className="self-start" />}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">{conf.role}</span>
            {upcoming && <span className="badge badge-primary">{t.common.upcoming}</span>}
          </div>
          <h3 className="mt-2 text-base font-semibold leading-snug text-ink transition-colors group-hover:text-accent-dark sm:mt-2.5 sm:text-xl">
            <Link href={localePath(lang, `/conferences/${conf.id}`)} className="after:absolute after:inset-0">
              {conf.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm font-medium text-ink/75">{conf.event}</p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="size-3.5" aria-hidden /> {conf.location}
          </p>
          {conf.description && <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted sm:mt-3 sm:text-[0.95rem]">{conf.description}</p>}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-sm">
            <span className="inline-flex items-center gap-3 text-xs text-muted">
              {nVideos > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Film className="size-3.5" aria-hidden /> {nVideos}
                </span>
              )}
              {nPhotos > 0 && (
                <span className="inline-flex items-center gap-1">
                  <ImageIcon className="size-3.5" aria-hidden /> {nPhotos}
                </span>
              )}
              <span className="sr-only">{t.conferences.nMedia(nVideos, nPhotos)}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-accent-dark">
              {t.conferences.detail}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
