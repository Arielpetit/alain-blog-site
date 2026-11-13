import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, FileText, Inbox, Languages, Library, PenLine, Plus, UserRound } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getArticles, getConferences, getMessages, getProfile, getPublications } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/ui";

export default async function Dashboard() {
  const [, profile, articles, publications, conferences, messages] = await Promise.all([
    requireAdmin(),
    getProfile(),
    getArticles({ includeDrafts: true }),
    getPublications(),
    getConferences(),
    getMessages(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const published = articles.filter((a) => a.published).length;
  const unread = messages.filter((m) => !m.read);
  const upcoming = conferences.filter((c) => c.date >= today).reverse();
  const missingEn =
    articles.filter((a) => a.published && !a.i18n?.en?.content?.trim()).length +
    publications.filter((p) => !p.i18n?.en?.title?.trim()).length +
    conferences.filter((c) => !c.i18n?.en?.title?.trim()).length;
  const hour = Number(new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hour12: false, timeZone: "Africa/Brazzaville" }).format(new Date()));
  const greeting = hour < 18 ? "Bonjour" : "Bonsoir";

  const stats = [
    { label: "Articles publiés", value: published, sub: `${articles.length - published} brouillon(s)`, icon: FileText, href: "/admin/articles" },
    { label: "Publications", value: publications.length, sub: `${publications.filter((p) => p.pdfUrl).length} avec PDF`, icon: Library, href: "/admin/publications" },
    { label: "Conférences à venir", value: upcoming.length, sub: `${conferences.length} au total`, icon: CalendarDays, href: "/admin/conferences" },
    { label: "Messages non lus", value: unread.length, sub: `${messages.length} reçu(s)`, icon: Inbox, href: "/admin/messages", highlight: unread.length > 0 },
  ];

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm capitalize text-muted">{formatDate(today, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          <h1 className="mt-1 text-[1.75rem] font-semibold text-ink md:text-3xl">
            {greeting}, {profile.name.replace(/^(Dr\.?|Pr\.?)\s+/i, "")}
          </h1>
          <p className="mt-1.5 text-muted">Voici l'essentiel de votre site aujourd'hui.</p>
        </div>
        <Link href="/admin/articles/nouveau" className="btn btn-primary">
          <PenLine className="size-4" aria-hidden /> Rédiger un article
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, href, highlight }, i) => (
          <Link
            key={label}
            href={href}
            className="card hover-lift group animate-fade-up p-4 sm:p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className={`grid size-10 place-items-center rounded-xl ${highlight ? "bg-accent text-white" : "bg-accent-soft text-accent-dark"}`}>
                <Icon className="size-[1.1rem]" aria-hidden />
              </span>
              <ArrowUpRight className="size-4 text-muted opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
            </div>
            <p className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">{value}</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{label}</p>
            <p className="mt-0.5 text-xs text-muted">{sub}</p>
          </Link>
        ))}
      </div>

      {missingEn > 0 && (
        <div className="mt-4 flex animate-fade-up items-center gap-3 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent-dark [animation-delay:250ms]">
          <Languages className="size-4 shrink-0" aria-hidden />
          <p className="flex-1">
            <strong>{missingEn}</strong> contenu(s) sans traduction anglaise : le site anglais affiche alors la version française.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="card overflow-hidden lg:col-span-3">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-serif text-lg font-semibold text-ink">Derniers messages</h2>
            <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm font-medium text-accent-dark hover:underline">
              Boîte de réception <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          {messages.length ? (
            <ul className="divide-y divide-line">
              {messages.slice(0, 5).map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/messages#${m.id}`} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2/60">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-ink">
                      {m.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className={`truncate text-sm text-ink ${m.read ? "" : "font-semibold"}`}>{m.name}</p>
                        <time className="shrink-0 text-xs text-muted">{formatDate(m.date, { day: "numeric", month: "short" })}</time>
                      </div>
                      <p className="truncate text-sm text-muted">{m.subject}</p>
                    </div>
                    {!m.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" aria-label="Non lu" />}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-muted">Aucun message pour le moment.</p>
          )}
        </section>

        <div className="space-y-6 lg:col-span-2">
          <section className="card p-5">
            <h2 className="font-serif text-lg font-semibold text-ink">Actions rapides</h2>
            <div className="mt-4 grid gap-2">
              {[
                { href: "/admin/publications/nouveau", label: "Ajouter une publication", icon: Plus },
                { href: "/admin/conferences/nouveau", label: "Ajouter une conférence", icon: Plus },
                { href: "/admin/profil", label: "Mettre à jour le profil", icon: UserRound },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="group flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm text-ink transition-colors hover:border-ink">
                  {label}
                  <Icon className="size-4 text-muted transition-transform group-hover:scale-110" aria-hidden />
                </Link>
              ))}
            </div>
          </section>

          <section className="card p-5">
            <h2 className="font-serif text-lg font-semibold text-ink">Articles récents</h2>
            <ul className="mt-3 divide-y divide-line">
              {articles.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <Link href={`/admin/articles/${a.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="truncate text-ink hover:text-accent-dark">{a.title}</span>
                    <StatusBadge ok={a.published} yes="Publié" no="Brouillon" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {upcoming[0] && (
            <section className="card relative overflow-hidden p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-dark">Prochaine intervention</p>
              <p className="mt-2 font-serif text-lg font-semibold leading-snug text-ink">{upcoming[0].title}</p>
              <p className="mt-1 text-sm text-muted">
                {formatDate(upcoming[0].date)} · {upcoming[0].location}
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
