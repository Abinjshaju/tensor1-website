-- Run this in the Supabase SQL Editor (or via Supabase CLI) after creating a project.
-- Requires: Authentication → Email provider enabled.

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  author_name text,
  contact_email text,
  updated_at timestamptz not null default now()
);

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_profiles_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, author_name, contact_email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'author_name', split_part(new.email, '@', 1)),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Blog posts
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null unique,
  title text not null,
  excerpt text,
  cover_image_url text,
  body_markdown text,
  author_name text,
  category text not null default 'Blog',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute procedure public.set_blog_posts_updated_at();

-- Job postings
create table public.job_postings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role_id text not null unique,
  title text not null,
  description text,
  experience text,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.blog_posts enable row level security;
alter table public.job_postings enable row level security;

-- Profiles: own row only
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Blog posts: full CRUD for owner
create policy "blog_posts_select_own"
  on public.blog_posts for select
  using (auth.uid() = user_id);

create policy "blog_posts_select_published"
  on public.blog_posts for select
  using (published_at is not null);

create policy "blog_posts_insert_own"
  on public.blog_posts for insert
  with check (auth.uid() = user_id);

create policy "blog_posts_update_own"
  on public.blog_posts for update
  using (auth.uid() = user_id);

create policy "blog_posts_delete_own"
  on public.blog_posts for delete
  using (auth.uid() = user_id);

-- Job postings: authenticated users manage own rows
create policy "job_postings_select_own"
  on public.job_postings for select
  using (auth.uid() = user_id);

create policy "job_postings_insert_own"
  on public.job_postings for insert
  with check (auth.uid() = user_id);

create policy "job_postings_update_own"
  on public.job_postings for update
  using (auth.uid() = user_id);

create policy "job_postings_delete_own"
  on public.job_postings for delete
  using (auth.uid() = user_id);

-- Public read all job postings (careers page)
create policy "job_postings_select_public"
  on public.job_postings for select
  using (true);
