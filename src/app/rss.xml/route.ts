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
<rss version="2.0">
<channel>
  <title>${esc(profile.name)} — Articles</title>
  <link>${SITE_URL}</link>
  <description>${esc(profile.bioShort)}</description>
  <language>fr-FR</language>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
