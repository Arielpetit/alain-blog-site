import Link from "next/link";
import { headers } from "next/headers";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function NotFound() {
  const h = (await headers()).get("x-locale");
  const lang = isLocale(h) ? h : "fr";
  const t = getDictionary(lang).notFound;
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="animate-fade-up">
        <p className="font-serif text-[7rem] font-semibold leading-none text-accent">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-ink">{t.title}</h1>
        <p className="mt-3 text-muted">{t.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={localePath(lang, "/")} className="btn btn-primary">{t.home}</Link>
          <Link href={localePath(lang, "/articles")} className="btn btn-outline">{t.articles}</Link>
        </div>
      </div>
    </section>
  );
}
