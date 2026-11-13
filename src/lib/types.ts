export type TimelineItem = {
  period: string;
  title: string;
  place: string;
  description?: string;
};

export type Distinction = {
  year: string;
  title: string;
  issuer: string;
};

export type Expertise = {
  title: string;
  description: string;
};

export type Stat = {
  value: string;
  label: string;
};

export const SOCIAL_KEYS = [
  "linkedin",
  "scholar",
  "researchgate",
  "orcid",
  "academia",
  "x",
  "facebook",
  "whatsapp",
  "youtube",
] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];
export type Socials = Record<SocialKey, string>;

export type Profile = {
  name: string;
  title: string;
  tagline: string;
  bioShort: string;
  bioLong: string;
  photo: string;
  /** Grande image d'ambiance de la page d'accueil. */
  heroImage: string;
  institution: string;
  email: string;
  phone: string;
  address: string;
  cvUrl: string;
  socials: Socials;
  stats: Stat[];
  expertise: Expertise[];
  education: TimelineItem[];
  experience: TimelineItem[];
  distinctions: Distinction[];
  /** Traduction anglaise des champs textuels (facultative). */
  en?: Partial<ProfileText>;
};

/** Champs du profil qui se traduisent. */
export type ProfileText = Pick<
  Profile,
  "title" | "tagline" | "bioShort" | "bioLong" | "institution" | "stats" | "expertise" | "education" | "experience" | "distinctions"
>;

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  cover: string;
  published: boolean;
  date: string;
  updatedAt: string;
  i18n: { en?: Partial<Pick<Article, "title" | "excerpt" | "content" | "category">> };
};

export const PUBLICATION_TYPES = {
  article: "Article de revue",
  ouvrage: "Ouvrage",
  chapitre: "Chapitre d'ouvrage",
  these: "Thèse",
  communication: "Communication",
  rapport: "Rapport",
} as const;

export type PublicationType = keyof typeof PUBLICATION_TYPES;

export type Publication = {
  id: string;
  title: string;
  authors: string;
  type: PublicationType;
  venue: string;
  year: number;
  abstract: string;
  pdfUrl: string;
  link: string;
  featured: boolean;
  i18n: { en?: Partial<Pick<Publication, "title" | "abstract" | "venue">> };
};

export const CONFERENCE_ROLES = [
  "Conférencier",
  "Intervenant",
  "Panéliste",
  "Modérateur",
  "Président de séance",
] as const;

export type Conference = {
  id: string;
  title: string;
  event: string;
  location: string;
  date: string;
  role: string;
  description: string;
  link: string;
  slidesUrl: string;
  image: string;
  i18n: { en?: Partial<Pick<Conference, "title" | "event" | "location" | "role" | "description">> };
};

export type Message = {
  id: string;
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
};
