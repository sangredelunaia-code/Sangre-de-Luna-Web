-- DESAFIOS DE LA MANADA
-- Backend, seguridad y contenido inicial canonico para el Fan Club.

begin;

create table if not exists public.fanclub_challenges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  season integer check (season is null or season > 0),
  chapter_range text,
  icon text not null default '🐺',
  badge_key text not null unique,
  badge_name text not null,
  badge_description text,
  min_score_percent integer not null default 70 check (min_score_percent between 1 and 100),
  sort_order integer not null default 100,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  available_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fanclub_challenge_questions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.fanclub_challenges(id) on delete cascade,
  question_key text not null,
  question text not null,
  explanation text,
  points integer not null default 10 check (points > 0 and points <= 100),
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (challenge_id, question_key)
);

create table if not exists public.fanclub_challenge_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.fanclub_challenge_questions(id) on delete cascade,
  option_key text not null,
  label text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 100,
  unique (question_id, option_key)
);

create table if not exists public.fanclub_challenge_attempts (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.fanclub_members(id) on delete cascade,
  challenge_id uuid not null references public.fanclub_challenges(id) on delete cascade,
  score integer not null check (score >= 0),
  max_points integer not null check (max_points > 0),
  correct_answers integer not null check (correct_answers >= 0),
  total_questions integer not null check (total_questions > 0),
  percent integer not null check (percent between 0 and 100),
  completed_at timestamptz not null default now()
);

create table if not exists public.fanclub_member_badges (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.fanclub_members(id) on delete cascade,
  challenge_id uuid references public.fanclub_challenges(id) on delete set null,
  badge_key text not null,
  badge_name text not null,
  description text,
  icon text not null default '🌙',
  awarded_at timestamptz not null default now(),
  unique (member_id, badge_key)
);

create index if not exists fanclub_challenge_questions_challenge_sort_idx
  on public.fanclub_challenge_questions(challenge_id, sort_order);
create index if not exists fanclub_challenge_options_question_sort_idx
  on public.fanclub_challenge_options(question_id, sort_order);
create index if not exists fanclub_challenge_attempts_member_challenge_score_idx
  on public.fanclub_challenge_attempts(member_id, challenge_id, score desc, completed_at desc);
create index if not exists fanclub_challenge_attempts_challenge_completed_idx
  on public.fanclub_challenge_attempts(challenge_id, completed_at desc);
create index if not exists fanclub_member_badges_member_awarded_idx
  on public.fanclub_member_badges(member_id, awarded_at desc);
create index if not exists fanclub_member_badges_challenge_idx
  on public.fanclub_member_badges(challenge_id)
  where challenge_id is not null;

alter table public.fanclub_challenges enable row level security;
alter table public.fanclub_challenge_questions enable row level security;
alter table public.fanclub_challenge_options enable row level security;
alter table public.fanclub_challenge_attempts enable row level security;
alter table public.fanclub_member_badges enable row level security;

revoke all on public.fanclub_challenges from anon, authenticated;
revoke all on public.fanclub_challenge_questions from anon, authenticated;
revoke all on public.fanclub_challenge_options from anon, authenticated;
revoke all on public.fanclub_challenge_attempts from anon, authenticated;
revoke all on public.fanclub_member_badges from anon, authenticated;

grant select, insert, update, delete on public.fanclub_challenges to authenticated;
grant select, insert, update, delete on public.fanclub_challenge_questions to authenticated;
grant select, insert, update, delete on public.fanclub_challenge_options to authenticated;
grant select, insert, update, delete on public.fanclub_challenge_attempts to authenticated;
grant select, insert, update, delete on public.fanclub_member_badges to authenticated;
grant all on public.fanclub_challenges to service_role;
grant all on public.fanclub_challenge_questions to service_role;
grant all on public.fanclub_challenge_options to service_role;
grant all on public.fanclub_challenge_attempts to service_role;
grant all on public.fanclub_member_badges to service_role;

