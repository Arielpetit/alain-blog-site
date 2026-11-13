-- Traductions anglaises du contenu (FR/EN).
-- À exécuter une fois : Supabase > SQL Editor > New query > Run.
alter table public.dr_articles     add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table public.dr_publications add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table public.dr_conferences  add column if not exists i18n jsonb not null default '{}'::jsonb;
notify pgrst, 'reload schema';
