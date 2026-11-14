import type { Dictionary } from "@/i18n/dictionaries";

export type NavItem = { href: string; label: string; description?: string };
export type NavEntry = NavItem | { label: string; children: NavItem[] };

/** Navigation principale : « Travaux » regroupe publications, articles et conférences. */
export const navTree = (t: Dictionary["nav"]): NavEntry[] => [
  { href: "/", label: t.home },
  { href: "/a-propos", label: t.about },
  {
    label: t.work,
    children: [
      { href: "/publications", label: t.publications, description: t.workItems.publications },
      { href: "/articles", label: t.articles, description: t.workItems.articles },
      { href: "/conferences", label: t.conferences, description: t.workItems.conferences },
    ],
  },
  { href: "/contact", label: t.contact },
];

/** Liste à plat (pied de page, plan du site). */
export const navLinks = (t: Dictionary["nav"]): NavItem[] =>
  navTree(t).flatMap((e) => ("children" in e ? e.children : [e]));