drop policy if exists "staff manage fanclub challenges" on public.fanclub_challenges;
create policy "staff manage fanclub challenges"
on public.fanclub_challenges for all to authenticated
using (private.has_permission('fanclub'))
with check (private.has_permission('fanclub'));

drop policy if exists "staff manage fanclub challenge questions" on public.fanclub_challenge_questions;
create policy "staff manage fanclub challenge questions"
on public.fanclub_challenge_questions for all to authenticated
using (private.has_permission('fanclub'))
with check (private.has_permission('fanclub'));

drop policy if exists "staff manage fanclub challenge options" on public.fanclub_challenge_options;
create policy "staff manage fanclub challenge options"
on public.fanclub_challenge_options for all to authenticated
using (private.has_permission('fanclub'))
with check (private.has_permission('fanclub'));

drop policy if exists "staff manage fanclub challenge attempts" on public.fanclub_challenge_attempts;
create policy "staff manage fanclub challenge attempts"
on public.fanclub_challenge_attempts for all to authenticated
using (private.has_permission('fanclub'))
with check (private.has_permission('fanclub'));

drop policy if exists "staff manage fanclub member badges" on public.fanclub_member_badges;
create policy "staff manage fanclub member badges"
on public.fanclub_member_badges for all to authenticated
using (private.has_permission('fanclub'))
with check (private.has_permission('fanclub'));

create or replace function public.fanclub_public_challenges()
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', c.id,
      'slug', c.slug,
      'title', c.title,
      'subtitle', c.subtitle,
      'description', c.description,
      'season', c.season,
      'chapter_range', c.chapter_range,
      'icon', c.icon,
      'badge_name', c.badge_name,
      'badge_description', c.badge_description,
      'min_score_percent', c.min_score_percent,
      'question_count', (select count(*) from public.fanclub_challenge_questions q where q.challenge_id = c.id),
      'max_points', (select coalesce(sum(q.points),0) from public.fanclub_challenge_questions q where q.challenge_id = c.id)
    ) order by c.sort_order, c.created_at
  ), '[]'::jsonb)
  from public.fanclub_challenges c
  where c.status = 'published'
    and (c.available_at is null or c.available_at <= now());
$$;

