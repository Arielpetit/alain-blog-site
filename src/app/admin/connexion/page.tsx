import type { Metadata } from "next";
import { LogoMark } from "@/components/shared/Logo";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getProfile } from "@/lib/db";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

const ERRORS: Record<string, string> = {
  "non-autorise": "Ce compte n'a pas accès à l'administration.",
  lien: "Le lien est invalide ou a expiré. Demandez-en un nouveau.",
};

const BG = "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1600&q=80&auto=format&fit=crop";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; erreur?: string }> }) {
  const [{ next = "/admin", erreur }, profile] = await Promise.all([searchParams, getProfile()]);
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-deep lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="eyebrow text-accent">Espace administrateur</p>
          <p className="mt-4 max-w-md font-serif text-4xl leading-tight">« {profile.tagline} »</p>
          <p className="mt-4 text-white/60">{profile.name}</p>
        </div>
      </div>
      <div className="grid place-items-center bg-paper px-5 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="text-center">
            <LogoMark className="mx-auto size-14" />
            <h1 className="mt-5 text-3xl font-semibold text-ink">Connexion</h1>
            <p className="mt-2 text-sm text-muted">Gérez vos articles, publications et messages.</p>
          </div>
          {erreur && ERRORS[erreur] && (
            <p role="alert" className="mt-6 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">{ERRORS[erreur]}</p>
          )}
          <div className="card mt-6 p-6">
            <LoginForm next={next} />
          </div>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="size-3.5" aria-hidden /> Connexion sécurisée par Supabase
          </p>
          <Link href="/" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden /> Retour au site
          </Link>
        </div>
      </div>
    </main>
  );
}
