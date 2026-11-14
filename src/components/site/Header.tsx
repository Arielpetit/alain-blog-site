"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, ChevronDown, Menu, PenLine, X } from "lucide-react";
import { navTree, type NavItem } from "./nav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LogoMark } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn, shortName } from "@/lib/utils";
import { localePath, stripLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const ICONS: Record<string, typeof BookOpen> = { "/publications": BookOpen, "/articles": PenLine, "/conferences": CalendarDays };

export function Header({ name, tagline, lang, t }: { name: string; tagline: string; lang: Locale; t: Dictionary["nav"] }) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tree = navTree(t);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Masque l'en-tête en descendant, le réaffiche en remontant.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        if (y > last) setMenu(false);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const groupActive = (items: NavItem[]) => items.some((i) => isActive(i.href));
  const hoverOpen = () => {
    clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setMenu(false), 160);
  };

  const linkClass = (active: boolean) =>
    cn(
      "group relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.92rem] transition-colors",
      active ? "text-ink" : "text-muted hover:text-ink",
    );
  const underline = (active: boolean) => (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
      )}
    />
  );

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
          <LogoMark className="size-10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6 group-hover:scale-105" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-serif text-[1.02rem] font-semibold text-ink sm:text-lg">{shortName(name)}</span>
            <span className="hidden truncate text-[0.66rem] font-medium uppercase tracking-[0.14em] text-muted sm:block">{tagline}</span>
          </span>
        </Link>

        <nav aria-label={t.main} className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {tree.slice(0, -1).map((e) =>
              "children" in e ? (
                <li key={e.label} ref={menuRef} className="relative" onMouseEnter={hoverOpen} onMouseLeave={hoverClose}>
                  <button
                    type="button"
                    aria-expanded={menu}
                    aria-haspopup="true"
                    aria-controls="menu-travaux"
                    onClick={() => setMenu((v) => !v)}
                    className={linkClass(groupActive(e.children))}
                  >
                    {e.label}
                    <ChevronDown className={cn("size-3.5 transition-transform duration-300", menu && "rotate-180")} aria-hidden />
                    {underline(groupActive(e.children))}
                  </button>
                  <div
                    id="menu-travaux"
                    className={cn(
                      "absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      menu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
                    )}
                  >
                    <ul className="card overflow-hidden p-2 shadow-2xl shadow-navy/15 dark:shadow-black/50">
                      {e.children.map((c) => {
                        const Icon = ICONS[c.href] ?? BookOpen;
                        return (
                          <li key={c.href}>
                            <Link
                              href={localePath(lang, c.href)}
                              aria-current={isActive(c.href) ? "page" : undefined}
                              className={cn(
                                "group/item flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface-2",
                                isActive(c.href) && "bg-surface-2",
                              )}
                            >
                              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-dark transition-colors group-hover/item:bg-primary group-hover/item:text-primary-fg">
                                <Icon className="size-4" aria-hidden />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium text-ink">{c.label}</span>
                                <span className="mt-0.5 block text-xs leading-snug text-muted">{c.description}</span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={e.href}>
                  <Link href={localePath(lang, e.href)} aria-current={isActive(e.href) ? "page" : undefined} className={linkClass(isActive(e.href))}>
                    {e.label}
                    {underline(isActive(e.href))}
                  </Link>
                </li>
              ),
            )}
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
            {tree.map((e, i) => (
              <li
                key={e.label}
                className={cn("transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                {"children" in e ? (
                  <div className="py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{e.label}</p>
                    <ul className="mt-3 grid gap-1">
                      {e.children.map((c) => {
                        const Icon = ICONS[c.href] ?? BookOpen;
                        return (
                          <li key={c.href}>
                            <Link
                              href={localePath(lang, c.href)}
                              aria-current={isActive(c.href) ? "page" : undefined}
                              className={cn("flex items-center gap-3 rounded-xl px-2 py-2.5", isActive(c.href) ? "bg-surface-2" : "active:bg-surface-2")}
                            >
                              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-dark">
                                <Icon className="size-4" aria-hidden />
                              </span>
                              <span className="min-w-0">
                                <span className={cn("block font-serif text-xl", isActive(c.href) ? "text-accent-dark" : "text-ink")}>{c.label}</span>
                                <span className="block text-xs text-muted">{c.description}</span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={localePath(lang, e.href)}
                    aria-current={isActive(e.href) ? "page" : undefined}
                    className={cn("flex items-center justify-between py-4 font-serif text-[1.6rem]", isActive(e.href) ? "text-accent-dark" : "text-ink")}
                  >
                    {e.label}
                    <ArrowRight className={cn("size-5", isActive(e.href) ? "text-accent" : "text-muted/60")} aria-hidden />
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className={cn("mt-8 space-y-6 transition-opacity delay-300 duration-500", open ? "opacity-100" : "opacity-0")}>
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
