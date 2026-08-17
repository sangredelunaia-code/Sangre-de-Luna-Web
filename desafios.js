/* DESAFIOS DE LA MANADA */
(()=>{
const activity=document.querySelector('.activity-grid')?.closest('.section');
if(!activity||document.getElementById('desafios'))return;

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[char]));
const token=()=>sessionStorage.getItem('sdl_fanclub_token')||'';
const fmt=n=>new Intl.NumberFormat('es-EC').format(Number(n)||0);
const ASSET_BASE='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@main/assets';
let sb=null,preview=[],dashboard=null,activeId=null,lastToken='';

activity.insertAdjacentHTML('afterend',`
<section class="section manada-challenges" id="desafios">
 <div class="w">
  <div class="head"><div><span class="ey">DESAFÍOS DE LA MANADA</span><h2>Tu historia también deja huella</h2></div><p>Supera pruebas basadas en los capítulos oficiales, acumula puntos y desbloquea insignias para tu credencial digital.</p></div>
  <div class="challenge-intro">
   <article class="challenge-intro-copy"><span class="ey">CONTENIDO CANÓNICO</span><h3>Recuerda. Elige. Avanza.</h3><p>Cada desafío recorre acontecimientos ya publicados de Sangre de Luna. Para proteger la experiencia de los nuevos visitantes, las preguntas completas están reservadas para miembros del Fan Club.</p><div class="challenge-meta"><span class="challenge-chip">✓ 70 % PARA OBTENER INSIGNIA</span><span class="challenge-chip">↻ PUEDES VOLVER A INTENTARLO</span><span class="challenge-chip">⚑ PROGRESO GUARDADO</span></div></article>
   <aside class="challenge-oath"><div class="challenge-oath-icon">🌙</div><b>CRONISTA DE LA MANADA</b><p>La insignia final para quienes superen todos los desafíos disponibles.</p></aside>
  </div>
  <div id="challengePreview"><div class="empty">Preparando los desafíos…</div></div>
  <div id="challengeMember"></div>
 </div>
</section>`);

const heroToolbar=document.querySelector('.manada-hero .toolbar');
if(heroToolbar&&!heroToolbar.querySelector('[href="#desafios"]'))heroToolbar.insertAdjacentHTML('beforeend','<a class="btn ghost" href="#desafios">✦ VER DESAFÍOS</a>');

const previewRoot=document.getElementById('challengePreview');
const memberRoot=document.getElementById('challengeMember');

const cardStyle=document.createElement('style');
cardStyle.dataset.challengeCards='clickable-v1';
cardStyle.textContent=`
.challenge-preview-card,[data-open-challenge]{cursor:pointer;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease,background .2s ease;position:relative}
.challenge-preview-card:hover,.challenge-preview-card:focus-visible,[data-open-challenge]:hover,[data-open-challenge]:focus-visible{transform:translateY(-4px);border-color:#66c8ff!important;box-shadow:0 16px 38px rgba(0,0,0,.28),0 0 0 1px rgba(102,200,255,.12);outline:none;background:linear-gradient(145deg,rgba(12,34,50,.98),rgba(5,16,25,.98))}
.challenge-card-action{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:15px;color:#89d7ff;font-size:.7rem;font-weight:950;letter-spacing:.12em;text-transform:uppercase;opacity:.82}
.challenge-preview-card:hover .challenge-card-action,.challenge-preview-card:focus-visible .challenge-card-action{opacity:1;transform:translateX(2px)}
.challenge-card-action span{display:inline-grid;place-items:center;width:25px;height:25px;border:1px solid #3a6682;border-radius:999px;background:#0b2232;color:#dff6ff;font-size:.9rem}
`;
document.head.appendChild(cardStyle);

