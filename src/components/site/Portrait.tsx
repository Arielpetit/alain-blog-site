import { cn, initials } from "@/lib/utils";

/** Photo du profil, ou monogramme élégant si aucune photo n'est fournie. */
export function Portrait({
  name,
  photo,
  className,
  avatar = false,
}: {
  name: string;
  photo: string;
  className?: string;
  /** Version ronde et compacte (auteur, signature). */
  avatar?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-navy", avatar ? "rounded-full" : "rounded-2xl", className)}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={avatar ? "" : name} className="h-full w-full object-cover" />
      ) : avatar ? (
        <span aria-hidden className="grid h-full w-full place-items-center font-serif text-[0.95em] font-semibold text-white">
          {initials(name)}
        </span>
      ) : (
        <div className="relative grid h-full w-full place-items-center" role="img" aria-label={name}>
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 14px)" }}
          />
          <div aria-hidden className="absolute inset-6 rounded-xl border border-white/15" />
          <span className="relative font-serif text-7xl font-light tracking-wide text-white/90 sm:text-8xl">
            {initials(name)}
          </span>
        </div>
      )}
    </div>
  );
}
