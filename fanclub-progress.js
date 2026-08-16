/* SANGRE DE LUNA · PROGRESO, RANKING Y NOTIFICACIONES */
(()=>{
  'use strict';
  if(window.__SDL_FAN_PROGRESS__)return;
  window.__SDL_FAN_PROGRESS__=true;

  const CFG_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';
  const FN='fanclub-progress-notifications';
  const token=()=>sessionStorage.getItem('sdl_fanclub_token')||'';
  const cleanPath=()=>((location.pathname||'/').replace(/\.html$/,'').replace(/\/+$/,'')||'/');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=d=>{if(!d)return'—';try{return new Intl.DateTimeFormat('es-EC',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Guayaquil'}).format(new Date(d))}catch{return String(d)}};
  let sb=null,cfg=null,memberBusy=false,adminBusy=false,dispatchBusy=false,lastDispatch=0;

  async function ensureSupabase(){
    if(sb)return sb;
    if(!window.supabase?.createClient){await new Promise((ok,fail)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=ok;s.onerror=fail;document.head.appendChild(s)})}
    cfg=await fetch(CFG_URL,{cache:'no-store'}).then(r=>r.json());
    sb=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    return sb;
  }

  function style(){
    if(document.getElementById('sdl-progress-style'))return;
    const s=document.createElement('style');s.id='sdl-progress-style';s.textContent=`
      .sdl-rank{margin-top:26px;padding:24px;border:1px solid #3a5269;border-radius:24px;background:radial-gradient(circle at 10% 0,#203b5838,transparent 34%),linear-gradient(145deg,#07131e,#03090f);box-shadow:0 25px 70px #0007}.sdl-rank-head{display:flex;justify-content:space-between;align-items:end;gap:18px;flex-wrap:wrap}.sdl-rank-head h3{margin:5px 0;font:700 clamp(1.9rem,4vw,2.8rem) Georgia,serif}.sdl-rank-head p{max-width:650px;margin:5px 0;color:#91a8ba;font-size:.82rem}.sdl-rank-me{display:flex;gap:7px;flex-wrap:wrap}.sdl-rank-chip{padding:8px 11px;border:1px solid #355a76;border-radius:999px;color:#c6eaff;font-size:.66rem;font-weight:900}.sdl-rank-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(290px,.75fr);gap:14px;margin-top:18px}.sdl-rank-board,.sdl-rank-prefs{border:1px solid #29475d;border-radius:18px;background:#07131d;padding:16px}.sdl-rank-board h4,.sdl-rank-prefs h4{margin:0 0 10px;font:700 1.2rem Georgia,serif}.sdl-rank-row{display:grid;grid-template-columns:48px 1fr auto auto;gap:10px;align-items:center;padding:11px 8px;border-top:1px solid #1d3447}.sdl-rank-row:first-of-type{border-top:0}.sdl-rank-pos{width:38px;height:38px;display:grid;place-items:center;border:1px solid #315673;border-radius:50%;font-weight:900;color:#a9ddff}.sdl-rank-row.top .sdl-rank-pos{background:#d8eefc;color:#07121b;border-color:#d8eefc}.sdl-rank-name b{display:block}.sdl-rank-name small{color:#8299aa}.sdl-rank-points{font-weight:900;color:#bfe8ff;white-space:nowrap}.sdl-rank-badges{font-size:.68rem;color:#93aabc;white-space:nowrap}.sdl-rank-empty{padding:22px;border:1px dashed #315069;border-radius:14px;text-align:center;color:#879eaf}.sdl-pref{display:grid;gap:5px;margin:12px 0}.sdl-pref label{color:#9eb3c4;font-size:.68rem;font-weight:900}.sdl-pref input[type=text]{width:100%;padding:10px 11px;border:1px solid #315069;border-radius:11px;background:#050d15;color:#eef8ff}.sdl-pref-check{display:flex;gap:9px;align-items:flex-start;margin:12px 0;color:#bfd0dd;font-size:.78rem}.sdl-pref-check input{margin-top:3px}.sdl-pref-note{font-size:.69rem;color:#71899c;line-height:1.5}.sdl-pref-save{border:0;border-radius:999px;padding:10px 14px;background:#dff3ff;color:#07101a;font-weight:900;cursor:pointer}.sdl-pref-msg{margin-top:9px;font-size:.74rem;color:#9de2c2}.sdl-pref-msg.err{color:#ffbdc6}
      .sdl-progress-admin{margin:18px 0;padding:20px;border:1px solid #31516a;border-radius:18px;background:#07131d}.sdl-progress-admin h3{margin:0 0 6px;font:700 1.45rem Georgia,serif}.sdl-progress-admin .note{color:#91a8ba;font-size:.79rem;line-height:1.55}.sdl-prog-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:16px 0}.sdl-prog-stat{padding:14px;border:1px solid #29475d;border-radius:14px;background:#08151f}.sdl-prog-stat small{display:block;color:#7f9aaf;font-size:.62rem;font-weight:900;letter-spacing:.06em}.sdl-prog-stat b{display:block;margin-top:4px;font-size:1.45rem}.sdl-prog-two{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0}.sdl-prog-box{padding:14px;border:1px solid #29475d;border-radius:14px;background:#08151f}.sdl-prog-box h4{margin:0 0 10px;font:700 1.05rem Georgia,serif}.sdl-prog-mini{display:grid;grid-template-columns:34px 1fr auto;gap:8px;align-items:center;padding:8px 0;border-top:1px solid #1d3447;font-size:.75rem}.sdl-prog-mini:first-of-type{border-top:0}.sdl-prog-mini .n{color:#8fd7ff;font-weight:900}.sdl-prog-mini small{color:#7f98aa}.sdl-prog-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:14px 0}.sdl-prog-tools input,.sdl-prog-tools select{padding:9px 10px;border:1px solid #315069;border-radius:10px;background:#07131d;color:#eef8ff}.sdl-prog-table-wrap{overflow:auto;border:1px solid #233d52;border-radius:14px}.sdl-prog-table{width:100%;border-collapse:collapse;min-width:1120px;font-size:.73rem}.sdl-prog-table th,.sdl-prog-table td{padding:9px 8px;border-bottom:1px solid #1a3041;text-align:left;vertical-align:middle}.sdl-prog-table th{position:sticky;top:0;background:#08151f;color:#8fd4ff;font-size:.59rem;letter-spacing:.06em}.sdl-prog-level{display:inline-flex;padding:4px 7px;border:1px solid #355b75;border-radius:999px;color:#bde8ff;font-weight:900;font-size:.61rem}.sdl-prog-up{color:#8ee0b8;font-weight:900}.sdl-prog-muted{color:#7b91a3}.sdl-prog-recent{margin-top:16px}.sdl-prog-recent-row{display:grid;grid-template-columns:42px 1fr auto;gap:9px;align-items:center;padding:9px;border-top:1px solid #1e3547;font-size:.74rem}.sdl-prog-recent-row:first-of-type{border-top:0}.sdl-prog-recent-row .ico{font-size:1.35rem}.sdl-prog-recent-row small{color:#849bad}.sdl-prog-levels{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.sdl-prog-level-count{padding:7px 9px;border:1px solid #294a62;border-radius:999px;color:#a9c8db;font-size:.67rem}
      @media(max-width:900px){.sdl-rank-grid,.sdl-prog-two{grid-template-columns:1fr}.sdl-prog-stats{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.sdl-rank{padding:18px}.sdl-rank-row{grid-template-columns:42px 1fr auto}.sdl-rank-badges{display:none}.sdl-prog-stats{grid-template-columns:1fr 1fr}}
    `;document.head.appendChild(s);
  }

  async function dispatchNotifications(force=false){
    const t=token();if(!t||dispatchBusy)return;
    if(!force&&Date.now()-lastDispatch<15000)return;
    dispatchBusy=true;lastDispatch=Date.now();
    try{await ensureSupabase();await fetch(`${cfg.url}/functions/v1/${FN}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.key},body:JSON.stringify({action:'dispatch',access_token:t}),cache:'no-store'})}catch(e){console.debug('[SDL progreso correo]',e.message)}finally{dispatchBusy=false}
  }

  function rankingRows(rows){
    if(!rows?.length)return'<div class="sdl-rank-empty">Todavía no hay miembros que hayan activado su participación pública en el ranking.</div>';
    return rows.slice(0,20).map(r=>`<div class="sdl-rank-row ${Number(r.position)<=3?'top':''}"><div class="sdl-rank-pos">${Number(r.position)<=3?['🥇','🥈','🥉'][Number(r.position)-1]:Number(r.position)}</div><div class="sdl-rank-name"><b>${esc(r.alias)}</b><small>${esc(r.level||'Iniciado')}</small></div><div class="sdl-rank-points">${Number(r.points)||0} pts</div><div class="sdl-rank-badges">🏅 ${Number(r.badges)||0}</div></div>`).join('');
  }

  function renderMember(data){
    const portal=document.getElementById('sdlManadaPortal');if(!portal)return;
    let host=document.getElementById('sdlRankingPanel');
    if(!host){host=document.createElement('section');host.id='sdlRankingPanel';host.className='sdl-rank';const w=portal.querySelector('.w');const ach=document.getElementById('sdlAchievementsPanel');ach?ach.after(host):w?.appendChild(host)}
    const me=data?.me||{},pos=me.position?`#${me.position}`:'FUERA DEL RANKING';
    host.innerHTML=`<div class="sdl-rank-head"><div><span class="ey">PROGRESO DE LA MANADA</span><h3>Ranking de la Manada</h3><p>Clasificación voluntaria entre miembros. Solo se muestra el alias elegido por cada fan; el correo y los datos personales nunca aparecen en el ranking.</p></div><div class="sdl-rank-me"><span class="sdl-rank-chip">${esc(me.level||'Iniciado')}</span><span class="sdl-rank-chip">${Number(me.points)||0} PUNTOS</span><span class="sdl-rank-chip">${esc(pos)}</span></div></div><div class="sdl-rank-grid"><div class="sdl-rank-board"><h4>🐺 Clasificación general</h4>${rankingRows(data?.ranking||[])}</div><div class="sdl-rank-prefs"><h4>⚙️ Mi privacidad y avisos</h4><p class="sdl-pref-note">Participar en el ranking es opcional. Si lo activas, los demás miembros verán únicamente el alias que escribas aquí, tu rango, puntos e insignias.</p><div class="sdl-pref"><label>ALIAS PÚBLICO DEL RANKING</label><input id="sdlRankAlias" type="text" maxlength="40" value="${esc(me.ranking_alias||'')}" placeholder="Ej.: Lobo del Alba"></div><label class="sdl-pref-check"><input id="sdlRankOpt" type="checkbox" ${me.ranking_opt_in?'checked':''}><span>Aparecer en el Ranking de la Manada.</span></label><label class="sdl-pref-check"><input id="sdlProgressMail" type="checkbox" ${me.progress_email_enabled!==false?'checked':''}><span>Recibir por correo mis ascensos de nivel y logros extraordinarios.</span></label><p class="sdl-pref-note">Los correos son automáticos y solo se envían una vez por cada ascenso o logro destacado. Puedes desactivarlos aquí cuando quieras.</p><button id="sdlRankSave" class="sdl-pref-save" type="button">GUARDAR PREFERENCIAS</button><div id="sdlRankMsg" class="sdl-pref-msg"></div></div></div>`;
    document.getElementById('sdlRankSave').onclick=savePreferences;
  }

  async function refreshMember(force=false){
    if(memberBusy||!token()||cleanPath()!=='/la-manada')return;
    if(!force&&document.getElementById('sdlRankingPanel'))return;
    memberBusy=true;
    try{await ensureSupabase();const {data,error}=await sb.rpc('fanclub_member_ranking',{p_access_token:token()});if(error)throw error;renderMember(data);dispatchNotifications()}catch(e){console.debug('[SDL ranking]',e.message)}finally{memberBusy=false}
  }

  async function savePreferences(){
    const msg=document.getElementById('sdlRankMsg'),opt=document.getElementById('sdlRankOpt')?.checked,alias=document.getElementById('sdlRankAlias')?.value?.trim()||'',mail=document.getElementById('sdlProgressMail')?.checked;
    if(opt&&(alias.length<2||alias.length>40||alias.includes('@'))){msg.textContent='Elige un alias de 2 a 40 caracteres y sin correo electrónico.';msg.classList.add('err');return}
    msg.textContent='Guardando…';msg.classList.remove('err');
    try{await ensureSupabase();const {error}=await sb.rpc('fanclub_member_progress_preferences',{p_access_token:token(),p_ranking_opt_in:!!opt,p_ranking_alias:alias,p_progress_email_enabled:mail!==false});if(error)throw error;msg.textContent='Preferencias actualizadas.';setTimeout(()=>refreshMember(true),350)}catch(e){msg.textContent=e.message||'No se pudieron guardar las preferencias.';msg.classList.add('err')}
  }

  async function injectAdmin(){
    if(new URLSearchParams(location.search).get('admin')!=='1')return;
    const tabs=document.getElementById('fanAdminTabs');if(!tabs||document.getElementById('sdlProgressAdminTab'))return;
    const panes=[...document.querySelectorAll('[data-fan-admin-pane]')],anchor=panes.at(-1);if(!anchor)return;
    const tab=document.createElement('button');tab.type='button';tab.id='sdlProgressAdminTab';tab.dataset.fanPane='progress-manada';tab.textContent='Progreso de la Manada';tabs.appendChild(tab);
    const pane=document.createElement('div');pane.className='fanclub-admin-pane hidden';pane.dataset.fanAdminPane='progress-manada';pane.innerHTML='<div class="sdl-progress-admin" id="sdlProgressAdmin"><h3>📊 Progreso de la Manada</h3><p class="note">Panel de consulta. Los puntos, niveles e insignias son automáticos y no pueden modificarse desde aquí.</p><div id="sdlProgressAdminBody" class="note">Cargando progreso…</div></div>';anchor.parentElement.appendChild(pane);
    tab.addEventListener('click',()=>setTimeout(loadAdmin,60));
  }

  function topMini(rows,key='points'){
    return (rows||[]).slice(0,5).map((m,i)=>`<div class="sdl-prog-mini"><span class="n">${i+1}</span><span><b>${esc(m.display_name)}</b><br><small>${esc(m.level||'Iniciado')} · ${esc(m.member_code||'')}</small></span><b>${Number(m[key])||0} pts</b></div>`).join('')||'<div class="note">Sin datos todavía.</div>';
  }

  function recentBadges(rows){
    return (rows||[]).slice(0,12).map(x=>`<div class="sdl-prog-recent-row"><span class="ico">${esc(x.icon||'🌙')}</span><span><b>${esc(x.badge_name)}</b><br><small>${esc(x.display_name)} · ${esc(x.member_code||'')} · ${esc(x.rarity||'común')}</small></span><small>${esc(fmt(x.awarded_at))}</small></div>`).join('')||'<div class="note">Aún no hay insignias registradas.</div>';
  }

  function renderAdmin(data){
    const host=document.getElementById('sdlProgressAdminBody');if(!host)return;
    const members=Array.isArray(data?.members)?data.members:[],recent=Array.isArray(data?.recent_badges)?data.recent_badges:[],levels=Array.isArray(data?.level_distribution)?data.level_distribution:[];
    const weekly=[...members].sort((a,b)=>(Number(b.weekly_points)||0)-(Number(a.weekly_points)||0)||(Number(b.points)||0)-(Number(a.points)||0));
    const active7=members.filter(m=>Number(m.weekly_points)>0).length,rankingCount=members.filter(m=>m.ranking_opt_in).length;
    host.innerHTML=`<div class="sdl-prog-stats"><div class="sdl-prog-stat"><small>MIEMBROS ACTIVOS</small><b>${members.length}</b></div><div class="sdl-prog-stat"><small>CON AVANCE · 7 DÍAS</small><b>${active7}</b></div><div class="sdl-prog-stat"><small>EN RANKING VOLUNTARIO</small><b>${rankingCount}</b></div><div class="sdl-prog-stat"><small>INSIGNIAS RECIENTES</small><b>${recent.length}</b></div></div><div class="sdl-prog-levels">${levels.map(x=>`<span class="sdl-prog-level-count">${esc(x.level)} · <b>${Number(x.count)||0}</b></span>`).join('')}</div><div class="sdl-prog-two"><section class="sdl-prog-box"><h4>🏆 Quiénes van arriba</h4>${topMini(members,'points')}</section><section class="sdl-prog-box"><h4>📈 Mayor avance · últimos 7 días</h4>${topMini(weekly,'weekly_points')}</section></div><div class="sdl-prog-tools"><input id="sdlProgSearch" type="search" placeholder="Buscar miembro, código o correo"><select id="sdlProgLevel"><option value="">Todos los niveles</option>${[...new Set(members.map(x=>x.level).filter(Boolean))].map(x=>`<option>${esc(x)}</option>`).join('')}</select><select id="sdlProgSort"><option value="points">Ordenar por puntos</option><option value="weekly">Ordenar por avance 7 días</option><option value="badges">Ordenar por insignias</option><option value="recent">Ordenar por actividad reciente</option></select></div><div id="sdlProgTable"></div><section class="sdl-prog-box sdl-prog-recent"><h4>🏅 Insignias obtenidas recientemente</h4>${recentBadges(recent)}</section>`;
    const refreshTable=()=>renderAdminTable(members);
    document.getElementById('sdlProgSearch').oninput=refreshTable;document.getElementById('sdlProgLevel').onchange=refreshTable;document.getElementById('sdlProgSort').onchange=refreshTable;refreshTable();
  }

  function renderAdminTable(source){
    const host=document.getElementById('sdlProgTable');if(!host)return;
    const q=(document.getElementById('sdlProgSearch')?.value||'').trim().toLowerCase(),lev=document.getElementById('sdlProgLevel')?.value||'',sort=document.getElementById('sdlProgSort')?.value||'points';
    let rows=(source||[]).filter(m=>(!lev||m.level===lev)&&(!q||[m.display_name,m.email,m.member_code,m.ranking_alias].some(v=>String(v||'').toLowerCase().includes(q))));
    rows=[...rows].sort((a,b)=>sort==='weekly'?(Number(b.weekly_points)||0)-(Number(a.weekly_points)||0):sort==='badges'?(Number(b.badges)||0)-(Number(a.badges)||0):sort==='recent'?new Date(b.last_activity||0)-new Date(a.last_activity||0):(Number(b.points)||0)-(Number(a.points)||0));
    host.innerHTML=`<div class="sdl-prog-table-wrap"><table class="sdl-prog-table"><thead><tr><th>#</th><th>MIEMBRO</th><th>CORREO</th><th>RANGO</th><th>PUNTOS</th><th>+ 7 DÍAS</th><th>INSIGNIAS</th><th>DESAFÍOS</th><th>EXPLORACIONES</th><th>VIAJES</th><th>RANKING</th><th>CORREOS</th><th>ÚLTIMA ACTIVIDAD</th></tr></thead><tbody>${rows.map((m,i)=>`<tr><td>${i+1}</td><td><b>${esc(m.display_name)}</b><br><span class="sdl-prog-muted">${esc(m.member_code||'')}${m.ranking_alias?` · alias: ${esc(m.ranking_alias)}`:''}</span></td><td>${esc(m.email)}</td><td><span class="sdl-prog-level">${esc(m.level||'Iniciado')}</span></td><td><b>${Number(m.points)||0}</b></td><td class="${Number(m.weekly_points)>0?'sdl-prog-up':''}">+${Number(m.weekly_points)||0}</td><td>${Number(m.badges)||0}</td><td>${Number(m.challenges)||0}</td><td>${Number(m.explorations)||0}</td><td>${Number(m.journeys)||0}</td><td>${m.ranking_opt_in?'✓ Sí':'—'}</td><td>${m.progress_email_enabled!==false?'✓ Activos':'No'}</td><td>${esc(fmt(m.last_activity))}</td></tr>`).join('')}</tbody></table></div>`;
  }

  async function loadAdmin(){
    const host=document.getElementById('sdlProgressAdminBody');if(!host||adminBusy)return;adminBusy=true;
    try{await ensureSupabase();const {data,error}=await sb.rpc('fanclub_progress_admin_dashboard');if(error)throw error;renderAdmin(data)}catch(e){host.innerHTML=`<div class="sdl-pref-msg err">${esc(e.message||'No se pudo cargar el progreso.')}</div>`}finally{adminBusy=false}
  }

  function scheduleProgressCheck(){
    if(!token())return;
    setTimeout(()=>{dispatchNotifications(true);if(cleanPath()==='/la-manada')refreshMember(true)},1800);
  }

  function boot(){
    style();
    const obs=new MutationObserver(()=>{injectAdmin();if(cleanPath()==='/la-manada'&&!document.getElementById('sdlRankingPanel'))refreshMember()});
    obs.observe(document.documentElement,{childList:true,subtree:true});injectAdmin();refreshMember();
    if(token()){setTimeout(()=>dispatchNotifications(true),1800);setInterval(()=>dispatchNotifications(),45000)}
    document.addEventListener('submit',()=>scheduleProgressCheck(),true);
    document.addEventListener('click',e=>{if(e.target.closest?.('#s360Next,#fanVoteBtn,[data-story],[data-episode],[data-exp-quiz],#fanChallengeSubmit'))scheduleProgressCheck()},true);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')dispatchNotifications()});
    setTimeout(()=>obs.disconnect(),60000);
  }

  window.SDLFanProgress={refresh:()=>refreshMember(true),dispatch:()=>dispatchNotifications(true),loadAdmin};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();