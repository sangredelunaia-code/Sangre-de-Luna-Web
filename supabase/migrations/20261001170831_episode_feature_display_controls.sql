create table if not exists public.site_episode_feature_settings (
  id smallint primary key default 1 check (id = 1),
  image_path text,
  image_url text,
  image_fit text not null default 'cover' check (image_fit in ('cover', 'contain')),
  image_position_x smallint not null default 50 check (image_position_x between 0 and 100),
  image_position_y smallint not null default 50 check (image_position_y between 0 and 100),
  desktop_height smallint not null default 330 check (desktop_height between 240 and 600),
  mobile_height smallint not null default 420 check (mobile_height between 240 and 700),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_episode_feature_settings enable row level security;

grant select on public.site_episode_feature_settings to anon, authenticated;
grant update on public.site_episode_feature_settings to authenticated;

drop policy if exists "Public can read episode display settings" on public.site_episode_feature_settings;
create policy "Public can read episode display settings"
  on public.site_episode_feature_settings for select
  using (true);

drop policy if exists "Superadmins manage episode display settings" on public.site_episode_feature_settings;
create policy "Superadmins manage episode display settings"
  on public.site_episode_feature_settings for update to authenticated
  using (private.is_superadmin())
  with check (private.is_superadmin());

insert into public.site_episode_feature_settings (id)
values (1)
on conflict (id) do nothing;
