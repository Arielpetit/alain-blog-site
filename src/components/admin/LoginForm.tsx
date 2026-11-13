"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { login, requestPasswordReset, type FormState } from "@/app/admin/actions";

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  const [resetState, resetAction, resetPending] = useActionState<FormState, FormData>(requestPasswordReset, {});
  const [show, setShow] = useState(false);

  if (mode === "reset")
    return (
      <form action={resetAction} className="space-y-5 animate-fade-up">
        <p className="text-sm text-muted">Saisissez votre adresse : vous recevrez un lien pour choisir un nouveau mot de passe.</p>
        <div>
          <label htmlFor="reset-email" className="field-label">Adresse e-mail</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input id="reset-email" name="email" type="email" required autoComplete="email" className="field pl-10" />
          </div>
        </div>
        {resetState.error && <p role="alert" className="text-sm text-danger">{resetState.error}</p>}
        {resetState.success && <p role="status" className="rounded-lg bg-success/5 px-3 py-2.5 text-sm text-success">{resetState.success}</p>}
        <button className="btn btn-primary w-full py-3" disabled={resetPending}>
          {resetPending && <LoaderCircle className="size-4 animate-spin" aria-hidden />} Envoyer le lien
        </button>
        <button type="button" onClick={() => setMode("login")} className="mx-auto flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Retour à la connexion
        </button>
      </form>
    );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="field-label">Adresse e-mail</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input id="email" name="email" type="email" required autoFocus autoComplete="username" className="field pl-10" />
        </div>
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-ink">Mot de passe</label>
          <button type="button" onClick={() => setMode("reset")} className="text-xs font-medium text-accent-dark hover:underline">
            Mot de passe oublié ?
          </button>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            className="field px-10"
            aria-invalid={!!state.error}
            aria-describedby={state.error ? "login-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded text-muted hover:text-ink"
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      {state.error && <p id="login-error" role="alert" className="text-sm text-danger">{state.error}</p>}
      <button className="btn btn-primary w-full py-3" disabled={pending}>
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
        Se connecter
      </button>
    </form>
  );
}
