"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function ShareButtons({ title, path, lang }: { title: string; path: string; lang: Locale }) {
  const t = getDictionary(lang).common;
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.origin + path);
    setCanNativeShare(typeof navigator.share === "function");
  }, [path]);

  const enc = encodeURIComponent;
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, short: "in" },
    { label: "X", href: `https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`, short: "X" },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} — ${url}`)}`, short: "WA" },
  ];
  const btn =
    "grid size-9 place-items-center rounded-full border border-line-strong bg-surface text-muted transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink hover:text-ink";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-muted">{t.share}</span>
      {canNativeShare && (
        <button type="button" className={btn} aria-label={t.shareVia} onClick={() => navigator.share({ title, url }).catch(() => {})}>
          <Share2 className="size-4" aria-hidden />
        </button>
      )}
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${t.shareOn} ${l.label}`} title={l.label} className={btn}>
          <span aria-hidden className="text-[0.7rem] font-bold">{l.short}</span>
        </a>
      ))}
      <a href={`mailto:?subject=${enc(title)}&body=${enc(url)}`} aria-label={t.shareEmail} className={btn}>
        <Mail className="size-4" aria-hidden />
      </a>
      <button
        type="button"
        className={btn}
        aria-label={t.copyLink}
        onClick={async () => {
          await navigator.clipboard.writeText(url).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check className="size-4 animate-scale-in text-success" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? t.linkCopied : ""}</span>
    </div>
  );
}
