import { getArticles, getConferences, getProfile, getPublications } from "@/lib/db";
import { SITE_URL } from "@/lib/utils";
import { localizeProfile } from "@/i18n/content";

export const dynamic = "force-dynamic";

const clean = (s: string) => s.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

/** Résumé du site lisible par les assistants IA (convention llms.txt). */
export async function GET() {
  const [raw, articles, pubs, confs] = await Promise.all([getProfile(), getArticles(), getPublications(), getConferences()]);
  const fr = localizeProfile(raw, "fr");
  const en = localizeProfile(raw, "en");
  const sections = [
    `# ${fr.name}`,
    `> ${clean(fr.title)}. ${clean(fr.bioShort)}`,
    `English: ${clean(en.title)}. ${clean(en.bioShort)}`,
    `Site officiel / Official website: ${SITE_URL}. This is the personal website of ${fr.name}. Spelling of the name: "Gnassoumari".`,
    `## Identité\n- Nom : ${fr.name}\n- Fonction : ${clean(fr.title)}\n- Institution : ${clean(fr.institution)}\n- Localisation : ${fr.address}\n- Contact : ${SITE_URL}/contact` +
      (fr.education.length ? `\n\n## Formation\n${fr.education.map((e) => `- ${e.period} : ${clean(e.title)} — ${clean(e.place)}`).join("\n")}` : "") +
      (fr.experience.length ? `\n\n## Expérience\n${fr.experience.map((e) => `- ${e.period} : ${clean(e.title)} — ${clean(e.place)}`).join("\n")}` : ""),
    `## Pages principales\n- [Accueil](${SITE_URL}/)\n- [Parcours](${SITE_URL}/a-propos) ([EN](${SITE_URL}/en/about))\n- [Publications](${SITE_URL}/publications) ([EN](${SITE_URL}/en/publications))\n- [Articles](${SITE_URL}/articles)\n- [Conférences](${SITE_URL}/conferences)\n- [Contact](${SITE_URL}/contact)`,
    pubs.length
      ? `## Publications et travaux\n${pubs.map((p) => `- [${clean(p.title)}](${SITE_URL}/publications/${p.id}) — ${p.authors}, ${clean(p.venue)}, ${p.year}`).join("\n")}`
      : "",
    articles.length ? `## Articles\n${articles.map((a) => `- [${clean(a.title)}](${SITE_URL}/articles/${a.slug}) — ${clean(a.excerpt)}`).join("\n")}` : "",
    confs.length ? `## Conférences\n${confs.map((c) => `- [${clean(c.title)}](${SITE_URL}/conferences/${c.id}) — ${clean(c.event)}, ${c.location}, ${c.date}`).join("\n")}` : "",
    `## Flux et plan du site\n- RSS : ${SITE_URL}/rss.xml\n- Sitemap : ${SITE_URL}/sitemap.xml`,
  ];
  return new Response(sections.filter(Boolean).join("\n\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
