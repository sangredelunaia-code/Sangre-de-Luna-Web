alter table public.episodes
  add column if not exists cover_path text,
  add column if not exists cover_url text,
  add column if not exists cover_fit text not null default 'cover',
  add column if not exists cover_position_x smallint not null default 50,
  add column if not exists cover_position_y smallint not null default 50;

alter table public.episodes
  drop constraint if exists episodes_cover_fit_check,
  add constraint episodes_cover_fit_check check (cover_fit in ('cover', 'contain')),
  drop constraint if exists episodes_cover_position_x_check,
  add constraint episodes_cover_position_x_check check (cover_position_x between 0 and 100),
  drop constraint if exists episodes_cover_position_y_check,
  add constraint episodes_cover_position_y_check check (cover_position_y between 0 and 100);
