"use server";

import { headers } from "next/headers";
import { getProfile } from "@/lib/db";
import { sendContactEmail } from "@/lib/mail";

export type ContactError = "required" | "email" | "short" | "long" | "rate" | "server";
export type ContactState = { ok: boolean; error?: ContactError; fields?: Record<string, string> };

const lastSubmit = new Map<string, number>();

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const fields = {
    name: get("name"),
    email: get("email"),
    organization: get("organization"),
    subject: get("subject"),
    message: get("message"),
  };

  // Champ piège anti-robots : invisible pour les humains.
  if (get("website")) return { ok: true };

  if (!fields.name || !fields.email || !fields.subject || !fields.message) return { ok: false, error: "required", fields };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return { ok: false, error: "email", fields };
  if (fields.message.length < 10) return { ok: false, error: "short", fields };
  if (fields.message.length > 5000 || fields.name.length > 120 || fields.subject.length > 200 || fields.organization.length > 160)
    return { ok: false, error: "long", fields };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  if (now - (lastSubmit.get(ip) ?? 0) < 30_000) return { ok: false, error: "rate", fields };

  try {
    const profile = await getProfile();
    await sendContactEmail(profile.email, fields);
  } catch (e) {
    console.error(e);
    return { ok: false, error: "server", fields };
  }
  lastSubmit.set(ip, now);
  return { ok: true };
}
