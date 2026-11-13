"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

const MESSAGES: Record<string, string> = {
  cree: "Élément créé avec succès.",
  modifie: "Modifications enregistrées.",
  supprime: "Élément supprimé.",
};

function ToastInner() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get("ok");
    if (!code || !MESSAGES[code]) return;
    setMsg(MESSAGES[code]);
    // Nettoie l'URL sans recharger la page.
    const next = new URLSearchParams(params);
    next.delete("ok");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
    const id = setTimeout(() => setMsg(null), 4000);
    return () => clearTimeout(id);
  }, [params, pathname, router]);

  if (!msg) return null;
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
      <div role="status" className="pointer-events-auto flex animate-toast-in items-center gap-3 rounded-xl border border-line bg-surface py-3 pl-4 pr-2 shadow-2xl shadow-black/15">
        <span className="grid size-7 place-items-center rounded-full bg-success-soft">
          <CheckCircle2 className="size-4 text-success" aria-hidden />
        </span>
        <p className="text-sm font-medium text-ink">{msg}</p>
        <button type="button" onClick={() => setMsg(null)} className="grid size-7 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-ink" aria-label="Fermer">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function Toast() {
  return (
    <Suspense fallback={null}>
      <ToastInner />
    </Suspense>
  );
}
