import type { Metadata } from "next";
import Link from "next/link";
import { Award, Briefcase, FileDown, GraduationCap, Mail, MapPin } from "lucide-react";
import { getProfile } from "@/lib/db";
import type { TimelineItem } from "@/lib/types";
import { PAGE_IMAGES, PageHeader } from "@/components/site/PageHeader";
import { Portrait } from "@/components/site/Portrait";
import { Markdown } from "@/components/site/Markdown";
import { SocialLinks } from "@/components/site/SocialLinks";
import { Reveal } from "@/components/site/Reveal";
import { langFromParams, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizeProfile } from "@/i18n/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getDictionary(await langFromParams(params));
  return { title: t.about.eyebrow, description: t.about.metaDescription };
}

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative border-l border-line">
      {items.map((it, i) => (
        <Reveal as="li" key={i} delay={i * 90} className="group relative pb-10 pl-8 last:pb-0">
          <span aria-hidden className="absolute -left-[5px] top-1.5 size-[9px] rounded-full bg-accent ring-4 ring-paper transition-transform duration-500 group-hover:scale-150" />
          {it.period && <p className="text-sm font-medium text-accent-dark">{it.period}</p>}
          <h3 className="mt-1 text-xl font-semibold text-ink">{it.title}</h3>
          {it.place && <p className="mt-0.5 text-sm text-muted">{it.place}</p>}
          {it.description && <p className="mt-2.5 leading-relaxed text-ink/80">{it.description}</p>}
        </Reveal>
      ))}
    </ol>
  );
}

function SectionTitle({ icon: Icon, children }: { icon?: typeof Award; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-3xl font-semibold text-ink">
      {Icon && (
        <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-dark">
          <Icon className="size-5" aria-hidden />
        </span>
      )}
      {children}
    </h2>
  );
}

export default async function AboutPage({ params }: Props) {
  const lang = await langFromParams(params);
  const t = getDictionary(lang);
  const p = localizeProfile(await getProfile(), lang);

  return (
    <>
      <PageHeader eyebrow={t.about.eyebrow} title={t.about.title} description={p.title} image={PAGE_IMAGES.about} />

      <section className="container-page grid grid-cols-1 gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
        <Reveal variant="left" className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Portrait name={p.name} photo={p.photo} className="aspect-[4/5] w-full max-w-sm shadow-xl shadow-navy/15" />
            <div className="mt-6 space-y-3 text-sm">
              <p className="font-serif text-2xl font-semibold text-ink">{p.name}</p>
              <p className="text-muted">{p.institution}</p>
              {p.address && (
                <p className="flex items-center gap-2 text-muted">
                  <MapPin className="size-4 shrink-0 text-accent" aria-hidden /> {p.address}
                </p>
              )}
              {p.email && (
                <p className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0 text-accent" aria-hidden />
                  <a href={`mailto:${p.email}`} className="link-underline break-all">{p.email}</a>
                </p>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.cvUrl && (
                <a href={p.cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <FileDown className="size-4" aria-hidden /> {t.home.downloadCv}
                </a>
              )}
              <Link href={localePath(lang, "/contact")} className="btn btn-outline">{t.about.contactMe}</Link>
            </div>
            <SocialLinks socials={p.socials} email={p.email} className="mt-6" />
          </div>
        </Reveal>

        <div className="min-w-0 lg:col-span-8">
          <Reveal>
            <SectionTitle>{t.about.bio}</SectionTitle>
            <Markdown className="mt-6">{p.bioLong}</Markdown>
          </Reveal>

          {p.expertise.length > 0 && (
            <div className="mt-16">
              <Reveal><SectionTitle>{t.about.research}</SectionTitle></Reveal>
              <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {p.expertise.map((e, i) => (
                  <Reveal as="li" key={e.title} delay={i * 80} className="h-full">
                    <div className="card hover-lift h-full p-5">
                      <p className="font-serif text-lg font-semibold text-ink">{e.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.description}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-16 grid grid-cols-1 gap-14 xl:grid-cols-2 xl:gap-10">
            {p.education.length > 0 && (
              <div>
                <Reveal><SectionTitle icon={GraduationCap}>{t.about.education}</SectionTitle></Reveal>
                <div className="mt-8"><Timeline items={p.education} /></div>
              </div>
            )}
            {p.experience.length > 0 && (
              <div>
                <Reveal><SectionTitle icon={Briefcase}>{t.about.experience}</SectionTitle></Reveal>
                <div className="mt-8"><Timeline items={p.experience} /></div>
              </div>
            )}
          </div>

          {p.distinctions.length > 0 && (
            <div className="mt-16">
              <Reveal><SectionTitle icon={Award}>{t.about.distinctions}</SectionTitle></Reveal>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {p.distinctions.map((d, i) => (
                  <Reveal as="li" key={i} delay={i * 80} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                    <span className="w-16 shrink-0 font-serif text-xl font-semibold text-accent-dark">{d.year}</span>
                    <div>
                      <p className="font-medium text-ink">{d.title}</p>
                      <p className="text-sm text-muted">{d.issuer}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
