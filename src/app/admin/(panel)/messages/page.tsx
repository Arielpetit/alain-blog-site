import { Inbox, Mail, MailOpen, Reply } from "lucide-react";
import { getMessages } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AdminHeader, EmptyState } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/FormControls";
import { SearchableList } from "@/components/admin/SearchableList";
import { removeMessage, toggleMessageRead } from "../../actions";

export const metadata = { title: "Messages" };

export default async function AdminMessages() {
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;
  return (
    <>
      <AdminHeader
        title="Messages"
        description={`${messages.length} message(s) reçu(s) via le formulaire de contact${unread ? ` · ${unread} non lu(s)` : ""}`}
      />
      {messages.length === 0 ? (
        <EmptyState icon={Inbox} title="Boîte de réception vide" description="Les messages envoyés depuis la page Contact apparaîtront ici." />
      ) : (
        <SearchableList
          placeholder="Rechercher un message…"
          filters={[
            { value: "unread", label: "Non lus" },
            { value: "read", label: "Lus" },
          ]}
          rows={messages.map((m) => ({
            id: m.id,
            text: `${m.name} ${m.email} ${m.organization} ${m.subject} ${m.message}`,
            tags: [m.read ? "read" : "unread"],
            node: (
              <details id={m.id} className="group scroll-mt-24" open={!m.read}>
                <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${m.read ? "bg-surface-2 text-muted" : "bg-accent text-white"}`}>
                    {m.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <p className={`text-ink ${m.read ? "" : "font-semibold"}`}>
                        {m.name}
                        {m.organization && <span className="ml-1.5 text-sm font-normal text-muted">· {m.organization}</span>}
                      </p>
                      <time className="text-xs text-muted">
                        {formatDate(m.date, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </div>
                    <p className={`mt-0.5 text-sm ${m.read ? "text-muted" : "text-ink"}`}>{m.subject}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted group-open:hidden">{m.message}</p>
                  </div>
                </summary>
                <div className="animate-fade-in px-4 pb-5 sm:pl-[4.25rem] sm:pr-5">
                  <a href={`mailto:${m.email}`} className="text-sm text-accent-dark underline-offset-2 hover:underline">{m.email}</a>
                  <p className="mt-3 whitespace-pre-wrap rounded-xl bg-surface-2 p-4 leading-relaxed text-ink">{m.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="btn btn-primary btn-sm">
                      <Reply className="size-4" aria-hidden /> Répondre
                    </a>
                    <form action={toggleMessageRead}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="read" value={String(!m.read)} />
                      <button className="btn btn-outline btn-sm">
                        {m.read ? <Mail className="size-4" aria-hidden /> : <MailOpen className="size-4" aria-hidden />}
                        {m.read ? "Marquer non lu" : "Marquer comme lu"}
                      </button>
                    </form>
                    <DeleteButton action={removeMessage} id={m.id} title="Supprimer ce message ?" description={`Le message de ${m.name} sera définitivement supprimé.`} />
                  </div>
                </div>
              </details>
            ),
          }))}
        />
      )}
    </>
  );
}
