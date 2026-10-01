alter table public.site_episode_feature_settings
  add column if not exists page_header_image_path text,
  add column if not exists page_header_image_url text,
  add column if not exists page_header_image_fit text not null default 'cover',
  add column if not exists page_header_image_position_x smallint not null default 50,
  add column if not exists page_header_image_position_y smallint not null default 30;

alter table public.site_episode_feature_settings
  drop constraint if exists site_episode_feature_settings_page_header_image_fit_check,
  add constraint site_episode_feature_settings_page_header_image_fit_check
    check (page_header_image_fit in ('cover', 'contain')),
  drop constraint if exists site_episode_feature_settings_page_header_image_position_x_check,
  add constraint site_episode_feature_settings_page_header_image_position_x_check
    check (page_header_image_position_x between 0 and 100),
  drop constraint if exists site_episode_feature_settings_page_header_image_position_y_check,
  add constraint site_episode_feature_settings_page_header_image_position_y_check
    check (page_header_image_position_y between 0 and 100);
