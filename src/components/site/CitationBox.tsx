"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils";

/** Référence dans plusieurs formats, avec copie en un clic. */
export function CitationBox({ formats, labels }: { formats: Record<string, string>; labels: { title: string; copy: string; copied: string } }) {
  const keys = Object.keys(formats);
  const [active, setActive] = useState(keys[0]);
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="font-serif text-lg font-semibold text-ink">{labels.title}</p>
        <div role="tablist" className="flex rounded-full bg-surface-2 p-1">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={active === k}
              onClick={() => setActive(k)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                active === k ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      <pre key={active} className="animate-fade-in overflow-x-auto whitespace-pre-wrap break-words px-5 py-4 font-mono text-[0.82rem] leading-relaxed text-ink/85">
        {formats[active]}
      </pre>
      <div className="flex justify-end border-t border-line bg-surface-2/60 px-5 py-3">
        <CopyButton text={formats[active]} label={labels.copy} copiedLabel={labels.copied} />
      </div>
    </div>
  );
}
