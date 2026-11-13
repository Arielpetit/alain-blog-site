"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Bascule FR / EN en conservant la page courante. */
export function LanguageSwitcher({ lang, label, className }: { lang: Locale; label: string; className?: string }) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname);
  return (
    <div role="group" aria-label={label} className={cn("inline-flex items-center rounded-full border border-line bg-surface p-0.5 text-xs font-semibold", className)}>
      {(["fr", "en"] as const).map((l) => (
        <Link
          key={l}
          href={localePath(l, path)}
          hrefLang={l}
          lang={l}
          aria-current={lang === l ? "true" : undefined}
          scroll={false}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase tracking-wide transition-colors",
            lang === l ? "bg-primary text-primary-fg" : "text-muted hover:text-ink",
          )}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
