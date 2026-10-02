/* SANGRE DE LUNA · INSIGNIAS CANÓNICAS AUTOMÁTICAS */
(()=>{
  'use strict';
  if(window.__SDL_FAN_ACHIEVEMENTS__)return;
  window.__SDL_FAN_ACHIEVEMENTS__=true;

  const CFG_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';
  const token=()=>sessionStorage.getItem('sdl_fanclub_token')||'';
  const path=()=>((location.pathname||'/').replace(/\.html$/,'').replace(/\/+$/,'')||'/');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  let sb=null,cfg=null,stories=null,episodes=null,territories=null,storyWatch=null,ytReady=null,currentEpisode=null,panelBusy=false;

  async function ensureSupabase(){
    if(sb)return sb;
    if(!window.supabase?.createClient){await new Promise((ok,fail)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=ok;s.onerror=fail;document.head.appendChild(s)})}
    cfg=await fetch(CFG_URL,{cache:'no-store'}).then(r=>r.json());
    sb=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    return sb;
  }

  function style(){if(document.getElementById('sdl-ach-style'))return;const s=document.createElement('style');s.id='sdl-ach-style';s.textContent=`
    .sdl-ach-toast{position:fixed;right:18px;bottom:88px;z-index:26000;width:min(390px,calc(100vw - 36px));padding:18px;border:1px solid #85d6ff88;border-radius:18px;background:linear-gradient(145deg,#091a28f7,#03090ff7);box-shadow:0 24px 70px #000c,0 0 28px #62c7ff25;color:#eef8ff;animation:sdlAchIn .45s ease both}.sdl-ach-toast .icon{font-size:2rem}.sdl-ach-toast small{display:block;color:#89d4ff;font-size:.62rem;font-weight:900;letter-spacing:.16em}.sdl-ach-toast b{display:block;margin:4px 0;font:700 1.25rem Georgia,serif}.sdl-ach-toast p{margin:0;color:#a9bdcc;font-size:.82rem}@keyframes sdlAchIn{from{opacity:0;transform:translateY(18px) scale(.96)}}
    .sdl-ach-panel{margin-top:28px;padding:22px;border:1px solid #294a62;border-radius:22px;background:linear-gradient(145deg,#07131e,#03090f);box-shadow:0 20px 60px #0006}.sdl-ach-head{display:flex;justify-content:space-between;gap:18px;align-items:end;flex-wrap:wrap}.sdl-ach-head h3{margin:5px 0;font:700 clamp(1.8rem,4vw,2.7rem) Georgia,serif}.sdl-ach-stats{display:flex;gap:8px;flex-wrap:wrap}.sdl-ach-stat{padding:8px 11px;border:1px solid #2d506a;border-radius:999px;color:#bfe8ff;font-size:.72rem;font-weight:900}.sdl-ach-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:18px}.sdl-ach-badge{min-height:154px;padding:15px;border:1px solid #29475d;border-radius:16px;background:#07131d}.sdl-ach-badge.locked{opacity:.48;filter:saturate(.45)}.sdl-ach-badge .ico{font-size:1.7rem}.sdl-ach-badge b{display:block;margin:8px 0 4px;font:700 1rem Georgia,serif}.sdl-ach-badge small{color:#829aad;font-size:.66rem}.sdl-ach-badge p{margin:7px 0 0;color:#9cafbd;font-size:.75rem;line-height:1.45}.sdl-ach-rarity{display:inline-block;margin-top:7px;color:#8fd8ff;font-size:.58rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
    .sdl-ach-admin{margin:18px 0;padding:18px;border:1px solid #31516a;border-radius:16px;background:#07131d}.sdl-ach-admin h3{margin:0 0 6px;font:700 1.3rem Georgia,serif}.sdl-ach-admin-note{color:#91a8ba;font-size:.8rem;margin-bottom:14px}.sdl-ach-table{width:100%;border-collapse:collapse;font-size:.76rem}.sdl-ach-table th,.sdl-ach-table td{padding:9px 8px;border-bottom:1px solid #1d3447;text-align:left;vertical-align:top}.sdl-ach-table th{color:#8fd4ff;font-size:.62rem;letter-spacing:.07em}.sdl-ach-auto{color:#88dfbb;font-weight:900}.sdl-ach-source{color:#90a6b7}
    @media(max-width:900px){.sdl-ach-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.sdl-ach-grid{grid-template-columns:1fr}.sdl-ach-toast{bottom:76px}}
  `;document.head.appendChild(s)}

  function showAwards(list){
    if(!Array.isArray(list)||!list.length)return;
    let i=0;
    const next=()=>{document.querySelector('.sdl-ach-toast')?.remove();const b=list[i++];if(!b)return;const el=document.createElement('div');el.className='sdl-ach-toast';el.innerHTML=`<div class="icon">${esc(b.icon||'🌙')}</div><small>NUEVA INSIGNIA DESBLOQUEADA</small><b>${esc(b.badge_name||'Insignia de La Manada')}</b><p>${esc(b.description||'Tu progreso dentro de La Manada ha sido reconocido.')}</p>`;document.body.appendChild(el);setTimeout(()=>{el.remove();next()},4800)};
    next();
  }

  async function record(activity,sourceId){
    const t=token();if(!t||!sourceId)return null;
    try{await ensureSupabase();const {data,error}=await sb.rpc('fanclub_record_activity',{p_access_token:t,p_activity_type:activity,p_source_id:sourceId});if(error)throw error;showAwards(data?.new_badges);refreshMemberPanel(true);return data}catch(e){console.debug('[SDL insignias]',e.message);return null}
  }
  window.SDLAchievements={record,showAwards};

  async function loadContentMaps(){
    await ensureSupabase();
    if(!stories){const r=await sb.from('stories').select('id,season,chapter_label,title,sort_order,body').eq('is_published',true).order('season').order('sort_order');stories=r.data||[]}
    if(!episodes){const r=await sb.from('episodes').select('id,season,chapter_label,title,sort_order,youtube_id').eq('is_published',true).order('season').order('sort_order');episodes=r.data||[]}
    if(!territories){const r=await sb.from('tour_territories').select('id,slug,name,status').eq('is_published',true);territories=r.data||[]}
  }

  function beginStoryRead(story,body){
    if(!token()||!story?.id||!body)return;
    storyWatch?.cleanup?.();
    let done=false,timer=null;
    const readerOpen=()=>document.getElementById('storyModal')?.classList.contains('open');
    const cleanup=()=>{body.removeEventListener('scroll',check);if(timer)clearTimeout(timer)};
    const complete=()=>{if(done||!readerOpen())return;done=true;cleanup();record('story_read',story.id)};
    const check=()=>{if(done||!readerOpen())return;const max=body.scrollHeight-body.clientHeight;if(max>18&&body.scrollTop/max>=.93)complete()};
    body.addEventListener('scroll',check,{passive:true});
    timer=setTimeout(()=>{if(readerOpen()&&body.scrollHeight<=body.clientHeight+18)complete()},18000);
    storyWatch={cleanup};
  }

  async function identifyStory(button){
    await loadContentMaps();
    const idx=Number(button.dataset.story);if(Number.isFinite(idx)&&stories[idx])return stories[idx];
    const title=button.querySelector('.story-main>b')?.textContent?.trim(),ch=button.querySelector('.ey')?.textContent?.trim();
    return stories.find(x=>x.title===title&&x.chapter_label===ch)||null;
  }

  function loadYT(){
    if(window.YT?.Player)return Promise.resolve(window.YT);if(ytReady)return ytReady;
    ytReady=new Promise(resolve=>{const old=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{try{old?.()}catch{}resolve(window.YT)};if(!document.querySelector('script[data-sdl-yt-api]')){const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.dataset.sdlYtApi='1';document.head.appendChild(s)}});
    return ytReady;
  }

  async function watchEpisode(episode){
    if(!token()||!episode?.id)return;currentEpisode=episode;
    try{const YT=await loadYT();setTimeout(()=>{const frame=document.getElementById('videoFrame');if(!frame||currentEpisode?.id!==episode.id||!frame.src)return;const u=new URL(frame.src);u.searchParams.set('enablejsapi','1');u.searchParams.set('origin',location.origin);frame.src=u.toString();setTimeout(()=>{try{new YT.Player(frame,{events:{onStateChange:e=>{if(e.data===YT.PlayerState.ENDED&&currentEpisode?.id===episode.id)record('episode_watch',episode.id)}}})}catch(e){console.debug('[SDL insignias YouTube]',e.message)}},650)},180)}catch(e){console.debug('[SDL insignias YouTube]',e.message)}
  }

  async function identifyEpisode(button){
    await loadContentMaps();
    const row=button.closest('.erow'),chapter=row?.querySelector('.ech')?.textContent?.trim(),title=button.textContent?.trim(),active=document.querySelector('#seasonTabs .tabbtn.on')?.textContent||'',season=Number(active.match(/\d+/)?.[0]);
    return episodes.find(x=>(!season||x.season===season)&&x.chapter_label===chapter&&x.title===title)||episodes.find(x=>x.title===title&&x.chapter_label===chapter)||null;
  }

  async function recordTourIfFinished(){
    if(!token()||path()!=='/tour')return;
    await new Promise(r=>setTimeout(r,60));
    const final=document.getElementById('s360Final');if(!final||final.hidden)return;
    await loadContentMaps();const slug=new URLSearchParams(location.search).get('territory'),t=territories.find(x=>x.slug===slug);if(t?.id)record('tour_complete',t.id);
  }

  async function recordVoteIfSucceeded(){
    if(!token())return;
    for(let i=0;i<25;i++){await new Promise(r=>setTimeout(r,180));const m=document.getElementById('fanVoteMsg');if(/voto fue registrado/i.test(m?.textContent||'')){try{await ensureSupabase();const now=Date.now(),{data:polls}=await sb.from('fanclub_polls').select('id,status,starts_at,ends_at').eq('status','published').order('sort_order');const poll=(polls||[]).find(p=>(!p.starts_at||new Date(p.starts_at).getTime()<=now)&&(!p.ends_at||new Date(p.ends_at).getTime()>=now)),voter=localStorage.getItem('sdl_fan_voter');if(!poll||!voter)return;const {data,error}=await sb.rpc('fanclub_record_poll_vote',{p_access_token:token(),p_poll_id:poll.id,p_voter_key:voter});if(!error){showAwards(data?.new_badges);refreshMemberPanel(true)}}catch{}return}if(/error|no válido|ya participaste/i.test(m?.textContent||''))return}
  }

  async function gradeTriviaAsMember(form){
    if(!token()||!form)return;
    try{await ensureSupabase();const answers={};form.querySelectorAll('input[type="radio"]:checked').forEach(o=>{const name=o.name||'';if(name.startsWith('tq_'))answers[name.slice(3)]=o.value});if(!Object.keys(answers).length)return;const {data,error}=await sb.rpc('fanclub_grade_trivia_member',{p_access_token:token(),p_answers:answers});if(!error){showAwards(data?.new_badges);refreshMemberPanel(true)}}catch{}
  }

  document.addEventListener('click',async e=>{
    if(e.target.closest?.('#storyModal .close'))storyWatch?.cleanup?.();
    const story=e.target.closest?.('[data-story]');if(story&&token()){const s=await identifyStory(story);setTimeout(()=>beginStoryRead(s,document.getElementById('storyReaderBody')),120)}
    const ep=e.target.closest?.('[data-episode]');if(ep&&token()){const x=await identifyEpisode(ep);watchEpisode(x)}
    if(e.target.closest?.('#s360Next'))recordTourIfFinished();
    if(e.target.closest?.('#fanVoteBtn'))recordVoteIfSucceeded();
  },true);
  document.addEventListener('submit',e=>{if(e.target?.id==='fanTriviaFormPublic'&&token())setTimeout(()=>gradeTriviaAsMember(e.target),60)},true);

  async function refreshMemberPanel(force=false){
    if(panelBusy||!token()||path()!=='/la-manada')return;
    const portal=document.getElementById('sdlManadaPortal');if(!portal)return;
    if(!force&&document.getElementById('sdlAchievementsPanel'))return;
    panelBusy=true;
    try{await ensureSupabase();const {data,error}=await sb.rpc('fanclub_member_achievement_dashboard',{p_access_token:token()});if(error)throw error;let host=document.getElementById('sdlAchievementsPanel');if(!host){host=document.createElement('section');host.id='sdlAchievementsPanel';host.className='sdl-ach-panel';portal.querySelector('.w')?.appendChild(host)}const catalog=Array.isArray(data?.catalog)?data.catalog:[];host.innerHTML=`<div class="sdl-ach-head"><div><span class="ey">PROGRESO AUTOMÁTICO</span><h3>Mis insignias de La Manada</h3></div><div class="sdl-ach-stats"><span class="sdl-ach-stat">RANGO · ${esc(data?.level||'Iniciado')}</span><span class="sdl-ach-stat">${Number(data?.earned_count)||0} DESBLOQUEADAS</span></div></div><div class="sdl-ach-grid">${catalog.map(b=>`<article class="sdl-ach-badge ${b.earned?'':'locked'}"><div class="ico">${b.earned?esc(b.icon||'🌙'):'🔒'}</div><b>${esc(b.badge_name)}</b><small>${b.earned?'DESBLOQUEADA':'PENDIENTE'}</small><p>${esc(b.description||'')}</p><span class="sdl-ach-rarity">${esc(String(b.rarity||'comun').replaceAll('_',' '))}</span></article>`).join('')}</div>`}
    catch(e){console.debug('[SDL insignias panel]',e.message)}finally{panelBusy=false}
  }

  async function injectAdmin(){
    if(new URLSearchParams(location.search).get('admin')!=='1')return;
    const tabs=document.getElementById('fanAdminTabs');if(!tabs||document.getElementById('sdlAchAdminTab'))return;
    const panes=[...document.querySelectorAll('[data-fan-admin-pane]')],anchor=panes.at(-1);if(!anchor)return;
    const tab=document.createElement('button');tab.type='button';tab.id='sdlAchAdminTab';tab.dataset.fanPane='badges-auto';tab.textContent='Insignias automáticas';tabs.appendChild(tab);
    const pane=document.createElement('div');pane.className='fanclub-admin-pane hidden';pane.dataset.fanAdminPane='badges-auto';pane.innerHTML='<div class="sdl-ach-admin" id="sdlAchAdmin"><h3>🌙 Insignias automáticas</h3><p class="sdl-ach-admin-note">Cargando catálogo canónico…</p></div>';anchor.parentElement.appendChild(pane);
    tab.addEventListener('click',()=>setTimeout(loadAdminBadges,50));
  }

  async function loadAdminBadges(){
    const host=document.getElementById('sdlAchAdmin');if(!host)return;
    try{await ensureSupabase();const {data,error}=await sb.from('fanclub_badge_catalog').select('*').order('sort_order').order('badge_name');if(error)throw error;const rows=data||[];host.innerHTML=`<h3>🌙 Insignias automáticas</h3><p class="sdl-ach-admin-note"><strong>${rows.filter(x=>x.is_active).length} insignias activas.</strong> El catálogo se sincroniza automáticamente al publicar o actualizar historias, episodios, desafíos, niveles y territorios. No existe asignación manual: cada insignia se obtiene únicamente al cumplir su condición.</p><div style="overflow:auto"><table class="sdl-ach-table"><thead><tr><th>INSIGNIA</th><th>CATEGORÍA</th><th>RAREZA</th><th>ORIGEN CANÓNICO</th><th>CONDICIÓN</th><th>ESTADO</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.icon)} <b>${esc(x.badge_name)}</b><br><span class="sdl-ach-source">${esc(x.description||'')}</span></td><td>${esc(x.category)}</td><td>${esc(x.rarity)}</td><td>${esc(x.source_type||'sistema')}${x.canon_ref?.title?` · ${esc(x.canon_ref.title)}`:''}${x.canon_ref?.territory?` · ${esc(x.canon_ref.territory)}`:''}</td><td>${esc(x.condition_type)}${Number(x.threshold)>1?` · ${x.threshold}`:''}</td><td class="${x.is_active?'sdl-ach-auto':''}">${x.is_active?'● AUTOMÁTICA':'OCULTA'}</td></tr>`).join('')}</tbody></table></div>`}
    catch(e){host.innerHTML=`<h3>🌙 Insignias automáticas</h3><p class="sdl-ach-admin-note">${esc(e.message)}</p>`}
  }

  function boot(){
    style();
    const obs=new MutationObserver(()=>{injectAdmin();if(!document.getElementById('sdlAchievementsPanel'))refreshMemberPanel()});
    obs.observe(document.documentElement,{childList:true,subtree:true});
    injectAdmin();refreshMemberPanel();
    setTimeout(()=>obs.disconnect(),45000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();