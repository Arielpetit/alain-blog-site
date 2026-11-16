"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { sendContact, type ContactState } from "@/app/actions";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function ContactForm({ defaultSubject = "", lang }: { defaultSubject?: string; lang: Locale }) {
  const t = getDictionary(lang).contact;
  const [key, setKey] = useState(0);
  return <Form key={key} t={t} defaultSubject={defaultSubject} onReset={() => setKey((k) => k + 1)} />;
}

function Form({ t, defaultSubject, onReset }: { t: ReturnType<typeof getDictionary>["contact"]; defaultSubject: string; onReset: () => void }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { ok: false });

  if (state.ok)
    return (
      <div className="card flex animate-scale-in flex-col items-center px-6 py-14 text-center" role="status">
        <span className="grid size-16 place-items-center rounded-full bg-success-soft">
          <CheckCircle2 className="size-8 text-success" aria-hidden />
        </span>
        <p className="mt-5 font-serif text-2xl font-semibold text-ink">{t.sentTitle}</p>
        <p className="mt-2 max-w-sm text-muted">{t.sentText}</p>
        <button type="button" onClick={onReset} className="btn btn-outline mt-7">{t.sendAnother}</button>
      </div>
    );

  const f = state.fields ?? {};
  const subject = f.subject ?? defaultSubject;
  const req = <span className="text-danger">*</span>;

  return (
    <form action={action} className="card space-y-4 p-5 sm:space-y-5 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">{t.name} {req}</label>
          <input id="name" name="name" required maxLength={120} autoComplete="name" defaultValue={f.name} className="field" />
        </div>
        <div>
          <label htmlFor="email" className="field-label">{t.email} {req}</label>
          <input id="email" name="email" type="email" required autoComplete="email" defaultValue={f.email} className="field" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="organization" className="field-label">{t.organization}</label>
          <input id="organization" name="organization" maxLength={160} autoComplete="organization" defaultValue={f.organization} className="field" placeholder={t.optional} />
        </div>
        <div>
          <label htmlFor="subject" className="field-label">{t.subject} {req}</label>
          <input id="subject" name="subject" required maxLength={200} list="subjects" defaultValue={subject} className="field" placeholder={t.subjectPlaceholder} />
          <datalist id="subjects">{t.subjects.map((s) => <option key={s} value={s} />)}</datalist>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="field-label">{t.message} {req}</label>
        <textarea id="message" name="message" required minLength={10} maxLength={5000} rows={6} defaultValue={f.message} className="field resize-y" />
      </div>
      {/* Piège anti-spam */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {state.error && (
        <p role="alert" className="animate-fade-up rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger">{t.errors[state.error]}</p>
      )}

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">{t.privacy}</p>
        <button type="submit" className="btn btn-primary px-6 py-3" disabled={pending}>
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
          {pending ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
