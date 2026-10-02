-- SANGRE DE LUNA · RECUPERACION DE CONTRASENA DEL FAN CLUB
-- Migracion aplicada en Supabase. Tokens de un solo uso, 30 minutos y correo administrable.

begin;

create table if not exists public.fanclub_password_resets (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.fanclub_members(id) on delete cascade,
  token_hash text not null unique,
  requested_by text not null default 'self' check (requested_by in ('self','admin')),
  expires_at timestamptz not null,
  used_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists fanclub_password_resets_member_created_idx on public.fanclub_password_resets(member_id,created_at desc);
create index if not exists fanclub_password_resets_expiry_idx on public.fanclub_password_resets(expires_at) where used_at is null;
alter table public.fanclub_password_resets enable row level security;
revoke all on public.fanclub_password_resets from anon, authenticated;
grant all on public.fanclub_password_resets to service_role;
grant select on public.fanclub_password_resets to authenticated;
drop policy if exists "fanclub staff read password resets" on public.fanclub_password_resets;
create policy "fanclub staff read password resets" on public.fanclub_password_resets for select to authenticated using (private.has_permission('fanclub'));

create table if not exists private.fanclub_mail_config (
  singleton boolean primary key default true check(singleton=true),
  sender_email text not null default 'sangredelunaia@gmail.com',
  sender_name text not null default 'Sangre de Luna',
  app_password text,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
revoke all on private.fanclub_mail_config from public, anon, authenticated;
insert into private.fanclub_mail_config(singleton,sender_email,sender_name)
values(true,'sangredelunaia@gmail.com','Sangre de Luna')
on conflict(singleton) do update set sender_email=excluded.sender_email,sender_name=excluded.sender_name;

create or replace function public.fanclub_issue_password_reset(p_email text,p_requested_by text default 'self')
returns jsonb language plpgsql volatile security definer set search_path=pg_catalog,public,extensions as $$
declare m public.fanclub_members; raw_token text; hashed text; reset_id uuid; expires timestamptz;
begin
  if p_requested_by not in ('self','admin') then raise exception 'Solicitud inválida.'; end if;
  select * into m from public.fanclub_members where lower(email)=lower(trim(coalesce(p_email,''))) and status='active' limit 1;
  if m.id is null then return jsonb_build_object('found',false); end if;
  if p_requested_by='self' and exists(select 1 from public.fanclub_password_resets r where r.member_id=m.id and r.used_at is null and r.created_at>now()-interval '90 seconds') then
    return jsonb_build_object('found',true,'cooldown',true);
  end if;
  update public.fanclub_password_resets set used_at=coalesce(used_at,now()) where member_id=m.id and used_at is null;
  raw_token:=encode(gen_random_bytes(32),'hex');
  hashed:=encode(extensions.digest(raw_token,'sha256'),'hex');
  expires:=now()+interval '30 minutes';
  insert into public.fanclub_password_resets(member_id,token_hash,requested_by,expires_at) values(m.id,hashed,p_requested_by,expires) returning id into reset_id;
  return jsonb_build_object('found',true,'cooldown',false,'reset_id',reset_id,'member_id',m.id,'display_name',m.display_name,'email',m.email,'token',raw_token,'expires_at',expires);
end$$;
revoke all on function public.fanclub_issue_password_reset(text,text) from public,anon,authenticated;
grant execute on function public.fanclub_issue_password_reset(text,text) to service_role;

create or replace function public.fanclub_consume_password_reset(p_token text,p_password text)
returns jsonb language plpgsql volatile security definer set search_path=pg_catalog,public,extensions as $$
declare r public.fanclub_password_resets; m public.fanclub_members; hashed text;
begin
  if length(coalesce(p_password,''))<8 or length(coalesce(p_password,''))>72 then raise exception 'La contraseña debe tener entre 8 y 72 caracteres.'; end if;
  hashed:=encode(extensions.digest(coalesce(p_token,''),'sha256'),'hex');
  select * into r from public.fanclub_password_resets where token_hash=hashed and used_at is null and expires_at>now() order by created_at desc limit 1 for update;
  if r.id is null then raise exception 'Este enlace de recuperación no es válido o ya expiró.'; end if;
  select * into m from public.fanclub_members where id=r.member_id and status='active' limit 1;
  if m.id is null then raise exception 'Esta membresía no está activa.'; end if;
  update public.fanclub_members set password_hash=extensions.crypt(p_password,extensions.gen_salt('bf',10)),password_set_at=now(),access_token=gen_random_uuid(),updated_at=now() where id=m.id;
  update public.fanclub_password_resets set used_at=now() where member_id=m.id and used_at is null;
  return jsonb_build_object('ok',true,'member_id',m.id,'display_name',m.display_name,'email',m.email);
end$$;
revoke all on function public.fanclub_consume_password_reset(text,text) from public,anon,authenticated;
grant execute on function public.fanclub_consume_password_reset(text,text) to service_role;

create or replace function public.fanclub_mail_config_status()
returns jsonb language plpgsql stable security definer set search_path=pg_catalog,public,private as $$
declare c private.fanclub_mail_config;
begin
  if not private.has_permission('fanclub') then raise exception 'No autorizado.'; end if;
  select * into c from private.fanclub_mail_config where singleton=true;
  return jsonb_build_object('sender_email',coalesce(c.sender_email,'sangredelunaia@gmail.com'),'sender_name',coalesce(c.sender_name,'Sangre de Luna'),'configured',c.app_password is not null and length(trim(c.app_password))>0,'updated_at',c.updated_at);
end$$;
revoke all on function public.fanclub_mail_config_status() from public,anon;
grant execute on function public.fanclub_mail_config_status() to authenticated,service_role;

create or replace function public.fanclub_mail_config_set(p_app_password text)
returns jsonb language plpgsql volatile security definer set search_path=pg_catalog,public,private as $$
declare cleaned text;
begin
  if not private.is_superadmin() then raise exception 'Solo el superadministrador puede configurar el correo de recuperación.'; end if;
  cleaned:=replace(trim(coalesce(p_app_password,'')),' ','');
  if length(cleaned)<16 or length(cleaned)>128 then raise exception 'La contraseña de aplicación de Google no tiene un formato válido.'; end if;
  insert into private.fanclub_mail_config(singleton,sender_email,sender_name,app_password,updated_at,updated_by)
  values(true,'sangredelunaia@gmail.com','Sangre de Luna',cleaned,now(),auth.uid())
  on conflict(singleton) do update set sender_email=excluded.sender_email,sender_name=excluded.sender_name,app_password=excluded.app_password,updated_at=now(),updated_by=auth.uid();
  return jsonb_build_object('ok',true,'sender_email','sangredelunaia@gmail.com');
end$$;
revoke all on function public.fanclub_mail_config_set(text) from public,anon;
grant execute on function public.fanclub_mail_config_set(text) to authenticated;

create or replace function public.fanclub_mail_secret()
returns jsonb language sql stable security definer set search_path=pg_catalog,private as $$
  select jsonb_build_object('sender_email',sender_email,'sender_name',sender_name,'app_password',app_password,'configured',app_password is not null and length(trim(app_password))>0)
  from private.fanclub_mail_config where singleton=true;
$$;
revoke all on function public.fanclub_mail_secret() from public,anon,authenticated;
grant execute on function public.fanclub_mail_secret() to service_role;

create or replace function public.fanclub_mail_public_status()
returns jsonb language sql stable security definer set search_path=pg_catalog,private as $$
  select jsonb_build_object('configured',app_password is not null and length(trim(app_password))>0,'sender_email',sender_email)
  from private.fanclub_mail_config where singleton=true;
$$;
revoke all on function public.fanclub_mail_public_status() from public;
grant execute on function public.fanclub_mail_public_status() to anon,authenticated,service_role;

commit;
