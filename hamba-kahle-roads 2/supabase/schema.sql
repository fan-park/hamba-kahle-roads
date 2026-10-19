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

-- ---------- Table access for the website (newer Supabase projects don't grant this automatically) ----------
grant usage on schema public to anon, authenticated;
grant select on table public.reports, public.votes, public.briefings to anon, authenticated;
grant insert, delete on table public.reports to authenticated;
grant insert, update, delete on table public.votes to authenticated;

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



create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind       text not null check (kind in ('guide', 'bug', 'idea', 'other')),
  message    text not null check (char_length(message) between 3 and 1500),
  email      text check (char_length(email) <= 120),
  page       text check (char_length(page) <= 200),
  user_agent text check (char_length(user_agent) <= 300),
  user_id    uuid default auth.uid()
);

alter table public.feedback enable row level security;

grant insert on table public.feedback to anon, authenticated;

drop policy if exists "anyone can send feedback" on public.feedback;
create policy "anyone can send feedback" on public.feedback
  for insert to anon, authenticated with check (true);

-- Simple spam brake: at most 200 feedback messages per hour across the whole site
create or replace function public.limit_feedback_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.feedback where created_at > now() - interval '1 hour') >= 200 then
    raise exception 'Too much feedback right now. Try again later.';
  end if;
  return new;
end $$;
drop trigger if exists feedback_rate_limit on public.feedback;
create trigger feedback_rate_limit before insert on public.feedback
  for each row execute function public.limit_feedback_rate();

-- ---------- Hardening (applied 18 Oct 2026) ----------
-- Trigger functions are never called directly through the API
revoke execute on function public.limit_report_rate() from public, anon, authenticated;
revoke execute on function public.refresh_vote_counts() from public, anon, authenticated;

-- Feedback spam brake: 200 an hour site-wide, 10 an hour per signed-in person
create or replace function public.limit_feedback_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.feedback where created_at > now() - interval '1 hour') >= 200 then
    raise exception 'Too much feedback right now. Try again later.';
  end if;
  if new.user_id is not null and
     (select count(*) from public.feedback where user_id = new.user_id and created_at > now() - interval '1 hour') >= 10 then
    raise exception 'Too much feedback from you in the last hour. Try again later.';
  end if;
  return new;
end $$;
create or replace trigger feedback_rate_limit before insert on public.feedback
  for each row execute function public.limit_feedback_rate();
revoke execute on function public.limit_feedback_rate() from public, anon, authenticated;

-- Remove table permissions the website never uses
revoke truncate, trigger, references on table public.reports, public.votes, public.briefings, public.feedback from anon, authenticated;

-- ---------- Privacy (applied 18 Oct 2026) ----------
-- Lets a signed-in person find their own reports without exposing anyone's user ID
create or replace function public.my_report_ids() returns setof uuid
language sql stable security definer set search_path = public as $$
  select id from public.reports where author = auth.uid()
$$;
revoke execute on function public.my_report_ids() from public, anon;
grant execute on function public.my_report_ids() to authenticated;

-- Round report locations to about 100 m, whatever the device sends
create or replace function public.round_report_location() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.lat is not null then new.lat := round(new.lat::numeric, 3)::double precision; end if;
  if new.lng is not null then new.lng := round(new.lng::numeric, 3)::double precision; end if;
  return new;
end $$;
create or replace trigger reports_round_location before insert or update of lat, lng on public.reports
  for each row execute function public.round_report_location();
revoke execute on function public.round_report_location() from public, anon, authenticated;

-- Votes are private: each person sees only their own (totals stay on each report)
do $$ begin
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'votes' and policyname = 'read own votes') then
    drop policy if exists "votes readable by all" on public.votes;
  else
    alter policy "votes readable by all" on public.votes rename to "read own votes";
  end if;
end $$;
alter policy "read own votes" on public.votes to authenticated using (user_id = auth.uid());
revoke select on table public.votes from anon;

-- Hide the poster's user ID: everyone can read every report column except author
revoke select on table public.reports from anon, authenticated;
grant select (id, created_at, author_name, road, direction, location_note, type, severity, lane, trip, note, lat, lng, quick, confirms, cleared)
  on table public.reports to anon, authenticated;

-- Live updates only carry the report ID and time; the site then reloads the public fields
alter publication supabase_realtime set table public.reports (id, created_at);

