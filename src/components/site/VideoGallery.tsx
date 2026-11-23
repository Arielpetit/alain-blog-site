"use client";

import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

type Video = { title: string; url: string; poster?: string };

/** Miniatures cliquables ; la vidéo se lit dans une fenêtre (aucun chargement avant le clic). */
export function VideoGallery({ videos, label, closeLabel }: { videos: Video[]; label: string; closeLabel: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<Video | null>(null);

  if (!videos.length) return null;

  const open = (v: Video) => {
    setCurrent(v);
    dialog.current?.showModal();
  };
  const close = () => {
    dialog.current?.close();
    setCurrent(null); // démonte le lecteur : arrête la lecture
  };

  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label} <span className="font-normal normal-case tracking-normal">({videos.length})</span>
      </p>
      <ul className="mt-2.5 grid grid-cols-3 gap-2 sm:gap-3">
        {videos.map((v) => (
          <li key={v.url}>
            <button
              type="button"
              onClick={() => open(v)}
              className="group/vid relative block aspect-video w-full overflow-hidden rounded-lg bg-navy text-left ring-1 ring-line transition-shadow hover:ring-accent"
              aria-label={v.title}
            >
              {v.poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.poster} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover/vid:scale-105" />
              )}
              <span aria-hidden className="absolute inset-0 bg-navy-deep/30 transition-colors group-hover/vid:bg-navy-deep/10" />
              <span aria-hidden className="absolute inset-0 grid place-items-center">
                <span className="grid size-9 place-items-center rounded-full bg-white/90 text-navy shadow-lg transition-transform duration-300 group-hover/vid:scale-110 sm:size-10">
                  <Play className="size-4 translate-x-px fill-current" />
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-navy-deep/80 to-transparent px-2 pb-1 pt-4 text-[0.65rem] font-medium text-white sm:text-xs">
                {v.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setCurrent(null)}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto w-[calc(100%-1.5rem)] max-w-3xl overflow-hidden rounded-2xl border-0 bg-navy-deep p-0 text-white shadow-2xl open:animate-scale-in"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="min-w-0 truncate text-sm font-medium">{current?.title}</p>
          <button type="button" onClick={close} className="grid size-8 shrink-0 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white" aria-label={closeLabel}>
            <X className="size-5" />
          </button>
        </div>
        {current && (
          <video key={current.url} src={current.url} poster={current.poster} controls autoPlay playsInline preload="metadata" className="block aspect-video w-full bg-black" />
        )}
      </dialog>
    </div>
  );
}
