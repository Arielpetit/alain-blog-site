import { KeyRound, Palette, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { AdminHeader, Section } from "@/components/admin/ui";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export const metadata = { title: "Mon compte" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ reinit?: string }> }) {
  const [user, { reinit }] = await Promise.all([requireAdmin(), searchParams]);
  return (
    <>
      <AdminHeader title="Mon compte" description="Connexion, sécurité et préférences." />
      {reinit && (
        <p role="status" className="mb-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent-dark">
          <KeyRound className="size-4 shrink-0" aria-hidden /> Vous êtes connecté via le lien reçu par e-mail : choisissez maintenant un nouveau mot de passe.
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Identifiant" aside={<ShieldCheck className="size-5 text-success" aria-hidden />}>
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-muted">Adresse e-mail</dt>
              <dd className="mt-1 break-all font-medium text-ink">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Dernière connexion</dt>
              <dd className="mt-1 font-medium text-ink">
                {user.last_sign_in_at ? formatDate(user.last_sign_in_at, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
              </dd>
            </div>
          </dl>
        </Section>
        <Section title="Apparence" description="S'applique au site et à l'administration sur cet appareil." aside={<Palette className="size-5 text-accent" aria-hidden />}>
          <ThemeToggle variant="segmented" labels={{ label: "Thème", light: "Clair", dark: "Sombre", system: "Système" }} />
        </Section>
        <Section title="Changer le mot de passe" className="lg:col-span-2">
          <PasswordForm />
        </Section>
      </div>
    </>
  );
}
