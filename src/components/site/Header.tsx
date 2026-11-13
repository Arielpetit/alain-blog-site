"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { navLinks } from "./nav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn, initials } from "@/lib/utils";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Header({ name, lang, t }: { name: string; lang: Locale; t: Dictionary["nav"] }) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const links = navLinks(t);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Masque l'en-tête en descendant, le réaffiche en remontant.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hidden && !open && "-translate-y-full",
        // Pas de backdrop-filter quand le menu est ouvert : il créerait un
        // bloc conteneur pour le panneau mobile en position fixe.
        open
          ? "border-b border-line bg-paper"
          : scrolled
            ? "border-b border-line bg-paper/95 shadow-[0_8px_30px_-20px_rgb(0_0_0/0.35)] backdrop-blur-xl"
            : "border-b border-transparent bg-paper",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href={localePath(lang, "/")} className="group flex min-w-0 items-center gap-3" aria-label={name}>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy font-serif text-sm font-semibold tracking-wide text-white ring-1 ring-white/10 transition-[background-color,transform] duration-500 group-hover:rotate-[-8deg] group-hover:bg-accent">
            {initials(name)}
          </span>
          <span className="truncate font-serif text-lg font-semibold leading-tight text-ink">{name}</span>
        </Link>

        <nav aria-label={t.main} className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {links.slice(0, -1).map((l) => (
              <li key={l.href}>
                <Link
                  href={localePath(lang, l.href)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "group relative block rounded-full px-3.5 py-2 text-[0.92rem] transition-colors",
                    isActive(l.href) ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageSwitcher lang={lang} label={t.language} className="hidden sm:inline-flex" />
          <ThemeToggle labels={t.theme} className="hidden sm:inline-flex" />
          <Link href={localePath(lang, "/contact")} className="btn btn-primary ml-1 hidden md:inline-flex">
            {t.cta}
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-icon -mr-1 lg:hidden"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block size-6">
              <Menu className={cn("absolute inset-0 size-6 transition-all duration-300", open ? "rotate-90 opacity-0" : "opacity-100")} aria-hidden />
              <X className={cn("absolute inset-0 size-6 transition-all duration-300", open ? "opacity-100" : "-rotate-90 opacity-0")} aria-hidden />
            </span>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-paper transition-[opacity,visibility] duration-300 md:top-[4.5rem] lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav aria-label={t.main} className="container-page flex min-h-full flex-col py-6">
          <ul className="divide-y divide-line border-y border-line">
            {links.map((l, i) => (
              <li
                key={l.href}
                className={cn("transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <Link
                  href={localePath(lang, l.href)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between py-4 font-serif text-[1.65rem]",
                    isActive(l.href) ? "text-accent-dark" : "text-ink",
                  )}
                >
                  {l.label}
                  <ArrowRight className={cn("size-5", isActive(l.href) ? "text-accent" : "text-muted/60")} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div
            className={cn("mt-8 space-y-6 transition-opacity delay-300 duration-500", open ? "opacity-100" : "opacity-0")}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <LanguageSwitcher lang={lang} label={t.language} />
              <ThemeToggle labels={t.theme} variant="segmented" />
            </div>
            <Link href={localePath(lang, "/contact")} className="btn btn-primary w-full py-3.5">
              {t.cta}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
