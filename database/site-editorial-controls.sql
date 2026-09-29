-- Añade contenido administrable para el libro destacado y los puntos del mapa.
-- El acceso sigue usando las políticas RLS existentes de site_experience_content.

alter table public.site_experience_content
  drop constraint if exists site_experience_content_type_check;

alter table public.site_experience_content
  add constraint site_experience_content_type_check
  check (content_type in (
    'start_path','news','timeline','relationship','tour_territory',
    'journey_destination','cronista_mode','progression_level',
    'map_location','book_promo'
  ));

create index if not exists site_experience_map_locations_order_idx
  on public.site_experience_content (sort_order, slug)
  where content_type = 'map_location' and is_published = true;

create index if not exists site_experience_book_promo_idx
  on public.site_experience_content (content_type, slug)
  where content_type = 'book_promo';
