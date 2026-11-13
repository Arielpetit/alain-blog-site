import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  action,
  back,
  children,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link href={back.href} className="group mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden /> {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[1.75rem] font-semibold leading-tight text-ink md:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 text-muted">{description}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}
          {action && (
            <Link href={action.href} className="btn btn-primary">
              <Plus className="size-4" aria-hidden /> {action.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  label,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="card flex flex-col items-center border-dashed px-6 py-16 text-center">
      {Icon && (
        <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-dark">
          <Icon className="size-6" />
        </span>
      )}
      <p className="mt-4 font-serif text-xl text-ink">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>
      {href && (
        <Link href={href} className="btn btn-primary mt-6">
          <Plus className="size-4" aria-hidden /> {label}
        </Link>
      )}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="field-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function Section({
  id,
  title,
  description,
  children,
  className,
  aside,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  aside?: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("card scroll-mt-24 p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {aside}
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export function StatusBadge({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return (
    <span className={cn("badge", ok ? "badge-success" : "badge-neutral")}>
      <span className={cn("size-1.5 rounded-full", ok ? "bg-success" : "bg-muted/60")} aria-hidden />
      {ok ? yes : no}
    </span>
  );
}
