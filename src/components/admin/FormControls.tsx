"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { FileText, ImageIcon, LoaderCircle, Save, Trash2, UploadCloud, X } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------
   Boutons
   --------------------------------------------------------------------- */

export function SubmitButton({ children = "Enregistrer", className }: { children?: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={cn("btn btn-primary", className)} disabled={pending}>
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
      {pending ? "Enregistrement…" : children}
    </button>
  );
}

/** Suppression avec boîte de dialogue de confirmation. */
export function DeleteButton({
  action,
  id,
  label = "Supprimer",
  title = "Supprimer cet élément ?",
  description = "Cette action est définitive et ne peut pas être annulée.",
  compact = false,
}: {
  action: (form: FormData) => Promise<void>;
  id: string;
  label?: string;
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={cn("btn btn-danger", compact ? "btn-icon" : "btn-sm")}
        aria-label={compact ? label : undefined}
        title={label}
      >
        <Trash2 className="size-4" aria-hidden /> {!compact && label}
      </button>
      <dialog
        ref={dialog}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl open:animate-scale-in"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <div className="p-6">
          <span className="grid size-11 place-items-center rounded-full bg-danger-soft text-danger">
            <Trash2 className="size-5" aria-hidden />
          </span>
          <h2 className="mt-4 font-serif text-xl font-semibold">{title}</h2>
          <p className="mt-1.5 text-sm text-muted">{description}</p>
        </div>
        <form action={action} className="flex flex-col-reverse gap-2 border-t border-line bg-surface-2 px-6 py-4 sm:flex-row sm:justify-end">
          <input type="hidden" name="id" value={id} />
          <button type="button" className="btn btn-outline" onClick={() => dialog.current?.close()}>
            Annuler
          </button>
          <ConfirmButton />
        </form>
      </dialog>
    </>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-danger-solid" disabled={pending}>
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
      Supprimer définitivement
    </button>
  );
}

/* ---------------------------------------------------------------------
   Interrupteur
   --------------------------------------------------------------------- */

export function Toggle({ name, defaultChecked, label, hint }: { name: string; defaultChecked?: boolean; label: string; hint?: string }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
      <input type="checkbox" name={name} checked={on} onChange={(e) => setOn(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2",
          on ? "bg-success" : "bg-line-strong",
        )}
      >
        <span className={cn("absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-300", on && "translate-x-5")} />
      </span>
    </label>
  );
}

/* ---------------------------------------------------------------------
   Onglets de langue (FR / EN) — les deux panneaux restent dans le DOM
   pour être envoyés avec le formulaire.
   --------------------------------------------------------------------- */

export function LangTabs({ fr, en, enFilled }: { fr: React.ReactNode; en: React.ReactNode; enFilled?: boolean }) {
  const [tab, setTab] = useState<"fr" | "en">("fr");
  return (
    <div>
      <div role="tablist" aria-label="Langue du contenu" className="mb-5 inline-flex rounded-full border border-line bg-surface-2 p-1">
        {(["fr", "en"] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={tab === l}
            onClick={() => setTab(l)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === l ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
            )}
          >
            {l === "fr" ? "Français" : "English"}
            {l === "en" && (
              <span
                className={cn("size-1.5 rounded-full", enFilled ? "bg-success" : "bg-accent")}
                title={enFilled ? "Traduction renseignée" : "Traduction manquante"}
              />
            )}
          </button>
        ))}
      </div>
      <div role="tabpanel" hidden={tab !== "fr"} className="space-y-5">{fr}</div>
      <div role="tabpanel" hidden={tab !== "en"} className="space-y-5">
        <p className="rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
          Facultatif : les champs laissés vides affichent la version française sur le site anglais.
        </p>
        {en}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Éditeur de texte
   --------------------------------------------------------------------- */

/** Éditeur de texte riche (visuel) — conserve l'ancien nom pour les formulaires existants. */
export function MarkdownEditor({ name, defaultValue = "", rows = 18, id, placeholder }: { name: string; defaultValue?: string; rows?: number; id?: string; placeholder?: string }) {
  return <RichTextEditor name={name} id={id} defaultValue={defaultValue} placeholder={placeholder} minHeight={`${Math.max(8, rows * 1.4)}rem`} />;
}

