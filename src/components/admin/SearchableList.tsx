"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type ListRow = { id: string; text: string; tags?: string[]; node: React.ReactNode };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Liste filtrable (recherche + onglets) pour les pages d'administration. */
export function SearchableList({
  rows,
  filters = [],
  placeholder = "Rechercher…",
  emptyText = "Aucun résultat.",
}: {
  rows: ListRow[];
  filters?: { value: string; label: string }[];
  placeholder?: string;
  emptyText?: string;
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const shown = useMemo(() => {
    const query = norm(q.trim());
    return rows.filter((r) => (filter === "all" || r.tags?.includes(filter)) && (!query || norm(r.text).includes(query)));
  }, [rows, q, filter]);

  const count = (v: string) => (v === "all" ? rows.length : rows.filter((r) => r.tags?.includes(v)).length);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row sm:items-center sm:justify-between">
        {filters.length > 0 && (
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none]" role="tablist">
            {[{ value: "all", label: "Tout" }, ...filters].map((f) => (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={filter === f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
                  filter === f.value ? "bg-surface-2 font-medium text-ink" : "text-muted hover:text-ink",
                )}
              >
                {f.label}
                <span className="rounded-full bg-paper px-1.5 text-xs text-muted">{count(f.value)}</span>
              </button>
            ))}
          </div>
        )}
        <label className="relative sm:ml-auto sm:w-72">
          <span className="sr-only">{placeholder}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="field py-2 pl-9 text-sm" />
        </label>
      </div>
      {shown.length ? (
        <ul className="divide-y divide-line">
          {shown.map((r) => (
            <li key={r.id} className="transition-colors hover:bg-surface-2/60">{r.node}</li>
          ))}
        </ul>
      ) : (
        <p className="px-6 py-14 text-center text-sm text-muted">{emptyText}</p>
      )}
    </div>
  );
}
