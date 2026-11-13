"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sommaire collant qui suit la section en cours de lecture. */
export function TableOfContents({ items, title }: { items: { id: string; text: string }[]; title: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={title} className="sticky top-28">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{title}</p>
      <ol className="mt-4 space-y-1 border-l border-line text-sm">
        {items.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              aria-current={active === t.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pl-4 transition-colors duration-300",
                active === t.id ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
