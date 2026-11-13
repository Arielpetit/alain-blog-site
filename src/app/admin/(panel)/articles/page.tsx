import Link from "next/link";
import { Eye, FileText, Pencil } from "lucide-react";
import { getArticles } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AdminHeader, EmptyState, StatusBadge } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/FormControls";
import { SearchableList } from "@/components/admin/SearchableList";
import { removeArticle } from "../../actions";

export const metadata = { title: "Articles" };

export default async function AdminArticles() {
  const articles = await getArticles({ includeDrafts: true });
  return (
    <>
      <AdminHeader title="Articles" description="Rédigez, traduisez et publiez vos analyses." action={{ href: "/admin/articles/nouveau", label: "Nouvel article" }} />
      {articles.length === 0 ? (
        <EmptyState icon={FileText} title="Aucun article" description="Commencez par rédiger votre premier article." href="/admin/articles/nouveau" label="Rédiger un article" />
      ) : (
        <SearchableList
          placeholder="Rechercher un article…"
          filters={[
            { value: "published", label: "Publiés" },
            { value: "draft", label: "Brouillons" },
            { value: "no-en", label: "Sans traduction" },
          ]}
          rows={articles.map((a) => ({
            id: a.id,
            text: `${a.title} ${a.category} ${a.tags.join(" ")}`,
            tags: [a.published ? "published" : "draft", ...(a.i18n?.en?.content?.trim() ? [] : ["no-en"])],
            node: (
              <div className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
                <div className="hidden size-14 shrink-0 overflow-hidden rounded-lg bg-navy sm:block">
                  {a.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/articles/${a.id}`} className="line-clamp-1 font-medium text-ink hover:text-accent-dark">{a.title}</Link>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-muted">
                    <StatusBadge ok={a.published} yes="Publié" no="Brouillon" />
                    <span>{a.category}</span>
                    <span aria-hidden>·</span>
                    <time>{formatDate(a.date)}</time>
                    <span className={a.i18n?.en?.content?.trim() ? "badge badge-success" : "badge badge-neutral"}>EN</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {a.published && (
                    <Link href={`/articles/${a.slug}`} target="_blank" className="btn btn-ghost btn-icon hidden text-muted sm:inline-flex" title="Voir sur le site" aria-label="Voir sur le site">
                      <Eye className="size-4" />
                    </Link>
                  )}
                  <Link href={`/admin/articles/${a.id}`} className="btn btn-outline btn-sm">
                    <Pencil className="size-3.5" aria-hidden /> <span className="hidden sm:inline">Modifier</span>
                  </Link>
                  <DeleteButton action={removeArticle} id={a.id} compact title="Supprimer cet article ?" description={`« ${a.title} » sera définitivement supprimé, ainsi que son image de couverture.`} />
                </div>
              </div>
            ),
          }))}
        />
      )}
    </>
  );
}
