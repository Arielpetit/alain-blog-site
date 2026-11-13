import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { cn, formatDate, readingTime } from "@/lib/utils";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

function Cover({ article, className }: { article: Article; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-navy", className)}>
      {article.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.cover} alt="" loading="lazy" className="img-zoom absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div aria-hidden className="grain absolute inset-0">
          <span className="absolute -bottom-8 right-5 font-serif text-[9rem] leading-none text-white/10">§</span>
        </div>
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/35 to-transparent" />
    </div>
  );
}

export function ArticleCard({
  article,
  lang,
  featured = false,
  horizontal = false,
}: {
  article: Article;
  lang: Locale;
  featured?: boolean;
  /** Vignette à gauche, texte à droite (listes compactes). */
  horizontal?: boolean;
}) {
  const t = getDictionary(lang);
  return (
    <article className={cn("card hover-lift group relative flex h-full overflow-hidden", horizontal ? "flex-col sm:flex-row" : "flex-col")}>
      <Cover
        article={article}
        className={cn(horizontal ? "aspect-[16/9] sm:aspect-auto sm:w-52 sm:shrink-0" : featured ? "aspect-[16/10] min-h-56 flex-1" : "aspect-[16/9]")}
      />
      <div className={cn("flex flex-col p-6", featured ? "md:p-8" : "flex-1")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
          <span className="badge">{article.category}</span>
          <time dateTime={article.date}>{formatDate(article.date, undefined, lang)}</time>
        </div>
        <h3
          className={cn(
            "mt-4 font-semibold leading-snug text-ink transition-colors duration-300 group-hover:text-accent-dark",
            featured ? "text-2xl md:text-[1.9rem]" : "text-xl",
          )}
        >
          <Link href={localePath(lang, `/articles/${article.slug}`)} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className={cn("mt-3 flex-1 leading-relaxed text-muted", featured ? "line-clamp-3" : "line-clamp-2 text-[0.95rem]")}>
          {article.excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Clock className="size-3.5" aria-hidden /> {readingTime(article.content)} {t.common.minRead}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-accent-dark">
            {t.common.readMore}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
