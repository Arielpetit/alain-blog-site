// Remplit Supabase avec le contenu de démonstration.
// Usage : node --env-file=.env.local scripts/seed.mjs [--reset]
//   --reset : vide d'abord les tables dr_* (articles, publications, conférences, messages).
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { articles, conferences, messages, publications } from "./seed-content.mjs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Variables NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY requises (utilisez --env-file=.env.local).");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });
const reset = process.argv.includes("--reset");

async function run(label, promise) {
  const { error } = await promise;
  if (error) {
    console.error(`✗ ${label} : ${error.message}`);
    if (error.code === "PGRST205") console.error("  → Exécutez d'abord supabase/migrations/001_schema.sql dans le SQL Editor de Supabase.");
    process.exit(1);
  }
  console.log(`✓ ${label}`);
}

const profile = JSON.parse(readFileSync(new URL("../src/content/profile.json", import.meta.url), "utf8"));
await run("profil", sb.from("dr_profile").upsert({ id: 1, data: profile }));

for (const [table, data] of [
  ["dr_articles", articles.map((a) => ({ ...a, content: a.content.trim(), published: true }))],
  ["dr_publications", publications],
  ["dr_conferences", conferences],
  ["dr_messages", messages],
]) {
  if (reset) await run(`vidage ${table}`, sb.from(table).delete().not("id", "is", null));
  const { count } = await sb.from(table).select("id", { count: "exact", head: true });
  if (count && !reset) {
    console.log(`• ${table} contient déjà ${count} ligne(s) — ignoré (utilisez --reset pour remplacer).`);
    continue;
  }
  await run(`${table} (${data.length})`, sb.from(table).insert(data));
}
console.log("Terminé.");
