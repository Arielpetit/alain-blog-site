"use client";

import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

type Video = { title: string; url: string; poster?: string };

/** Miniatures cliquables ; la vidéo se lit dans une fenêtre (aucun chargement avant le clic). */
export function VideoGallery({ videos, closeLabel }: { videos: Video[]; closeLabel: string }) {
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
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <li key={v.url}>
            <button
              type="button"
              onClick={() => open(v)}
              className="group/vid relative block aspect-video w-full overflow-hidden rounded-xl bg-navy text-left ring-1 ring-line transition-shadow hover:ring-accent"
              aria-label={v.title}
            >
              {v.poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.poster} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover/vid:scale-105" />
              )}
              <span aria-hidden className="absolute inset-0 bg-navy-deep/25 transition-colors group-hover/vid:bg-navy-deep/5" />
              <span aria-hidden className="absolute inset-0 grid place-items-center">
                <span className="grid size-14 place-items-center rounded-full bg-white/90 text-navy shadow-lg transition-transform duration-300 group-hover/vid:scale-110">
                  <Play className="size-6 translate-x-0.5 fill-current" />
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 to-transparent px-3 pb-2 pt-8 text-sm font-medium text-white">{v.title}</span>
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
        {current && <video key={current.url} src={current.url} poster={current.poster} controls autoPlay playsInline preload="metadata" className="block aspect-video w-full bg-black" />}
      </dialog>
    </>
  );
}
