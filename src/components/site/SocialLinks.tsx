import { GraduationCap } from "lucide-react";
import type { SocialKey, Socials } from "@/lib/types";
import { cn } from "@/lib/utils";

type IconProps = React.SVGProps<SVGSVGElement>;
const svg = (d: string) =>
  function Icon(p: IconProps) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
        <path d={d} />
      </svg>
    );
  };

const LinkedIn = svg(
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
);
const XLogo = svg(
  "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z",
);
const Facebook = svg(
  "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z",
);
const WhatsApp = svg(
  "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z",
);
const YouTube = svg(
  "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z",
);
const TextMark = ({ label }: { label: string }) => (
  <span aria-hidden className="text-[0.66rem] font-bold leading-none tracking-tight">
    {label}
  </span>
);

export const SOCIALS: Record<SocialKey, { label: string; icon: React.ReactNode; color: string }> = {
  linkedin: { label: "LinkedIn", icon: <LinkedIn className="size-4" />, color: "#0a66c2" },
  scholar: { label: "Google Scholar", icon: <GraduationCap className="size-4" aria-hidden />, color: "#4285f4" },
  researchgate: { label: "ResearchGate", icon: <TextMark label="RG" />, color: "#00ccbb" },
  orcid: { label: "ORCID", icon: <TextMark label="iD" />, color: "#a6ce39" },
  academia: { label: "Academia.edu", icon: <TextMark label="A." />, color: "#41454a" },
  x: { label: "X (Twitter)", icon: <XLogo className="size-3.5" />, color: "#000000" },
  facebook: { label: "Facebook", icon: <Facebook className="size-4" />, color: "#1877f2" },
  whatsapp: { label: "WhatsApp", icon: <WhatsApp className="size-4" />, color: "#25d366" },
  youtube: { label: "YouTube", icon: <YouTube className="size-4" />, color: "#ff0000" },
};

export const activeSocials = (socials: Partial<Socials>) =>
  (Object.keys(SOCIALS) as SocialKey[]).filter((k) => socials[k]).map((k) => ({ key: k, href: socials[k]!, ...SOCIALS[k] }));

/** Icônes rondes des réseaux renseignés. */
export function SocialLinks({
  socials,
  className,
  variant = "light",
}: {
  socials: Partial<Socials>;
  className?: string;
  variant?: "light" | "dark";
}) {
  const items = activeSocials(socials);
  if (!items.length) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((i) => (
        <li key={i.key}>
          <a
            href={i.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={i.label}
            title={i.label}
            className={cn(
              "grid size-9 place-items-center rounded-full border transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5",
              variant === "dark"
                ? "border-white/15 text-white/70 hover:border-accent hover:bg-accent hover:text-white"
                : "border-line-strong bg-surface text-muted hover:border-ink hover:text-ink",
            )}
          >
            {i.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Version détaillée : tuiles avec nom du réseau (page Contact). */
export function SocialTiles({ socials, className }: { socials: Partial<Socials>; className?: string }) {
  const items = activeSocials(socials);
  if (!items.length) return null;
  return (
    <ul className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3", className)}>
      {items.map((i) => (
        <li key={i.key}>
          <a
            href={i.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
            style={{ "--brand": i.color } as React.CSSProperties}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted transition-colors duration-300 group-hover:bg-[var(--brand)] group-hover:text-white">
              {i.icon}
            </span>
            <span className="truncate">{i.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
