import Link from "next/link";
import { FileText, Library, Pencil, Star } from "lucide-react";
import { getPublications } from "@/lib/db";
import { PUBLICATION_TYPES } from "@/lib/types";
import { AdminHeader, EmptyState } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/FormControls";
import { SearchableList } from "@/components/admin/SearchableList";
import { removePublication } from "../../actions";

export const metadata = { title: "Publications" };

export default async function AdminPublications() {
  const pubs = await getPublications();
  return (
    <>
      <AdminHeader title="Publications" description="Ouvrages, articles, chapitres, thèse et communications." action={{ href: "/admin/publications/nouveau", label: "Nouvelle publication" }} />
      {pubs.length === 0 ? (
        <EmptyState icon={Library} title="Aucune publication" description="Ajoutez vos travaux scientifiques." href="/admin/publications/nouveau" label="Ajouter une publication" />
      ) : (
        <SearchableList
          placeholder="Rechercher une publication…"
          filters={[
            { value: "featured", label: "À la une" },
            { value: "pdf", label: "Avec PDF" },
            { value: "no-en", label: "Sans traduction" },
          ]}
          rows={pubs.map((p) => ({
            id: p.id,
            text: `${p.title} ${p.authors} ${p.venue} ${p.year}`,
            tags: [...(p.featured ? ["featured"] : []), ...(p.pdfUrl ? ["pdf"] : []), ...(p.i18n?.en?.title?.trim() ? [] : ["no-en"])],
            node: (
              <div className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
                <span className="w-12 shrink-0 font-serif text-xl font-semibold text-accent-dark">{p.year}</span>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/publications/${p.id}`} className="line-clamp-1 font-medium text-ink hover:text-accent-dark">{p.title}</Link>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-muted">
                    <span className="badge">{PUBLICATION_TYPES[p.type]}</span>
                    {p.featured && <span className="inline-flex items-center gap-1 text-accent-dark"><Star className="size-3 fill-current" aria-hidden /> À la une</span>}
                    {p.pdfUrl && <span className="inline-flex items-center gap-1"><FileText className="size-3" aria-hidden /> PDF</span>}
                    <span className={p.i18n?.en?.title?.trim() ? "badge badge-success" : "badge badge-neutral"}>EN</span>
                    <span className="hidden truncate md:inline">{p.venue}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Link href={`/admin/publications/${p.id}`} className="btn btn-outline btn-sm">
                    <Pencil className="size-3.5" aria-hidden /> <span className="hidden sm:inline">Modifier</span>
                  </Link>
                  <DeleteButton action={removePublication} id={p.id} compact title="Supprimer cette publication ?" description={`« ${p.title} » et son PDF éventuel seront définitivement supprimés.`} />
                </div>
              </div>
            ),
          }))}
        />
      )}
    </>
  );
}
