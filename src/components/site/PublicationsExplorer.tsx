"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { PUBLICATION_TYPES, type Publication, type PublicationType } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PublicationItem } from "./PublicationItem";
import { cn } from "@/lib/utils";

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function PublicationsExplorer({ publications, lang }: { publications: Publication[]; lang: Locale }) {
  const t = getDictionary(lang);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PublicationType | "all">("all");
  const [year, setYear] = useState<string>("all");

  const types = useMemo(
    () => (Object.keys(PUBLICATION_TYPES) as PublicationType[]).filter((ty) => publications.some((p) => p.type === ty)),
    [publications],
  );
  const years = useMemo(() => [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a), [publications]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return publications.filter(
      (p) =>
        (type === "all" || p.type === type) &&
        (year === "all" || String(p.year) === year) &&
        (!q || normalize(`${p.title} ${p.authors} ${p.venue} ${p.abstract}`).includes(q)),
    );
  }, [publications, query, type, year]);

  const hasFilters = query || type !== "all" || year !== "all";

  return (
    <div>
      <div className="card p-4 shadow-sm sm:p-5 md:-mt-24 md:relative md:z-10 md:shadow-xl md:shadow-navy/10 dark:md:shadow-black/40">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">{t.publications.searchLabel}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.publications.search}
              className="field pl-10"
            />
          </label>
          <label className="md:w-52">
            <span className="sr-only">{t.publications.yearLabel}</span>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="field">
              <option value="all">{t.publications.allYears}</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="group" aria-label={t.publications.typeLabel}>
          {(["all", ...types] as const).map((ty) => (
            <button key={ty} type="button" aria-pressed={type === ty} onClick={() => setType(ty)} className="chip">
              {ty === "all" ? t.common.all : t.publications.types[ty]}
              <span className="ml-1.5 text-xs opacity-60">
                {ty === "all" ? publications.length : publications.filter((p) => p.type === ty).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-muted">
        <p aria-live="polite">{t.publications.count(filtered.length)}</p>
        {hasFilters && (
          <button
            type="button"
            className="inline-flex items-center gap-1 font-medium text-ink hover:text-accent-dark"
            onClick={() => {
              setQuery("");
              setType("all");
              setYear("all");
            }}
          >
            <X className="size-3.5" aria-hidden /> {t.common.reset}
          </button>
        )}
      </div>

      {filtered.length ? (
        <div className="mt-2 divide-y divide-line border-t border-line">
          {filtered.map((p, i) => (
            <div key={`${p.id}-${type}-${year}`} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <PublicationItem pub={p} lang={lang} />
            </div>
          ))}
        </div>
      ) : (
        <div className={cn("mt-6 rounded-2xl border border-dashed border-line-strong py-16 text-center")}>
          <p className="font-serif text-xl text-ink">{t.publications.emptyTitle}</p>
          <p className="mt-2 text-sm text-muted">{t.publications.emptyText}</p>
        </div>
      )}
    </div>
  );
}
