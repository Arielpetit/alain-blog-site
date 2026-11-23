// Vidéos de la soutenance de thèse : téléverse les fichiers dans Supabase Storage
// et les enregistre sur l'entrée « Soutenance » (i18n.fr.videos).
// Usage : node --env-file=.env.local scripts/defence-videos.mjs <dossier contenant soutenance-N.mp4 / .jpg>
import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

const dir = process.argv[2];
if (!dir) {
  console.error("Indiquez le dossier des vidéos préparées (soutenance-1.mp4, soutenance-1.jpg, …).");
  process.exit(1);
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

const clips = [
  { n: 1, title: "Extrait 1", titleEn: "Clip 1" },
  { n: 2, title: "Extrait 2", titleEn: "Clip 2" },
  { n: 3, title: "Extrait 3", titleEn: "Clip 3" },
];

const put = async (path, file, contentType) => {
  const { error } = await sb.storage.from("dr-media").upload(path, readFileSync(file), { contentType, upsert: true, cacheControl: "31536000" });
  if (error) throw new Error(`${path} : ${error.message}`);
  return sb.storage.from("dr-media").getPublicUrl(path).data.publicUrl;
};

const videos = [];
for (const c of clips) {
  const url = await put(`conferences/videos/soutenance-these-${c.n}.mp4`, join(dir, `soutenance-${c.n}.mp4`), "video/mp4");
  const poster = await put(`conferences/videos/soutenance-these-${c.n}.jpg`, join(dir, `soutenance-${c.n}.jpg`), "image/jpeg");
  videos.push({ title: c.title, titleEn: c.titleEn, url, poster });
  console.log(`✓ ${c.title}`);
}

const { data: conf, error: e1 } = await sb.from("dr_conferences").select("id,i18n").like("title", "Soutenance de thèse%").single();
if (e1) throw new Error(e1.message);
const { error } = await sb.from("dr_conferences").update({ i18n: { ...conf.i18n, fr: { ...(conf.i18n?.fr ?? {}), videos } } }).eq("id", conf.id);
if (error) throw new Error(error.message);
console.log("✓ vidéos enregistrées sur la soutenance");