create or replace function public.fanclub_member_challenges(p_access_token uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_member_id uuid;
  v_points integer := 0;
  v_completed integer := 0;
  v_total integer := 0;
  v_level text := 'Iniciado';
  v_badges jsonb := '[]'::jsonb;
  v_challenges jsonb := '[]'::jsonb;
begin
  select m.id into v_member_id
  from public.fanclub_members m
  where m.access_token = p_access_token and m.status = 'active'
  limit 1;

  if v_member_id is null then
    raise exception 'Tu sesión de miembro no es válida. Vuelve a ingresar.';
  end if;

  with published as (
    select c.id from public.fanclub_challenges c
    where c.status = 'published' and (c.available_at is null or c.available_at <= now())
  ), best as (
    select a.challenge_id, max(a.score)::int as best_score
    from public.fanclub_challenge_attempts a
    where a.member_id = v_member_id and a.challenge_id in (select id from published)
    group by a.challenge_id
  )
  select coalesce(sum(best_score),0)::int, count(*)::int, (select count(*) from published)::int
  into v_points, v_completed, v_total
  from best;

  v_level := case
    when v_points >= 180 then 'Legendario'
    when v_points >= 120 then 'Élite'
    when v_points >= 50 then 'Guardián'
    else 'Iniciado'
  end;

  select coalesce(jsonb_agg(jsonb_build_object(
    'badge_key', b.badge_key,
    'badge_name', b.badge_name,
    'description', b.description,
    'icon', b.icon,
    'awarded_at', b.awarded_at
  ) order by b.awarded_at), '[]'::jsonb)
  into v_badges
  from public.fanclub_member_badges b
  where b.member_id = v_member_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id,
    'slug', c.slug,
    'title', c.title,
    'subtitle', c.subtitle,
    'description', c.description,
    'season', c.season,
    'chapter_range', c.chapter_range,
    'icon', c.icon,
    'badge_key', c.badge_key,
    'badge_name', c.badge_name,
    'badge_description', c.badge_description,
    'min_score_percent', c.min_score_percent,
    'best_score', coalesce(best.score,0),
    'best_percent', coalesce(best.percent,0),
    'completed', best.id is not null,
    'earned_badge', exists(
      select 1 from public.fanclub_member_badges mb
      where mb.member_id = v_member_id and mb.badge_key = c.badge_key
    ),
    'question_count', (select count(*) from public.fanclub_challenge_questions q where q.challenge_id = c.id),
    'max_points', (select coalesce(sum(q.points),0) from public.fanclub_challenge_questions q where q.challenge_id = c.id),
    'questions', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', q.id,
        'question', q.question,
        'points', q.points,
        'options', (
          select coalesce(jsonb_agg(jsonb_build_object('id', o.id, 'label', o.label) order by o.sort_order), '[]'::jsonb)
          from public.fanclub_challenge_options o
          where o.question_id = q.id
        )
      ) order by q.sort_order), '[]'::jsonb)
      from public.fanclub_challenge_questions q
      where q.challenge_id = c.id
    )
  ) order by c.sort_order, c.created_at), '[]'::jsonb)
  into v_challenges
  from public.fanclub_challenges c
  left join lateral (
    select a.id, a.score, a.percent
    from public.fanclub_challenge_attempts a
    where a.member_id = v_member_id and a.challenge_id = c.id
    order by a.score desc, a.completed_at desc
    limit 1
  ) best on true
  where c.status = 'published'
    and (c.available_at is null or c.available_at <= now());

  return jsonb_build_object(
    'profile', jsonb_build_object(
      'points', v_points,
      'level', v_level,
      'completed_challenges', v_completed,
      'total_challenges', v_total,
      'badges', v_badges
    ),
    'challenges', v_challenges
  );
end;
$$;

