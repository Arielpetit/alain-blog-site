"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { updatePassword, type FormState } from "@/app/admin/actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(updatePassword, {});
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="field-label">Nouveau mot de passe</label>
          <input id="password" name="password" type="password" minLength={10} required autoComplete="new-password" className="field" />
          <p className="field-hint">10 caractères minimum.</p>
        </div>
        <div>
          <label htmlFor="confirm" className="field-label">Confirmer</label>
          <input id="confirm" name="confirm" type="password" minLength={10} required autoComplete="new-password" className="field" />
        </div>
      </div>
      {state.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-success">{state.success}</p>}
      <button className="btn btn-primary" disabled={pending}>
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />} Mettre à jour le mot de passe
      </button>
    </form>
  );
}
