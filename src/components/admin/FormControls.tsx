"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Bold,
  FileText,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  LoaderCircle,
  Quote,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Markdown } from "@/components/site/Markdown";
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
   Éditeur Markdown avec barre d'outils et aperçu
   --------------------------------------------------------------------- */

type Action = { icon: typeof Bold; label: string; before: string; after?: string; block?: boolean };
const ACTIONS: Action[] = [
  { icon: Heading2, label: "Titre de section", before: "## ", block: true },
  { icon: Heading3, label: "Sous-titre", before: "### ", block: true },
  { icon: Bold, label: "Gras", before: "**", after: "**" },
  { icon: Italic, label: "Italique", before: "*", after: "*" },
  { icon: Quote, label: "Citation", before: "> ", block: true },
  { icon: List, label: "Liste à puces", before: "- ", block: true },
  { icon: ListOrdered, label: "Liste numérotée", before: "1. ", block: true },
  { icon: Link2, label: "Lien", before: "[", after: "](https://)" },
];

export function MarkdownEditor({ name, defaultValue = "", rows = 18, id }: { name: string; defaultValue?: string; rows?: number; id?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  const apply = (a: Action) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || (a.block ? "" : "texte");
    let next: string;
    let cursor: number;
    if (a.block) {
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      next = value.slice(0, lineStart) + a.before + value.slice(lineStart);
      cursor = e + a.before.length;
    } else {
      next = value.slice(0, s) + a.before + selected + (a.after ?? "") + value.slice(e);
      cursor = s + a.before.length + selected.length;
    }
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-surface focus-within:border-accent focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_20%,transparent)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2 px-2 py-1.5">
        <div role="tablist" className="flex">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                tab === t ? "bg-surface font-medium text-ink shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              {t === "write" ? "Écrire" : "Aperçu"}
            </button>
          ))}
        </div>
        {tab === "write" && (
          <div className="flex flex-wrap items-center" role="toolbar" aria-label="Mise en forme">
            {ACTIONS.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => apply(a)}
                className="grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink"
                title={a.label}
                aria-label={a.label}
              >
                <a.icon className="size-4" />
              </button>
            ))}
          </div>
        )}
      </div>
      <textarea
        ref={ref}
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn("block w-full resize-y border-0 bg-transparent p-4 font-mono text-[0.86rem] leading-relaxed text-ink focus:outline-none", tab !== "write" && "hidden")}
      />
      {tab === "preview" && (
        <div className="min-h-[20rem] p-5 sm:p-6">
          {value.trim() ? <Markdown className="prose-base no-dropcap">{value}</Markdown> : <p className="text-sm text-muted">Rien à prévisualiser.</p>}
        </div>
      )}
      <div className="flex justify-between border-t border-line px-4 py-2 text-xs text-muted">
        <span>Markdown</span>
        <span>
          {words} mot{words > 1 ? "s" : ""} · ≈ {Math.max(1, Math.round(words / 220))} min
        </span>
      </div>
    </div>
  );
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