-- ---------- Flags (applied 18 Oct 2026) ----------
-- Drivers can flag a report once (spam, abuse, fake, private info). Flags are private.
-- A report with 3 or more flags is hidden from everyone. To restore one: delete its rows
-- in report_flags, then set its flags column back to 0 in the Table Editor.
alter table public.reports add column if not exists flags integer not null default 0;
create table if not exists public.report_flags (
  report_id  uuid not null references public.reports(id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reason     text not null check (reason in ('spam','abuse','false','private','other')),
  created_at timestamptz not null default now(),
  primary key (report_id, user_id)
);
create index if not exists report_flags_user_idx on public.report_flags (user_id, created_at desc);
alter table public.report_flags enable row level security;
grant select, insert on table public.report_flags to authenticated;
drop policy if exists "flag as yourself" on public.report_flags;
create policy "flag as yourself" on public.report_flags for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "read own flags" on public.report_flags;
create policy "read own flags" on public.report_flags for select to authenticated using (user_id = auth.uid());
create or replace function public.refresh_flag_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.report_flags where user_id = new.user_id and created_at > now() - interval '1 hour') > 20 then
    raise exception 'Too many flags in the last hour. Try again later.';
  end if;
  update public.reports set flags = (select count(*) from public.report_flags where report_id = new.report_id) where id = new.report_id;
  return null;
end $$;
create or replace trigger report_flags_count after insert on public.report_flags
  for each row execute function public.refresh_flag_count();
revoke execute on function public.refresh_flag_count() from public, anon, authenticated;
alter policy "reports readable by all" on public.reports using (flags < 3);
alter policy "post own reports" on public.reports with check (author = auth.uid() and confirms = 0 and cleared = 0 and flags = 0);

-- ---------- Review fixes (applied 19 Oct 2026) ----------
-- The database stamps created_at itself, so posts can't be backdated or future-dated to dodge limits.
create or replace function public.set_server_time() returns trigger
language plpgsql set search_path = public as $$
begin
  new.created_at := now();
  return new;
end $$;
revoke execute on function public.set_server_time() from public, anon, authenticated;
create or replace trigger reports_a_server_time before insert on public.reports for each row execute function public.set_server_time();
create or replace trigger votes_a_server_time before insert on public.votes for each row execute function public.set_server_time();
create or replace trigger report_flags_a_server_time before insert on public.report_flags for each row execute function public.set_server_time();

-- Feedback is attributed to the real signed-in user (or nobody), never to an ID the browser sends.
create or replace function public.set_feedback_identity() returns trigger
language plpgsql set search_path = public as $$
begin
  new.created_at := now();
  new.user_id := auth.uid();
  return new;
end $$;
revoke execute on function public.set_feedback_identity() from public, anon, authenticated;
create or replace trigger feedback_a_identity before insert on public.feedback for each row execute function public.set_feedback_identity();

-- Rate limits take a per-person lock so parallel requests can't slip past the count.
create or replace function public.limit_report_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtext('report:' || new.author::text));
  if (select count(*) from public.reports
      where author = new.author and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'Too many reports in the last hour. Try again later.';
  end if;
  return new;
end $$;
create or replace function public.limit_feedback_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtext('feedback:' || coalesce(new.user_id::text, 'anon')));
  if (select count(*) from public.feedback where created_at > now() - interval '1 hour') >= 200 then
    raise exception 'Too much feedback right now. Try again later.';
  end if;
  if new.user_id is not null and
     (select count(*) from public.feedback where user_id = new.user_id and created_at > now() - interval '1 hour') >= 10 then
    raise exception 'Too much feedback from you in the last hour. Try again later.';
  end if;
  return new;
end $$;

-- A vote can switch between "still there" and "gone", but can't move to another report or person.
create or replace function public.lock_vote_identity() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.report_id is distinct from old.report_id or new.user_id is distinct from old.user_id then
    raise exception 'A vote cannot be moved to another report.';
  end if;
  new.created_at := old.created_at;
  return new;
end $$;
revoke execute on function public.lock_vote_identity() from public, anon, authenticated;
create or replace trigger votes_lock_identity before update on public.votes for each row execute function public.lock_vote_identity();

-- Flag counts are recalculated when flags are removed too (e.g. when an account is deleted).
create or replace function public.refresh_flag_count() returns trigger
language plpgsql security definer set search_path = public as $$
declare rid uuid := coalesce(new.report_id, old.report_id);
begin
  if tg_op = 'INSERT' then
    perform pg_advisory_xact_lock(hashtext('flag:' || new.user_id::text));
    if (select count(*) from public.report_flags where user_id = new.user_id and created_at > now() - interval '1 hour') > 20 then
      raise exception 'Too many flags in the last hour. Try again later.';
    end if;
  end if;
  update public.reports set flags = (select count(*) from public.report_flags where report_id = rid) where id = rid;
  return null;
end $$;
create or replace trigger report_flags_count after insert or delete on public.report_flags
  for each row execute function public.refresh_flag_count();
revoke execute on function public.refresh_flag_count() from public, anon, authenticated;
