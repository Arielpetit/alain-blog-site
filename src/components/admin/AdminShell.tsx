"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn, initials } from "@/lib/utils";

const GROUPS = [
  {
    label: "Général",
    items: [{ href: "/admin", label: "Tableau de bord", icon: LayoutDashboard }],
  },
  {
    label: "Contenu",
    items: [
      { href: "/admin/articles", label: "Articles", icon: FileText },
      { href: "/admin/publications", label: "Publications", icon: Library },
      { href: "/admin/conferences", label: "Conférences", icon: CalendarDays },
    ],
  },
  {
    label: "Relations",
    items: [{ href: "/admin/messages", label: "Messages", icon: Inbox }],
  },
  {
    label: "Paramètres",
    items: [
      { href: "/admin/profil", label: "Profil & parcours", icon: UserRound },
      { href: "/admin/compte", label: "Mon compte", icon: KeyRound },
    ],
  },
];

const THEME_LABELS = { label: "Thème", light: "Clair", dark: "Sombre", system: "Système" };

export function AdminShell({
  children,
  name,
  email,
  unread,
  logout,
}: {
  children: React.ReactNode;
  name: string;
  email: string;
  unread: number;
  logout: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const current = GROUPS.flatMap((g) => g.items).find((i) => active(i.href));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent font-serif text-sm font-semibold text-white">
          {initials(name)}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-white/50">Administration</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="ml-auto grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 lg:hidden" aria-label="Fermer le menu">
          <X className="size-5" />
        </button>
      </div>

      <nav aria-label="Administration" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/35">{g.label}</p>
            <ul className="mt-2 space-y-0.5">
              {g.items.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active(href) ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      active(href) ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {active(href) && <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" />}
                    <Icon className="size-4 shrink-0" aria-hidden />
                    <span className="flex-1">{label}</span>
                    {href === "/admin/messages" && unread > 0 && (
                      <span className="min-w-5 rounded-full bg-accent px-1.5 py-0.5 text-center text-[0.68rem] font-semibold leading-none text-white">
                        {unread}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/65 hover:bg-white/5 hover:text-white">
          <ExternalLink className="size-4" aria-hidden /> Voir le site
        </Link>
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/65 hover:bg-white/5 hover:text-white">
            <LogOut className="size-4" aria-hidden /> Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      {/* Barre latérale (bureau) */}
      <aside className="sticky top-0 hidden h-dvh bg-navy-deep lg:block">{sidebar}</aside>

      {/* Tiroir (mobile / tablette) */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={cn("absolute inset-0 bg-navy-deep/60 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] bg-navy-deep shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebar}
        </aside>
      </div>

      <div className="flex min-w-0 flex-col">
        {/* Barre supérieure */}
        <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
            <button type="button" onClick={() => setOpen(true)} className="btn btn-ghost btn-icon -ml-1 lg:hidden" aria-label="Ouvrir le menu" aria-expanded={open}>
              <Menu className="size-5" />
            </button>
            <p className="truncate text-sm text-muted">
              <span className="hidden sm:inline">Administration</span>
              {current && (
                <>
                  <span className="mx-2 hidden text-line-strong sm:inline">/</span>
                  <span className="font-medium text-ink">{current.label}</span>
                </>
              )}
            </p>
            <div className="ml-auto flex items-center gap-1.5">
              <ThemeToggle labels={THEME_LABELS} />
              <Link href="/" target="_blank" className="btn btn-ghost btn-icon hidden text-muted hover:text-ink sm:inline-flex" aria-label="Voir le site" title="Voir le site">
                <ExternalLink className="size-[1.1rem]" />
              </Link>
              <Link href="/admin/compte" className="ml-1 flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pl-1 pr-3 transition-colors hover:border-line-strong" title={email}>
                <span className="grid size-7 place-items-center rounded-full bg-primary text-[0.7rem] font-semibold text-primary-fg">
                  {email.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-40 truncate text-xs text-muted md:inline">{email}</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