function renderPreview(){
 if(!preview.length){previewRoot.innerHTML='<div class="empty">Los primeros desafíos se publicarán próximamente.</div>';return}
 previewRoot.innerHTML=`<div class="challenge-preview-grid">${preview.map(c=>`
  <article class="challenge-preview-card" data-preview-challenge="${esc(c.id)}" role="button" tabindex="0" aria-label="Abrir desafío ${esc(c.title)}">
   <div class="challenge-card-top"><div><span class="challenge-season">Temporada ${esc(c.season)} · ${esc(c.chapter_range)}</span><h4>${esc(c.title)}</h4></div><div class="challenge-icon">${esc(c.icon||'🐺')}</div></div>
   <p>${esc(c.description||'')}</p>
   <div class="challenge-meta"><span class="challenge-chip">${fmt(c.question_count)} PREGUNTAS</span><span class="challenge-chip">${fmt(c.max_points)} PUNTOS</span><span class="challenge-chip">INSIGNIA: ${esc(c.badge_name)}</span></div>
   <div class="challenge-card-action">ABRIR DESAFÍO <span>→</span></div>
  </article>`).join('')}</div>`;
 bindPreviewCards();
}

function bindPreviewCards(){
 previewRoot.querySelectorAll('[data-preview-challenge]').forEach(card=>{
  const open=()=>goToChallenge(card.dataset.previewChallenge);
  card.addEventListener('click',open);
  card.addEventListener('keydown',event=>{
   if(event.key==='Enter'||event.key===' '){event.preventDefault();open()}
  });
 });
}

async function goToChallenge(challengeId){
 if(!token()){
  const target=document.getElementById('fanMemberCard')||document.getElementById('fanJoinCard');
  target?.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>document.getElementById('fanLoginEmail')?.focus({preventScroll:true}),500);
  return;
 }
 if(!dashboard)await syncSession(true);
 const challenge=(dashboard?.challenges||[]).find(c=>String(c.id)===String(challengeId));
 if(!challenge)return;
 activeId=challenge.id;
 renderMember();
 requestAnimationFrame(()=>requestAnimationFrame(()=>document.getElementById('challengeRunner')?.scrollIntoView({behavior:'smooth',block:'start'})));
}

