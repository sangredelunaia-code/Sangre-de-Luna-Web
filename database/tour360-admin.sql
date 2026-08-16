-- Sangre de Luna · Recorridos 360° administrables
-- Esquema aplicado en Supabase mediante la migración: admin_recorridos_360
-- Los datos iniciales de Ciudadela y Reino Vampiro fueron migrados desde tour.html.

create table if not exists public.tour_territories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text,
  region text,
  intro_label text,
  description text,
  final_title text,
  final_text text,
  cover_path text,
  status text not null default 'available' check (status in ('available','coming_soon','hidden')),
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.tour_scenes (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null references public.tour_territories(id) on delete cascade,
  slug text not null,
  label text,
  title text not null,
  plain_title text,
  description text,
  narration text,
  panorama_path text,
  initial_yaw numeric not null default 0,
  initial_pitch numeric not null default 0,
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  unique(territory_id,slug)
);

create table if not exists public.tour_hotspots (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.tour_scenes(id) on delete cascade,
  title text not null,
  body text,
  yaw numeric not null default 0,
  pitch numeric not null default 0,
  href text,
  link_label text,
  sort_order integer not null default 100,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

-- Seguridad aplicada en producción:
-- 1. Lectura pública únicamente de registros publicados.
-- 2. Escritura solo para usuarios autenticados con profiles.is_active = true.
-- 3. Bucket público tour-media; escritura/borrado restringidos a administradores activos.
-- 4. Límite de archivo del bucket: 50 MB; formatos de imagen JPEG/PNG/WebP/GIF.
