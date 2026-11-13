import { getProfile } from "@/lib/db";
import { SOCIAL_KEYS, type Profile, type ProfileText, type SocialKey, type TimelineItem } from "@/lib/types";

const SOCIAL_LABELS: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  scholar: "Google Scholar",
  researchgate: "ResearchGate",
  orcid: "ORCID",
  academia: "Academia.edu",
  x: "X (Twitter)",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  youtube: "YouTube",
};
import { AdminHeader, Field, Section } from "@/components/admin/ui";
import { FileField, LangTabs, MarkdownEditor, SaveBar } from "@/components/admin/FormControls";
import { saveProfile } from "../../actions";

export const metadata = { title: "Profil" };

const tl = (items: TimelineItem[] = []) =>
  items.map((i) => [i.period, i.title, i.place, i.description].filter((x, n) => n < 3 || x).join(" | ")).join("\n");

const NAV = [
  { id: "presentation", label: "Présentation" },
  { id: "images", label: "Images & CV" },
  { id: "coordonnees", label: "Coordonnées" },
  { id: "reseaux", label: "Réseaux" },
  { id: "parcours", label: "Parcours" },
];

/** Champs de texte d'une langue (préfixe « en_ » pour l'anglais). */
function TextFields({ p, prefix }: { p: Partial<ProfileText>; prefix: "" | "en_" }) {
  const en = prefix === "en_";
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={en ? "Title / position" : "Titre / fonction"} htmlFor={`${prefix}title`} required={!en}>
          <input id={`${prefix}title`} name={`${prefix}title`} required={!en} defaultValue={p.title} className="field" />
        </Field>
        <Field label={en ? "Institution" : "Institution"} htmlFor={`${prefix}institution`}>
          <input id={`${prefix}institution`} name={`${prefix}institution`} defaultValue={p.institution} className="field" />
        </Field>
      </div>
      <Field label={en ? "Motto" : "Devise / phrase d'accroche"} htmlFor={`${prefix}tagline`}>
        <input id={`${prefix}tagline`} name={`${prefix}tagline`} defaultValue={p.tagline} className="field" />
      </Field>
      <Field label={en ? "Short bio" : "Présentation courte"} htmlFor={`${prefix}bioShort`} hint={en ? undefined : "Accueil et référencement (2 à 3 phrases)."}>
        <textarea id={`${prefix}bioShort`} name={`${prefix}bioShort`} rows={3} defaultValue={p.bioShort} className="field" />
      </Field>
      <Field label={en ? "Full biography" : "Biographie complète"} htmlFor={`${prefix}bioLong`}>
        <MarkdownEditor id={`${prefix}bioLong`} name={`${prefix}bioLong`} defaultValue={p.bioLong ?? ""} rows={10} />
      </Field>
    </>
  );
}

function CareerFields({ p, prefix }: { p: Partial<ProfileText>; prefix: "" | "en_" }) {
  const en = prefix === "en_";
  const area = (name: string, label: string, hint: string, value: string, rows = 4) => (
    <Field label={label} htmlFor={`${prefix}${name}`} hint={hint}>
      <textarea id={`${prefix}${name}`} name={`${prefix}${name}`} rows={rows} defaultValue={value} className="field font-mono text-[0.84rem] leading-relaxed" />
    </Field>
  );
  return (
    <>
      {area("stats", en ? "Key figures" : "Chiffres clés", en ? "value | label" : "valeur | libellé — ex. : 30+ | Publications scientifiques", (p.stats ?? []).map((s) => `${s.value} | ${s.label}`).join("\n"))}
      {area("expertise", en ? "Areas of expertise" : "Domaines d'expertise", en ? "title | description" : "titre | description", (p.expertise ?? []).map((e) => `${e.title} | ${e.description}`).join("\n"))}
      {area("education", en ? "Education" : "Formation", en ? "period | degree | institution | description" : "période | diplôme | établissement | description (facultative)", tl(p.education))}
      {area("experience", en ? "Experience" : "Expérience professionnelle", en ? "period | position | organisation | description" : "période | poste | structure | description (facultative)", tl(p.experience))}
      {area("distinctions", en ? "Awards" : "Distinctions", en ? "year | award | issuer" : "année | distinction | organisme", (p.distinctions ?? []).map((d) => `${d.year} | ${d.title} | ${d.issuer}`).join("\n"), 3)}
    </>
  );
}

export default async function AdminProfile() {
  const p: Profile = await getProfile();
  const en = p.en ?? {};
  const enFilled = !!(en.title || en.bioShort);

  return (
    <form action={saveProfile}>
      <AdminHeader title="Profil & parcours" description="Ces informations alimentent l'accueil, la page Parcours et le pied de page." />

      <nav aria-label="Sections du profil" className="sticky top-16 z-20 -mx-4 mb-6 border-b border-line bg-paper/90 px-4 py-2 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="block shrink-0 rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-6">
        <Section id="presentation" title="Présentation">
          <Field label="Nom affiché" htmlFor="name" required>
            <input id="name" name="name" required defaultValue={p.name} className="field sm:max-w-md" />
          </Field>
          <LangTabs enFilled={enFilled} fr={<TextFields p={p} prefix="" />} en={<TextFields p={en} prefix="en_" />} />
        </Section>

        <Section id="images" title="Images et CV">
          <div className="grid gap-6 md:grid-cols-3">
            <FileField label="Photo professionnelle" fileName="photoFile" removeName="removePhoto" current={p.photo} accept="image/*" allowUrl={false} image hint="Portrait 4:5, 1200 px min." />
            <FileField label="Image d'accueil" fileName="heroFile" urlName="heroImage" removeName="removeHero" current={p.heroImage} accept="image/*" image hint="Utilisée sans photo" />
            <FileField label="CV (PDF)" fileName="cvFile" removeName="removeCv" current={p.cvUrl} accept=".pdf,application/pdf" allowUrl={false} hint="Active « Télécharger le CV »" />
          </div>
        </Section>

        <Section id="coordonnees" title="Coordonnées">
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="E-mail" htmlFor="email"><input id="email" name="email" type="email" defaultValue={p.email} className="field" /></Field>
            <Field label="Téléphone" htmlFor="phone"><input id="phone" name="phone" defaultValue={p.phone} className="field" /></Field>
            <Field label="Ville / adresse" htmlFor="address"><input id="address" name="address" defaultValue={p.address} className="field" /></Field>
          </div>
        </Section>

        <Section id="reseaux" title="Réseaux et profils académiques" description="Laissez vide pour masquer l'icône.">
          <div className="grid gap-5 sm:grid-cols-2">
            {SOCIAL_KEYS.map((k) => (
              <Field key={k} label={SOCIAL_LABELS[k]} htmlFor={k} hint={k === "whatsapp" ? "Format : https://wa.me/242060000000 (numéro sans + ni espaces)" : undefined}>
                <input id={k} name={k} type="url" defaultValue={p.socials[k]} className="field" placeholder="https://" />
              </Field>
            ))}
          </div>
        </Section>

        <Section id="parcours" title="Parcours" description="Une ligne par entrée ; séparez les champs par une barre verticale « | ».">
          <LangTabs enFilled={!!en.expertise?.length} fr={<CareerFields p={p} prefix="" />} en={<CareerFields p={en} prefix="en_" />} />
        </Section>
      </div>

      <SaveBar cancelHref="/admin" label="Enregistrer le profil" />
    </form>
  );
}