function renderMember(){
 const currentToken=token();
 if(!currentToken){
  dashboard=null;activeId=null;
  memberRoot.innerHTML=`<div class="challenge-lock-panel"><span class="ey">ACCESO PARA MIEMBROS</span><h4>Únete para aceptar los desafíos</h4><p>Las preguntas, los puntos, los niveles y las insignias se guardan en tu perfil de miembro y aparecen en el reverso digital de tu credencial.</p><div class="toolbar" style="justify-content:center"><button class="btn pri" type="button" data-challenge-go="join">UNIRME A LA MANADA</button><button class="btn" type="button" data-challenge-go="member">YA SOY MIEMBRO</button></div></div>`;
  memberRoot.querySelector('[data-challenge-go="join"]')?.addEventListener('click',()=>document.getElementById('fanJoinCard')?.scrollIntoView({behavior:'smooth',block:'start'}));
  memberRoot.querySelector('[data-challenge-go="member"]')?.addEventListener('click',()=>document.getElementById('fanMemberCard')?.scrollIntoView({behavior:'smooth',block:'start'}));
  renderCredentialReverse();return;
 }
 if(!dashboard){memberRoot.innerHTML='<div class="challenge-lock-panel"><div class="empty">Cargando tu progreso…</div></div>';return}
 const profile=dashboard.profile||{},challenges=Array.isArray(dashboard.challenges)?dashboard.challenges:[],badges=Array.isArray(profile.badges)?profile.badges:[];
 const maxPoints=challenges.reduce((sum,c)=>sum+(Number(c.max_points)||0),0);
 const progress=maxPoints?Math.min(100,Math.round((Number(profile.points)||0)*100/maxPoints)):0;
 memberRoot.innerHTML=`<div class="challenge-dashboard">
  <section class="challenge-profile">
   <div class="challenge-profile-head"><div><span class="ey">MI RANGO EN LA MANADA</span><div class="challenge-level">${esc(profile.level||'Iniciado')}<small>PROGRESO PERSONAL</small></div></div>
   <div class="challenge-stats"><div class="challenge-stat"><b>${fmt(profile.points)}</b><small>PUNTOS</small></div><div class="challenge-stat"><b>${fmt(profile.completed_challenges)}/${fmt(profile.total_challenges)}</b><small>DESAFÍOS</small></div><div class="challenge-stat"><b>${fmt(badges.length)}</b><small>INSIGNIAS</small></div></div></div>
   <div class="challenge-progress" style="--progress:${progress}%"><i></i></div><div class="challenge-progress-note"><span>Iniciado</span><span>Guardián · Élite · Legendario</span></div>
   <div class="challenge-badges">${badges.length?badges.map(b=>`<article class="challenge-badge"><span>${esc(b.icon||'🌙')}</span><b>${esc(b.badge_name)}</b><p>${esc(b.description||'')}</p></article>`).join(''):'<div class="challenge-empty-badges">Tu primera insignia aparecerá aquí cuando superes un desafío.</div>'}</div>
  </section>
  <div class="challenge-grid">${challenges.map(c=>{
   const pct=Number(c.best_percent)||0;
   return `<article class="challenge-card ${c.earned_badge?'done':''}" data-open-challenge="${esc(c.id)}" role="button" tabindex="0" aria-label="Abrir desafío ${esc(c.title)}">
    <div class="challenge-card-top"><div><span class="challenge-season">Temporada ${esc(c.season)} · ${esc(c.chapter_range)}</span><h4>${esc(c.title)}</h4></div><div class="challenge-icon">${esc(c.icon||'🐺')}</div></div>
    <p>${esc(c.subtitle||c.description||'')}</p>
    <div class="challenge-meta"><span class="challenge-chip">${fmt(c.question_count)} PREGUNTAS</span><span class="challenge-chip">${fmt(c.max_points)} PUNTOS</span>${c.earned_badge?`<span class="challenge-chip earned">✓ ${esc(c.badge_name)}</span>`:''}</div>
    <div class="challenge-score-line"><div class="challenge-progress" style="--progress:${pct}%"><i></i></div><b>${pct}%</b></div>
    <button class="btn ${c.completed?'':'pri'}" type="button" data-start-challenge="${esc(c.id)}">${c.completed?'VOLVER A INTENTAR':'ACEPTAR DESAFÍO'}</button>
   </article>`}).join('')}</div>
  <div id="challengeRunner"></div>
 </div>`;
 memberRoot.querySelectorAll('[data-start-challenge]').forEach(btn=>btn.addEventListener('click',event=>{event.stopPropagation();activeId=btn.dataset.startChallenge;renderRunner();requestAnimationFrame(()=>document.getElementById('challengeRunner')?.scrollIntoView({behavior:'smooth',block:'start'}))}));
 memberRoot.querySelectorAll('[data-open-challenge]').forEach(card=>{
  const open=()=>{activeId=card.dataset.openChallenge;renderRunner();requestAnimationFrame(()=>document.getElementById('challengeRunner')?.scrollIntoView({behavior:'smooth',block:'start'}))};
  card.addEventListener('click',event=>{if(event.target.closest('button,a,input,label'))return;open()});
  card.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&!event.target.closest('button,a,input,label')){event.preventDefault();open()}});
 });
 if(activeId)renderRunner();
 renderCredentialReverse();
}

