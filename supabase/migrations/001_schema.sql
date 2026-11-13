-- =====================================================================
--  Site du Docteur — schéma Supabase
--  À exécuter une seule fois : Supabase > SQL Editor > New query > Run.
--  Toutes les tables sont préfixées « dr_ » pour cohabiter sans risque
--  avec les autres applications du même projet Supabase.
-- =====================================================================

-- Profil (une seule ligne, id = 1)
create table if not exists public.dr_profile (
  id          int primary key default 1 check (id = 1),
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.dr_articles (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  excerpt     text not null default '',
  content     text not null default '',
  category    text not null default 'Général',
  tags        text[] not null default '{}',
  cover       text not null default '',
  published   boolean not null default false,
  date        date not null default current_date,
  updated_at  timestamptz not null default now()
);
create index if not exists dr_articles_published_date_idx on public.dr_articles (published, date desc);

create table if not exists public.dr_publications (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  authors     text not null default '',
  type        text not null default 'article'
              check (type in ('article','ouvrage','chapitre','these','communication','rapport')),
  venue       text not null default '',
  year        int not null,
  abstract    text not null default '',
  pdf_url     text not null default '',
  link        text not null default '',
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists dr_publications_year_idx on public.dr_publications (year desc);

create table if not exists public.dr_conferences (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  event       text not null default '',
  location    text not null default '',
  date        date not null,
  role        text not null default 'Conférencier',
  description text not null default '',
  link        text not null default '',
  slides_url  text not null default '',
  image       text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists dr_conferences_date_idx on public.dr_conferences (date desc);

create table if not exists public.dr_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  organization  text not null default '',
  subject       text not null,
  message       text not null,
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);
create index if not exists dr_messages_created_idx on public.dr_messages (created_at desc);

-- ---------------------------------------------------------------------
--  Sécurité (RLS)
--  Lecture publique du contenu publié uniquement. Toutes les écritures
--  passent par le serveur Next.js (clé secrète) après vérification que
--  l'utilisateur connecté figure dans ADMIN_EMAILS.
-- ---------------------------------------------------------------------
alter table public.dr_profile      enable row level security;
alter table public.dr_articles     enable row level security;
alter table public.dr_publications enable row level security;
alter table public.dr_conferences  enable row level security;
alter table public.dr_messages     enable row level security;

drop policy if exists "dr_profile public read" on public.dr_profile;
create policy "dr_profile public read" on public.dr_profile for select using (true);

drop policy if exists "dr_articles public read" on public.dr_articles;
create policy "dr_articles public read" on public.dr_articles for select using (published);

drop policy if exists "dr_publications public read" on public.dr_publications;
create policy "dr_publications public read" on public.dr_publications for select using (true);

drop policy if exists "dr_conferences public read" on public.dr_conferences;
create policy "dr_conferences public read" on public.dr_conferences for select using (true);
-- dr_messages : aucune politique => inaccessible depuis le navigateur.

-- ---------------------------------------------------------------------
--  Stockage des fichiers (PDF, images, CV, supports)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('dr-media', 'dr-media', true, 15728640)
on conflict (id) do nothing;
