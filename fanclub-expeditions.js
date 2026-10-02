/* SANGRE DE LUNA · EXPEDICIONES AUTOMÁTICAS DE LA MANADA */
(()=>{
  'use strict';
  if(window.__SDL_FAN_EXPEDITIONS__)return;
  window.__SDL_FAN_EXPEDITIONS__=true;

  const CFG_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';
  const token=()=>sessionStorage.getItem('sdl_fanclub_token')||'';
  const cleanPath=()=>((location.pathname||'/').replace(/\.html$/,'').replace(/\/+$/,'')||'/');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=d=>{try{return new Intl.DateTimeFormat('es-EC',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Guayaquil'}).format(new Date(d))}catch{return d||''}};
  let sb=null,memberBusy=false,adminBusy=false,sceneTimer=null,sceneCache=new Map();

  async function ensureSupabase(){
    if(sb)return sb;
    if(!window.supabase?.createClient){await new Promise((ok,fail)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=ok;s.onerror=fail;document.head.appendChild(s)})}
    const cfg=await fetch(CFG_URL,{cache:'no-store'}).then(r=>r.json());
    sb=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    return sb;
  }

  function addStyle(){
    if(document.getElementById('sdl-exp-style'))return;
    const s=document.createElement('style');s.id='sdl-exp-style';s.textContent=`
      .sdl-exp{margin-top:26px;padding:24px;border:1px solid #31536d;border-radius:24px;background:radial-gradient(circle at 90% 8%,#16415a55,transparent 28%),linear-gradient(145deg,#07131f,#03090f);box-shadow:0 26px 70px #0008}.sdl-exp-head{display:flex;justify-content:space-between;gap:18px;align-items:end;flex-wrap:wrap}.sdl-exp-head h3{margin:5px 0;font:700 clamp(1.9rem,4vw,3rem) Georgia,serif}.sdl-exp-meta{display:flex;gap:8px;flex-wrap:wrap}.sdl-exp-chip{display:inline-flex;padding:8px 11px;border:1px solid #35617f;border-radius:999px;color:#bfeaff;font-size:.65rem;font-weight:900}.sdl-exp-progress{height:7px;margin:15px 0 20px;border-radius:99px;background:#10283a;overflow:hidden}.sdl-exp-progress i{display:block;height:100%;background:linear-gradient(90deg,#71bce8,#daf4ff);width:var(--p)}.sdl-exp-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.sdl-exp-card{padding:17px;border:1px solid #2b4a61;border-radius:18px;background:#08151f;min-height:210px;display:flex;flex-direction:column}.sdl-exp-card.done{border-color:#3a8067;background:linear-gradient(145deg,#0b211b,#07151b)}.sdl-exp-icon{font-size:1.9rem}.sdl-exp-card h4{margin:9px 0 7px;font:700 1.12rem Georgia,serif}.sdl-exp-card p{margin:0 0 12px;color:#9db2c2;font-size:.8rem;line-height:1.5}.sdl-exp-card .foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}.sdl-exp-points{color:#8ed9ff;font-weight:900;font-size:.68rem}.sdl-exp-done{color:#89dfb8;font-weight:900;font-size:.68rem}.sdl-exp-btn{border:1px solid #5a8ead;border-radius:999px;background:#0c2130;color:#e9f7ff;padding:8px 11px;text-decoration:none;cursor:pointer;font-size:.65rem;font-weight:900}.sdl-exp-quiz{margin-top:14px;padding:16px;border:1px solid #2d4e65;border-radius:16px;background:#050e16}.sdl-exp-q{padding:14px 0;border-top:1px solid #1c3446}.sdl-exp-q:first-child{border-top:0}.sdl-exp-q b{display:block;margin-bottom:9px}.sdl-exp-opt{display:flex;gap:8px;align-items:flex-start;padding:8px 10px;border:1px solid #203c50;border-radius:10px;margin:6px 0;cursor:pointer}.sdl-exp-msg{margin-top:10px;padding:10px 12px;border:1px solid #3b6d58;border-radius:10px;background:#0b2019;color:#a9e8ca;font-size:.77rem}.sdl-exp-msg.err{border-color:#74434b;background:#271015;color:#ffc4cc}.sdl-exp-admin{margin:18px 0;padding:20px;border:1px solid #31536d;border-radius:18px;background:#07131d}.sdl-exp-admin h3{margin:0 0 7px;font:700 1.35rem Georgia,serif}.sdl-exp-admin .note{color:#91a8ba;font-size:.78rem;line-height:1.55}.sdl-exp-settings{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:16px 0}.sdl-exp-settings label{display:grid;gap:5px;color:#8da6b9;font-size:.62rem;font-weight:900;letter-spacing:.05em}.sdl-exp-settings select,.sdl-exp-settings input{width:100%;padding:9px;border:1px solid #2d4c62;border-radius:10px;background:#08141e;color:#eef7ff}.sdl-exp-checks{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0}.sdl-exp-checks label{display:flex;gap:7px;align-items:center;color:#c5d5e1;font-size:.75rem}.sdl-exp-admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.sdl-exp-box{padding:14px;border:1px solid #274459;border-radius:14px;background:#08141e}.sdl-exp-box h4{margin:0 0 8px}.sdl-exp-mini{display:grid;gap:7px}.sdl-exp-mini div{padding:9px;border:1px solid #20394c;border-radius:10px}.sdl-exp-mini small{color:#85a0b4}.sdl-exp-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.sdl-exp-actions button{border:1px solid #47728e;border-radius:999px;background:#0b1d2a;color:#e8f5ff;padding:9px 12px;cursor:pointer;font-size:.66rem;font-weight:900}.sdl-exp-actions button.primary{background:#dff3ff;color:#07101a}.sdl-exp-actions button.good{border-color:#4d8a70;color:#a9e9c8}.sdl-exp-status{color:#8fe0ba;font-weight:900}.sdl-exp-status.wait{color:#e4c37f}.sdl-exp-admin-msg{margin-top:10px;color:#b7d6e9;font-size:.75rem}
      @media(max-width:950px){.sdl-exp-grid{grid-template-columns:1fr}.sdl-exp-settings{grid-template-columns:repeat(2,1fr)}.sdl-exp-admin-grid{grid-template-columns:1fr}}@media(max-width:560px){.sdl-exp-settings{grid-template-columns:1fr}.sdl-exp{padding:18px}}
    `;document.head.appendChild(s);
  }

  async function ensureRotation(){try{await ensureSupabase();await sb.rpc('fanclub_rotation_ensure_current')}catch(e){console.debug('[SDL expediciones ensure]',e.message)}}

  function shuffle(arr){const a=[...(arr||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

  function renderMember(data){
    const portal=document.getElementById('sdlManadaPortal');if(!portal||!data?.rotation)return;
    let host=document.getElementById('sdlExpeditionPanel');
    if(!host){host=document.createElement('section');host.id='sdlExpeditionPanel';host.className='sdl-exp';const w=portal.querySelector('.w');const ach=document.getElementById('sdlAchievementsPanel');ach?w.insertBefore(host,ach):w?.appendChild(host)}
    const total=Number(data.total_count)||0,done=Number(data.completed_count)||0,pct=total?Math.round(done*100/total):0;
    host.innerHTML=`<div class="sdl-exp-head"><div><span class="ey">EXPEDICIÓN ACTIVA</span><h3>${esc(data.rotation.title)}</h3></div><div class="sdl-exp-meta"><span class="sdl-exp-chip">${done}/${total} COMPLETADAS</span><span class="sdl-exp-chip">+${Number(data.earned_points)||0} PUNTOS</span><span class="sdl-exp-chip">HASTA ${esc(fmt(data.rotation.ends_at))}</span></div></div><div class="sdl-exp-progress"><i style="--p:${pct}%"></i></div><div class="sdl-exp-grid">${(data.items||[]).map(item=>memberCard(item)).join('')}</div><div id="sdlExpQuizArea"></div>`;
    host.querySelectorAll('[data-exp-quiz]').forEach(b=>b.onclick=()=>openQuiz(data.items.find(x=>x.id===b.dataset.expQuiz)));
  }

  function memberCard(item){
    const typeLabel=item.item_type==='quiz'?'DESAFÍO':item.item_type==='exploration'?'EXPLORACIÓN':'VIAJE';
    const action=item.completed?`<span class="sdl-exp-done">✓ COMPLETADO</span>`:item.item_type==='quiz'?`<button class="sdl-exp-btn" data-exp-quiz="${item.id}">RESPONDER</button>`:`<a class="sdl-exp-btn" href="${esc(item.href||'/la-manada')}">IR AHORA</a>`;
    return `<article class="sdl-exp-card ${item.completed?'done':''}"><div class="sdl-exp-icon">${esc(item.icon||'🌙')}</div><small>${typeLabel}</small><h4>${esc(item.title)}</h4><p>${esc(item.description||'')}</p><div class="foot"><span class="sdl-exp-points">+${Number(item.points)||0} PUNTOS</span>${action}</div></article>`;
  }

  function openQuiz(item){
    const area=document.getElementById('sdlExpQuizArea');if(!area||!item)return;
    if(item.completed){area.innerHTML='<div class="sdl-exp-msg">Este desafío ya fue superado en la expedición actual.</div>';return}
    const qs=(item.questions||[]).map(q=>({...q,options:shuffle(q.options||[])}));
    area.innerHTML=`<form class="sdl-exp-quiz" id="sdlExpQuizForm"><span class="ey">DESAFÍO CANÓNICO</span><h3>${esc(item.title)}</h3>${qs.map((q,i)=>`<div class="sdl-exp-q"><b>${i+1}. ${esc(q.question)}</b>${q.options.map((o,j)=>`<label class="sdl-exp-opt"><input type="radio" name="q_${q.id}" value="${esc(o)}" ${j===0?'required':''}><span>${esc(o)}</span></label>`).join('')}</div>`).join('')}<div class="sdl-exp-actions"><button class="primary" type="submit">ENVIAR RESPUESTAS</button></div><div id="sdlExpQuizMsg"></div></form>`;
    area.scrollIntoView({behavior:'smooth',block:'start'});
    area.querySelector('#sdlExpQuizForm').onsubmit=e=>submitQuiz(e,item);
  }

  async function submitQuiz(e,item){
    e.preventDefault();const msg=document.getElementById('sdlExpQuizMsg');msg.innerHTML='<div class="sdl-exp-msg">Comprobando respuestas…</div>';
    const answers={};(item.questions||[]).forEach(q=>{const v=e.currentTarget.querySelector(`input[name="q_${q.id}"]:checked`)?.value;if(v!=null)answers[q.id]=v});
    try{await ensureSupabase();const {data,error}=await sb.rpc('fanclub_submit_rotation_quiz',{p_access_token:token(),p_item_id:item.id,p_answers:answers});if(error)throw error;msg.innerHTML=`<div class="sdl-exp-msg ${data.passed?'':'err'}">${data.passed?`✓ Desafío superado · ${data.percent}% · +${data.awarded_points} puntos`:`Resultado: ${data.percent}%. Necesitas 70% para completar el desafío. Puedes intentarlo nuevamente.`}</div>`;if(data.passed){window.SDLAchievements?.refresh?.();setTimeout(()=>refreshMember(true),700)}}catch(err){msg.innerHTML=`<div class="sdl-exp-msg err">${esc(err.message)}</div>`}
  }

  async function refreshMember(force=false){
    if(memberBusy||!token()||cleanPath()!=='/la-manada')return;
    if(!force&&document.getElementById('sdlExpeditionPanel'))return;
    memberBusy=true;try{await ensureSupabase();const {data,error}=await sb.rpc('fanclub_rotation_member_dashboard',{p_access_token:token()});if(error)throw error;renderMember(data)}catch(e){console.debug('[SDL expediciones miembro]',e.message)}finally{memberBusy=false}
  }

  async function recordJourneyVisit(){
    const t=token(),p=cleanPath();if(!t||!['/mapa','/la-manada'].includes(p))return;
    try{await ensureSupabase();const {data}=await sb.from('site_experience_content').select('id,href').eq('content_type','journey_destination').eq('is_published',true).eq('href',p);const dest=(data||[])[0];if(!dest)return;setTimeout(async()=>{try{const {data:r,error}=await sb.rpc('fanclub_record_expedition_activity',{p_access_token:t,p_activity_type:'journey_visit',p_source_id:dest.id});if(error)throw error;if(p==='/la-manada'&&r?.dashboard)renderMember(r.dashboard);window.SDLAchievements?.refresh?.()}catch{}},5000)}catch{}
  }

  async function scenesFor(slug){
    if(!slug)return[];if(sceneCache.has(slug))return sceneCache.get(slug);
    await ensureSupabase();const {data:t}=await sb.from('tour_territories').select('id').eq('slug',slug).eq('is_published',true).eq('status','available').maybeSingle();if(!t)return[];const {data}=await sb.from('tour_scenes').select('id,title,plain_title').eq('territory_id',t.id).eq('is_published',true);const rows=data||[];sceneCache.set(slug,rows);return rows;
  }

  async function trackSceneTitle(title){
    clearTimeout(sceneTimer);if(!token()||!title)return;
    sceneTimer=setTimeout(async()=>{try{const slug=new URLSearchParams(location.search).get('territory');const rows=await scenesFor(slug);const scene=rows.find(x=>x.title===title||x.plain_title===title);if(!scene)return;await sb.rpc('fanclub_record_expedition_activity',{p_access_token:token(),p_activity_type:'tour_scene_visit',p_source_id:scene.id})}catch{}},10000);
  }

  function watchTour(){
    if(cleanPath()!=='/tour'||!token())return;
    const attach=()=>{const title=document.getElementById('s360Title');if(!title||title.dataset.expWatch)return false;title.dataset.expWatch='1';let last='';const check=()=>{const v=title.textContent.trim();if(v&&v!==last){last=v;trackSceneTitle(v)}};new MutationObserver(check).observe(title,{childList:true,subtree:true,characterData:true});check();return true};
    if(attach())return;const o=new MutationObserver(()=>{if(attach())o.disconnect()});o.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>o.disconnect(),30000);
  }

  function adminMarkup(){return `<div class="sdl-exp-admin" id="sdlExpAdmin"><h3>🐺 Expediciones automáticas</h3><p class="note">Configura la rotación de desafíos, exploraciones y viajes. El generador usa únicamente contenido oficial publicado; nunca crea acontecimientos ni datos narrativos fuera del canon.</p><div id="sdlExpAdminBody"><div class="note">Cargando configuración…</div></div></div>`}

  async function injectAdmin(){
    if(new URLSearchParams(location.search).get('admin')!=='1')return;
    const tabs=document.getElementById('fanAdminTabs');if(!tabs||document.getElementById('sdlExpAdminTab'))return;
    const panes=[...document.querySelectorAll('[data-fan-admin-pane]')],anchor=panes.at(-1);if(!anchor)return;
    const tab=document.createElement('button');tab.type='button';tab.id='sdlExpAdminTab';tab.dataset.fanPane='expeditions';tab.textContent='Expediciones';tabs.appendChild(tab);
    const pane=document.createElement('div');pane.className='fanclub-admin-pane hidden';pane.dataset.fanAdminPane='expeditions';pane.innerHTML=adminMarkup();anchor.parentElement.appendChild(pane);
    tab.addEventListener('click',()=>setTimeout(loadAdmin,50));
  }

  function cadenceLabel(v){return({every_3_days:'Cada 3 días',weekly:'Semanal',biweekly:'Cada 2 semanas',monthly:'Mensual',custom:'Personalizada'})[v]||v}
  function modeLabel(v){return({automatic:'Automático',approval:'Automático con aprobación',manual:'Manual'})[v]||v}
  function itemsMini(items){return (items||[]).map(x=>`<div><b>${x.type==='quiz'?'🧠':x.type==='exploration'?'🗺️':'🧭'} ${esc(x.title)}</b><br><small>${esc(x.description||'')} · +${Number(x.points)||0} pts</small></div>`).join('')||'<div><small>Sin actividades.</small></div>'}

  async function loadAdmin(){
    const body=document.getElementById('sdlExpAdminBody');if(!body||adminBusy)return;adminBusy=true;
    try{await ensureSupabase();const {data,error}=await sb.rpc('fanclub_rotation_admin_dashboard');if(error)throw error;renderAdmin(data)}catch(e){body.innerHTML=`<div class="sdl-exp-msg err">${esc(e.message)}</div>`}finally{adminBusy=false}
  }

  function renderAdmin(data){
    const body=document.getElementById('sdlExpAdminBody'),s=data.settings||{},cur=data.current,pen=data.pending;
    body.innerHTML=`<div class="sdl-exp-settings"><label>MODO<select id="expMode"><option value="automatic" ${s.mode==='automatic'?'selected':''}>Automático</option><option value="approval" ${s.mode==='approval'?'selected':''}>Automático con aprobación</option><option value="manual" ${s.mode==='manual'?'selected':''}>Manual</option></select></label><label>FRECUENCIA<select id="expCadence"><option value="every_3_days" ${s.cadence==='every_3_days'?'selected':''}>Cada 3 días</option><option value="weekly" ${s.cadence==='weekly'?'selected':''}>Semanal</option><option value="biweekly" ${s.cadence==='biweekly'?'selected':''}>Cada 2 semanas</option><option value="monthly" ${s.cadence==='monthly'?'selected':''}>Mensual</option><option value="custom" ${s.cadence==='custom'?'selected':''}>Personalizada</option></select></label><label>DÍAS PERSONALIZADOS<input id="expCustom" type="number" min="1" max="90" value="${Number(s.custom_days)||7}"></label><label>DÍA SEMANAL<select id="expWeekday">${['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map((x,i)=>`<option value="${i+1}" ${Number(s.change_weekday)===i+1?'selected':''}>${x}</option>`).join('')}</select></label><label>HORA<input id="expHour" type="number" min="0" max="23" value="${Number(s.change_hour)||0}"></label><label>ANTI-REPETICIÓN · CICLOS<input id="expRepeat" type="number" min="1" max="52" value="${Number(s.anti_repeat_cycles)||12}"></label><label>RETRASO ANTI-SPOILER · DÍAS<input id="expSpoiler" type="number" min="0" max="60" value="${Number(s.spoiler_delay_days)||7}"></label><label>PREGUNTAS POR DESAFÍO<input id="expQuestions" type="number" min="3" max="15" value="${Number(s.questions_per_quiz)||7}"></label><label>PUNTOS · DESAFÍO<input id="expQuizPts" type="number" min="0" max="500" value="${Number(s.points_quiz)||25}"></label><label>PUNTOS · EXPLORACIÓN<input id="expExplorePts" type="number" min="0" max="500" value="${Number(s.points_exploration)||20}"></label><label>PUNTOS · VIAJE<input id="expJourneyPts" type="number" min="0" max="500" value="${Number(s.points_journey)||15}"></label></div><div class="sdl-exp-checks"><label><input id="expQuiz" type="checkbox" ${s.include_quiz?'checked':''}> Desafíos</label><label><input id="expExplore" type="checkbox" ${s.include_exploration?'checked':''}> Exploraciones</label><label><input id="expJourney" type="checkbox" ${s.include_journey?'checked':''}> Viajes</label></div><div class="sdl-exp-actions"><button class="primary" id="expSave">GUARDAR CONFIGURACIÓN</button><button id="expGenerate">GENERAR PROPUESTA AHORA</button>${pen?'<button class="good" id="expPublish">PUBLICAR PROPUESTA</button>':''}</div><div id="sdlExpAdminMsg" class="sdl-exp-admin-msg"></div><div class="sdl-exp-admin-grid"><section class="sdl-exp-box"><h4>Expedición activa</h4>${cur?`<p><span class="sdl-exp-status">● PUBLICADA</span><br><b>${esc(cur.title)}</b><br><small>Finaliza: ${esc(fmt(cur.ends_at))}</small></p><div class="sdl-exp-mini">${itemsMini(cur.items)}</div>`:'<p class="note">No hay una expedición publicada.</p>'}</section><section class="sdl-exp-box"><h4>Próxima propuesta</h4>${pen?`<p><span class="sdl-exp-status wait">● PENDIENTE DE APROBACIÓN</span><br><b>${esc(pen.title)}</b></p><div class="sdl-exp-mini">${itemsMini(pen.items)}</div>`:'<p class="note">No hay una propuesta pendiente.</p>'}</section></div><p class="note" style="margin-top:14px">Modo actual: <b>${esc(modeLabel(s.mode))}</b> · Frecuencia: <b>${esc(cadenceLabel(s.cadence))}</b> · Banco canónico: <b>${Number(data.question_bank_count)||0} preguntas</b> · Próximo cambio: <b>${s.next_rotation_at?esc(fmt(s.next_rotation_at)):'manual'}</b>.</p>`;
    document.getElementById('expSave').onclick=saveAdmin;
    document.getElementById('expGenerate').onclick=generateAdmin;
    document.getElementById('expPublish')?.addEventListener('click',()=>publishAdmin(pen.id));
  }

  function settingsPayload(){return{mode:document.getElementById('expMode').value,cadence:document.getElementById('expCadence').value,custom_days:Number(document.getElementById('expCustom').value),change_weekday:Number(document.getElementById('expWeekday').value),change_hour:Number(document.getElementById('expHour').value),anti_repeat_cycles:Number(document.getElementById('expRepeat').value),spoiler_delay_days:Number(document.getElementById('expSpoiler').value),questions_per_quiz:Number(document.getElementById('expQuestions').value),include_quiz:document.getElementById('expQuiz').checked,include_exploration:document.getElementById('expExplore').checked,include_journey:document.getElementById('expJourney').checked,points_quiz:Number(document.getElementById('expQuizPts').value),points_exploration:Number(document.getElementById('expExplorePts').value),points_journey:Number(document.getElementById('expJourneyPts').value)}}
  function adminMsg(t,err=false){const x=document.getElementById('sdlExpAdminMsg');if(x)x.innerHTML=`<span style="color:${err?'#ffb9c2':'#a9e8ca'}">${esc(t)}</span>`}
  async function saveAdmin(){try{adminMsg('Guardando…');const {data,error}=await sb.rpc('fanclub_rotation_admin_save_settings',{p_settings:settingsPayload()});if(error)throw error;renderAdmin(data);adminMsg('Configuración guardada.')}catch(e){adminMsg(e.message,true)}}
  async function generateAdmin(){try{adminMsg('Generando nueva propuesta canónica…');const {data,error}=await sb.rpc('fanclub_rotation_admin_generate',{p_publish:false});if(error)throw error;renderAdmin(data.dashboard);adminMsg('Propuesta generada. Revísala antes de publicarla.')}catch(e){adminMsg(e.message,true)}}
  async function publishAdmin(id){try{adminMsg('Publicando expedición…');const {data,error}=await sb.rpc('fanclub_rotation_admin_publish',{p_rotation_id:id});if(error)throw error;renderAdmin(data);adminMsg('Expedición publicada.')}catch(e){adminMsg(e.message,true)}}

  function boot(){
    addStyle();ensureRotation();recordJourneyVisit();watchTour();
    const obs=new MutationObserver(()=>{injectAdmin();if(cleanPath()==='/la-manada'&&!document.getElementById('sdlExpeditionPanel'))refreshMember()});
    obs.observe(document.documentElement,{childList:true,subtree:true});injectAdmin();refreshMember();setTimeout(()=>obs.disconnect(),50000);
  }
  window.SDLExpeditions={refresh:()=>refreshMember(true),ensure:ensureRotation};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();