function renderRunner(){
 const root=document.getElementById('challengeRunner');if(!root||!dashboard)return;
 const challenge=(dashboard.challenges||[]).find(c=>c.id===activeId);if(!challenge){root.innerHTML='';return}
 root.innerHTML=`<section class="challenge-runner"><div class="challenge-runner-head"><div><span class="challenge-season">${esc(challenge.chapter_range)} · CONTIENE REVELACIONES</span><h3>${esc(challenge.title)}</h3><p>${esc(challenge.description||'')}</p></div><button class="mini" type="button" id="challengeClose">CERRAR</button></div>
 <form id="challengeForm">${(challenge.questions||[]).map((q,index)=>`<div class="challenge-runner-q"><p><small>${index+1}.</small> ${esc(q.question)} <small>· ${fmt(q.points)} puntos</small></p><div class="challenge-answer-grid">${(q.options||[]).map(o=>`<label class="challenge-answer"><input type="radio" name="cq_${esc(q.id)}" value="${esc(o.id)}"><span>${esc(o.label)}</span></label>`).join('')}</div></div>`).join('')}
 <div class="challenge-runner-actions"><button class="btn" type="button" id="challengeCancel">SALIR DEL DESAFÍO</button><button class="btn pri" type="submit">ENVIAR MIS RESPUESTAS</button></div><div id="challengeSubmitMsg"></div></form></section>`;
 const close=()=>{activeId=null;root.innerHTML=''};
 document.getElementById('challengeClose')?.addEventListener('click',close);document.getElementById('challengeCancel')?.addEventListener('click',close);
 document.getElementById('challengeForm')?.addEventListener('submit',event=>submitChallenge(event,challenge));
}

async function submitChallenge(event,challenge){
 event.preventDefault();const form=event.currentTarget,msgRoot=document.getElementById('challengeSubmitMsg');
 const answers={};(challenge.questions||[]).forEach(q=>{const picked=form.querySelector(`input[name="cq_${CSS.escape(q.id)}"]:checked`);if(picked)answers[q.id]=picked.value});
 if(Object.keys(answers).length!==(challenge.questions||[]).length){msgRoot.innerHTML='<div class="msg err">Responde todas las preguntas antes de enviar el desafío.</div>';return}
 const submit=form.querySelector('[type="submit"]');submit.disabled=true;submit.textContent='CALIFICANDO…';msgRoot.innerHTML='<div class="msg">El Cronista está verificando tus respuestas…</div>';
 const {data,error}=await sb.rpc('fanclub_submit_challenge',{p_access_token:token(),p_challenge_id:challenge.id,p_answers:answers});
 submit.disabled=false;submit.textContent='ENVIAR MIS RESPUESTAS';
 if(error){msgRoot.innerHTML=`<div class="msg err">${esc(error.message)}</div>`;return}
 const result=data?.result||{};dashboard=data?.dashboard||dashboard;
 msgRoot.innerHTML=`<article class="challenge-result ${result.passed?'':'fail'}"><span class="ey">RESULTADO OFICIAL</span><div class="challenge-result-score">${fmt(result.percent)}%</div><h4>${result.passed?`¡Insignia ${esc(result.badge_name||'desbloqueada')}!`:'Aún puedes volver a intentarlo'}</h4><p>${fmt(result.correct)} de ${fmt(result.total_questions)} respuestas correctas · ${fmt(result.score)} de ${fmt(result.max_points)} puntos.</p>${result.passed?'<p>La insignia ya fue incorporada a tu perfil y al reverso digital de tu credencial.</p>':'<p>Necesitas alcanzar al menos el 70 %. Revisa las historias y vuelve cuando estés listo.</p>'}</article>`;
 renderCredentialReverse();
 document.dispatchEvent(new CustomEvent('sdl:achievements-updated',{detail:dashboard.profile||{}}));
 setTimeout(()=>{renderMember();const runner=document.getElementById('challengeRunner');if(runner){activeId=challenge.id;renderRunner();const resultRoot=document.getElementById('challengeSubmitMsg');if(resultRoot)resultRoot.innerHTML=msgRoot.innerHTML}},1200);
}

