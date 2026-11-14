"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { isAllowedAdmin } from "@/lib/admins";
import { supabaseServer } from "@/lib/supabase/server";
import * as db from "@/lib/db";
import { SITE_URL, slugify } from "@/lib/utils";
import { PUBLICATION_TYPES, SOCIAL_KEYS, type Profile, type ProfileText, type PublicationType, type TimelineItem } from "@/lib/types";

/* =====================================================================
   Authentification (Supabase Auth)
   ===================================================================== */

export type FormState = { error?: string; success?: string };

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Renseignez votre e-mail et votre mot de passe." };
  if (!isAllowedAdmin(email)) {
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Identifiants incorrects." };
  }
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message.includes("Invalid") ? "Identifiants incorrects." : error.message };

  const next = String(form.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/connexion") ? next : "/admin");
}

export async function logout() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/connexion");
}

export async function requestPasswordReset(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Renseignez votre adresse e-mail." };
  // Réponse identique dans tous les cas pour ne pas révéler les comptes existants.
  if (isAllowedAdmin(email)) {
    const supabase = await supabaseServer();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/admin/auth/callback?next=/admin/compte`,
    });
  }
  return { success: "Si ce compte existe, un lien de réinitialisation vient d'être envoyé par e-mail." };
}

export async function updatePassword(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 10) return { error: "Le mot de passe doit contenir au moins 10 caractères." };
  if (password !== confirm) return { error: "Les deux mots de passe ne correspondent pas." };
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: "Mot de passe mis à jour." };
}

/* =====================================================================
   Utilitaires
   ===================================================================== */

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/** Regroupe les champs « en_* » non vides ; renvoie {} si aucun n'est rempli. */
function enFields<K extends string>(form: FormData, keys: K[], raw: K[] = []): { en?: Partial<Record<K, string>> } {
  const out: Partial<Record<K, string>> = {};
  for (const k of keys) {
    const v = raw.includes(k) ? String(form.get(`en_${k}`) ?? "") : str(form, `en_${k}`);
    if (v.trim()) out[k] = v;
  }
  return Object.keys(out).length ? { en: out } : {};
}

const ALLOWED = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".gif", ".doc", ".docx", ".pptx"];
const MAX_UPLOAD = 15 * 1024 * 1024;

/**
 * Gère un champ fichier : suppression demandée, nouveau téléversement,
 * URL saisie ou valeur actuelle conservée.
 */
async function media(form: FormData, opts: { file: string; url?: string; remove: string; current: string; folder: string }) {
  if (form.get(opts.remove)) {
    await db.removeMedia(opts.current).catch(() => {});
    return "";
  }
  const file = form.get(opts.file);
  if (file instanceof File && file.size > 0) {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED.includes(ext)) throw new Error(`Type de fichier non autorisé (${ext}).`);
    if (file.size > MAX_UPLOAD) throw new Error("Fichier trop volumineux (15 Mo maximum).");
    const url = await db.uploadMedia(file, opts.folder);
    if (opts.current) await db.removeMedia(opts.current).catch(() => {});
    return url;
  }
  return opts.url ? str(form, opts.url) : opts.current;
}

function refresh() {
  revalidatePath("/", "layout");
}

/* =====================================================================
   Articles
   ===================================================================== */

export async function saveArticle(form: FormData) {
  await requireAdmin();
  const id = str(form, "id") || null;
  const existing = id ? await db.getArticleById(id) : undefined;
  const title = str(form, "title");
  let slug = slugify(str(form, "slug") || title) || `article-${Date.now()}`;
  if (await db.slugExists(slug, id ?? undefined)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  await db.upsertArticle(id, {
    slug,
    title,
    excerpt: str(form, "excerpt"),
    content: String(form.get("content") ?? ""),
    category: str(form, "category") || "Général",
    tags: str(form, "tags").split(",").map((t) => t.trim()).filter(Boolean),
    cover: await media(form, { file: "coverFile", url: "cover", remove: "removeCover", current: existing?.cover ?? "", folder: "articles" }),
    published: form.get("published") === "on",
    date: str(form, "date") || new Date().toISOString().slice(0, 10),
    i18n: enFields(form, ["title", "excerpt", "content", "category"], ["content"]),
  });
  refresh();
  redirect(`/admin/articles?ok=${id ? "modifie" : "cree"}`);
}

export async function removeArticle(form: FormData) {
  await requireAdmin();
  const a = await db.getArticleById(str(form, "id"));
  if (a) {
    await db.deleteArticle(a.id);
    if (a.cover) await db.removeMedia(a.cover).catch(() => {});
  }
  refresh();
  redirect("/admin/articles?ok=supprime");
}

/* =====================================================================
   Publications
   ===================================================================== */

export async function savePublication(form: FormData) {
  await requireAdmin();
  const id = str(form, "id") || null;
  const existing = id ? await db.getPublicationById(id) : undefined;
  const type = str(form, "type") as PublicationType;
  await db.upsertPublication(id, {
    title: str(form, "title"),
    authors: str(form, "authors"),
    type: type in PUBLICATION_TYPES ? type : "article",
    venue: str(form, "venue"),
    year: Number(str(form, "year")) || new Date().getFullYear(),
    abstract: str(form, "abstract"),
    pdfUrl: await media(form, { file: "pdfFile", url: "pdfUrl", remove: "removePdf", current: existing?.pdfUrl ?? "", folder: "publications" }),
    link: str(form, "link"),
    featured: form.get("featured") === "on",
    i18n: {
      ...(String(form.get("summary") ?? "").trim() ? { fr: { summary: String(form.get("summary")) } } : {}),
      ...enFields(form, ["title", "abstract", "venue", "summary"], ["summary"]),
    },
  });
  refresh();
  redirect(`/admin/publications?ok=${id ? "modifie" : "cree"}`);
}

export async function removePublication(form: FormData) {
  await requireAdmin();
  const p = await db.getPublicationById(str(form, "id"));
  if (p) {
    await db.deletePublication(p.id);
    if (p.pdfUrl) await db.removeMedia(p.pdfUrl).catch(() => {});
  }
  refresh();
  redirect("/admin/publications?ok=supprime");
}

/* =====================================================================
   Conférences
   ===================================================================== */

export async function saveConference(form: FormData) {
  await requireAdmin();
  const id = str(form, "id") || null;
  const existing = id ? await db.getConferenceById(id) : undefined;
  await db.upsertConference(id, {
    title: str(form, "title"),
    event: str(form, "event"),
    location: str(form, "location"),
    date: str(form, "date"),
    role: str(form, "role") || "Intervenant",
    description: str(form, "description"),
    link: str(form, "link"),
    slidesUrl: await media(form, { file: "slidesFile", url: "slidesUrl", remove: "removeSlides", current: existing?.slidesUrl ?? "", folder: "conferences" }),
    image: await media(form, { file: "imageFile", url: "image", remove: "removeImage", current: existing?.image ?? "", folder: "conferences" }),
    i18n: enFields(form, ["title", "event", "location", "role", "description"]),
  });
  refresh();
  redirect(`/admin/conferences?ok=${id ? "modifie" : "cree"}`);
}

export async function removeConference(form: FormData) {
  await requireAdmin();
  const c = await db.getConferenceById(str(form, "id"));
  if (c) {
    await db.deleteConference(c.id);
    for (const u of [c.slidesUrl, c.image]) if (u) await db.removeMedia(u).catch(() => {});
  }
  refresh();
  redirect("/admin/conferences?ok=supprime");
}

/* =====================================================================
   Messages
   ===================================================================== */

export async function toggleMessageRead(form: FormData) {
  await requireAdmin();
  await db.setMessageRead(str(form, "id"), form.get("read") === "true");
  revalidatePath("/admin", "layout");
}

export async function removeMessage(form: FormData) {
  await requireAdmin();
  await db.deleteMessage(str(form, "id"));
  revalidatePath("/admin", "layout");
  redirect("/admin/messages?ok=supprime");
}

/* =====================================================================
   Profil
   ===================================================================== */

/** Une ligne = une entrée ; les champs sont séparés par « | ». */
function lines(value: string) {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split("|").map((p) => p.trim()));
}

const timeline = (v: string): TimelineItem[] =>
  lines(v).map(([period = "", title = "", place = "", ...rest]) => ({ period, title, place, description: rest.join(" | ") }));

/** Champs textuels traduits du profil (vides ignorés). */
function profileText(form: FormData, prefix: string): Partial<ProfileText> {
  const g = (k: string) => str(form, `${prefix}${k}`);
  const out: Partial<ProfileText> = {};
  for (const k of ["title", "tagline", "bioShort", "institution"] as const) if (g(k)) out[k] = g(k);
  const bio = String(form.get(`${prefix}bioLong`) ?? "");
  if (bio.trim()) out.bioLong = bio;
  const stats = lines(g("stats")).map(([value = "", label = ""]) => ({ value, label }));
  if (stats.length) out.stats = stats;
  const expertise = lines(g("expertise")).map(([title = "", ...d]) => ({ title, description: d.join(" | ") }));
  if (expertise.length) out.expertise = expertise;
  const education = timeline(g("education"));
  if (education.length) out.education = education;
  const experience = timeline(g("experience"));
  if (experience.length) out.experience = experience;
  const distinctions = lines(g("distinctions")).map(([year = "", title = "", issuer = ""]) => ({ year, title, issuer }));
  if (distinctions.length) out.distinctions = distinctions;
  return out;
}

export async function saveProfile(form: FormData) {
  await requireAdmin();
  const current = await db.getProfile();
  const profile: Profile = {
    name: str(form, "name") || current.name,
    title: str(form, "title"),
    tagline: str(form, "tagline"),
    bioShort: str(form, "bioShort"),
    bioLong: String(form.get("bioLong") ?? ""),
    photo: await media(form, { file: "photoFile", remove: "removePhoto", current: current.photo, folder: "profil" }),
    heroImage: await media(form, { file: "heroFile", url: "heroImage", remove: "removeHero", current: current.heroImage, folder: "profil" }),
    institution: str(form, "institution"),
    email: str(form, "email"),
    phone: str(form, "phone"),
    address: str(form, "address"),
    cvUrl: await media(form, { file: "cvFile", remove: "removeCv", current: current.cvUrl, folder: "profil" }),
    socials: Object.fromEntries(SOCIAL_KEYS.map((k) => [k, str(form, k)])) as Profile["socials"],
    stats: lines(str(form, "stats")).map(([value = "", label = ""]) => ({ value, label })),
    expertise: lines(str(form, "expertise")).map(([title = "", ...d]) => ({ title, description: d.join(" | ") })),
    education: timeline(str(form, "education")),
    experience: timeline(str(form, "experience")),
    distinctions: lines(str(form, "distinctions")).map(([year = "", title = "", issuer = ""]) => ({ year, title, issuer })),
    en: profileText(form, "en_"),
  };
  await db.saveProfile(profile);
  refresh();
  redirect("/admin/profil?ok=modifie");
}
