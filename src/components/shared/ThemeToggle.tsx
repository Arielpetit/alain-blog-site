"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "light" | "dark" | "system";
const ORDER: Mode[] = ["light", "dark", "system"];

function apply(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.dataset.theme = dark ? "dark" : "light";
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
}

/** Bouton de thème : clair → sombre → système. */
export function ThemeToggle({
  labels,
  className,
  variant = "icon",
}: {
  labels: { label: string; light: string; dark: string; system: string };
  className?: string;
  /** « segmented » : trois boutons côte à côte (menus, réglages). */
  variant?: "icon" | "segmented";
}) {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    try {
      setMode((localStorage.getItem("theme") as Mode) || "system");
    } catch {}
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let m: Mode = "system";
      try { m = (localStorage.getItem("theme") as Mode) || "system"; } catch {}
      if (m === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const choose = (m: Mode) => {
    setMode(m);
    try { localStorage.setItem("theme", m); } catch {}
    apply(m);
  };

  const icons = { light: Sun, dark: Moon, system: Monitor };

  if (variant === "segmented")
    return (
      <div role="radiogroup" aria-label={labels.label} className={cn("inline-flex rounded-full border border-line bg-surface p-1", className)}>
        {ORDER.map((m) => {
          const Icon = icons[m];
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => choose(m)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                mode === m ? "bg-primary text-primary-fg" : "text-muted hover:text-ink",
              )}
            >
              <Icon className="size-3.5" aria-hidden /> {labels[m]}
            </button>
          );
        })}
      </div>
    );

  const Icon = icons[mode];
  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
  return (
    <button
      type="button"
      onClick={() => choose(next)}
      className={cn("btn btn-ghost btn-icon text-muted hover:text-ink", className)}
      aria-label={`${labels.label} : ${labels[mode]}`}
      title={`${labels.label} : ${labels[mode]}`}
    >
      <Icon key={mode} className="size-[1.1rem] animate-scale-in" aria-hidden />
    </button>
  );
}
