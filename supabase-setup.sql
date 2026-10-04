-- ============================================================================
-- Routis — Configuration Supabase pour les comptes utilisateurs
-- ============================================================================
-- À exécuter UNE FOIS dans : Dashboard Supabase > SQL Editor > New query
-- Colle tout ce fichier, puis clique sur "Run".
--
-- Ce script crée une table `progress` qui stocke, pour chaque utilisateur
-- inscrit (email/mot de passe géré par Supabase Auth), sa progression sur
-- le site : panneaux appris, meilleurs scores, historique des examens
-- blancs et statistiques de répétition espacée (qStats/signStats).
--
-- Le script est idempotent : tu peux le relancer sans risque si besoin
-- (les IF NOT EXISTS / OR REPLACE évitent les erreurs en cas de ré-exécution).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1) Table `progress`
-- ----------------------------------------------------------------------------
-- Une seule ligne par utilisateur (user_id = clé primaire = identifiant
-- Supabase Auth). Les colonnes reprennent les mêmes clés que le
-- localStorage du site, converties en snake_case pour suivre les
-- conventions SQL/Postgres.
create table if not exists public.progress (
  -- Identifiant de l'utilisateur, lié à la table interne auth.users gérée
  -- par Supabase Auth. `on delete cascade` : si le compte est supprimé, sa
  -- ligne de progression l'est aussi automatiquement.
  user_id uuid primary key references auth.users (id) on delete cascade,

  -- Statut "appris / à revoir / pas appris" par panneau (clé localStorage
  -- `signStatus`). Format libre en JSON, ex: {"panneau-1": "appris", ...}
  sign_status jsonb not null default '{}'::jsonb,

  -- Meilleure série de bonnes réponses d'affilée (clé `streak`).
  streak integer not null default 0,

  -- Meilleur score obtenu à un examen blanc (clé `bestScore`).
  best_score integer not null default 0,

  -- Meilleur score au mini-jeu "slice" (clé `sliceBestScore`).
  slice_best_score integer not null default 0,

  -- Historique des examens blancs passés (clé `examHistory`), tableau JSON
  -- d'objets {date, score, total, ...}.
  exam_history jsonb not null default '[]'::jsonb,

  -- Statistiques de répétition espacée (Leitner) par question de
  -- connaissances générales (clé `qStats`).
  q_stats jsonb not null default '{}'::jsonb,

  -- Statistiques de répétition espacée (Leitner) par panneau (clé
  -- `signStats`).
  sign_stats jsonb not null default '{}'::jsonb,

  -- Horodatage de dernière modification, utilisé côté client (assets/sync.js)
  -- pour décider si la copie serveur ou la copie locale est la plus
  -- récente lors d'une synchronisation. Mis à jour automatiquement par le
  -- trigger défini plus bas — inutile de le gérer à la main.
  updated_at timestamptz not null default now()
);

-- Petit commentaire visible dans le dashboard Supabase (Table editor), pour
-- se souvenir à quoi sert cette table.
comment on table public.progress is
  'Progression de révision du code de la route par utilisateur (1 ligne par compte), synchronisée depuis le localStorage du site.';


-- ----------------------------------------------------------------------------
-- 2) Row Level Security (RLS)
-- ----------------------------------------------------------------------------
-- Très important : sans RLS activé, n'importe quel utilisateur connecté
-- pourrait lire/modifier la progression de n'importe qui d'autre via l'API
-- Supabase (la clé "publishable" utilisée côté client n'apporte, à elle
-- seule, AUCUNE protection : c'est RLS qui protège réellement les données).
alter table public.progress enable row level security;

-- On force RLS même pour le propriétaire de la table (bonne pratique,
-- évite les surprises si un rôle "owner" est utilisé par erreur côté API).
alter table public.progress force row level security;

-- On supprime d'éventuelles anciennes policies du même nom avant de les
-- recréer, pour que ce script reste rejouable sans erreur.
drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_insert_own" on public.progress;
drop policy if exists "progress_update_own" on public.progress;
drop policy if exists "progress_delete_own" on public.progress;

-- Lecture : un utilisateur connecté ne peut lire QUE sa propre ligne.
-- Aucune lecture publique (les utilisateurs non connectés n'ont accès à
-- rien) et aucun accès aux lignes des autres utilisateurs.
create policy "progress_select_own"
  on public.progress
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Création : un utilisateur connecté ne peut créer que sa propre ligne
-- (impossible d'insérer une ligne avec l'user_id de quelqu'un d'autre).
create policy "progress_insert_own"
  on public.progress
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Mise à jour : idem, uniquement sa propre ligne.
create policy "progress_update_own"
  on public.progress
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Suppression : idem, uniquement sa propre ligne (pas strictement
-- nécessaire pour le site, mais cohérent et sans danger : chacun ne peut
-- supprimer que ses propres données).
create policy "progress_delete_own"
  on public.progress
  for delete
  to authenticated
  using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 3) Mise à jour automatique de `updated_at`
-- ----------------------------------------------------------------------------
-- Fonction déclenchée avant chaque UPDATE sur `progress`, qui force
-- `updated_at` à l'heure serveur actuelle. Le client (assets/sync.js)
-- envoie bien sa propre valeur d'`updated_at`, mais ce trigger garantit
-- que la colonne reflète toujours vraiment la dernière écriture réelle
-- côté serveur, même en cas d'horloge client décalée.
create or replace function public.set_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_progress_updated_at on public.progress;

create trigger trg_progress_updated_at
  before update on public.progress
  for each row
  execute function public.set_progress_updated_at();


-- ============================================================================
-- Fin du script.
--
-- Une fois exécuté avec succès, la table "progress" doit apparaître dans
-- Dashboard > Table Editor, et Dashboard > Authentication > Policies doit
-- lister les 4 policies ci-dessus pour la table "progress".
--
-- Rappel : Supabase envoie par défaut un email de confirmation à chaque
-- inscription (Authentication > Providers > Email > "Confirm email"). Voir
-- le fichier COMPTE-UTILISATEUR.md à la racine du site pour plus de détails.
-- ============================================================================
