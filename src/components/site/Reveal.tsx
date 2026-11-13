"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Délai en millisecondes (utile pour décaler les éléments d'une grille). */
  delay?: number;
  variant?: "up" | "fade" | "left" | "right" | "scale";
  as?: "div" | "section" | "li" | "article";
};

/** Fait apparaître son contenu en douceur lorsqu'il entre dans l'écran. */
export function Reveal({ children, className, delay = 0, variant = "up", as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={variant}
      className={cn("reveal min-w-0", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
