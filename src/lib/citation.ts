import type { Publication } from "./types";
import { slugify } from "./utils";

/** Formats de citation usuels pour une publication. */
export function citations(p: Publication) {
  const key = `${slugify(p.authors.split(/[,&]| et /)[0] ?? "auteur").replace(/-/g, "")}${p.year}`;
  const bibType = p.type === "ouvrage" ? "book" : p.type === "these" ? "phdthesis" : p.type === "chapitre" ? "incollection" : p.type === "communication" ? "inproceedings" : p.type === "rapport" ? "techreport" : "article";
  return {
    APA: `${p.authors} (${p.year}). ${p.title}. ${p.venue}.`,
    MLA: `${p.authors}. « ${p.title} ». ${p.venue}, ${p.year}.`,
    Chicago: `${p.authors}. ${p.year}. « ${p.title} ». ${p.venue}.`,
    BibTeX: `@${bibType}{${key},\n  author = {${p.authors}},\n  title  = {${p.title}},\n  year   = {${p.year}},\n  note   = {${p.venue}}\n}`,
  };
}

export const scholarUrl = (p: Publication) => `https://scholar.google.com/scholar?q=${encodeURIComponent(`"${p.title}"`)}`;