function credentialSignature(profile){return JSON.stringify([profile?.points,profile?.level,(profile?.badges||[]).map(b=>b.badge_key)])}
function renderCredentialReverse(){
 const shell=document.querySelector('#fanCredential .fan-credential-shell');
 if(!shell||!dashboard?.profile)return;
 const profile=dashboard.profile,badges=Array.isArray(profile.badges)?profile.badges:[],signature=credentialSignature(profile),existing=shell.querySelector('.fan-achievement-wrap');
 if(existing?.dataset.signature===signature)return;
 existing?.remove();
 const wrap=document.createElement('div');wrap.className='fan-achievement-wrap';wrap.dataset.signature=signature;
 wrap.innerHTML=`<div class="fan-achievement-tools"><button class="btn" type="button" data-toggle-achievements>✦ VER REVERSO DIGITAL: INSIGNIAS</button></div><article class="fan-achievement-reverse hidden"><img src="${ASSET_BASE}/logo-oficial.png" alt="Sangre de Luna"><h4>DESAFÍOS DE LA MANADA</h4><small>REVERSO DIGITAL DE LOGROS</small><div class="fan-achievement-rank">${esc(profile.level||'Iniciado')}<span>${fmt(profile.points)} PUNTOS ACUMULADOS</span></div><div class="fan-achievement-badge-grid">${badges.length?badges.slice(0,6).map(b=>`<div class="fan-achievement-mini"><span>${esc(b.icon||'🌙')}</span><b>${esc(b.badge_name)}</b></div>`).join(''):'<div class="fan-achievement-none">Supera tu primer desafío para colocar una insignia en tu credencial.</div>'}</div></article>`;
 shell.appendChild(wrap);const card=wrap.querySelector('.fan-achievement-reverse'),button=wrap.querySelector('[data-toggle-achievements]');button.addEventListener('click',()=>{const opening=card.classList.contains('hidden');card.classList.toggle('hidden');button.textContent=opening?'✕ OCULTAR REVERSO':'✦ VER REVERSO DIGITAL: INSIGNIAS';if(opening)card.scrollIntoView({behavior:'smooth',block:'center'})});
}

async function loadPreview(){const {data,error}=await sb.rpc('fanclub_public_challenges');if(error)throw error;preview=Array.isArray(data)?data:[];renderPreview()}
async function syncSession(force=false){
 const current=token();if(!force&&current===lastToken)return;lastToken=current;
 if(!current){dashboard=null;renderMember();return}
 memberRoot.innerHTML='<div class="challenge-lock-panel"><div class="empty">Cargando tu progreso…</div></div>';
 const {data,error}=await sb.rpc('fanclub_member_challenges',{p_access_token:current});
 if(error){dashboard=null;memberRoot.innerHTML=`<div class="challenge-lock-panel"><h4>No pudimos cargar tu progreso</h4><p>${esc(error.message)}</p><button class="btn" type="button" data-retry-challenges>VOLVER A INTENTAR</button></div>`;memberRoot.querySelector('[data-retry-challenges]')?.addEventListener('click',()=>syncSession(true));return}
 dashboard=data;renderMember();
}

async function boot(){
 try{const cfg=await fetch('https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config',{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('Configuración no disponible');return response.json()});sb=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});await loadPreview();await syncSession(true)}catch(error){previewRoot.innerHTML=`<div class="empty">No se pudieron cargar los desafíos. ${esc(error.message||'')}</div>`}
 const credential=document.getElementById('fanCredential');if(credential)new MutationObserver(()=>{renderCredentialReverse();syncSession()}).observe(credential,{childList:true,subtree:true});
 document.addEventListener('click',event=>{if(event.target?.id==='fanLogout')setTimeout(()=>syncSession(true),80)});
 ['fanJoinForm','fanLoginForm'].forEach(id=>document.getElementById(id)?.addEventListener('submit',()=>setTimeout(()=>syncSession(true),900)));
 document.getElementById('fanActivateLegacy')?.addEventListener('click',()=>setTimeout(()=>syncSession(true),900));
 window.setInterval(()=>syncSession(),1500);
}
boot();
})();