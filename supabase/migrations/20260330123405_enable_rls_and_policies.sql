-- =============================================================================
-- Enable RLS on all tables
-- =============================================================================

alter table "user"               enable row level security;
alter table language_profile     enable row level security;
alter table content_entry        enable row level security;
alter table tv_show_library      enable row level security;
alter table episode_log          enable row level security;
alter table podcast_feed         enable row level security;
alter table podcast_episode_log  enable row level security;


-- =============================================================================
-- user
-- =============================================================================

create policy "users: select own" on "user"
  for select using (auth.uid() = id);

create policy "users: update own" on "user"
  for update using (auth.uid() = id);


-- =============================================================================
-- language_profile
-- =============================================================================

create policy "language_profile: select own" on language_profile
  for select using (auth.uid() = user_id);

create policy "language_profile: insert own" on language_profile
  for insert with check (auth.uid() = user_id);

create policy "language_profile: update own" on language_profile
  for update using (auth.uid() = user_id);

create policy "language_profile: delete own" on language_profile
  for delete using (auth.uid() = user_id);


-- =============================================================================
-- content_entry (join through language_profile)
-- =============================================================================

create policy "content_entry: select own" on content_entry
  for select using (
    exists (
      select 1 from language_profile
      where language_profile.id = content_entry.profile_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "content_entry: insert own" on content_entry
  for insert with check (
    exists (
      select 1 from language_profile
      where language_profile.id = content_entry.profile_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "content_entry: update own" on content_entry
  for update using (
    exists (
      select 1 from language_profile
      where language_profile.id = content_entry.profile_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "content_entry: delete own" on content_entry
  for delete using (
    exists (
      select 1 from language_profile
      where language_profile.id = content_entry.profile_id
      and language_profile.user_id = auth.uid()
    )
  );


-- =============================================================================
-- tv_show_library (join through language_profile)
-- =============================================================================

create policy "tv_show_library: select own" on tv_show_library
  for select using (
    exists (
      select 1 from language_profile
      where language_profile.id = tv_show_library.profile_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "tv_show_library: insert own" on tv_show_library
  for insert with check (
    exists (
      select 1 from language_profile
      where language_profile.id = tv_show_library.profile_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "tv_show_library: update own" on tv_show_library
  for update using (
    exists (
      select 1 from language_profile
      where language_profile.id = tv_show_library.profile_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "tv_show_library: delete own" on tv_show_library
  for delete using (
    exists (
      select 1 from language_profile
      where language_profile.id = tv_show_library.profile_id
      and language_profile.user_id = auth.uid()
    )
  );


-- =============================================================================
-- episode_log (join through tv_show_library -> language_profile)
-- =============================================================================

create policy "episode_log: select own" on episode_log
  for select using (
    exists (
      select 1 from tv_show_library
      join language_profile on language_profile.id = tv_show_library.profile_id
      where tv_show_library.id = episode_log.library_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "episode_log: insert own" on episode_log
  for insert with check (
    exists (
      select 1 from tv_show_library
      join language_profile on language_profile.id = tv_show_library.profile_id
      where tv_show_library.id = episode_log.library_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "episode_log: update own" on episode_log
  for update using (
    exists (
      select 1 from tv_show_library
      join language_profile on language_profile.id = tv_show_library.profile_id
      where tv_show_library.id = episode_log.library_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "episode_log: delete own" on episode_log
  for delete using (
    exists (
      select 1 from tv_show_library
      join language_profile on language_profile.id = tv_show_library.profile_id
      where tv_show_library.id = episode_log.library_id
      and language_profile.user_id = auth.uid()
    )
  );


-- =============================================================================
-- podcast_feed (join through language_profile)
-- =============================================================================

create policy "podcast_feed: select own" on podcast_feed
  for select using (
    exists (
      select 1 from language_profile
      where language_profile.id = podcast_feed.profile_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "podcast_feed: insert own" on podcast_feed
  for insert with check (
    exists (
      select 1 from language_profile
      where language_profile.id = podcast_feed.profile_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "podcast_feed: update own" on podcast_feed
  for update using (
    exists (
      select 1 from language_profile
      where language_profile.id = podcast_feed.profile_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "podcast_feed: delete own" on podcast_feed
  for delete using (
    exists (
      select 1 from language_profile
      where language_profile.id = podcast_feed.profile_id
      and language_profile.user_id = auth.uid()
    )
  );


-- =============================================================================
-- podcast_episode_log (join through podcast_feed -> language_profile)
-- =============================================================================

create policy "podcast_episode_log: select own" on podcast_episode_log
  for select using (
    exists (
      select 1 from podcast_feed
      join language_profile on language_profile.id = podcast_feed.profile_id
      where podcast_feed.id = podcast_episode_log.feed_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "podcast_episode_log: insert own" on podcast_episode_log
  for insert with check (
    exists (
      select 1 from podcast_feed
      join language_profile on language_profile.id = podcast_feed.profile_id
      where podcast_feed.id = podcast_episode_log.feed_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "podcast_episode_log: update own" on podcast_episode_log
  for update using (
    exists (
      select 1 from podcast_feed
      join language_profile on language_profile.id = podcast_feed.profile_id
      where podcast_feed.id = podcast_episode_log.feed_id
      and language_profile.user_id = auth.uid()
    )
  );

create policy "podcast_episode_log: delete own" on podcast_episode_log
  for delete using (
    exists (
      select 1 from podcast_feed
      join language_profile on language_profile.id = podcast_feed.profile_id
      where podcast_feed.id = podcast_episode_log.feed_id
      and language_profile.user_id = auth.uid()
    )
  );


-- =============================================================================
-- User creation trigger
-- Automatically creates a public user row when someone signs up via Supabase Auth
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."user" (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
