create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text unique not null,
  avatar_url text,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  photo_path text not null,
  photo_date date,
  uploaded_by uuid references public.profiles(id) on delete set null,
  is_favorite boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists album_photos_photo_path_key on public.album_photos(photo_path);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  cover_path text,
  created_by uuid references public.profiles(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  author_id uuid references public.profiles(id) on delete set null,
  recipient_id uuid references public.profiles(id) on delete set null,
  open_at timestamptz,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  score integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_album_photos_updated_at on public.album_photos;
create trigger set_album_photos_updated_at
before update on public.album_photos
for each row execute function public.set_updated_at();

drop trigger if exists set_timeline_events_updated_at on public.timeline_events;
create trigger set_timeline_events_updated_at
before update on public.timeline_events
for each row execute function public.set_updated_at();

drop trigger if exists set_letters_updated_at on public.letters;
create trigger set_letters_updated_at
before update on public.letters
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Usuario'),
    lower(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.album_photos enable row level security;
alter table public.timeline_events enable row level security;
alter table public.letters enable row level security;
alter table public.games enable row level security;
alter table public.game_scores enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists "members can read profiles" on public.profiles;
create policy "members can read profiles"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "members can manage album" on public.album_photos;
create policy "members can manage album"
on public.album_photos for all
to authenticated
using (true)
with check (true);

drop policy if exists "members can manage timeline" on public.timeline_events;
create policy "members can manage timeline"
on public.timeline_events for all
to authenticated
using (true)
with check (true);

drop policy if exists "members can manage letters" on public.letters;
create policy "members can manage letters"
on public.letters for all
to authenticated
using (true)
with check (true);

drop policy if exists "members can read games" on public.games;
create policy "members can read games"
on public.games for select
to authenticated
using (true);

drop policy if exists "members can manage game scores" on public.game_scores;
create policy "members can manage game scores"
on public.game_scores for all
to authenticated
using (true)
with check (true);

drop policy if exists "members can read settings" on public.app_settings;
create policy "members can read settings"
on public.app_settings for select
to authenticated
using (true);

insert into public.games (slug, title) values
  ('memory', 'Memoria'),
  ('quiz', 'Quiz'),
  ('roulette', 'Ruleta'),
  ('puzzle', 'Puzzle')
on conflict (slug) do nothing;

insert into public.app_settings (key, value) values
  ('anniversary', '{"date": "2025-05-04"}'),
  ('app_name', '{"name": "Page JB"}')
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('album', 'album', false, 52428800, array['image/jpeg', 'image/png', 'image/webp']),
  ('timeline', 'timeline', false, 52428800, array['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', false, 52428800, array['image/jpeg', 'image/png', 'image/webp']),
  ('letters', 'letters', false, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "members can read app storage" on storage.objects;
create policy "members can read app storage"
on storage.objects for select
to authenticated
using (bucket_id in ('album', 'timeline', 'avatars', 'letters'));

drop policy if exists "members can upload app storage" on storage.objects;
create policy "members can upload app storage"
on storage.objects for insert
to authenticated
with check (bucket_id in ('album', 'timeline', 'avatars', 'letters'));

drop policy if exists "members can update app storage" on storage.objects;
create policy "members can update app storage"
on storage.objects for update
to authenticated
using (bucket_id in ('album', 'timeline', 'avatars', 'letters'))
with check (bucket_id in ('album', 'timeline', 'avatars', 'letters'));

drop policy if exists "members can delete app storage" on storage.objects;
create policy "members can delete app storage"
on storage.objects for delete
to authenticated
using (bucket_id in ('album', 'timeline', 'avatars', 'letters'));
