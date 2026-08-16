-- Sangre de Luna · Centro editorial de Universo y Experiencia
-- Aplicado en producción el 2026-08-16 mediante Supabase migration: site_experience_editorial_hub.
-- Este archivo documenta la estructura para futuras instalaciones o recuperación.

create table if not exists public.site_experience_content (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  slug text not null,
  title text not null default '',
  subtitle text not null default '',
  description text not null default '',
  image_path text,
  href text,
  meta jsonb not null default '{}'::jsonb,
  sort_order integer not null default 100,
  is_published boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_experience_content_type_check check (content_type in (
    'start_path','news','timeline','relationship','tour_territory','journey_destination','cronista_mode','progression_level'
  )),
  constraint site_experience_content_unique unique(content_type, slug)
);

alter table public.site_experience_content enable row level security;

drop policy if exists "experience public read" on public.site_experience_content;
create policy "experience public read" on public.site_experience_content
for select to anon, authenticated
using (
  is_published = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at > now())
);

drop policy if exists "superadmin manage experience" on public.site_experience_content;
create policy "superadmin manage experience" on public.site_experience_content
for all to authenticated
using (private.is_superadmin())
with check (private.is_superadmin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('experience-media','experience-media',true,15728640,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

-- La migración de producción también actualiza public.fanclub_member_challenges(uuid)
-- para obtener el nombre del rango desde los registros content_type='progression_level'.
-- Los umbrales iniciales conservan el comportamiento previo:
-- Iniciado 0 · Guardián 50 · Élite 120 · Legendario 180.
