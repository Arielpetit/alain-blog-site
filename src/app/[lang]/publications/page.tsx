import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublications } from "@/lib/db";
import { PAGE_IMAGES, PageHeader } from "@/components/site/PageHeader";
import { PublicationsExplorer } from "@/components/site/PublicationsExplorer";
import { langFromParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizePublication } from "@/i18n/content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await langFromParams(params);
  const t = getDictionary(lang).publications;
  return buildMetadata({ lang, path: "/publications", title: t.title, description: t.description });
}

export default async function PublicationsPage({ params }: Props) {
  const lang = await langFromParams(params);
  const t = getDictionary(lang).publications;
  const publications = (await getPublications()).map((p) => localizePublication(p, lang));
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.description} image={PAGE_IMAGES.publications} />
      <section className="container-page py-12 md:py-16">
        <PublicationsExplorer publications={publications} lang={lang} />
      </section>
    </>
  );
}
