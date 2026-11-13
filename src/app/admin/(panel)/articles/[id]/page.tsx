import { notFound } from "next/navigation";
import { getArticleById, getArticles } from "@/lib/db";
import type { Article } from "@/lib/types";
import { AdminHeader, Field, Section } from "@/components/admin/ui";
import { FileField, LangTabs, MarkdownEditor, SaveBar, Toggle } from "@/components/admin/FormControls";
import { saveArticle } from "../../../actions";

export const metadata = { title: "Article" };

const TEMPLATE = `Introduction de votre article.

## Première partie

Développement…

## Seconde partie

> Une citation marquante.

## Conclusion
`;

export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "nouveau";
  const found = isNew ? undefined : await getArticleById(id);
  if (!isNew && !found) notFound();
  const all = await getArticles({ includeDrafts: true });
  const categories = [...new Set(all.map((x) => x.category))];

  const a: Article = found ?? {
    id: "", slug: "", title: "", excerpt: "", content: TEMPLATE, category: "", tags: [], cover: "",
    published: false, date: new Date().toISOString().slice(0, 10), updatedAt: "", i18n: {},
  };
  const en = a.i18n?.en ?? {};

  return (
    <form action={saveArticle}>
      <input type="hidden" name="id" value={a.id} />
      <AdminHeader
        title={isNew ? "Nouvel article" : "Modifier l'article"}
        description={isNew ? "Rédigez en français ; la traduction anglaise est facultative." : a.title}
        back={{ href: "/admin/articles", label: "Articles" }}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Section title="Contenu">
          <LangTabs
            enFilled={!!en.content?.trim()}
            fr={
              <>
                <Field label="Titre" htmlFor="title" required>
                  <input id="title" name="title" required defaultValue={a.title} className="field text-lg font-medium" placeholder="Titre de l'article" />
                </Field>
                <Field label="Chapô (résumé)" htmlFor="excerpt" required hint="2 à 3 phrases, affichées dans les listes et sur les réseaux sociaux.">
                  <textarea id="excerpt" name="excerpt" required rows={3} maxLength={400} defaultValue={a.excerpt} className="field" />
                </Field>
                <Field label="Corps de l'article" htmlFor="content">
                  <MarkdownEditor id="content" name="content" defaultValue={a.content} />
                </Field>
              </>
            }
            en={
              <>
                <Field label="Title" htmlFor="en_title">
                  <input id="en_title" name="en_title" defaultValue={en.title} className="field text-lg font-medium" placeholder="Article title" />
                </Field>
                <Field label="Excerpt" htmlFor="en_excerpt">
                  <textarea id="en_excerpt" name="en_excerpt" rows={3} maxLength={400} defaultValue={en.excerpt} className="field" />
                </Field>
                <Field label="Category" htmlFor="en_category">
                  <input id="en_category" name="en_category" defaultValue={en.category} className="field" placeholder="e.g. Constitutional law" />
                </Field>
                <Field label="Body" htmlFor="en_content">
                  <MarkdownEditor id="en_content" name="en_content" defaultValue={en.content ?? ""} />
                </Field>
              </>
            }
          />
        </Section>

        <div className="space-y-6">
          <Section title="Publication">
            <Toggle name="published" defaultChecked={a.published} label="Publié sur le site" hint="Désactivez pour garder en brouillon" />
            <Field label="Date" htmlFor="date">
              <input id="date" name="date" type="date" defaultValue={a.date} className="field" />
            </Field>
          </Section>
          <Section title="Classement">
            <Field label="Catégorie" htmlFor="category" required>
              <input id="category" name="category" list="cats" required defaultValue={a.category} className="field" />
              <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
            <Field label="Mots-clés" htmlFor="tags" hint="Séparés par des virgules.">
              <input id="tags" name="tags" defaultValue={a.tags.join(", ")} className="field" />
            </Field>
            <Field label="Adresse (slug)" htmlFor="slug" hint="Vide = générée à partir du titre.">
              <input id="slug" name="slug" defaultValue={a.slug} className="field font-mono text-sm" />
            </Field>
          </Section>
          <Section title="Couverture">
            <FileField label="Image" fileName="coverFile" urlName="cover" removeName="removeCover" current={a.cover} accept="image/*" image hint="Paysage, 1600 × 900 recommandé" />
          </Section>
        </div>
      </div>

      <SaveBar cancelHref="/admin/articles" label={isNew ? "Créer l'article" : "Enregistrer"}>
        {!isNew && <span className="hidden sm:inline">Les modifications sont visibles immédiatement sur le site.</span>}
      </SaveBar>
    </form>
  );
}
