import { notFound } from "next/navigation";
import { getPublicationById } from "@/lib/db";
import { PUBLICATION_TYPES, type Publication } from "@/lib/types";
import { AdminHeader, Field, Section } from "@/components/admin/ui";
import { FileField, LangTabs, MarkdownEditor, SaveBar, Toggle } from "@/components/admin/FormControls";
import { savePublication } from "../../../actions";

export const metadata = { title: "Publication" };

export default async function EditPublication({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "nouveau";
  const found = isNew ? undefined : await getPublicationById(id);
  if (!isNew && !found) notFound();
  const p: Publication = found ?? {
    id: "", title: "", authors: "", type: "article", venue: "", year: new Date().getFullYear(), abstract: "", pdfUrl: "", link: "", featured: false, i18n: {},
  };
  const en = p.i18n?.en ?? {};

  return (
    <form action={savePublication}>
      <input type="hidden" name="id" value={p.id} />
      <AdminHeader title={isNew ? "Nouvelle publication" : "Modifier la publication"} description={isNew ? undefined : p.title} back={{ href: "/admin/publications", label: "Publications" }} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <Section title="Référence">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Type" htmlFor="type" required>
                <select id="type" name="type" defaultValue={p.type} className="field">
                  {Object.entries(PUBLICATION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="Année" htmlFor="year" required>
                <input id="year" name="year" type="number" min={1950} max={2100} required defaultValue={p.year} className="field" />
              </Field>
              <Field label="Auteur(s)" htmlFor="authors" required>
                <input id="authors" name="authors" required defaultValue={p.authors} className="field" placeholder="J. Dupont, A. Martin" />
              </Field>
            </div>
          </Section>
          <Section title="Description">
            <LangTabs
              enFilled={!!en.title?.trim()}
              fr={
                <>
                  <Field label="Titre" htmlFor="title" required>
                    <input id="title" name="title" required defaultValue={p.title} className="field" />
                  </Field>
                  <Field label="Revue / éditeur / événement" htmlFor="venue" hint="Ex. : Revue africaine de droit public, n° 12, p. 45-78">
                    <input id="venue" name="venue" defaultValue={p.venue} className="field" />
                  </Field>
                  <Field label="Résumé" htmlFor="abstract">
                    <textarea id="abstract" name="abstract" rows={6} defaultValue={p.abstract} className="field" />
                  </Field>
                  <Field label="Présentation détaillée (facultatif)" htmlFor="summary" hint="Affichée sur la fiche de la publication : problématique, plan, conclusions…">
                    <MarkdownEditor id="summary" name="summary" defaultValue={p.i18n?.fr?.summary ?? ""} rows={12} />
                  </Field>
                </>
              }
              en={
                <>
                  <Field label="Title" htmlFor="en_title">
                    <input id="en_title" name="en_title" defaultValue={en.title} className="field" />
                  </Field>
                  <Field label="Journal / publisher / event" htmlFor="en_venue">
                    <input id="en_venue" name="en_venue" defaultValue={en.venue} className="field" />
                  </Field>
                  <Field label="Abstract" htmlFor="en_abstract">
                    <textarea id="en_abstract" name="en_abstract" rows={6} defaultValue={en.abstract} className="field" />
                  </Field>
                  <Field label="Detailed overview (optional)" htmlFor="en_summary">
                    <MarkdownEditor id="en_summary" name="en_summary" defaultValue={en.summary ?? ""} rows={12} />
                  </Field>
                </>
              }
            />
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Mise en avant">
            <Toggle name="featured" defaultChecked={p.featured} label="Publication à la une" hint="Affichée sur la page d'accueil" />
          </Section>
          <Section title="Documents">
            <FileField label="Document PDF" fileName="pdfFile" urlName="pdfUrl" removeName="removePdf" current={p.pdfUrl} accept=".pdf,application/pdf" hint="Bouton « Lire l'article » sur le site. PDF, 15 Mo maximum." />
            <Field label="Lien externe" htmlFor="link" hint="Éditeur, DOI, HAL…">
              <input id="link" name="link" type="url" defaultValue={p.link} className="field" placeholder="https://" />
            </Field>
          </Section>
        </div>
      </div>

      <SaveBar cancelHref="/admin/publications" label={isNew ? "Ajouter la publication" : "Enregistrer"} />
    </form>
  );
}
