import Link from "next/link";
import { CalendarDays, MapPin, Pencil } from "lucide-react";
import { getConferences } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AdminHeader, EmptyState } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/FormControls";
import { SearchableList } from "@/components/admin/SearchableList";
import { removeConference } from "../../actions";

export const metadata = { title: "Conférences" };

export default async function AdminConferences() {
  const confs = await getConferences();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <AdminHeader title="Conférences" description="Colloques, interventions et formations." action={{ href: "/admin/conferences/nouveau", label: "Nouvelle conférence" }} />
      {confs.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Aucune conférence" description="Ajoutez vos interventions passées et à venir." href="/admin/conferences/nouveau" label="Ajouter une conférence" />
      ) : (
        <SearchableList
          placeholder="Rechercher une conférence…"
          filters={[
            { value: "upcoming", label: "À venir" },
            { value: "past", label: "Passées" },
            { value: "no-en", label: "Sans traduction" },
          ]}
          rows={confs.map((c) => ({
            id: c.id,
            text: `${c.title} ${c.event} ${c.location} ${c.role}`,
            tags: [c.date >= today ? "upcoming" : "past", ...(c.i18n?.en?.title?.trim() ? [] : ["no-en"])],
            node: (
              <div className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
                <div className={`flex w-14 shrink-0 flex-col items-center rounded-lg py-1.5 ${c.date >= today ? "bg-primary text-primary-fg" : "bg-accent-soft text-accent-dark"}`}>
                  <span className="font-serif text-lg font-semibold leading-none">{formatDate(c.date, { day: "2-digit" })}</span>
                  <span className="text-[0.62rem] uppercase tracking-wider">{formatDate(c.date, { month: "short", year: "2-digit" }).replace(".", "")}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/conferences/${c.id}`} className="line-clamp-1 font-medium text-ink hover:text-accent-dark">{c.title}</Link>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-muted">
                    <span className="badge">{c.role}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3" aria-hidden /> {c.location}</span>
                    <span className={c.i18n?.en?.title?.trim() ? "badge badge-success" : "badge badge-neutral"}>EN</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Link href={`/admin/conferences/${c.id}`} className="btn btn-outline btn-sm">
                    <Pencil className="size-3.5" aria-hidden /> <span className="hidden sm:inline">Modifier</span>
                  </Link>
                  <DeleteButton action={removeConference} id={c.id} compact title="Supprimer cette conférence ?" description={`« ${c.title} » sera définitivement supprimée.`} />
                </div>
              </div>
            ),
          }))}
        />
      )}
    </>
  );
}
