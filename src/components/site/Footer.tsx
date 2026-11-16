import Link from "next/link";
import { LogoMark } from "@/components/shared/Logo";
import { ArrowUp, Mail, MapPin, Phone, Rss } from "lucide-react";
import type { Profile } from "@/lib/types";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { navLinks } from "./nav";
import { SocialLinks } from "./SocialLinks";

export function Footer({ profile, lang, t }: { profile: Profile; lang: Locale; t: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-16 overflow-hidden bg-navy-deep text-white/75 sm:mt-28">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="container-page relative grid grid-cols-1 gap-10 py-12 sm:gap-12 sm:py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4"><LogoMark className="size-11 sm:size-14" /><p className="font-serif text-xl leading-tight text-white sm:text-2xl md:text-[1.7rem]">{profile.name}</p></div>
          <p className="mt-1.5 text-sm text-white/55">{profile.title}</p>
          <p className="mt-5 max-w-sm font-serif text-base italic leading-relaxed text-white/80 sm:mt-6 sm:text-lg">« {profile.tagline} »</p>
          <SocialLinks socials={profile.socials} email={profile.email} className="mt-7" variant="dark" />
        </div>

        <nav aria-label={t.footer.navigation} className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{t.footer.navigation}</p>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks(t.nav).map((l) => (
              <li key={l.href}>
                <Link href={localePath(lang, l.href)} className="link-underline hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{t.footer.contact}</p>
          <ul className="mt-5 space-y-3.5 text-sm">
            {profile.email && (
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <a href={`mailto:${profile.email}`} className="link-underline break-all hover:text-white">{profile.email}</a>
              </li>
            )}
            {profile.phone && (
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="link-underline hover:text-white">{profile.phone}</a>
              </li>
            )}
            {profile.address && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>{profile.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {profile.name}. {t.footer.rights}</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="/rss.xml" className="inline-flex items-center gap-1.5 hover:text-white">
              <Rss className="size-3.5" aria-hidden /> {t.footer.rss}
            </a>
            <Link href="/admin" className="hover:text-white">{t.footer.admin}</Link>
            <a href="#contenu" className="group inline-flex items-center gap-1.5 hover:text-white">
              {t.footer.backToTop}
              <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
