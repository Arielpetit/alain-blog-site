import Link from "next/link";
import { ArrowUpRight, ExternalLink, FileDown } from "lucide-react";
import type { Publication } from "@/lib/types";
import { citations } from "@/lib/citation";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { CopyButton } from "./CopyButton";

export function PublicationItem({ pub, lang, showAbstract = true }: { pub: Publication; lang: Locale; showAbstract?: boolean }) {
  const t = getDictionary(lang).publications;
  const href = localePath(lang, `/publications/${pub.id}`);
  const external = pub.link || pub.pdfUrl || null;
  return (
    <article className="group relative -mx-4 grid grid-cols-1 gap-4 rounded-2xl px-4 py-6 transition-colors sm:py-8 duration-300 hover:bg-surface sm:-mx-6 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:px-6">
      <div className="flex items-center gap-3 sm:block">
        <p className="font-serif text-xl font-semibold text-accent-dark sm:text-2xl transition-transform duration-500 group-hover:translate-x-1 sm:text-[2rem]">{pub.year}</p>
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted sm:mt-1.5">{t.types[pub.type]}</p>
      </div>
      <div className="min-w-0">
        <h3 className="text-[1.05rem] font-semibold leading-snug text-ink transition-colors group-hover:text-accent-dark sm:text-xl">
          {external ? (
            <a href={external} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-2xl">
              {pub.title}
            </a>
          ) : (
            <Link href={href} className="after:absolute after:inset-0 after:rounded-2xl">
              {pub.title}
            </Link>
          )}
        </h3>
        <p className="mt-1.5 text-sm text-muted">
          <span className="font-medium text-ink/80">{pub.authors}</span> — <em>{pub.venue}</em>
        </p>
        {showAbstract && pub.abstract && <p className="mt-3 line-clamp-2 max-w-3xl text-[0.95rem] leading-relaxed text-muted">{pub.abstract}</p>}
        <div className="relative z-10 mt-4 flex flex-wrap gap-2">
          {pub.pdfUrl && (
            <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">
              <FileDown className="size-3.5" aria-hidden /> {t.readPaper}
            </a>
          )}
          <Link href={href} className={pub.pdfUrl ? "btn btn-outline btn-sm" : "btn btn-primary btn-sm"}>
            {t.details} <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
          {pub.link && (
            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm text-muted hover:text-ink">
              <ExternalLink className="size-3.5" aria-hidden /> {t.issuePage}
            </a>
          )}
          <CopyButton text={citations(pub).APA} label={t.cite} copiedLabel={t.cited} />
        </div>
      </div>
    </article>
  );
}