/* ---------------------------------------------------------------------
   Champ fichier : glisser-déposer, aperçu, URL, suppression
   --------------------------------------------------------------------- */

export function FileField({
  label,
  urlName,
  fileName,
  removeName,
  current,
  accept,
  hint,
  allowUrl = true,
  image = false,
}: {
  label: string;
  urlName?: string;
  fileName: string;
  removeName: string;
  current: string;
  accept: string;
  hint?: string;
  allowUrl?: boolean;
  /** Affiche un aperçu de l'image. */
  image?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<{ name: string; url?: string } | null>(null);
  const [removed, setRemoved] = useState(false);
  const [drag, setDrag] = useState(false);

  useEffect(() => () => { if (picked?.url) URL.revokeObjectURL(picked.url); }, [picked]);

  const onFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    setRemoved(false);
    setPicked({ name: f.name, url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined });
  };

  const preview = picked?.url ?? (!removed && image ? current : "");
  const hasFile = !!picked || (!!current && !removed);

  return (
    <fieldset className="min-w-0">
      <legend className="field-label">{label}</legend>
      <input type="hidden" name={removeName} value={removed ? "on" : ""} />

      {hasFile ? (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          {image && preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="aspect-[16/9] w-full bg-surface-2 object-cover" />
          )}
          <div className="flex items-center gap-3 px-3 py-2.5 text-sm">
            {image ? <ImageIcon className="size-4 shrink-0 text-accent-dark" aria-hidden /> : <FileText className="size-4 shrink-0 text-accent-dark" aria-hidden />}
            {picked ? (
              <span className="min-w-0 flex-1 truncate text-ink">{picked.name} <span className="text-muted">— sera envoyé à l'enregistrement</span></span>
            ) : (
              <a href={current} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-ink underline-offset-2 hover:underline">
                {decodeURIComponent(current.split("/").pop() ?? current)}
              </a>
            )}
            <button type="button" onClick={() => input.current?.click()} className="btn btn-outline btn-sm">
              Remplacer
            </button>
            <button
              type="button"
              onClick={() => {
                if (picked) {
                  setPicked(null);
                  if (input.current) input.current.value = "";
                } else setRemoved(true);
              }}
              className="grid size-8 place-items-center rounded-md text-muted hover:bg-danger-soft hover:text-danger"
              aria-label="Retirer le fichier"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (input.current && e.dataTransfer.files.length) {
              input.current.files = e.dataTransfer.files;
              onFiles(e.dataTransfer.files);
            }
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            drag ? "border-accent bg-accent-soft" : "border-line-strong hover:border-accent/60 hover:bg-surface-2",
          )}
        >
          <UploadCloud className={cn("size-7 transition-transform", drag ? "-translate-y-1 text-accent" : "text-muted")} aria-hidden />
          <span className="text-sm font-medium text-ink">Glissez un fichier ou cliquez pour parcourir</span>
          {hint && <span className="text-xs text-muted">{hint}</span>}
        </button>
      )}
      <input ref={input} type="file" name={fileName} accept={accept} className="sr-only" tabIndex={-1} onChange={(e) => onFiles(e.target.files)} />

      {allowUrl && urlName && (
        <input
          type="url"
          name={urlName}
          defaultValue={current}
          placeholder="… ou coller une adresse https://"
          className="field mt-3 text-sm"
          onChange={() => setRemoved(false)}
        />
      )}
      {hasFile && hint && <p className="field-hint">{hint}</p>}
    </fieldset>
  );
}

/* ---------------------------------------------------------------------
   Barre d'enregistrement collante
   --------------------------------------------------------------------- */

export function SaveBar({ cancelHref, label, children }: { cancelHref: string; label: string; children?: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-line bg-paper/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="min-w-0 text-xs text-muted">{children}</div>
        <div className="flex shrink-0 gap-2">
          <a href={cancelHref} className="btn btn-outline">Annuler</a>
          <SubmitButton>{label}</SubmitButton>
        </div>
      </div>
    </div>
  );
}
