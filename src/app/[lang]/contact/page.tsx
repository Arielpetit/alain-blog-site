import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, Mail, MapPin, Mic, Phone, Scale } from "lucide-react";
import { getProfile } from "@/lib/db";
import { PAGE_IMAGES, PageHeader } from "@/components/site/PageHeader";
import { ContactForm } from "@/components/site/ContactForm";
import { SOCIALS, SocialTiles } from "@/components/site/SocialLinks";
import { Reveal } from "@/components/site/Reveal";
import { langFromParams, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeProfile } from "@/i18n/content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ objet?: string }> };

const REASON_ICONS = [Mic, Scale, GraduationCap];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getDictionary(await langFromParams(params)).contact;
  return { title: t.eyebrow, description: t.description };
}

export default async function ContactPage({ params, searchParams }: Props) {
  const lang = await langFromParams(params);
  const t = getDictionary(lang).contact;
  const [raw, { objet }] = await Promise.all([getProfile(), searchParams]);
  const p = localizeProfile(raw, lang);
  const tel = p.phone ? `tel:${p.phone.replace(/\s/g, "")}` : "";

  const details = [
    p.email && { icon: Mail, label: t.email, value: p.email, href: `mailto:${p.email}` },
    p.phone && { icon: Phone, label: t.phone, value: p.phone, href: tel },
    p.address && { icon: MapPin, label: t.address, value: p.address },
    { icon: Clock, label: t.responseTime, value: t.responseValue },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.description} image={PAGE_IMAGES.contact}>
        <div className="mt-9 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          {p.email && (
            <a href={`mailto:${p.email}`} className="btn btn-accent px-5 py-3">
              <Mail className="size-4" aria-hidden /> {t.writeEmail}
            </a>
          )}
          {p.socials.whatsapp && (
            <a href={p.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="btn border border-white/20 bg-white/5 px-5 py-3 text-white backdrop-blur hover:bg-white/15">
              <span className="text-[#25d366]">{SOCIALS.whatsapp.icon}</span> {t.whatsapp}
            </a>
          )}
          {tel && (
            <a href={tel} className="btn border border-white/20 bg-white/5 px-5 py-3 text-white backdrop-blur hover:bg-white/15">
              <Phone className="size-4" aria-hidden /> {t.call}
            </a>
          )}
        </div>
      </PageHeader>

      {/* Motifs de prise de contact */}
      <section className="container-page pt-14 md:pt-20">
        <Reveal>
          <p className="eyebrow">{t.reasonsEyebrow}</p>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {t.reasons.map((r, i) => {
            const Icon = REASON_ICONS[i];
            const active = objet === r.subject;
            return (
              <Reveal key={r.title} delay={i * 100} className="h-full">
                <Link
                  href={localePath(lang, `/contact?objet=${encodeURIComponent(r.subject)}#formulaire`)}
                  scroll={false}
                  className={`card hover-lift group flex h-full flex-col p-6 ${active ? "border-accent ring-1 ring-accent" : ""}`}
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-dark transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-fg">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="mt-5 font-serif text-xl font-semibold text-ink">{r.title}</span>
                  <span className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-muted">{r.text}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-dark">
                    {t.choose} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Formulaire + coordonnées */}
      <section id="formulaire" className="container-page grid grid-cols-1 scroll-mt-24 gap-8 py-14 md:py-20 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <div className="mb-5">
            <h2 className="text-3xl font-semibold text-ink">{t.formTitle}</h2>
            <p className="mt-1.5 text-sm text-muted">{t.formText}</p>
          </div>
          <ContactForm key={objet ?? ""} defaultSubject={objet} lang={lang} />
        </Reveal>

        <Reveal variant="right" delay={120} className="space-y-6 lg:col-span-5">
          <div className="relative isolate overflow-hidden rounded-[1.25rem] bg-navy-deep p-6 text-white md:p-8">
            <div aria-hidden className="grain absolute inset-0 -z-10" />
            <div aria-hidden className="absolute -right-16 -top-16 -z-10 size-56 rounded-full bg-accent/20 blur-3xl" />
            <h2 className="font-serif text-2xl font-semibold">{t.directTitle}</h2>
            <p className="mt-1.5 text-sm text-white/60">{t.directText}</p>
            <ul className="mt-6 divide-y divide-white/10">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-center gap-4 py-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-accent">
                    <Icon className="size-[1.1rem]" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-white/50">{label}</p>
                    {href ? (
                      <a href={href} className="link-underline break-all font-medium text-white">{value}</a>
                    ) : (
                      <p className="font-medium text-white">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {p.socials.whatsapp && (
              <a
                href={p.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-6 w-full bg-[#25d366] py-3 font-semibold text-[#073b1d] hover:brightness-95"
              >
                {SOCIALS.whatsapp.icon} {t.whatsapp}
              </a>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-ink">{t.socialsTitle}</p>
            <SocialTiles socials={p.socials} className="mt-3" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
