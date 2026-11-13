import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 text-center">
      <div className="animate-fade-up">
        <p className="font-serif text-[7rem] font-semibold leading-none text-accent">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-ink">Page introuvable · Page not found</h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Accueil</Link>
          <Link href="/en" className="btn btn-outline">Home</Link>
        </div>
      </div>
    </main>
  );
}
