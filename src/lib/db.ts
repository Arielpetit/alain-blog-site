import "server-only";
import { cache } from "react";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "./supabase/admin";
import { MEDIA_BUCKET } from "./supabase/env";
import { slugify } from "./utils";
import defaultProfile from "@/content/profile.json";
import { SOCIAL_KEYS, type Article, type Conference, type Message, type Profile, type Publication, type PublicationType } from "./types";

/* ---------- Helpers ---------- */

type Row = Record<string, unknown>;
const sb = () => supabaseAdmin();

/** Tolère l'absence des tables (schéma pas encore installé) côté lecture publique. */
function rows<T>(res: { data: T[] | null; error: { code?: string; message: string } | null }, label: string): T[] {
  if (res.error) {
    if (res.error.code === "PGRST205" || res.error.code === "42P01") {
      console.warn(`[supabase] Table ${label} introuvable : exécutez supabase/migrations/001_schema.sql.`);
      return [];
    }
    throw new Error(`[supabase] ${label} : ${res.error.message}`);
  }
  return res.data ?? [];
}
function check(error: { message: string } | null, label: string) {
  if (error) throw new Error(`[supabase] ${label} : ${error.message}`);
}

/**
 * Insère ou met à jour une ligne. Si la colonne « i18n » n'existe pas encore
 * (migration 002 non appliquée), réessaie sans les traductions.
 */
async function save(table: string, id: string | null, row: Row, label: string) {
  const exec = (r: Row) => (id ? sb().from(table).update(r).eq("id", id) : sb().from(table).insert(r));
  let { error } = await exec(row);
  if (error && error.code === "PGRST204" && error.message.includes("i18n")) {
    console.warn("[supabase] Colonne i18n absente : exécutez supabase/migrations/002_translations.sql.");
    const { i18n: _ignored, ...rest } = row;
    ({ error } = await exec(rest));
  }
  check(error, label);
}

/* ---------- Mapping ---------- */

const toArticle = (r: Row): Article => ({
  id: r.id as string,
  slug: r.slug as string,
  title: r.title as string,
  excerpt: r.excerpt as string,
  content: r.content as string,
  category: r.category as string,
  tags: (r.tags as string[]) ?? [],
  cover: r.cover as string,
  published: r.published as boolean,
  date: r.date as string,
  updatedAt: String(r.updated_at ?? r.date),
  i18n: (r.i18n as Article["i18n"]) ?? {},
});
const fromArticle = (a: Omit<Article, "id" | "updatedAt">) => ({
  slug: a.slug, title: a.title, excerpt: a.excerpt, content: a.content, category: a.category,
  tags: a.tags, cover: a.cover, published: a.published, date: a.date, updated_at: new Date().toISOString(),
  i18n: a.i18n,
});

const toPublication = (r: Row): Publication => ({
  id: r.id as string,
  title: r.title as string,
  authors: r.authors as string,
  type: r.type as PublicationType,
  venue: r.venue as string,
  year: r.year as number,
  abstract: r.abstract as string,
  pdfUrl: r.pdf_url as string,
  link: r.link as string,
  featured: r.featured as boolean,
  i18n: (r.i18n as Publication["i18n"]) ?? {},
});
const fromPublication = (p: Omit<Publication, "id">) => ({
  title: p.title, authors: p.authors, type: p.type, venue: p.venue, year: p.year,
  abstract: p.abstract, pdf_url: p.pdfUrl, link: p.link, featured: p.featured, i18n: p.i18n,
});

const toConference = (r: Row): Conference => ({
  id: r.id as string,
  title: r.title as string,
  event: r.event as string,
  location: r.location as string,
  date: r.date as string,
  role: r.role as string,
  description: r.description as string,
  link: r.link as string,
  slidesUrl: r.slides_url as string,
  image: (r.image as string) ?? "",
  i18n: (r.i18n as Conference["i18n"]) ?? {},
});
const fromConference = (c: Omit<Conference, "id">) => ({
  title: c.title, event: c.event, location: c.location, date: c.date, role: c.role,
  description: c.description, link: c.link, slides_url: c.slidesUrl, image: c.image, i18n: c.i18n,
});

const toMessage = (r: Row): Message => ({
  id: r.id as string,
  name: r.name as string,
  email: r.email as string,
  organization: r.organization as string,
  subject: r.subject as string,
  message: r.message as string,
  date: r.created_at as string,
  read: r.read as boolean,
});

/* ---------- Profil ---------- */

