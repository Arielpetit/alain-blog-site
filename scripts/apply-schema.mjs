// Applique supabase/migrations/001_schema.sql via une connexion Postgres directe.
// Usage : SUPABASE_DB_URL="postgresql://postgres.xxx:MOT_DE_PASSE@...pooler.supabase.com:5432/postgres" node scripts/apply-schema.mjs
import { readFileSync } from "fs";
import pg from "pg";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("SUPABASE_DB_URL manquant (Supabase > Connect > Session pooler).");
  process.exit(1);
}
const sql = readFileSync(new URL("../supabase/migrations/001_schema.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  await client.query(sql);
  const { rows } = await client.query("select table_name from information_schema.tables where table_schema = 'public' and table_name like 'dr\\_%' order by 1");
  console.log("✓ Schéma appliqué :", rows.map((r) => r.table_name).join(", "));
} finally {
  await client.end();
}
