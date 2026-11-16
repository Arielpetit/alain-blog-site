"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "tiptap-markdown";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Éditeur visuel (type traitement de texte) : aucun Markdown à connaître.
 * Le contenu est converti en Markdown à l'enregistrement, ce qui garde le
 * même format de stockage et d'affichage que le reste du site.
 * Le collage depuis Word / Google Docs conserve titres, gras, listes et liens.
 */
export function RichTextEditor({
  name,
  defaultValue = "",
  id,
  placeholder = "Commencez à écrire…",
  minHeight = "18rem",
}: {
  name: string;
  defaultValue?: string;
  id?: string;
  placeholder?: string;
  minHeight?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        underline: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Placeholder.configure({ placeholder }),
      Markdown.configure({ html: false, linkify: true, transformPastedText: true, transformCopiedText: true }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: "prose prose-base prose-article no-dropcap max-w-none px-4 py-4 focus:outline-none sm:px-5",
        style: `min-height:${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => setValue(getMarkdown(editor)),
  });

  // Valeur initiale normalisée une fois l'éditeur prêt.
  useEffect(() => {
    if (editor) setValue(getMarkdown(editor));
  }, [editor]);

  const words = value.trim() ? value.replace(/[#>*_\-[\]()`]/g, " ").trim().split(/\s+/).length : 0;

  return (
    <div className="overflow-clip rounded-xl border border-line-strong bg-surface focus-within:border-accent focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_20%,transparent)]">
      <input type="hidden" name={name} value={value} />
      <Toolbar editor={editor} />
      {editor ? (
        // Cliquer n'importe où dans la zone place le curseur dans le texte.
        <div className="cursor-text" style={{ minHeight }} onClick={(e) => e.target === e.currentTarget && editor.commands.focus("end")}>
          <EditorContent editor={editor} className="[&_.tiptap]:outline-none" />
        </div>
      ) : (
        <div className="animate-pulse bg-surface-2/50" style={{ minHeight }} />
      )}
      <div className="flex justify-between border-t border-line px-4 py-2 text-xs text-muted">
        <span>Astuce : vous pouvez coller un texte depuis Word, la mise en forme est conservée.</span>
        <span className="shrink-0 pl-3">
          {words} mot{words > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

function getMarkdown(editor: Editor): string {
  const storage = editor.storage as unknown as { markdown?: { getMarkdown: () => string } };
  return storage.markdown?.getMarkdown() ?? "";
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            p: e.isActive("paragraph"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
            undo: e.can().undo(),
            redo: e.can().redo(),
          }
        : null,
  });

  const run = (fn: (e: Editor) => void) => () => editor && fn(editor);
  const setLink = () => {
    if (!editor) return;
    const prev = (editor.getAttributes("link").href as string | undefined) ?? "https://";
    const url = window.prompt("Adresse du lien", prev);
    if (url === null) return;
    if (!url.trim() || url === "https://") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const groups: { label: string; icon: typeof Bold; on?: boolean; disabled?: boolean; action: () => void }[][] = [
    [
      { label: "Texte normal", icon: Pilcrow, on: state?.p, action: run((e) => e.chain().focus().setParagraph().run()) },
      { label: "Titre de section", icon: Heading2, on: state?.h2, action: run((e) => e.chain().focus().toggleHeading({ level: 2 }).run()) },
      { label: "Sous-titre", icon: Heading3, on: state?.h3, action: run((e) => e.chain().focus().toggleHeading({ level: 3 }).run()) },
    ],
    [
      { label: "Gras", icon: Bold, on: state?.bold, action: run((e) => e.chain().focus().toggleBold().run()) },
      { label: "Italique", icon: Italic, on: state?.italic, action: run((e) => e.chain().focus().toggleItalic().run()) },
      { label: state?.link ? "Retirer le lien" : "Ajouter un lien", icon: state?.link ? Link2Off : Link2, on: state?.link, action: state?.link ? run((e) => e.chain().focus().unsetLink().run()) : setLink },
    ],
    [
      { label: "Liste à puces", icon: List, on: state?.bullet, action: run((e) => e.chain().focus().toggleBulletList().run()) },
      { label: "Liste numérotée", icon: ListOrdered, on: state?.ordered, action: run((e) => e.chain().focus().toggleOrderedList().run()) },
      { label: "Citation", icon: Quote, on: state?.quote, action: run((e) => e.chain().focus().toggleBlockquote().run()) },
    ],
    [
      { label: "Annuler", icon: Undo2, disabled: !state?.undo, action: run((e) => e.chain().focus().undo().run()) },
      { label: "Rétablir", icon: Redo2, disabled: !state?.redo, action: run((e) => e.chain().focus().redo().run()) },
    ],
  ];

  return (
    <div role="toolbar" aria-label="Mise en forme" className="sticky top-16 z-10 flex flex-wrap items-center gap-1 border-b border-line bg-surface-2/95 px-2 py-1.5 backdrop-blur">
      {groups.map((g, gi) => (
        <div key={gi} className={cn("flex items-center", gi > 0 && "border-l border-line pl-1")}>
          {g.map((b) => (
            <button
              key={b.label}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={b.action}
              disabled={b.disabled || !editor}
              title={b.label}
              aria-label={b.label}
              aria-pressed={b.on ?? undefined}
              className={cn(
                "grid size-8 place-items-center rounded-md transition-colors disabled:opacity-35",
                b.on ? "bg-primary text-primary-fg" : "text-muted hover:bg-surface hover:text-ink",
              )}
            >
              <b.icon className="size-4" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
