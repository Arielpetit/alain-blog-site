"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Photo = { url: string; caption?: string };

/** Grille de photos avec visionneuse plein écran (flèches clavier, Échap). */
export function PhotoGallery({ photos, alt, labels }: { photos: Photo[]; alt: string; labels: { close: string; prev: string; next: string } }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const count = photos.length;

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + count) % count)), [count]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  if (!count) return null;
  const current = index !== null ? photos[index] : null;
  const single = count === 1;

  return (
    <>
      <ul className={cn("grid gap-3 sm:gap-4", single ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3")}>
        {photos.map((p, i) => (
          <li key={p.url}>
            <button
              type="button"
              onClick={() => open(i)}
              className={cn("group/ph relative block w-full overflow-hidden rounded-xl bg-navy ring-1 ring-line transition-shadow hover:ring-accent", single ? "aspect-[16/9]" : "aspect-[4/3]")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.caption || `${alt} ${i + 1}`} loading="lazy" className={cn("h-full w-full object-cover transition-transform duration-500 group-hover/ph:scale-105", single && "object-[center_22%]")} />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-black/85"
      >
        {current && (
          <div className="relative grid h-full place-items-center p-3 sm:p-10" onClick={(e) => e.target === e.currentTarget && close()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt={current.caption || alt} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
            {current.caption && <p className="absolute inset-x-0 bottom-3 text-center text-sm text-white/80 sm:bottom-5">{current.caption}</p>}
            <button type="button" onClick={close} className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:right-6 sm:top-6" aria-label={labels.close}>
              <X className="size-5" />
            </button>
            {!single && (
              <>
                <button type="button" onClick={() => go(-1)} className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:left-6" aria-label={labels.prev}>
                  <ChevronLeft className="size-5" />
                </button>
                <button type="button" onClick={() => go(1)} className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:right-6" aria-label={labels.next}>
                  <ChevronRight className="size-5" />
                </button>
                <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs sm:left-6 sm:top-6">{(index ?? 0) + 1} / {count}</span>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