export const getProfile = cache(async (): Promise<Profile> => {
  const { data, error } = await sb().from("dr_profile").select("data").eq("id", 1).maybeSingle();
  if (error && error.code !== "PGRST205") throw new Error(`[supabase] profil : ${error.message}`);
  const base = defaultProfile as Profile;
  const stored = (data?.data as Partial<Profile>) ?? {};
  // Fusion profonde des réseaux : les nouvelles clés gardent une valeur par défaut vide.
  const socials = Object.fromEntries(SOCIAL_KEYS.map((k) => [k, stored.socials?.[k] ?? (data ? "" : base.socials[k])])) as Profile["socials"];
  return { ...base, ...stored, socials };
});
export async function saveProfile(p: Profile) {
  const { error } = await sb().from("dr_profile").upsert({ id: 1, data: p, updated_at: new Date().toISOString() });
  check(error, "profil");
}

/* ---------- Articles ---------- */

export const getArticles = cache(async ({ includeDrafts = false } = {}) => {
  let q = sb().from("dr_articles").select("*").order("date", { ascending: false });
  if (!includeDrafts) q = q.eq("published", true);
  return rows(await q, "dr_articles").map(toArticle);
});
export async function getArticleBySlug(slug: string) {
  const { data } = await sb().from("dr_articles").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return data ? toArticle(data) : undefined;
}
export async function getArticleById(id: string) {
  const { data } = await sb().from("dr_articles").select("*").eq("id", id).maybeSingle();
  return data ? toArticle(data) : undefined;
}
export async function slugExists(slug: string, exceptId?: string) {
  let q = sb().from("dr_articles").select("id").eq("slug", slug);
  if (exceptId) q = q.neq("id", exceptId);
  const { data } = await q;
  return (data?.length ?? 0) > 0;
}
export async function upsertArticle(id: string | null, a: Omit<Article, "id" | "updatedAt">) {
  await save("dr_articles", id, fromArticle(a), "article");
}
export async function deleteArticle(id: string) {
  check((await sb().from("dr_articles").delete().eq("id", id)).error, "article");
}

/* ---------- Publications ---------- */

export const getPublications = cache(async () =>
  rows(await sb().from("dr_publications").select("*").order("year", { ascending: false }).order("created_at", { ascending: false }), "dr_publications").map(toPublication),
);
export async function getPublicationById(id: string) {
  const { data } = await sb().from("dr_publications").select("*").eq("id", id).maybeSingle();
  return data ? toPublication(data) : undefined;
}
export async function upsertPublication(id: string | null, p: Omit<Publication, "id">) {
  await save("dr_publications", id, fromPublication(p), "publication");
}
export async function deletePublication(id: string) {
  check((await sb().from("dr_publications").delete().eq("id", id)).error, "publication");
}

/* ---------- Conférences ---------- */

export const getConferences = cache(async () =>
  rows(await sb().from("dr_conferences").select("*").order("date", { ascending: false }), "dr_conferences").map(toConference),
);
export async function getConferenceById(id: string) {
  const { data } = await sb().from("dr_conferences").select("*").eq("id", id).maybeSingle();
  return data ? toConference(data) : undefined;
}
export async function upsertConference(id: string | null, c: Omit<Conference, "id">) {
  await save("dr_conferences", id, fromConference(c), "conférence");
}
export async function deleteConference(id: string) {
  check((await sb().from("dr_conferences").delete().eq("id", id)).error, "conférence");
}

/* ---------- Messages ---------- */

export async function getMessages() {
  return rows(await sb().from("dr_messages").select("*").order("created_at", { ascending: false }), "dr_messages").map(toMessage);
}
export async function countUnreadMessages() {
  const { count } = await sb().from("dr_messages").select("id", { count: "exact", head: true }).eq("read", false);
  return count ?? 0;
}
export async function addMessage(msg: Pick<Message, "name" | "email" | "organization" | "subject" | "message">) {
  check((await sb().from("dr_messages").insert(msg)).error, "message");
}
export async function setMessageRead(id: string, read: boolean) {
  check((await sb().from("dr_messages").update({ read }).eq("id", id)).error, "message");
}
export async function deleteMessage(id: string) {
  check((await sb().from("dr_messages").delete().eq("id", id)).error, "message");
}

/* ---------- Fichiers (Supabase Storage) ---------- */

export async function uploadMedia(file: File, folder: string) {
  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
  const base = slugify(dot >= 0 ? file.name.slice(0, dot) : file.name) || "fichier";
  const path = `${folder}/${base}-${randomBytes(3).toString("hex")}${ext}`;
  const { error } = await sb().storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    cacheControl: "31536000",
    upsert: false,
  });
  check(error, "téléversement");
  return sb().storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Supprime un fichier du bucket s'il en provient (ignore les URL externes). */
export async function removeMedia(url: string) {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return;
  await sb().storage.from(MEDIA_BUCKET).remove([decodeURIComponent(url.slice(i + marker.length))]);
}
