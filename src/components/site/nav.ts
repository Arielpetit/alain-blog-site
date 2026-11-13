import type { Dictionary } from "@/i18n/dictionaries";

/** Liens de navigation (chemins internes, à passer dans localePath). */
export const navLinks = (t: Dictionary["nav"]) => [
  { href: "/", label: t.home },
  { href: "/a-propos", label: t.about },
  { href: "/publications", label: t.publications },
  { href: "/articles", label: t.articles },
  { href: "/conferences", label: t.conferences },
  { href: "/contact", label: t.contact },
];
