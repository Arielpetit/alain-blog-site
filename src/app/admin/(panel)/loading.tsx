/** Squelette affiché instantanément pendant le chargement d'une page d'administration. */
export default function AdminLoading() {
  return (
    <div className="animate-fade-in" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement…</span>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-surface-2" />
          <div className="h-4 w-80 max-w-[70vw] animate-pulse rounded bg-surface-2" />
        </div>
        <div className="hidden h-10 w-40 animate-pulse rounded-lg bg-surface-2 sm:block" />
      </div>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line p-3">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-lg bg-surface-2" />
            ))}
          </div>
          <div className="hidden h-9 w-64 animate-pulse rounded-lg bg-surface-2 sm:block" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-0">
            <div className="size-12 shrink-0 animate-pulse rounded-lg bg-surface-2" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" />
            </div>
            <div className="hidden h-8 w-24 animate-pulse rounded-lg bg-surface-2 sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
