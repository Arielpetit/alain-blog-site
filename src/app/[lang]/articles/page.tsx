import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, PenLine, Search } from "lucide-react";
import { getArticles } from "@/lib/db";
import { PAGE_IMAGES, PageHeader } from "@/components/site/PageHeader";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";
import { langFromParams, localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeArticle } from "@/i18n/content";

export const dynamic = "force-dynamic";

const PER_PAGE = 9;
const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

type Query = { q?: string; categorie?: string; page?: string };
type Props = { params: Promise<{ lang: string }>; searchParams: Promise<Query> };

function href(lang: Locale, params: Query) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && sp.set(k, v));
  const s = sp.toString();
  return localePath(lang, `/articles${s ? `?${s}` : ""}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getDictionary(await langFromParams(params)).articles;
  return { title: t.title, description: t.description };
}

export default async function ArticlesPage({ params, searchParams }: Props) {
  const lang = await langFromParams(params);
  const t = getDictionary(lang).articles;
  const { q = "", categorie = "", page = "1" } = await searchParams;
  const all = (await getArticles()).map((a) => localizeArticle(a, lang));
  const categories = [...new Set(all.map((a) => a.category))].sort((a, b) => a.localeCompare(b));

  const query = normalize(q.trim());
  const filtered = all.filter(
    (a) =>
      (!categorie || a.category === categorie) &&
      (!query || normalize(`${a.title} ${a.excerpt} ${a.content} ${a.tags.join(" ")}`).includes(query)),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(Math.max(1, Number(page) || 1), pages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.description} image={PAGE_IMAGES.articles}>
        <form action={localePath(lang, "/articles")} className="mt-9 flex max-w-xl flex-col gap-2 sm:flex-row" role="search">
          {categorie && <input type="hidden" name="categorie" value={categorie} />}
          <label className="relative flex-1">
            <span className="sr-only">{t.search}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input name="q" type="search" defaultValue={q} placeholder={t.search} className="field h-12 border-white/15 pl-10" />
          </label>
          <button className="btn btn-accent h-12 px-6">{t.searchButton}</button>
        </form>
      </PageHeader>

      <section className="container-page py-12 md:py-16">
        {categories.length > 1 && <nav aria-label={t.categories} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none]">
          {[{ label: t.allCategories, value: "" }, ...categories.map((c) => ({ label: c, value: c }))].map((c) => (
            <Link
              key={c.label}
              href={href(lang, { q, categorie: c.value })}
              aria-current={categorie === c.value ? "page" : undefined}
              className="chip"
              scroll={false}
            >
              {c.label}
            </Link>
          ))}
        </nav>}

        {q && (
          <p className="mt-6 text-sm text-muted">
            {t.results(filtered.length, q)} ·{" "}
            <Link href={href(lang, { categorie })} className="font-medium text-accent-dark hover:underline">
              {t.clear}
            </Link>
          </p>
        )}

        {shown.length ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 100} className="h-full">
                <ArticleCard article={a} lang={lang} />
              </Reveal>
            ))}
          </div>
        ) : all.length === 0 ? (
          <div className="card mt-4 flex flex-col items-center px-6 py-16 text-center md:py-20">
            <span className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent-dark">
              <PenLine className="size-6" aria-hidden />
            </span>
            <p className="mt-5 font-serif text-2xl font-semibold text-ink">{t.comingTitle}</p>
            <p className="mt-2 max-w-md text-muted">{t.comingText}</p>
            <Link href={localePath(lang, "/publications")} className="btn btn-primary mt-7">
              {t.comingCta} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-line-strong py-20 text-center">
            <p className="font-serif text-xl text-ink">{t.emptyTitle}</p>
            <p className="mt-2 text-sm text-muted">{t.emptyText}</p>
          </div>
        )}

        {pages > 1 && (
          <nav aria-label={t.pagination} className="mt-14 flex items-center justify-center gap-2">
            <Link
              href={href(lang, { q, categorie, page: current > 2 ? String(current - 1) : "" })}
              aria-disabled={current === 1}
              className={cn("btn btn-outline btn-icon", current === 1 && "pointer-events-none opacity-40")}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Link>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={href(lang, { q, categorie, page: n > 1 ? String(n) : "" })}
                aria-current={n === current ? "page" : undefined}
                className={cn(
                  "grid size-10 place-items-center rounded-lg border text-sm transition-colors",
                  n === current ? "border-primary bg-primary text-primary-fg" : "border-line bg-surface hover:border-ink",
                )}
              >
                {n}
              </Link>
            ))}
            <Link
              href={href(lang, { q, categorie, page: String(Math.min(pages, current + 1)) })}
              aria-disabled={current === pages}
              className={cn("btn btn-outline btn-icon", current === pages && "pointer-events-none opacity-40")}
            >
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </nav>
        )}
      </section>
    </>
  );
}
