-- Run after 0001. Adds soft-archive for blog posts and jobs; tightens public read policies.

alter table public.blog_posts add column if not exists archived_at timestamptz;
alter table public.job_postings add column if not exists archived_at timestamptz;

comment on column public.blog_posts.archived_at is 'When set, post is hidden from public blog list and detail (still visible to owner in setup).';
comment on column public.job_postings.archived_at is 'When set, job is hidden from public careers page (still visible to owner in setup).';

drop policy if exists "blog_posts_select_published" on public.blog_posts;
create policy "blog_posts_select_published"
  on public.blog_posts for select
  using (published_at is not null and archived_at is null);

drop policy if exists "job_postings_select_public" on public.job_postings;
create policy "job_postings_select_public"
  on public.job_postings for select
  using (archived_at is null);
