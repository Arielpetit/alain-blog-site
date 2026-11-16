import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn, slugify } from "@/lib/utils";

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) return textOf((node as { props: { children?: React.ReactNode } }).props.children);
  return "";
}

/** Rendu Markdown sûr (le HTML brut est ignoré). Les titres reçoivent une ancre. */
export function Markdown({ children, className, lang }: { children: string; className?: string; lang?: string }) {
  return (
    <div lang={lang} className={cn("prose prose-base prose-article max-w-none sm:prose-lg", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 id={slugify(textOf(children))} className="scroll-mt-28">{children}</h2>,
          h3: ({ children }) => <h3 id={slugify(textOf(children))} className="scroll-mt-28">{children}</h3>,
          a: ({ href, children }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto"><table>{children}</table></div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

/** Extrait la table des matières (titres ##) d'un contenu Markdown. */
export function extractToc(md: string) {
  return md
    .split("\n")
    .filter((l) => /^##\s+/.test(l))
    .map((l) => {
      const text = l.replace(/^##\s+/, "").replace(/[*_`]/g, "").trim();
      return { text, id: slugify(text) };
    });
}
