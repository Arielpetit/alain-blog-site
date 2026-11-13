import { cn } from "@/lib/utils";

export const PAGE_IMAGES = {
  about: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=2000&q=80&auto=format&fit=crop",
  publications: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=2000&q=80&auto=format&fit=crop",
  articles: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=2000&q=80&auto=format&fit=crop",
  conferences: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=2000&q=80&auto=format&fit=crop",
  contact: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=2000&q=80&auto=format&fit=crop",
};

export function PageHeader({
  eyebrow,
  title,
  description,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  /** Image d'arrière-plan : bandeau sombre et immersif. */
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        image ? "bg-navy-deep text-white" : "border-b border-line bg-gradient-to-b from-accent-soft/50 to-paper",
      )}
    >
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35 animate-ken-burns" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/40" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-navy-deep/60 to-transparent" />
        </>
      )}
      <div className={cn("container-page", image ? "py-20 md:py-28" : "py-14 md:py-20")}>
        <p className={cn("eyebrow animate-fade-up", image && "text-accent")}>{eyebrow}</p>
        <h1
          className={cn(
            "mt-4 max-w-3xl animate-fade-up text-4xl font-semibold [animation-delay:80ms] md:text-6xl",
            image ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-5 max-w-2xl animate-fade-up text-lg leading-relaxed [animation-delay:160ms]",
              image ? "text-white/75" : "text-muted",
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="animate-fade-up [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}