create or replace function public.fanclub_submit_challenge(
  p_access_token uuid,
  p_challenge_id uuid,
  p_answers jsonb
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = pg_catalog, public
as $$
declare
  v_member_id uuid;
  v_challenge public.fanclub_challenges;
  v_score integer := 0;
  v_max_points integer := 0;
  v_correct integer := 0;
  v_total integer := 0;
  v_percent integer := 0;
  v_master_ready boolean := false;
begin
  select m.id into v_member_id
  from public.fanclub_members m
  where m.access_token = p_access_token and m.status = 'active'
  limit 1;

  if v_member_id is null then
    raise exception 'Tu sesión de miembro no es válida. Vuelve a ingresar.';
  end if;

  select * into v_challenge
  from public.fanclub_challenges c
  where c.id = p_challenge_id
    and c.status = 'published'
    and (c.available_at is null or c.available_at <= now());

  if v_challenge.id is null then
    raise exception 'Este desafío no está disponible.';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Las respuestas no tienen un formato válido.';
  end if;

  with scored as (
    select q.id, q.points,
      exists(
        select 1 from public.fanclub_challenge_options o
        where o.question_id = q.id
          and o.is_correct = true
          and (p_answers ->> q.id::text) = o.id::text
      ) as is_correct
    from public.fanclub_challenge_questions q
    where q.challenge_id = p_challenge_id
  )
  select count(*)::int,
         coalesce(sum(points),0)::int,
         count(*) filter (where is_correct)::int,
         coalesce(sum(case when is_correct then points else 0 end),0)::int
  into v_total, v_max_points, v_correct, v_score
  from scored;

  if v_total = 0 or v_max_points = 0 then
    raise exception 'Este desafío todavía no tiene preguntas.';
  end if;

  v_percent := round(v_score * 100.0 / v_max_points)::int;

  insert into public.fanclub_challenge_attempts(
    member_id, challenge_id, score, max_points, correct_answers, total_questions, percent
  ) values (
    v_member_id, p_challenge_id, v_score, v_max_points, v_correct, v_total, v_percent
  );

  if v_percent >= v_challenge.min_score_percent then
    insert into public.fanclub_member_badges(
      member_id, challenge_id, badge_key, badge_name, description, icon
    ) values (
      v_member_id, v_challenge.id, v_challenge.badge_key, v_challenge.badge_name,
      v_challenge.badge_description, v_challenge.icon
    ) on conflict (member_id, badge_key) do nothing;
  end if;

  with available as (
    select c.id, c.min_score_percent
    from public.fanclub_challenges c
    where c.status = 'published' and (c.available_at is null or c.available_at <= now())
  ), passed as (
    select a.challenge_id
    from public.fanclub_challenge_attempts a
    join available c on c.id = a.challenge_id
    where a.member_id = v_member_id and a.percent >= c.min_score_percent
    group by a.challenge_id
  )
  select (select count(*) from available) > 0
     and (select count(*) from passed) = (select count(*) from available)
  into v_master_ready;

  if v_master_ready then
    insert into public.fanclub_member_badges(
      member_id, challenge_id, badge_key, badge_name, description, icon
    ) values (
      v_member_id, null, 'cronista-manada', 'Cronista de la Manada',
      'Reconocimiento por superar todos los desafíos canónicos disponibles.', '🌙'
    ) on conflict (member_id, badge_key) do nothing;
  end if;

  return jsonb_build_object(
    'result', jsonb_build_object(
      'score', v_score,
      'max_points', v_max_points,
      'correct', v_correct,
      'total_questions', v_total,
      'percent', v_percent,
      'passed', v_percent >= v_challenge.min_score_percent,
      'badge_name', case when v_percent >= v_challenge.min_score_percent then v_challenge.badge_name else null end
    ),
    'dashboard', public.fanclub_member_challenges(p_access_token)
  );
end;
$$;

revoke execute on function public.fanclub_public_challenges() from public;
revoke execute on function public.fanclub_member_challenges(uuid) from public;
revoke execute on function public.fanclub_submit_challenge(uuid, uuid, jsonb) from public;
grant execute on function public.fanclub_public_challenges() to anon, authenticated, service_role;
grant execute on function public.fanclub_member_challenges(uuid) to anon, authenticated, service_role;
grant execute on function public.fanclub_submit_challenge(uuid, uuid, jsonb) to anon, authenticated, service_role;

insert into public.fanclub_challenges(
  slug,title,subtitle,description,season,chapter_range,icon,badge_key,badge_name,badge_description,min_score_percent,sort_order,status
) values
('huellas-del-origen','Huellas del Origen','El nacimiento de Sangre de Luna','Recorre los acontecimientos que reunieron a los hermanos y dieron forma a la primera manada.',1,'Capítulos 1–4','🐺','huella-fundadores','Huella de los Fundadores','Concedida a quienes conocen el origen de Sangre de Luna.',70,10,'published'),
('pacto-entre-reinos','Pacto entre Reinos','La alianza frente a la oscuridad','Demuestra cuánto conoces sobre la unión de lobos, vampiros y humanos frente a los Nocturnos.',1,'Capítulos 5–8','🤝','custodio-alianza','Custodio de la Alianza','Reconoce a quienes comprenden el pacto que unió a los reinos.',70,20,'published'),
('guardianes-del-umbral','Guardianes del Umbral','Los caminos bajo la Ciudadela','Descubre los secretos de las regiones, la red subterránea y las fuerzas que buscan abrir la noche.',2,'Capítulos 1–2','🚪','guardian-umbral','Guardián del Umbral','Concedida a quienes identifican los secretos de los antiguos caminos.',70,30,'published'),
('ruta-de-la-herida','La Ruta de la Herida','La Primera Puerta ha despertado','Sigue las decisiones que conectaron la Ciudadela, el Norte, el Este y las Tierras Prohibidas.',2,'Capítulos 3–4','🧭','explorador-herida','Explorador de la Herida','Reconoce a quienes siguieron la ruta hasta la verdad del Primer Alfa.',70,40,'published')
on conflict (slug) do update set
  title=excluded.title, subtitle=excluded.subtitle, description=excluded.description,
  season=excluded.season, chapter_range=excluded.chapter_range, icon=excluded.icon,
  badge_key=excluded.badge_key, badge_name=excluded.badge_name,
  badge_description=excluded.badge_description, min_score_percent=excluded.min_score_percent,
  sort_order=excluded.sort_order, status=excluded.status, updated_at=now();

with seed(challenge_slug,question_key,question,explanation,points,sort_order) as (values
('huellas-del-origen','q1','¿A quién buscaba Chris cuando recorrió los bosques antes de fundar la manada?','Chris recorría los bosques buscando a su hermano Gabriel.',10,10),
('huellas-del-origen','q2','¿En qué transformaron Chris y Gabriel la antigua fortaleza?','La fortaleza se convirtió en refugio para lobos y humanos sin hogar.',10,20),
('huellas-del-origen','q3','¿A quién reconoció Chris como Beta de Sangre de Luna?','Chris reconoció oficialmente a Gabriel como su Beta.',10,30),
('huellas-del-origen','q4','¿Qué hermano reapareció durante los acontecimientos de La Sombra del Eclipse?','Varkos, el hermano mayor, regresó después de años de exilio.',10,40),
('huellas-del-origen','q5','¿Qué decisión tomó Chris cuando finalmente derrotó a Varkos?','Chris se negó a destruirlo y le ofreció regresar a la manada.',10,50),
('pacto-entre-reinos','q1','¿Qué Príncipe Vampiro fue señalado inicialmente por el envenenamiento de Chris?','Las primeras sospechas apuntaron a Aleric, Príncipe Vampiro del Este.',10,10),
('pacto-entre-reinos','q2','¿Qué antigua especie comandaba Kael Draven?','Kael Draven era comandante de los Nocturnos.',10,20),
('pacto-entre-reinos','q3','¿Quién fue secuestrada antes del asalto total contra la Ciudadela?','Nine fue secuestrada como parte de la ofensiva definitiva de Kael.',10,30),
('pacto-entre-reinos','q4','¿Qué Alfa legendario llegó para reforzar a Sangre de Luna?','Peter llegó como Alfa veterano para apoyar a la manada.',10,40),
('pacto-entre-reinos','q5','¿Hacia qué región escapó Drakar Valeth tras la Batalla del Corredor Negro?','Drakar escapó hacia las grandes regiones industriales del Norte.',10,50),
('guardianes-del-umbral','q1','¿Cuántas grandes regiones revelaron los mapas encontrados entre los documentos de Drakar?','Los documentos mostraron cinco grandes regiones conectadas a un conflicto mayor.',10,10),
('guardianes-del-umbral','q2','¿Qué descubre la Corte sobre Drakar Valeth al estudiar los antiguos registros?','Descubren que Drakar no dirige realmente la guerra y responde a una fuerza más antigua.',10,20),
('guardianes-del-umbral','q3','¿Sobre qué fue construida la Ciudadela Sangre de Luna?','La Ciudadela fue construida sobre uno de los accesos de una enorme red subterránea.',10,30),
('guardianes-del-umbral','q4','¿Qué organización transportaba cargas por las rutas antiguas?','Gabriel y Ethan descubrieron que Sol Negro utilizaba aquellas rutas.',10,40),
('guardianes-del-umbral','q5','¿Hacia qué territorio apuntaban todas las señales al final de El Primer Umbral?','Todas las señales conducían hacia las Tierras Prohibidas.',10,50),
('ruta-de-la-herida','q1','¿Quiénes defendieron a los pueblos del Norte mientras despertaban los caminos antiguos?','Gabriel y Ethan defendieron a los pueblos del Norte.',10,10),
('ruta-de-la-herida','q2','¿Quiénes permanecieron protegiendo la Ciudadela?','Ella, Varkos y Sehan sostuvieron la defensa de la Ciudadela.',10,20),
('ruta-de-la-herida','q3','¿Quiénes descubrieron que Sombra también había infiltrado el Este?','Aleric y Valerius descubrieron la infiltración en el Reino Vampiro del Este.',10,30),
('ruta-de-la-herida','q4','¿Qué verdad esperaba detrás de la Primera Puerta?','El Primer Alfa no había muerto: permanecía encadenado bajo la montaña.',10,40),
('ruta-de-la-herida','q5','¿Qué Alfa quedó atrapado detrás de la Primera Puerta?','Peter quedó atrapado mientras el Primer Alfa volvía a caminar bajo el cielo.',10,50)
)
insert into public.fanclub_challenge_questions(challenge_id,question_key,question,explanation,points,sort_order)
select c.id,s.question_key,s.question,s.explanation,s.points,s.sort_order
from seed s join public.fanclub_challenges c on c.slug=s.challenge_slug
on conflict (challenge_id,question_key) do update set
  question=excluded.question, explanation=excluded.explanation,
  points=excluded.points, sort_order=excluded.sort_order, updated_at=now();

with seed(challenge_slug,question_key,option_key,label,is_correct,sort_order) as (values
('huellas-del-origen','q1','a','A Varkos',false,10),('huellas-del-origen','q1','b','A Gabriel',true,20),('huellas-del-origen','q1','c','A Peter',false,30),('huellas-del-origen','q1','d','A Ethan',false,40),
('huellas-del-origen','q2','a','En una prisión para enemigos',false,10),('huellas-del-origen','q2','b','En un palacio humano',false,20),('huellas-del-origen','q2','c','En un refugio para lobos y humanos sin hogar',true,30),('huellas-del-origen','q2','d','En un puesto comercial',false,40),
('huellas-del-origen','q3','a','Gabriel',true,10),('huellas-del-origen','q3','b','Varkos',false,20),('huellas-del-origen','q3','c','Ethan',false,30),('huellas-del-origen','q3','d','Sehan',false,40),
('huellas-del-origen','q4','a','Peter',false,10),('huellas-del-origen','q4','b','Aleric',false,20),('huellas-del-origen','q4','c','Varkos',true,30),('huellas-del-origen','q4','d','Darien',false,40),
('huellas-del-origen','q5','a','Lo expulsó para siempre',false,10),('huellas-del-origen','q5','b','Lo entregó a los vampiros',false,20),('huellas-del-origen','q5','c','Se negó a destruirlo y le ofreció regresar',true,30),('huellas-del-origen','q5','d','Abandonó la manada',false,40),
('pacto-entre-reinos','q1','a','Valerius',false,10),('pacto-entre-reinos','q1','b','Aleric',true,20),('pacto-entre-reinos','q1','c','Peter',false,30),('pacto-entre-reinos','q1','d','Darien',false,40),
('pacto-entre-reinos','q2','a','Sol Negro',false,10),('pacto-entre-reinos','q2','b','Los Nocturnos',true,20),('pacto-entre-reinos','q2','c','La Guardia del Este',false,30),('pacto-entre-reinos','q2','d','Los Administradores',false,40),
('pacto-entre-reinos','q3','a','Ella',false,10),('pacto-entre-reinos','q3','b','Nine',true,20),('pacto-entre-reinos','q3','c','Gabriel',false,30),('pacto-entre-reinos','q3','d','Aleric',false,40),
('pacto-entre-reinos','q4','a','Peter',true,10),('pacto-entre-reinos','q4','b','Kael',false,20),('pacto-entre-reinos','q4','c','Drakar',false,30),('pacto-entre-reinos','q4','d','Valerius',false,40),
('pacto-entre-reinos','q5','a','A las Tierras Vampiras',false,10),('pacto-entre-reinos','q5','b','A la Ciudadela',false,20),('pacto-entre-reinos','q5','c','A las regiones industriales del Norte',true,30),('pacto-entre-reinos','q5','d','Al bosque de Moonfall',false,40),
('guardianes-del-umbral','q1','a','Tres',false,10),('guardianes-del-umbral','q1','b','Cuatro',false,20),('guardianes-del-umbral','q1','c','Cinco',true,30),('guardianes-del-umbral','q1','d','Siete',false,40),
('guardianes-del-umbral','q2','a','Que Drakar protege la Ciudadela',false,10),('guardianes-del-umbral','q2','b','Que Drakar no dirige realmente la guerra',true,20),('guardianes-del-umbral','q2','c','Que Drakar es un Alfa',false,30),('guardianes-del-umbral','q2','d','Que Drakar abandonó el Norte',false,40),
('guardianes-del-umbral','q3','a','Sobre un antiguo acceso subterráneo',true,10),('guardianes-del-umbral','q3','b','Sobre un reino vampiro',false,20),('guardianes-del-umbral','q3','c','Sobre una aldea humana',false,30),('guardianes-del-umbral','q3','d','Sobre el Corredor Negro',false,40),
('guardianes-del-umbral','q4','a','La Guardia Lobo',false,10),('guardianes-del-umbral','q4','b','Sol Negro',true,20),('guardianes-del-umbral','q4','c','Los humanos del Norte',false,30),('guardianes-del-umbral','q4','d','La Corte Vampira',false,40),
('guardianes-del-umbral','q5','a','El Reino Vampiro',false,10),('guardianes-del-umbral','q5','b','Las Tierras Prohibidas',true,20),('guardianes-del-umbral','q5','c','La Ciudadela',false,30),('guardianes-del-umbral','q5','d','Moonfall Woods',false,40),
('ruta-de-la-herida','q1','a','Chris y Peter',false,10),('ruta-de-la-herida','q1','b','Gabriel y Ethan',true,20),('ruta-de-la-herida','q1','c','Aleric y Valerius',false,30),('ruta-de-la-herida','q1','d','Varkos y Sehan',false,40),
('ruta-de-la-herida','q2','a','Ella, Varkos y Sehan',true,10),('ruta-de-la-herida','q2','b','Chris, Nine y Darien',false,20),('ruta-de-la-herida','q2','c','Gabriel, Ethan y Peter',false,30),('ruta-de-la-herida','q2','d','Aleric, Valerius y Nine',false,40),
('ruta-de-la-herida','q3','a','Gabriel y Ethan',false,10),('ruta-de-la-herida','q3','b','Aleric y Valerius',true,20),('ruta-de-la-herida','q3','c','Ella y Nine',false,30),('ruta-de-la-herida','q3','d','Peter y Darien',false,40),
('ruta-de-la-herida','q4','a','La Ciudadela había sido destruida',false,10),('ruta-de-la-herida','q4','b','El Primer Alfa nunca murió',true,20),('ruta-de-la-herida','q4','c','Aleric controlaba la red',false,30),('ruta-de-la-herida','q4','d','Kael seguía con vida',false,40),
('ruta-de-la-herida','q5','a','Chris',false,10),('ruta-de-la-herida','q5','b','Gabriel',false,20),('ruta-de-la-herida','q5','c','Peter',true,30),('ruta-de-la-herida','q5','d','Gavrik',false,40)
)
insert into public.fanclub_challenge_options(question_id,option_key,label,is_correct,sort_order)
select q.id,s.option_key,s.label,s.is_correct,s.sort_order
from seed s
join public.fanclub_challenges c on c.slug=s.challenge_slug
join public.fanclub_challenge_questions q on q.challenge_id=c.id and q.question_key=s.question_key
on conflict (question_id,option_key) do update set
  label=excluded.label, is_correct=excluded.is_correct, sort_order=excluded.sort_order;

commit;
