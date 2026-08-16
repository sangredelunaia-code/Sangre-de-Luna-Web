/* SANGRE DE LUNA · UNIVERSO Y EXPERIENCIA
   Capa editorial para guía de inicio, novedades, cronología, relaciones,
   territorios, Mi Viaje, progresión de La Manada, Cronista y PWA. */
(()=>{
  'use strict';
  if(window.__SDL_UNIVERSE_EXPERIENCE__) return;
  window.__SDL_UNIVERSE_EXPERIENCE__=true;

  const CFG_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';
  const TABLE='site_experience_content';
  const BUCKET='experience-media';
  const LAST_KEY='sdlx-last-action-v1';
  const CHAPTER_KEY='sdlx-last-chapter-v1';
  const ITINERARY_KEY='sdlx-itinerary-v1';
  const PASSPORT_KEY='sdlx-passport-v1';
  const CRONISTA_MODE_KEY='sdl-cronista-mode-v2';
  const cleanPath=()=>{let p=(location.pathname||'/').replace(/\/+$/,'')||'/';return p.replace(/\.html$/,'')||'/'};
  const path=cleanPath();
  const isAdmin=new URLSearchParams(location.search).get('admin')==='1';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeName=value=>String(value||'archivo').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,90)||'archivo';
  const parseJSON=(value,fallback)=>{try{return JSON.parse(value)}catch{return fallback}};
  const getMeta=(row,key,fallback='')=>row?.meta?.[key]??fallback;
  const typeLabels={
    start_path:'Guía de inicio',news:'Novedades',timeline:'Línea del tiempo',relationship:'Relaciones',
    tour_territory:'Territorios 360°',journey_destination:'Mi Viaje / destinos',cronista_mode:'Cronista',progression_level:'Niveles de La Manada'
  };
  const typeHelp={
    start_path:['Texto del botón','cta','Icono','icon','Nota / etiqueta','tag'],
    news:['Etiqueta','tag','Texto del botón','cta','Destacado (sí/no)','featured'],
    timeline:['Temporada','season','Capítulo','chapter','Era / bloque','era'],
    relationship:['Personaje A','source','Personaje B','target','Tipo de vínculo','relation'],
    tour_territory:['Estado (available / coming_soon)','status','Texto del botón','cta','Región','region'],
    journey_destination:['Región','region','Icono','icon','Estado','status'],
    cronista_mode:['Modo (safe / upto / full)','mode','Etiqueta corta','label','Límite opcional','limit'],
    progression_level:['Puntos mínimos','min_points','Icono','icon','Orden visual','rank']
  };
  let sb=null;
  let rows=[];
  let installPrompt=null;

  function addCoreStyle(){
    if(document.getElementById('sdlx-style'))return;
    const style=document.createElement('style');style.id='sdlx-style';style.textContent=`
      .sdlx-section{position:relative;padding:58px 0;border-top:1px solid #1c3042;background:linear-gradient(180deg,#040b12,#06101a);color:#edf7ff;overflow:hidden}
      .sdlx-section:before{content:'';position:absolute;inset:auto -10% 55% 45%;height:260px;background:radial-gradient(circle,#70caff12,transparent 68%);pointer-events:none}
      .sdlx-w{position:relative;width:min(1160px,94%);margin:auto}.sdlx-kicker{color:#d9ad64;font-size:.68rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.sdlx-title{margin:7px 0 8px;font:500 clamp(2rem,5vw,3.7rem)/1 Georgia,serif;color:#f1eadf}.sdlx-lead{max-width:720px;margin:0 0 24px;color:#aebed0;line-height:1.65}
      .sdlx-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.sdlx-card{position:relative;min-height:215px;padding:21px;border:1px solid #3e566b;border-radius:18px;background:linear-gradient(145deg,#0b1824,#06101a);box-shadow:0 18px 45px #0005;color:#eef7ff;display:flex;flex-direction:column;overflow:hidden}.sdlx-card.has-image{background:linear-gradient(180deg,#02060b25,#02060bea),var(--sdlx-img) center/cover}.sdlx-card .sdlx-icon{font-size:1.35rem;color:#e0b871}.sdlx-card small{color:#9ccff1;font-size:.62rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.sdlx-card h3{margin:8px 0 7px;font:600 1.4rem Georgia,serif}.sdlx-card p{margin:0 0 18px;color:#b8c6d3;line-height:1.55;font-size:.88rem}.sdlx-card.has-image p{color:#e0e7ed}.sdlx-card a,.sdlx-card button,.sdlx-pill{margin-top:auto;align-self:flex-start;border:1px solid #557089;border-radius:999px;background:#0b1b29d9;color:#dff2ff;padding:9px 13px;font-size:.67rem;font-weight:900;letter-spacing:.08em;text-decoration:none;cursor:pointer}.sdlx-card a:hover,.sdlx-card button:hover{border-color:#c9eaff;color:#fff}.sdlx-card.disabled{opacity:.78}.sdlx-card.disabled button{cursor:default;color:#99a8b7}
      .sdlx-continue{display:grid;grid-template-columns:1fr auto;align-items:center;gap:18px;margin:0 auto 18px;padding:18px 20px;border:1px solid #8d6b38;border-radius:18px;background:linear-gradient(135deg,#101b26,#17130d);box-shadow:0 16px 44px #0005}.sdlx-continue strong{display:block;font:600 1.25rem Georgia,serif}.sdlx-continue span{color:#aab9c8;font-size:.8rem}.sdlx-continue a{border:1px solid #b78a49;border-radius:999px;padding:10px 15px;color:#f1ddb8;text-decoration:none;font-size:.68rem;font-weight:900;letter-spacing:.08em}.sdlx-news{margin-top:42px}.sdlx-news .sdlx-card{min-height:180px}
      .sdlx-timeline{position:relative;display:grid;gap:0;margin-top:24px}.sdlx-time-item{position:relative;display:grid;grid-template-columns:130px 22px 1fr;gap:16px;padding:0 0 24px}.sdlx-time-item:before{content:'';position:absolute;left:140px;top:20px;bottom:-4px;width:1px;background:#426075}.sdlx-time-item:last-child:before{display:none}.sdlx-time-dot{width:15px;height:15px;margin-top:5px;border:2px solid #bfe8ff;border-radius:50%;background:#0a1925;box-shadow:0 0 15px #75cfff55}.sdlx-time-meta{color:#d5ab68;font-size:.67rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.sdlx-time-copy{padding:0 0 2px}.sdlx-time-copy button{border:0;background:none;color:#f0f5f8;padding:0;text-align:left;font:600 1.2rem Georgia,serif;cursor:pointer}.sdlx-time-copy p{display:none;margin:7px 0 0;color:#9fb0bf;line-height:1.6}.sdlx-time-item.open p{display:block}
      .sdlx-rel-shell{display:grid;grid-template-columns:minmax(230px,.7fr) 1.3fr;gap:18px;margin-top:22px}.sdlx-node-cloud,.sdlx-rel-detail{border:1px solid #314b5f;border-radius:20px;background:#07121c;padding:18px}.sdlx-node-cloud{display:flex;align-content:flex-start;flex-wrap:wrap;gap:9px}.sdlx-node{border:1px solid #4a6a81;border-radius:999px;background:#0b1b29;color:#dff1ff;padding:9px 12px;cursor:pointer;font-size:.76rem;font-weight:800}.sdlx-node.on{background:#d7effd;color:#06111b;border-color:#d7effd}.sdlx-rel-list{display:grid;gap:10px}.sdlx-rel{padding:13px;border-left:2px solid #d0a763;background:#0a1824;border-radius:0 12px 12px 0}.sdlx-rel b{display:block;font:600 1rem Georgia,serif}.sdlx-rel small{color:#d4ac68}.sdlx-rel p{margin:5px 0 0;color:#9fb0bf;font-size:.8rem}
      .sdlx-manada-progress{margin:28px auto;padding:20px;border:1px solid #4a6073;border-radius:20px;background:linear-gradient(145deg,#0a1722,#071019);color:#eef7ff}.sdlx-rank-head{display:flex;justify-content:space-between;gap:18px;align-items:end}.sdlx-rank-head h3{margin:3px 0;font:600 2rem Georgia,serif;color:#e6c77e}.sdlx-rank-stats{display:flex;gap:18px}.sdlx-rank-stats div{text-align:right}.sdlx-rank-stats b{display:block;font-size:1.15rem}.sdlx-rank-stats small{color:#8799aa;font-size:.62rem}.sdlx-meter{height:8px;margin:16px 0 7px;background:#ffffff12;border-radius:99px;overflow:hidden}.sdlx-meter i{display:block;height:100%;width:var(--p);background:linear-gradient(90deg,#87d2ff,#e3c776)}.sdlx-levels{display:flex;justify-content:space-between;gap:8px;color:#8ea0b2;font-size:.64rem}.sdlx-levels .on{color:#e8ca81;font-weight:900}
      .sdlx-journey-launch{position:fixed;left:18px;bottom:18px;z-index:11000;border:1px solid #b9dccc55;border-radius:999px;background:#071610ea;color:#edf7f1;padding:11px 15px;box-shadow:0 14px 35px #0008;cursor:pointer;font-size:.7rem;font-weight:900;letter-spacing:.07em}.sdlx-route-modal{position:fixed;inset:0;z-index:16000;display:none;place-items:center;padding:18px;background:#010403e8;backdrop-filter:blur(16px)}.sdlx-route-modal.open{display:grid}.sdlx-route-box{width:min(980px,96vw);max-height:90svh;overflow:auto;border:1px solid #9bd0bb4a;border-radius:22px;background:linear-gradient(145deg,#0a1814,#040a08);padding:24px;color:#eef7f2}.sdlx-route-head{display:flex;justify-content:space-between;gap:16px;align-items:start}.sdlx-route-head h2{margin:4px 0;font:500 2.2rem Georgia,serif}.sdlx-route-close{width:38px;height:38px;border:1px solid #78998b55;border-radius:50%;background:#07130f;color:#fff;cursor:pointer}.sdlx-route-layout{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}.sdlx-destinations,.sdlx-itinerary{display:grid;gap:9px}.sdlx-destination,.sdlx-route-stop{padding:13px;border:1px solid #75988935;border-radius:14px;background:#07110e}.sdlx-destination{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center}.sdlx-destination i{font-style:normal;font-size:1.3rem}.sdlx-destination b,.sdlx-route-stop b{display:block}.sdlx-destination small,.sdlx-route-stop small{color:#91a59b}.sdlx-destination button,.sdlx-route-stop button{border:1px solid #75988955;border-radius:999px;background:transparent;color:#dff0e7;padding:7px 10px;cursor:pointer;font-size:.62rem}.sdlx-route-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.sdlx-stamp{color:#e6d29a!important;border-color:#b79c59!important}.sdlx-passport{margin-top:18px;padding:16px;border:1px solid #aa985c4a;border-radius:16px;background:#1a170d55}.sdlx-stamps{display:flex;gap:8px;flex-wrap:wrap;margin-top:9px}.sdlx-stamps span{padding:8px 10px;border:1px dashed #c8ad65;border-radius:10px;color:#dec888;font-size:.7rem}
      .sdlx-cronista-select{max-width:155px;height:34px;border:1px solid #36566f;border-radius:10px;background:#08141f;color:#d7eaff;padding:0 7px;font-size:.66rem;font-weight:800}.cronista-tools .sdlx-cronista-select{height:32px}.sdlx-cronista-context{font-size:.62rem;color:#8da5b8;margin-left:5px}
      .sdlx-install{display:none!important}.sdlx-install.ready{display:inline-flex!important}
      .sdlx-admin-filter{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.sdlx-admin-filter button{border:1px solid #35536b;border-radius:999px;background:#08131e;color:#c9dceb;padding:8px 11px;cursor:pointer;font-size:.67rem;font-weight:800}.sdlx-admin-filter button.on{background:#dcefff;color:#07111c}.sdlx-admin-items{display:grid;gap:9px;margin-top:16px}.sdlx-admin-row{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:13px;border:1px solid #243c50;border-radius:13px;background:#07111a}.sdlx-admin-row b{display:block}.sdlx-admin-row small{color:#8297aa}.sdlx-admin-row .toolbar{margin:0}.sdlx-admin-row button{padding:7px 10px}.sdlx-admin-note{margin:14px 0;padding:12px;border:1px solid #28475e;border-radius:12px;background:#091823;color:#a9bccd;font-size:.78rem}.sdlx-admin-preview{display:flex;gap:10px;align-items:center;margin-top:8px}.sdlx-admin-preview img{width:80px;height:54px;object-fit:cover;border-radius:8px;border:1px solid #35536b}
      @media(max-width:820px){.sdlx-grid{grid-template-columns:1fr}.sdlx-rel-shell,.sdlx-route-layout{grid-template-columns:1fr}.sdlx-time-item{grid-template-columns:88px 18px 1fr}.sdlx-time-item:before{left:96px}.sdlx-rank-head{display:block}.sdlx-rank-stats{margin-top:12px}.sdlx-rank-stats div{text-align:left}.sdlx-continue{grid-template-columns:1fr}.sdlx-continue a{justify-self:start}}
      @media(max-width:520px){.sdlx-section{padding:42px 0}.sdlx-card{min-height:190px}.sdlx-time-item{grid-template-columns:1fr}.sdlx-time-item:before,.sdlx-time-dot{display:none}.sdlx-rank-stats{display:grid;grid-template-columns:repeat(2,1fr)}.sdlx-journey-launch{left:10px;bottom:10px}.sdlx-route-box{padding:18px}.sdlx-destination{grid-template-columns:auto 1fr}.sdlx-destination button{grid-column:2;justify-self:start}}
      @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
    `;document.head.appendChild(style);
  }

  async function ensureSupabase(){
    if(!window.supabase){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=resolve;s.onerror=()=>reject(new Error('No se pudo cargar Supabase'));document.head.appendChild(s)})}
    const cfg=await fetch(CFG_URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Configuración no disponible');return r.json()});
    sb=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    return sb;
  }
  function publicImage(row){
    if(!row?.image_path)return'';
    if(/^https?:\/\//i.test(row.image_path))return row.image_path;
    try{return sb.storage.from(BUCKET).getPublicUrl(row.image_path).data.publicUrl||''}catch{return''}
  }
  function byType(type){return rows.filter(r=>r.content_type===type).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0))}
  async function loadRows(admin=false){
    let q=sb.from(TABLE).select('*').order('content_type').order('sort_order').order('created_at');
    if(!admin)q=q.eq('is_published',true);
    const {data,error}=await q;if(error)throw error;rows=data||[];return rows;
  }

  function recordAction(href,label){
    if(!href||href.startsWith('#')||href.startsWith('javascript:')||href.includes('admin=1'))return;
    if(/^https?:\/\//i.test(href)&&!href.startsWith(location.origin))return;
    const url=new URL(href,location.origin);if(url.origin!==location.origin)return;
    const clean=url.pathname+(url.hash||'');if(clean==='/'||clean==='/index.html')return;
    const action={href:clean,label:String(label||'Continuar explorando').trim().slice(0,90),at:Date.now()};
    localStorage.setItem(LAST_KEY,JSON.stringify(action));
  }
  function trackJourney(){
    document.addEventListener('click',event=>{
      const target=event.target.closest('a,button');if(!target||target.closest('#adminApp'))return;
      const href=target.getAttribute('href');
      if(href)recordAction(href,target.textContent);
      const story=target.closest('[data-story]');if(story){recordAction('/historias',story.textContent||'Continuar una historia');const m=(story.textContent||'').match(/(?:cap[ií]tulo\s*)?(\d{1,2})/i);if(m)localStorage.setItem(CHAPTER_KEY,m[1])}
      const episode=target.closest('[data-episode]');if(episode){recordAction('/episodios',episode.textContent||'Continuar un episodio');const m=(episode.textContent||'').match(/(?:cap[ií]tulo\s*)?(\d{1,2})/i);if(m)localStorage.setItem(CHAPTER_KEY,m[1])}
    },true);
    if(!['/','/index'].includes(path)&&!isAdmin&&!['/fanclub','/la-manada'].includes(path))recordAction(location.pathname+location.hash,document.title.split('|')[0].trim());
  }

  function renderHomeExperience(){
    if(path!=='/'&&path!=='/index')return;
    const hero=document.getElementById('inicio');if(!hero||document.getElementById('sdlxHomeExperience'))return;
    const start=byType('start_path'),news=byType('news');
    const root=document.createElement('section');root.id='sdlxHomeExperience';root.className='sdlx-section';
    let last=null;try{last=parseJSON(localStorage.getItem(LAST_KEY)||'null',null)}catch{}
    root.innerHTML=`<div class="sdlx-w">
      <span class="sdlx-kicker">TU PRIMER SENDERO</span><h2 class="sdlx-title">¿Por dónde empiezo?</h2><p class="sdlx-lead">Elige cómo quieres entrar al universo. Puedes comenzar por la historia, explorar las tierras o convertirte en miembro de La Manada.</p>
      ${last?.href?`<div class="sdlx-continue"><div><span>CONTINÚA TU VIAJE</span><strong>${esc(last.label||'Retomar mi recorrido')}</strong></div><a href="${esc(last.href)}">CONTINUAR →</a></div>`:''}
      <div class="sdlx-grid">${start.map(row=>{const img=publicImage(row);return `<article class="sdlx-card ${img?'has-image':''}"${img?` style="--sdlx-img:url('${esc(img)}')"`:''}><span class="sdlx-icon">${esc(getMeta(row,'icon','✦'))}</span><small>${esc(row.subtitle)}</small><h3>${esc(row.title)}</h3><p>${esc(row.description)}</p><a href="${esc(row.href||'/')}">${esc(getMeta(row,'cta','EXPLORAR'))} →</a></article>`}).join('')}</div>
      <div class="sdlx-news"><span class="sdlx-kicker">NOVEDADES DE LA CIUDADELA</span><h2 class="sdlx-title" style="font-size:clamp(1.8rem,4vw,3rem)">Lo nuevo en Sangre de Luna</h2><div class="sdlx-grid">${news.map(row=>{const img=publicImage(row);return `<article class="sdlx-card ${img?'has-image':''}"${img?` style="--sdlx-img:url('${esc(img)}')"`:''}><small>${esc(getMeta(row,'tag',row.subtitle))}</small><h3>${esc(row.title)}</h3><p>${esc(row.description)}</p>${row.href?`<a href="${esc(row.href)}">${esc(getMeta(row,'cta','VER MÁS'))} →</a>`:''}</article>`}).join('')}</div></div>
      <div style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap"><button id="sdlxInstall" class="btn ghost sdlx-install" type="button">⬇ INSTALAR SANGRE DE LUNA</button><a class="btn ghost" href="/viaje">🧭 CREAR MI ITINERARIO</a></div>
    </div>`;
    hero.insertAdjacentElement('afterend',root);
    const install=root.querySelector('#sdlxInstall');if(install){install.onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;install.classList.remove('ready')}}
  }

  function renderTimeline(){
    if(path!=='/historias'||document.getElementById('sdlxTimeline'))return;
    const data=byType('timeline');if(!data.length)return;
    const host=document.getElementById('historias')||document.querySelector('main');if(!host)return;
    const section=document.createElement('section');section.id='sdlxTimeline';section.className='sdlx-section';
    section.innerHTML=`<div class="sdlx-w"><span class="sdlx-kicker">CRONOLOGÍA INTERACTIVA</span><h2 class="sdlx-title">Línea del tiempo</h2><p class="sdlx-lead">Recorre los hitos publicados del universo. Pulsa un acontecimiento para ampliar su contexto.</p><div class="sdlx-timeline">${data.map(row=>`<article class="sdlx-time-item"><div class="sdlx-time-meta">${esc(getMeta(row,'era',row.subtitle))}</div><span class="sdlx-time-dot"></span><div class="sdlx-time-copy"><button type="button">${esc(row.title)}</button><p>${esc(row.description)}</p></div></article>`).join('')}</div></div>`;
    host.insertAdjacentElement('afterend',section);
    section.querySelectorAll('.sdlx-time-copy button').forEach(btn=>btn.onclick=()=>btn.closest('.sdlx-time-item').classList.toggle('open'));
  }

  function renderRelationships(){
    if(path!=='/personajes'||document.getElementById('sdlxRelationships'))return;
    const data=byType('relationship');if(!data.length)return;
    const host=document.getElementById('personajes')||document.querySelector('main');if(!host)return;
    const names=[...new Set(data.flatMap(r=>[getMeta(r,'source'),getMeta(r,'target')]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
    const section=document.createElement('section');section.id='sdlxRelationships';section.className='sdlx-section';
    section.innerHTML=`<div class="sdlx-w"><span class="sdlx-kicker">RED DE LEALTADES</span><h2 class="sdlx-title">Mapa de relaciones</h2><p class="sdlx-lead">Selecciona un personaje para ver sus vínculos publicados, alianzas, mandos y relaciones dentro del canon.</p><div class="sdlx-rel-shell"><div class="sdlx-node-cloud"><button class="sdlx-node on" data-name="">TODOS</button>${names.map(n=>`<button class="sdlx-node" data-name="${esc(n)}">${esc(n)}</button>`).join('')}</div><div class="sdlx-rel-detail"><div id="sdlxRelList" class="sdlx-rel-list"></div></div></div></div>`;
    host.insertAdjacentElement('afterend',section);
    const list=section.querySelector('#sdlxRelList');
    const render=name=>{const filtered=name?data.filter(r=>getMeta(r,'source')===name||getMeta(r,'target')===name):data;list.innerHTML=filtered.map(r=>`<article class="sdlx-rel"><small>${esc(getMeta(r,'relation',r.subtitle))}</small><b>${esc(getMeta(r,'source'))} ↔ ${esc(getMeta(r,'target'))}</b><p>${esc(r.description)}</p></article>`).join('')||'<div class="empty">No hay vínculos publicados.</div>'};render('');
    section.querySelectorAll('.sdlx-node').forEach(btn=>btn.onclick=()=>{section.querySelectorAll('.sdlx-node').forEach(x=>x.classList.remove('on'));btn.classList.add('on');render(btn.dataset.name||'')});
  }

  function renderTourExpansions(){
    if(path!=='/tour')return;
    const grid=document.querySelector('.territories');if(!grid||grid.dataset.sdlx)return;grid.dataset.sdlx='1';
    const extra=byType('tour_territory').filter(r=>!['citadel','east'].includes(r.slug));
    extra.forEach(row=>{const img=publicImage(row)||'/assets/hero.webp',status=getMeta(row,'status','coming_soon');const b=document.createElement('button');b.type='button';b.className='territory sdlx-territory-extra';b.style.setProperty('--territory-image',`url('${img.replace(/'/g,"%27")}')`);b.innerHTML=`<span class="territory-copy"><small>${esc(row.subtitle||status)}</small><strong>${esc(row.title)}</strong><span>${esc(row.description)}</span></span>`;b.onclick=()=>{if(status==='available'&&row.href&&row.href!=='/tour')location.href=row.href;else{const note=document.querySelector('.intro-note');if(note){note.textContent=`${row.title}: ${row.description||'Este territorio estará disponible próximamente.'}`;note.style.color='#e7cf9b'}}};grid.appendChild(b)});
  }

  function getItinerary(){const value=parseJSON(localStorage.getItem(ITINERARY_KEY)||'[]',[]);return Array.isArray(value)?value:[]}
  function getPassport(){const value=parseJSON(localStorage.getItem(PASSPORT_KEY)||'[]',[]);return Array.isArray(value)?value:[]}
  function saveItinerary(v){localStorage.setItem(ITINERARY_KEY,JSON.stringify(v))}
  function savePassport(v){localStorage.setItem(PASSPORT_KEY,JSON.stringify(v))}
  function renderJourneyPlanner(){
    if(path!=='/viaje'||document.getElementById('sdlxJourneyLaunch'))return;
    const destinations=byType('journey_destination');if(!destinations.length)return;
    const launch=document.createElement('button');launch.id='sdlxJourneyLaunch';launch.className='sdlx-journey-launch';launch.type='button';launch.textContent='🧭 MI ITINERARIO';document.body.appendChild(launch);
    const modal=document.createElement('div');modal.className='sdlx-route-modal';modal.id='sdlxRouteModal';modal.innerHTML=`<section class="sdlx-route-box"><header class="sdlx-route-head"><div><span class="sdlx-kicker">MI VIAJE 2.0</span><h2>Itinerario y pasaporte</h2><p class="sdlx-lead" style="margin-bottom:0">Elige destinos, cambia su orden y coloca un sello cuando completes una visita.</p></div><button class="sdlx-route-close" type="button">✕</button></header><div class="sdlx-route-layout"><div><h3>Destinos disponibles</h3><div id="sdlxDestinations" class="sdlx-destinations"></div></div><div><h3>Mi ruta</h3><div id="sdlxItinerary" class="sdlx-itinerary"></div></div></div><div class="sdlx-passport"><b>PASAPORTE DE SANGRE DE LUNA</b><p id="sdlxPassportText" style="color:#9fb2a8;margin:5px 0 0"></p><div id="sdlxStamps" class="sdlx-stamps"></div></div></section>`;document.body.appendChild(modal);
    const close=()=>modal.classList.remove('open');launch.onclick=()=>{modal.classList.add('open');render()};modal.querySelector('.sdlx-route-close').onclick=close;modal.onclick=e=>{if(e.target===modal)close()};
    const render=()=>{
      let itinerary=getItinerary().filter(slug=>destinations.some(d=>d.slug===slug));let passport=getPassport().filter(slug=>destinations.some(d=>d.slug===slug));
      const droot=modal.querySelector('#sdlxDestinations'),iroot=modal.querySelector('#sdlxItinerary');
      droot.innerHTML=destinations.map(d=>`<article class="sdlx-destination"><i>${esc(getMeta(d,'icon','⌖'))}</i><div><b>${esc(d.title)}</b><small>${esc(d.subtitle||getMeta(d,'region'))}</small></div><button type="button" data-add="${esc(d.slug)}" ${itinerary.includes(d.slug)?'disabled':''}>${itinerary.includes(d.slug)?'AÑADIDO':'AÑADIR'}</button></article>`).join('');
      iroot.innerHTML=itinerary.length?itinerary.map((slug,index)=>{const d=destinations.find(x=>x.slug===slug);return `<article class="sdlx-route-stop"><b>${index+1}. ${esc(d?.title||slug)}</b><small>${esc(getMeta(d,'region',d?.subtitle||''))}</small><div class="sdlx-route-actions"><button type="button" data-up="${index}" ${index===0?'disabled':''}>↑</button><button type="button" data-down="${index}" ${index===itinerary.length-1?'disabled':''}>↓</button><button class="sdlx-stamp" type="button" data-stamp="${esc(slug)}">${passport.includes(slug)?'✓ SELLADO':'SELLAR VISITA'}</button><button type="button" data-remove="${index}">QUITAR</button>${d?.href?`<a href="${esc(d.href)}" style="color:#bde5d2;font-size:.65rem;text-decoration:none">IR →</a>`:''}</div></article>`}).join(''):'<div class="empty">Añade tu primer destino.</div>';
      modal.querySelector('#sdlxPassportText').textContent=`${passport.length} de ${destinations.length} destinos sellados en este dispositivo.`;
      modal.querySelector('#sdlxStamps').innerHTML=passport.length?passport.map(slug=>{const d=destinations.find(x=>x.slug===slug);return `<span>${esc(getMeta(d,'icon','✦'))} ${esc(d?.title||slug)}</span>`}).join(''):'<span>Todavía no tienes sellos.</span>';
      droot.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{itinerary.push(b.dataset.add);saveItinerary(itinerary);render()});
      iroot.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{itinerary.splice(+b.dataset.remove,1);saveItinerary(itinerary);render()});
      iroot.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const i=+b.dataset.up;[itinerary[i-1],itinerary[i]]=[itinerary[i],itinerary[i-1]];saveItinerary(itinerary);render()});
      iroot.querySelectorAll('[data-down]').forEach(b=>b.onclick=()=>{const i=+b.dataset.down;[itinerary[i+1],itinerary[i]]=[itinerary[i],itinerary[i+1]];saveItinerary(itinerary);render()});
      iroot.querySelectorAll('[data-stamp]').forEach(b=>b.onclick=()=>{const slug=b.dataset.stamp;passport=passport.includes(slug)?passport.filter(x=>x!==slug):[...passport,slug];savePassport(passport);render()});
    };
  }

  async function renderManadaProgress(){
    if(path!=='/la-manada'||document.getElementById('sdlxManadaProgress'))return;
    const token=sessionStorage.getItem('sdl_fanclub_token')||'';if(!token){setTimeout(renderManadaProgress,600);return}
    const {data,error}=await sb.rpc('fanclub_member_challenges',{p_access_token:token});if(error||!data?.profile)return;
    const profile=data.profile,levels=byType('progression_level').map(r=>({...r,min:Number(getMeta(r,'min_points',0))||0})).sort((a,b)=>a.min-b.min);if(!levels.length)return;
    const current=[...levels].reverse().find(l=>profile.points>=l.min)||levels[0];const next=levels.find(l=>l.min>profile.points);const base=current.min,top=next?.min??Math.max(base+1,profile.points);const pct=next?Math.max(0,Math.min(100,Math.round((profile.points-base)*100/(top-base)))):100;
    const section=document.createElement('section');section.id='sdlxManadaProgress';section.className='sdlx-manada-progress';section.innerHTML=`<div class="sdlx-rank-head"><div><span class="sdlx-kicker">PROGRESIÓN DE LA MANADA</span><h3>${esc(profile.level||current.title)}</h3><span style="color:#93a6b7">${next?`${Math.max(0,next.min-profile.points)} puntos para ${next.title}`:'Has alcanzado el rango máximo disponible.'}</span></div><div class="sdlx-rank-stats"><div><b>${esc(profile.points)}</b><small>PUNTOS</small></div><div><b>${esc(profile.completed_challenges)}/${esc(profile.total_challenges)}</b><small>DESAFÍOS</small></div><div><b>${esc((profile.badges||[]).length)}</b><small>INSIGNIAS</small></div></div></div><div class="sdlx-meter" style="--p:${pct}%"><i></i></div><div class="sdlx-levels">${levels.map(l=>`<span class="${l.slug===current.slug?'on':''}">${esc(getMeta(l,'icon','◌'))} ${esc(l.title)}</span>`).join('')}</div>`;
    const anchor=document.getElementById('desafios')||document.querySelector('.manada-challenges');if(anchor)anchor.querySelector('.w')?.prepend(section);else document.querySelector('main')?.prepend(section);
    document.addEventListener('sdl:achievements-updated',()=>{section.remove();setTimeout(renderManadaProgress,250)},{once:true});
  }

  function setupCronistaModes(){
    const modes=byType('cronista_mode');if(!modes.length)return;
    let tries=0;const timer=setInterval(()=>{tries++;const native=document.getElementById('cronistaSpoilers'),global=document.getElementById('sdlgSpoilers');const old=native||global;if(!old){if(tries>30)clearInterval(timer);return}clearInterval(timer);if(document.getElementById('sdlxCronistaMode'))return;
      const select=document.createElement('select');select.id='sdlxCronistaMode';select.className='sdlx-cronista-select';select.setAttribute('aria-label','Modo del Cronista');select.innerHTML=modes.map(m=>`<option value="${esc(getMeta(m,'mode',m.slug))}">${esc(getMeta(m,'label',m.title))}</option>`).join('');
      const saved=localStorage.getItem(CRONISTA_MODE_KEY)||'safe';select.value=modes.some(m=>getMeta(m,'mode',m.slug)===saved)?saved:'safe';old.style.display='none';old.parentElement?.insertBefore(select,old);
      const apply=()=>{const mode=select.value;localStorage.setItem(CRONISTA_MODE_KEY,mode);const shouldSpoil=mode==='full';const isOn=old.classList.contains('on');if(shouldSpoil!==isOn)old.click();const chapter=localStorage.getItem(CHAPTER_KEY);const note=(global?document.querySelector('.sdlg-note'):document.querySelector('.cronista-note'));if(note){note.textContent=mode==='upto'?`Modo protegido · referencia de progreso: capítulo ${chapter||'no registrado'}`:mode==='full'?'Lore completo · puede incluir revelaciones publicadas':'Modo protegido · sin spoilers decisivos'}};select.onchange=apply;apply();
    },250);
  }

  function setupPWA(){
    if(!document.querySelector('link[rel="manifest"]')){const link=document.createElement('link');link.rel='manifest';link.href='/manifest.webmanifest';document.head.appendChild(link)}
    if('serviceWorker'in navigator)navigator.serviceWorker.register('/service-worker.js').catch(()=>{});
    addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;document.getElementById('sdlxInstall')?.classList.add('ready')});
    addEventListener('appinstalled',()=>{installPrompt=null;document.getElementById('sdlxInstall')?.classList.remove('ready')});
  }

  function setupAdmin(){
    let tries=0;const timer=setInterval(async()=>{tries++;const nav=document.getElementById('adminNav'),main=document.querySelector('#dashboard main');if(!nav||!main){if(tries>80)clearInterval(timer);return}clearInterval(timer);if(document.querySelector('[data-panel="universe"]'))return;
      const btn=document.createElement('button');btn.dataset.panel='universe';btn.textContent='Universo y experiencia';const settings=nav.querySelector('[data-panel="settings"]');settings?nav.insertBefore(btn,settings):nav.appendChild(btn);
      const panel=document.createElement('section');panel.className='panel hidden';panel.dataset.page='universe';panel.innerHTML=`<span class="ey">UNIVERSO Y EXPERIENCIA</span><h2>Centro editorial del mundo</h2><p class="sub">Administra las nuevas experiencias públicas sin modificar código: guía de inicio, novedades, cronología, relaciones, territorios, destinos, modos del Cronista y niveles de La Manada.</p><div class="sdlx-admin-note"><b>INGRESAR al Administrador se mantiene.</b> Esta sección amplía el Centro de Control existente. Las imágenes se suben directamente al almacenamiento del sitio.</div><div id="sdlxAdminMsg"></div><div class="sdlx-admin-filter" id="sdlxAdminFilters"></div><form id="sdlxAdminForm"><input id="sdlxId" type="hidden"><input id="sdlxImageCurrent" type="hidden"><div class="formgrid"><div class="fld"><label>TIPO DE CONTENIDO</label><select id="sdlxType">${Object.entries(typeLabels).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div><div class="fld"><label>IDENTIFICADOR</label><input id="sdlxSlug" required placeholder="ej. noticia-nueva"></div><div class="fld span2"><label>TÍTULO</label><input id="sdlxTitle" required></div><div class="fld span2"><label>ETIQUETA / SUBTÍTULO</label><input id="sdlxSubtitle"></div><div class="fld span2"><label>DESCRIPCIÓN</label><textarea id="sdlxDescription"></textarea></div><div class="fld span2"><label>IMAGEN</label><input id="sdlxImage" type="file" accept="image/jpeg,image/png,image/webp,image/gif"><div id="sdlxImagePreview" class="sdlx-admin-preview"></div></div><div class="fld span2"><label>ENLACE / DESTINO</label><input id="sdlxHref" placeholder="/mapa, /tour, /la-manada..."></div><div class="fld"><label id="sdlxExtraALabel">EXTRA A</label><input id="sdlxExtraA"></div><div class="fld"><label id="sdlxExtraBLabel">EXTRA B</label><input id="sdlxExtraB"></div><div class="fld span2"><label id="sdlxExtraCLabel">EXTRA C</label><input id="sdlxExtraC"></div><div class="fld"><label>ORDEN</label><input id="sdlxOrder" type="number" value="100"></div><div class="fld"><label>PUBLICADO</label><select id="sdlxPublished"><option value="true">Sí</option><option value="false">No</option></select></div><div class="fld"><label>PUBLICAR DESDE (OPCIONAL)</label><input id="sdlxStarts" type="datetime-local"></div><div class="fld"><label>OCULTAR DESDE (OPCIONAL)</label><input id="sdlxEnds" type="datetime-local"></div></div><div class="toolbar"><button class="btn pri" type="submit">GUARDAR CONTENIDO</button><button class="btn" type="button" id="sdlxReset">LIMPIAR</button></div></form><div id="sdlxAdminItems" class="sdlx-admin-items"></div>`;main.appendChild(panel);
      initAdminPanel(panel,btn);
    },160);
  }

  function message(text,error=false){const root=document.getElementById('sdlxAdminMsg');if(root)root.innerHTML=text?`<div class="msg ${error?'err':'ok'}">${esc(text)}</div>`:''}
  async function initAdminPanel(panel,navButton){
    const session=(await sb.auth.getSession()).data.session;
    const filters=panel.querySelector('#sdlxAdminFilters'),typeSelect=panel.querySelector('#sdlxType');let active='all';
    filters.innerHTML=`<button type="button" class="on" data-filter="all">Todo</button>${Object.entries(typeLabels).map(([v,l])=>`<button type="button" data-filter="${v}">${l}</button>`).join('')}`;
    const updateExtraLabels=()=>{const map=typeHelp[typeSelect.value]||['Extra A','a','Extra B','b','Extra C','c'];panel.querySelector('#sdlxExtraALabel').textContent=map[0].toUpperCase();panel.querySelector('#sdlxExtraBLabel').textContent=map[2].toUpperCase();panel.querySelector('#sdlxExtraCLabel').textContent=map[4].toUpperCase();panel.querySelector('#sdlxExtraA').placeholder=map[1];panel.querySelector('#sdlxExtraB').placeholder=map[3];panel.querySelector('#sdlxExtraC').placeholder=map[5]};typeSelect.onchange=updateExtraLabels;updateExtraLabels();
    const reset=()=>{panel.querySelector('#sdlxAdminForm').reset();panel.querySelector('#sdlxId').value='';panel.querySelector('#sdlxImageCurrent').value='';panel.querySelector('#sdlxOrder').value='100';panel.querySelector('#sdlxPublished').value='true';panel.querySelector('#sdlxImagePreview').innerHTML='';updateExtraLabels();message('')};panel.querySelector('#sdlxReset').onclick=reset;
    const refresh=async()=>{const current=(await sb.auth.getSession()).data.session;if(!current){panel.querySelector('#sdlxAdminItems').innerHTML='<div class="empty">Inicia sesión como administrador para gestionar este contenido.</div>';return}try{await loadRows(true);renderAdminItems()}catch(e){message(e.message,true)}};
    const renderAdminItems=()=>{const root=panel.querySelector('#sdlxAdminItems'),data=active==='all'?rows:rows.filter(r=>r.content_type===active);root.innerHTML=data.map(r=>`<article class="sdlx-admin-row"><div><small>${esc(typeLabels[r.content_type]||r.content_type)} · ${r.is_published?'PUBLICADO':'BORRADOR'} · orden ${esc(r.sort_order)}</small><b>${esc(r.title||r.slug)}</b><small>${esc(r.subtitle||r.slug)}</small></div><div class="toolbar"><button class="mini" type="button" data-edit="${r.id}">Editar</button><button class="mini danger" type="button" data-delete="${r.id}">Eliminar</button></div></article>`).join('')||'<div class="empty">No hay contenido en esta categoría.</div>';root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editRow(b.dataset.edit));root.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteRow(b.dataset.delete))};
    filters.querySelectorAll('button').forEach(b=>b.onclick=()=>{active=b.dataset.filter;filters.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));renderAdminItems()});
    const isoLocal=value=>{if(!value)return'';const d=new Date(value);if(Number.isNaN(d.getTime()))return'';const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`};
    const editRow=id=>{const r=rows.find(x=>x.id===id);if(!r)return;panel.querySelector('#sdlxId').value=r.id;typeSelect.value=r.content_type;updateExtraLabels();panel.querySelector('#sdlxSlug').value=r.slug||'';panel.querySelector('#sdlxTitle').value=r.title||'';panel.querySelector('#sdlxSubtitle').value=r.subtitle||'';panel.querySelector('#sdlxDescription').value=r.description||'';panel.querySelector('#sdlxHref').value=r.href||'';panel.querySelector('#sdlxOrder').value=r.sort_order??100;panel.querySelector('#sdlxPublished').value=String(!!r.is_published);panel.querySelector('#sdlxStarts').value=isoLocal(r.starts_at);panel.querySelector('#sdlxEnds').value=isoLocal(r.ends_at);panel.querySelector('#sdlxImageCurrent').value=r.image_path||'';const map=typeHelp[r.content_type]||['Extra A','a','Extra B','b','Extra C','c'];panel.querySelector('#sdlxExtraA').value=getMeta(r,map[1],'');panel.querySelector('#sdlxExtraB').value=getMeta(r,map[3],'');panel.querySelector('#sdlxExtraC').value=getMeta(r,map[5],'');const img=publicImage(r);panel.querySelector('#sdlxImagePreview').innerHTML=img?`<img src="${esc(img)}" alt=""><small>Imagen actual</small>`:'';panel.scrollIntoView({behavior:'smooth',block:'start'})};
    const deleteRow=async id=>{const r=rows.find(x=>x.id===id);if(!r||!confirm(`¿Eliminar “${r.title||r.slug}”?`))return;const {error}=await sb.from(TABLE).delete().eq('id',id);if(error){message(error.message,true);return}if(r.image_path&&!/^https?:/i.test(r.image_path))sb.storage.from(BUCKET).remove([r.image_path]).catch(()=>{});message('Contenido eliminado.');await refresh()};
    panel.querySelector('#sdlxImage').onchange=e=>{const file=e.target.files?.[0];const root=panel.querySelector('#sdlxImagePreview');if(!file){root.innerHTML='';return}const url=URL.createObjectURL(file);root.innerHTML=`<img src="${url}" alt=""><small>${esc(file.name)}</small>`};
    panel.querySelector('#sdlxAdminForm').onsubmit=async event=>{event.preventDefault();message('Guardando…');const id=panel.querySelector('#sdlxId').value,type=typeSelect.value,slug=panel.querySelector('#sdlxSlug').value.trim();if(!slug){message('Escribe un identificador.',true);return}let imagePath=panel.querySelector('#sdlxImageCurrent').value||null;const file=panel.querySelector('#sdlxImage').files?.[0];if(file){const ext=(file.name.split('.').pop()||'webp').toLowerCase();imagePath=`${type}/${crypto.randomUUID()}-${safeName(file.name.replace(/\.[^.]+$/,''))}.${safeName(ext)}`;const up=await sb.storage.from(BUCKET).upload(imagePath,file,{cacheControl:'3600',upsert:false,contentType:file.type||undefined});if(up.error){message(up.error.message,true);return}}
      const map=typeHelp[type]||['Extra A','a','Extra B','b','Extra C','c'];const meta={};[[map[1],panel.querySelector('#sdlxExtraA').value],[map[3],panel.querySelector('#sdlxExtraB').value],[map[5],panel.querySelector('#sdlxExtraC').value]].forEach(([k,v])=>{if(v!==''){meta[k]=k==='min_points'||k==='season'||k==='chapter'||k==='rank'?Number(v):v}});
      const payload={content_type:type,slug,title:panel.querySelector('#sdlxTitle').value.trim(),subtitle:panel.querySelector('#sdlxSubtitle').value.trim(),description:panel.querySelector('#sdlxDescription').value.trim(),image_path:imagePath,href:panel.querySelector('#sdlxHref').value.trim()||null,meta,sort_order:Number(panel.querySelector('#sdlxOrder').value)||100,is_published:panel.querySelector('#sdlxPublished').value==='true',starts_at:panel.querySelector('#sdlxStarts').value?new Date(panel.querySelector('#sdlxStarts').value).toISOString():null,ends_at:panel.querySelector('#sdlxEnds').value?new Date(panel.querySelector('#sdlxEnds').value).toISOString():null};
      const result=id?await sb.from(TABLE).update(payload).eq('id',id):await sb.from(TABLE).insert(payload);if(result.error){message(result.error.message,true);return}message('Contenido guardado correctamente.');reset();await refresh()};
    navButton.addEventListener('click',refresh);if(session)await refresh();
    const observer=new MutationObserver(()=>{if(!document.getElementById('dashboard')?.classList.contains('hidden'))refresh()});const dash=document.getElementById('dashboard');if(dash)observer.observe(dash,{attributes:true,attributeFilter:['class']});
  }

  async function boot(){
    addCoreStyle();setupPWA();trackJourney();
    try{await ensureSupabase();await loadRows(false)}catch(error){console.warn('[Sangre de Luna] Universo editorial no disponible:',error);if(isAdmin)setupAdmin();return}
    if(isAdmin){setupAdmin();return}
    renderHomeExperience();renderTimeline();renderRelationships();renderTourExpansions();renderJourneyPlanner();renderManadaProgress();setupCronistaModes();
    window.SDLExperience={rows,byType,refresh:async()=>{await loadRows(false);return rows}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
