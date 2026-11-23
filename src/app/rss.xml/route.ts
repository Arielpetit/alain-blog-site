import { getArticles, getProfile } from "@/lib/db";
import { SITE_URL } from "@/lib/utils";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const [profile, articles] = await Promise.all([getProfile(), getArticles()]);
  const items = articles
    .slice(0, 30)
    .map(
      (a) => `<item>
  <title>${esc(a.title)}</title>
  <link>${SITE_URL}/articles/${a.slug}</link>
  <guid>${SITE_URL}/articles/${a.slug}</guid>
  <pubDate>${new Date(a.date).toUTCString()}</pubDate>
  <category>${esc(a.category)}</category>
  <description>${esc(a.excerpt)}</description>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(profile.name)} — Articles</title>
  <link>${SITE_URL}</link>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
  <lastBuildDate>${new Date(articles[0]?.updatedAt ?? Date.now()).toUTCString()}</lastBuildDate>
  <description>${esc(profile.bioShort)}</description>
  <language>fr-FR</language>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
