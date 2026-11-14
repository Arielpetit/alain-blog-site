// Remplace le contenu de démonstration par le contenu réel et vérifié.
// Usage : npm run content:real
// Ne supprime que les lignes issues du jeu de démonstration (identifiées par slug / titre).
import { readFileSync, writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import * as demo from "./seed-content.mjs";
import * as real from "./real-content.mjs";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
const ok = (label, { error }) => {
  if (error) {
    console.error(`✗ ${label} : ${error.message}`);
    process.exit(1);
  }
  console.log(`✓ ${label}`);
};

// Profil (base de données + valeurs par défaut du code)
ok("profil", await sb.from("dr_profile").upsert({ id: 1, data: real.profile, updated_at: new Date().toISOString() }));
const file = new URL("../src/content/profile.json", import.meta.url);
const { en: _en, ...defaults } = real.profile;
writeFileSync(file, JSON.stringify({ ...JSON.parse(readFileSync(file, "utf8")), ...defaults }, null, 2));

// Retrait du contenu de démonstration
ok("articles démo retirés", await sb.from("dr_articles").delete().in("slug", [...demo.articles.map((a) => a.slug), "brouillon-reforme-code-electoral"]));
ok("publications démo retirées", await sb.from("dr_publications").delete().in("title", demo.publications.map((p) => p.title)));
ok("conférences démo retirées", await sb.from("dr_conferences").delete().in("title", demo.conferences.map((c) => c.title)));
ok("message démo retiré", await sb.from("dr_messages").delete().in("email", demo.messages.map((m) => m.email)));

// Contenu réel (idempotent)
for (const p of real.publications) {
  await sb.from("dr_publications").delete().eq("title", p.title);
  ok(`publication : ${p.title.slice(0, 50)}…`, await sb.from("dr_publications").insert(p));
}
ok("présentations déplacées vers les publications", await sb.from("dr_articles").delete().in("slug", real.retiredArticleSlugs));
for (const c of real.conferences) {
  await sb.from("dr_conferences").delete().eq("title", c.title);
  ok(`conférence : ${c.title}`, await sb.from("dr_conferences").insert(c));
}
for (const a of real.articles) {
  ok(`article : ${a.slug}`, await sb.from("dr_articles").upsert(a, { onConflict: "slug" }));
}
console.log("Terminé.");
