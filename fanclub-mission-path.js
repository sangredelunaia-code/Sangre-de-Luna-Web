/* SANGRE DE LUNA · RUTA GUIADA DE MISIONES DE LA MANADA */
(()=>{
  'use strict';
  if(window.__SDL_MISSION_PATH__)return;
  window.__SDL_MISSION_PATH__=true;

  const CFG_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';
  const token=()=>sessionStorage.getItem('sdl_fanclub_token')||'';
  const cleanPath=()=>((location.pathname||'/').replace(/\.html$/,'').replace(/\/+$/,'')||'/');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let sb=null,cfg=null,busy=false,observer=null,refreshTimer=null;

  async function ensureSupabase(){
    if(sb)return sb;
    if(!window.supabase?.createClient){await new Promise((ok,fail)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=ok;s.onerror=fail;document.head.appendChild(s)})}
    cfg=await fetch(CFG_URL,{cache:'no-store'}).then(r=>r.json());
    sb=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    return sb;
  }

  function addStyle(){
    if(document.getElementById('sdl-mission-path-style'))return;
    const s=document.createElement('style');s.id='sdl-mission-path-style';s.textContent=`
      .sdl-mission-shell{margin-top:18px}.sdl-mission-main{position:relative;overflow:hidden;padding:22px;border:1px solid #4b7390;border-radius:20px;background:radial-gradient(circle at 88% 10%,#2873a53b,transparent 32%),linear-gradient(145deg,#0a1c29,#06111a);box-shadow:0 20px 55px #0007,0 0 34px #56b7ef12}.sdl-mission-main:before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(#90dcff,#327daf)}.sdl-mission-ey{display:flex;align-items:center;gap:8px;color:#8edcff;font-size:.66rem;font-weight:900;letter-spacing:.14em}.sdl-mission-main-grid{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:16px;align-items:center;margin-top:13px}.sdl-mission-icon{width:66px;height:66px;display:grid;place-items:center;border:1px solid #4d7692;border-radius:18px;background:#07131d;font-size:2rem}.sdl-mission-main h4{margin:0 0 5px;font:700 clamp(1.35rem,3vw,2rem) Georgia,serif}.sdl-mission-main p{margin:0;color:#abc0cf;font-size:.8rem;line-height:1.55}.sdl-mission-cta{display:inline-flex;align-items:center;justify-content:center;min-width:150px;padding:11px 15px;border:0;border-radius:999px;background:#dff4ff;color:#06121c;text-decoration:none;font-size:.7rem;font-weight:950;cursor:pointer;white-space:nowrap}.sdl-mission-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.sdl-mission-chip{padding:6px 9px;border:1px solid #31546d;border-radius:999px;color:#9bc9e4;font-size:.61rem;font-weight:850}.sdl-route-progress{margin-top:14px;height:8px;border-radius:999px;background:#0e2636;overflow:hidden}.sdl-route-progress i{display:block;height:100%;width:var(--route);background:linear-gradient(90deg,#64bce9,#dff6ff)}
      .sdl-mission-section{margin-top:20px}.sdl-mission-section-head{display:flex;justify-content:space-between;gap:12px;align-items:end;margin-bottom:10px}.sdl-mission-section h4{margin:0;font:700 1.15rem Georgia,serif}.sdl-mission-section-head small{color:#7f9aae;font-size:.67rem}.sdl-mission-secondary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.sdl-mission-card{display:flex;flex-direction:column;min-height:180px;padding:15px;border:1px solid #294a61;border-radius:15px;background:#07131d}.sdl-mission-card .ico{font-size:1.55rem}.sdl-mission-card b{display:block;margin:8px 0 4px;font:700 .98rem Georgia,serif}.sdl-mission-card p{margin:0;color:#91a8b8;font-size:.72rem;line-height:1.45}.sdl-mission-card .foot{margin-top:auto;padding-top:11px}.sdl-mission-card a{display:inline-flex;padding:7px 10px;border:1px solid #47708b;border-radius:999px;color:#d8f2ff;text-decoration:none;font-size:.6rem;font-weight:900}.sdl-mission-card.locked{opacity:.5;filter:saturate(.5)}.sdl-mission-card.locked .foot{color:#7790a2;font-size:.62rem;font-weight:900}.sdl-mission-upcoming{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.sdl-mission-complete{padding:19px;border:1px solid #356e5b;border-radius:17px;background:#0a211b;color:#b9ead5}.sdl-mission-complete b{display:block;font:700 1.25rem Georgia,serif;color:#e5fff3}.sdl-ach-collection-title{margin-top:23px;padding-top:18px;border-top:1px solid #1f3a4d}.sdl-ach-collection-title h4{margin:0;font:700 1.2rem Georgia,serif}.sdl-ach-collection-title p{margin:4px 0 0;color:#8199aa;font-size:.72rem}.sdl-ach-grid.guided{margin-top:12px}.sdl-ach-empty{padding:18px;border:1px dashed #2c4c62;border-radius:14px;color:#7f99aa;text-align:center;font-size:.75rem}
      @media(max-width:900px){.sdl-mission-main-grid{grid-template-columns:auto 1fr}.sdl-mission-main-grid .sdl-mission-cta{grid-column:1/-1;width:100%}.sdl-mission-secondary{grid-template-columns:1fr}.sdl-mission-upcoming{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.sdl-mission-main-grid{grid-template-columns:1fr;text-align:center}.sdl-mission-icon{margin:auto}.sdl-mission-meta{justify-content:center}.sdl-mission-upcoming{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  const season=b=>Number(b?.canon_ref?.season)||0;
  const chapter=b=>Number(String(b?.canon_ref?.chapter_label||'').match(/\d+/)?.[0])||0;
  const direct=b=>['trivia_percent','story_read','episode_watch','tour_complete','challenge_pass'].includes(b?.condition_type);
  const optional=b=>['vote_count','story_season','episode_season','all_challenges'].includes(b?.condition_type);
  const passive=b=>['member_active','progression_level'].includes(b?.condition_type);

  function missionScore(b){
    if(b.badge_key==='guardian-archivo')return 5;
    if(b.condition_type==='story_read')return 100+(season(b)||1)*100+chapter(b);
    if(b.condition_type==='episode_watch')return 160+(season(b)||1)*100+chapter(b);
    if(b.condition_type==='tour_complete')return 520+Number(b.sort_order||0)/1000;
    if(b.condition_type==='challenge_pass')return 650+(season(b)||1)*30+Number(b.sort_order||0)/1000;
    if(b.badge_key==='centinela-archivo')return 900;
    return 1000+Number(b.sort_order||0);
  }

  function missionHref(b){
    const src=encodeURIComponent(b.source_key||'');
    if(b.condition_type==='trivia_percent')return '/la-manada?mision=trivia#trivia';
    if(b.condition_type==='vote_count')return '/la-manada?mision=poll#votaciones';
    if(b.condition_type==='story_read')return `/historias?mision=story&source=${src}`;
    if(b.condition_type==='episode_watch')return `/episodios?mision=episode&source=${src}`;
    if(b.condition_type==='tour_complete')return `/tour?territory=${encodeURIComponent(b?.canon_ref?.slug||'')}&mision=tour`;
    if(b.condition_type==='challenge_pass')return `/la-manada/desafios?mision=challenge&source=${src}`;
    if(b.condition_type==='story_season')return `/historias?mision=story-season&season=${encodeURIComponent(b.source_key||season(b)||'')}`;
    if(b.condition_type==='episode_season')return `/episodios?mision=episode-season&season=${encodeURIComponent(b.source_key||season(b)||'')}`;
    if(b.condition_type==='all_challenges')return '/la-manada/desafios?mision=challenges';
    return '/la-manada';
  }

  function actionLabel(b){
    if(b.condition_type==='trivia_percent')return 'RESPONDER TRIVIA';
    if(b.condition_type==='vote_count')return 'IR A VOTACIÓN';
    if(b.condition_type==='story_read')return 'LEER AHORA';
    if(b.condition_type==='episode_watch')return 'VER EPISODIO';
    if(b.condition_type==='tour_complete')return 'EXPLORAR AHORA';
    if(b.condition_type==='challenge_pass'||b.condition_type==='all_challenges')return 'IR AL DESAFÍO';
    if(b.condition_type==='story_season'||b.condition_type==='episode_season')return 'CONTINUAR TEMPORADA';
    return 'CONTINUAR';
  }

  function missionHint(b){
    if(b.condition_type==='trivia_percent')return `Alcanza al menos ${Number(b.threshold)||0}% en la trivia oficial.`;
    if(b.condition_type==='vote_count')return `Participa en ${Number(b.threshold)||1} votación${Number(b.threshold)===1?'':'es'} oficial${Number(b.threshold)===1?'':'es'}.`;
    if(b.condition_type==='story_read')return `Completa la lectura de ${b?.canon_ref?.chapter_label||'este capítulo'} · ${b?.canon_ref?.title||b.badge_name}.`;
    if(b.condition_type==='episode_watch')return `Mira hasta el final ${b?.canon_ref?.chapter_label||'este episodio'} · ${b?.canon_ref?.title||b.badge_name}.`;
    if(b.condition_type==='tour_complete')return `Completa el recorrido de ${b?.canon_ref?.territory||b.badge_name}.`;
    if(b.condition_type==='challenge_pass')return `Supera ${b?.canon_ref?.title||'el desafío'} con al menos ${Number(b.threshold)||70}%.`;
    if(b.condition_type==='story_season')return `Completa las ${Number(b.threshold)||0} crónicas publicadas de la Temporada ${b.source_key||season(b)}.`;
    if(b.condition_type==='episode_season')return `Completa los ${Number(b.threshold)||0} episodios publicados de la Temporada ${b.source_key||season(b)}.`;
    if(b.condition_type==='all_challenges')return 'Supera todos los desafíos canónicos disponibles.';
    return b.description||'Continúa avanzando dentro de La Manada.';
  }

  function chooseSecondary(unearned,main){
    const pool=unearned.filter(b=>b!==main&&(direct(b)||optional(b)));
    const selected=[],used=new Set(main?[main.category]:[]);
    const priority=[...pool].sort((a,b)=>{
      const ao=optional(a)?0:1,bo=optional(b)?0:1;
      return ao-bo||missionScore(a)-missionScore(b)||Number(a.sort_order||0)-Number(b.sort_order||0);
    });
    for(const b of priority){
      if(selected.length>=3)break;
      const key=b.category||b.condition_type;
      if(used.has(key)&&selected.length<2)continue;
      selected.push(b);used.add(key);
    }
    if(selected.length<3){for(const b of priority){if(selected.length>=3)break;if(!selected.includes(b))selected.push(b)}}
    return selected;
  }

  function missionCard(b,locked=false){
    return `<article class="sdl-mission-card ${locked?'locked':''}"><div class="ico">${locked?'🔒':esc(b.icon||'🌙')}</div><b>${esc(b.badge_name)}</b><p>${esc(missionHint(b))}</p><div class="foot">${locked?'PRÓXIMAMENTE':`<a href="${esc(missionHref(b))}">${esc(actionLabel(b))}</a>`}</div></article>`;
  }

  function earnedCard(b){
    return `<article class="sdl-ach-badge"><div class="ico">${esc(b.icon||'🌙')}</div><b>${esc(b.badge_name)}</b><small>DESBLOQUEADA</small><p>${esc(b.description||'')}</p><span class="sdl-ach-rarity">${esc(String(b.rarity||'comun').replaceAll('_',' '))}</span></article>`;
  }

  function render(data){
    const host=document.getElementById('sdlAchievementsPanel');if(!host)return;
    const catalog=Array.isArray(data?.catalog)?data.catalog:[];
    const earned=catalog.filter(b=>b.earned),unearned=catalog.filter(b=>!b.earned);
    const directAll=catalog.filter(direct),directEarned=directAll.filter(b=>b.earned).length;
    const main=[...unearned.filter(direct)].sort((a,b)=>missionScore(a)-missionScore(b)||Number(a.sort_order||0)-Number(b.sort_order||0))[0]||null;
    const secondary=chooseSecondary(unearned,main);
    const activeSet=new Set([main,...secondary].filter(Boolean).map(b=>b.badge_key));
    const upcoming=[...unearned.filter(b=>(direct(b)||optional(b))&&!activeSet.has(b.badge_key))].sort((a,b)=>missionScore(a)-missionScore(b)||Number(a.sort_order||0)-Number(b.sort_order||0)).slice(0,4);
    const pct=directAll.length?Math.round(directEarned*100/directAll.length):100;
    const mainHtml=main?`<section class="sdl-mission-main"><div class="sdl-mission-ey">🐺 TU SIGUIENTE PASO EN LA MANADA</div><div class="sdl-mission-main-grid"><div class="sdl-mission-icon">${esc(main.icon||'🌙')}</div><div><h4>${esc(main.badge_name)}</h4><p>${esc(missionHint(main))}</p><div class="sdl-mission-meta"><span class="sdl-mission-chip">MISIÓN PRINCIPAL</span><span class="sdl-mission-chip">${esc(String(main.rarity||'comun').replaceAll('_',' ').toUpperCase())}</span></div></div><a class="sdl-mission-cta" href="${esc(missionHref(main))}">${esc(actionLabel(main))}</a></div><div class="sdl-route-progress"><i style="--route:${pct}%"></i></div></section>`:`<section class="sdl-mission-complete"><b>🏆 Ruta principal completada</b>Has cumplido todas las misiones principales disponibles actualmente. Cuando se publique nuevo contenido canónico, la siguiente misión aparecerá aquí automáticamente.</section>`;
    host.dataset.sdlMissionUi='1';
    host.innerHTML=`<div class="sdl-ach-head"><div><span class="ey">RUTA GUIADA DE PROGRESO</span><h3>Mi camino en La Manada</h3></div><div class="sdl-ach-stats"><span class="sdl-ach-stat">RANGO · ${esc(data?.level||'Iniciado')}</span><span class="sdl-ach-stat">${Number(data?.earned_count)||0} DESBLOQUEADAS</span><span class="sdl-ach-stat">RUTA · ${directEarned}/${directAll.length}</span></div></div><div class="sdl-mission-shell">${mainHtml}${secondary.length?`<section class="sdl-mission-section"><div class="sdl-mission-section-head"><h4>🌙 Misiones secundarias</h4><small>Opcionales · puedes realizarlas cuando quieras</small></div><div class="sdl-mission-secondary">${secondary.map(b=>missionCard(b,false)).join('')}</div></section>`:''}${upcoming.length?`<section class="sdl-mission-section"><div class="sdl-mission-section-head"><h4>🔒 Próximas misiones</h4><small>Se irán destacando conforme avances</small></div><div class="sdl-mission-upcoming">${upcoming.map(b=>missionCard(b,true)).join('')}</div></section>`:''}<section class="sdl-ach-collection-title"><h4>🏅 Mi colección de insignias</h4><p>Aquí permanecen todos los logros que ya has desbloqueado.</p></section>${earned.length?`<div class="sdl-ach-grid guided">${earned.map(earnedCard).join('')}</div>`:'<div class="sdl-ach-empty">Aún no has desbloqueado insignias.</div>'}</div>`;
    setTimeout(()=>window.SDLAchievementSharing?.refresh?.(),80);
  }

  async function refresh(force=false){
    if(cleanPath()!=='/la-manada'||!token()||busy)return;
    const host=document.getElementById('sdlAchievementsPanel');if(!host)return;
    if(!force&&host.dataset.sdlMissionUi==='1'&&host.querySelector('.sdl-mission-shell'))return;
    busy=true;
    try{await ensureSupabase();const {data,error}=await sb.rpc('fanclub_member_achievement_dashboard',{p_access_token:token()});if(error)throw error;render(data)}catch(e){console.debug('[SDL ruta de misiones]',e.message)}finally{busy=false}
  }

  const waitFor=(selector,timeout=12000)=>new Promise(resolve=>{const found=document.querySelector(selector);if(found)return resolve(found);const o=new MutationObserver(()=>{const n=document.querySelector(selector);if(n){o.disconnect();resolve(n)}});o.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>{o.disconnect();resolve(null)},timeout)});

  async function openStory(source){
    await ensureSupabase();const {data}=await sb.from('stories').select('id,title,chapter_label,season,sort_order').eq('id',source).eq('is_published',true).maybeSingle();if(!data)return;
    await waitFor('[data-story]');
    const buttons=[...document.querySelectorAll('[data-story]')];
    const target=buttons.find(b=>(b.querySelector('.story-main>b')?.textContent||'').trim()===data.title&&(b.querySelector('.ey')?.textContent||'').includes(data.chapter_label||''))||buttons.find(b=>(b.textContent||'').includes(data.title));
    target?.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>target?.click(),450);
  }

  async function openEpisode(source){
    await ensureSupabase();const {data}=await sb.from('episodes').select('id,title,chapter_label,season,sort_order').eq('id',source).eq('is_published',true).maybeSingle();if(!data)return;
    await waitFor('[data-episode]');
    const tabs=[...document.querySelectorAll('#seasonTabs .tabbtn')],tab=tabs.find(t=>Number((t.textContent||'').match(/\d+/)?.[0])===Number(data.season));if(tab&&!tab.classList.contains('on')){tab.click();await new Promise(r=>setTimeout(r,350))}
    const buttons=[...document.querySelectorAll('[data-episode]')];
    const target=buttons.find(b=>(b.textContent||'').trim()===data.title)||buttons.find(b=>(b.textContent||'').includes(data.title));
    target?.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>target?.click(),450);
  }

  async function openLocalMission(type,source){
    const selectors=type==='trivia'?['#fanTriviaFormPublic','#fanTriviaPublic','#trivia']:type==='poll'?['#fanVoteBtn','#fanPollPublic','#votaciones']:type==='challenge'?[`[data-challenge-id="${CSS.escape(source||'')}"]`,'#fanChallengePublic','#fanChallengesPanel','#fanChallengeList']:['#sdlExpeditionPanel','#sdlAchievementsPanel'];
    for(const selector of selectors){const el=await waitFor(selector,3500);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList?.add('sdl-mission-target');setTimeout(()=>el.classList?.remove('sdl-mission-target'),2400);return}}
  }

  async function deepLink(){
    const q=new URLSearchParams(location.search),type=q.get('mision'),source=q.get('source')||'';if(!type)return;
    const p=cleanPath();
    try{
      if(p==='/historias'&&type==='story'&&source)return openStory(source);
      if(p==='/episodios'&&type==='episode'&&source)return openEpisode(source);
      if(p==='/historias'&&type==='story-season'){const s=Number(q.get('season'));const tabs=[...document.querySelectorAll('#seasonTabs .tabbtn')],tab=tabs.find(t=>Number((t.textContent||'').match(/\d+/)?.[0])===s);tab?.click();return}
      if(p==='/episodios'&&type==='episode-season'){const s=Number(q.get('season'));await waitFor('#seasonTabs');const tabs=[...document.querySelectorAll('#seasonTabs .tabbtn')],tab=tabs.find(t=>Number((t.textContent||'').match(/\d+/)?.[0])===s);tab?.click();return}
      if(p.startsWith('/la-manada'))return openLocalMission(type,source);
    }catch(e){console.debug('[SDL misión directa]',e.message)}
  }

  function boot(){
    addStyle();deepLink();
    observer=new MutationObserver(()=>{
      if(cleanPath()!=='/la-manada'||!token())return;
      clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{const host=document.getElementById('sdlAchievementsPanel');if(host&&(!host.dataset.sdlMissionUi||!host.querySelector('.sdl-mission-shell')))refresh(true)},120);
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>refresh(true),700);setTimeout(()=>refresh(),2200);
  }

  window.SDLMissionPath={refresh:()=>refresh(true),deepLink};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();