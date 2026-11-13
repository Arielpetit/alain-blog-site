"use client";

import { useEffect, useRef, useState } from "react";

/** Anime la partie numérique d'une valeur (« 1 200+ », « 30+ »…) à l'apparition. */
export function CountUp({ value, duration = 1600, lang = "fr" }: { value: string; duration?: number; lang?: "fr" | "en" }) {
  const match = value.match(/^(\D*)([\d\s .,]+)(.*)$/);
  const target = match ? Number(match[2].replace(/[\s ,.]/g, "")) : NaN;
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        setN(Math.round(target * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [target, duration]);

  if (!match || Number.isNaN(target)) return <span>{value}</span>;
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden>{match[1]}{new Intl.NumberFormat(lang === "en" ? "en-US" : "fr-FR").format(n)}{match[3]}</span>
    </span>
  );
}
