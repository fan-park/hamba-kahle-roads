-- Hamba Kahle Roads: database schema for Supabase
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run.

-- ---------- Reports ----------
create table if not exists public.reports (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  author        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_name   text check (char_length(author_name) <= 40),
  road          text not null check (char_length(road) between 1 and 40),
  direction     text check (direction in ('', 'Northbound', 'Southbound', 'Eastbound', 'Westbound')),
  location_note text check (char_length(location_note) <= 90),
  type          text not null check (type in ('pothole','lane','works','robots','flood','debris','crash','hotspot','slow','fog','tip')),
  severity      text check (severity in ('', 'minor', 'slow', 'avoid')),
  lane          text check (lane in ('', 'left', 'middle', 'right', 'any')),
  trip          text check (trip in ('', 'smooth', 'ok', 'rough')),
  note          text check (char_length(note) <= 400),
  lat           double precision check (lat between -90 and 90),
  lng           double precision check (lng between -180 and 180),
  quick         boolean not null default false,
  confirms      integer not null default 0,
  cleared       integer not null default 0
);
create index if not exists reports_created_at_idx on public.reports (created_at desc);
create index if not exists reports_road_idx on public.reports (lower(road));

-- ---------- Votes: "Still there" / "Gone now" (one per person per report) ----------
create table if not exists public.votes (
  report_id  uuid not null references public.reports(id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  vote       text not null check (vote in ('confirm', 'clear')),
  created_at timestamptz not null default now(),
  primary key (report_id, user_id)
);

-- Keep the counts on each report in step with the votes table
create or replace function public.refresh_vote_counts() returns trigger
language plpgsql security definer set search_path = public as $$
declare rid uuid := coalesce(new.report_id, old.report_id);
begin
  update public.reports r set
    confirms = (select count(*) from public.votes v where v.report_id = rid and v.vote = 'confirm'),
    cleared  = (select count(*) from public.votes v where v.report_id = rid and v.vote = 'clear')
  where r.id = rid;
  return null;
end $$;

drop trigger if exists votes_refresh on public.votes;
create trigger votes_refresh after insert or update or delete on public.votes
  for each row execute function public.refresh_vote_counts();

-- ---------- Cached trip briefings (written only by the server function) ----------
create table if not exists public.briefings (
  key        text primary key,
  from_place text not null,
  to_place   text not null,
  data       jsonb not null,
  created_at timestamptz not null default now()
);

-- ---------- Security: who can read and write what ----------
alter table public.reports   enable row level security;
alter table public.votes     enable row level security;
alter table public.briefings enable row level security;

-- Anyone, signed in or not, can read reports, votes and briefings
drop policy if exists "reports readable by all" on public.reports;
create policy "reports readable by all" on public.reports for select using (true);
drop policy if exists "votes readable by all" on public.votes;
create policy "votes readable by all" on public.votes for select using (true);
drop policy if exists "briefings readable by all" on public.briefings;
create policy "briefings readable by all" on public.briefings for select using (true);

-- Signed-in people post reports as themselves and delete only their own
drop policy if exists "post own reports" on public.reports;
create policy "post own reports" on public.reports for insert to authenticated
  with check (author = auth.uid() and confirms = 0 and cleared = 0);
drop policy if exists "delete own reports" on public.reports;
create policy "delete own reports" on public.reports for delete to authenticated
  using (author = auth.uid());

-- Signed-in people vote as themselves and change or remove only their own vote
drop policy if exists "cast own vote" on public.votes;
create policy "cast own vote" on public.votes for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "change own vote" on public.votes;
create policy "change own vote" on public.votes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "remove own vote" on public.votes;
create policy "remove own vote" on public.votes for delete to authenticated using (user_id = auth.uid());

-- Simple spam brake: at most 20 reports per person per hour
create or replace function public.limit_report_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.reports
      where author = new.author and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'Too many reports in the last hour. Try again later.';
  end if;
  return new;
end $$;
drop trigger if exists reports_rate_limit on public.reports;
create trigger reports_rate_limit before insert on public.reports
  for each row execute function public.limit_report_rate();

-- Live updates: new reports appear on everyone's screen without refreshing
do $$ begin
  alter publication supabase_realtime add table public.reports;
exception when duplicate_object then null; end $$;
