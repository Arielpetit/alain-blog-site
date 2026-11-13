# Site personnel — Docteur (Next.js + Supabase)

Site vitrine et blog scientifique : biographie, parcours, publications (PDF), articles,
conférences, formulaire de contact et **espace administrateur** complet.

- **Front** : Next.js 15 (App Router), Tailwind CSS 4, animations CSS (apparition au défilement,
  compteurs, transitions de page) respectant `prefers-reduced-motion`.
- **Bilingue** : français sur `/…`, anglais sur `/en/…` (`/en/about` ⇄ `/a-propos`). Textes de l'interface dans
  `src/i18n/dictionaries.ts` ; traductions du contenu saisies dans l'admin (onglet *English*), avec repli
  automatique sur le français.
- **Thème clair / sombre / système**, sans flash au chargement (jetons CSS dans `globals.css`).
- **Back** : Supabase — Postgres (tables `dr_*`), Auth (connexion admin), Storage (bucket `dr-media`).

## Installation

```bash
npm install
cp .env.example .env.local      # renseigner les clés Supabase et ADMIN_EMAILS
```

### 1. Créer les tables

Au choix :

- **SQL Editor** de Supabase : exécuter dans l'ordre `supabase/migrations/001_schema.sql` puis
  `supabase/migrations/002_translations.sql` ;
- **ou** en local : renseigner `SUPABASE_DB_URL` (Supabase > *Connect* > *Session pooler*) puis
  `npm run db:schema`.

Les tables sont préfixées `dr_` : elles cohabitent sans risque avec d'autres applications du même projet.

### 2. Créer le compte administrateur

Supabase > **Authentication > Users > Add user** (cocher *Auto Confirm User*), puis ajouter cette
adresse dans `ADMIN_EMAILS`. Recommandé : désactiver *Allow new users to sign up*
(Authentication > Providers > Email).

Pour le lien « mot de passe oublié », ajouter dans *Authentication > URL Configuration > Redirect URLs* :
`http://localhost:3000/admin/auth/callback` et `https://votre-domaine/admin/auth/callback`.

### 3. Contenu de démonstration

```bash
npm run seed          # n'ajoute que dans les tables vides
npm run seed:reset    # remplace articles, publications, conférences et messages
npm run seed:en       # ajoute les traductions anglaises (après la migration 002)
```

### 4. Lancer

```bash
npm run dev           # http://localhost:3000 — administration : /admin
```

## Pages publiques

| Page | Contenu |
|---|---|
| `/` | Accueil : présentation, chiffres clés animés, expertises, derniers articles, publications à la une, agenda |
| `/a-propos` | Biographie, domaines de recherche, formation, expérience, distinctions, CV |
| `/publications` | Recherche, filtres par type et année, résumé, PDF, copie de la référence |
| `/articles` | Blog : recherche, catégories, pagination |
| `/articles/[slug]` | Article : sommaire, temps de lecture, partage, auteur, articles liés |
| `/conferences` | Interventions à venir et passées |
| `/contact` | Formulaire (anti-spam), enregistré dans Supabase |

Inclus : `sitemap.xml`, `robots.txt`, flux `rss.xml`, OpenGraph, JSON-LD.

## Administration (`/admin`)

Tableau de bord · Articles (éditeur Markdown + aperçu, brouillons, couverture) · Publications (PDF) ·
Conférences (photo, supports) · Messages · Profil & parcours · Mon compte (mot de passe).

Sécurité : session Supabase vérifiée par le middleware **et** dans chaque Server Action ; seules les
adresses de `ADMIN_EMAILS` ont accès. Les écritures passent par le serveur (clé secrète) ; la RLS
n'autorise que la lecture publique du contenu publié.

## Mise en production

Compatible Vercel (aucun fichier stocké sur le serveur). Définir les variables de `.env.example`
dans l'hébergeur, avec `NEXT_PUBLIC_SITE_URL` = URL finale. Ne jamais exposer `SUPABASE_SECRET_KEY`.

Images de démonstration : Unsplash (licence libre). Remplacer par les photos du Docteur via l'admin.
