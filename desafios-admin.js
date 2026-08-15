/* NAVEGACION PUBLICA · RESTAURA EL ACCESO AL FAN CLUB */
(()=>{
const publicNav=document.querySelector('#publicApp .nav');
const exploreLink=publicNav?.querySelector('a[href="/tour.html"]');
if(publicNav&&exploreLink&&!publicNav.querySelector('a[href="/fanclub.html"]')){
 const fanclubLink=document.createElement('a');
 fanclubLink.href='/fanclub.html';
 fanclubLink.textContent='Fan Club';
 publicNav.insertBefore(fanclubLink,exploreLink);
}
})();

/* ADMINISTRACION · DESAFIOS DE LA MANADA */
(()=>{
const nav=document.getElementById('adminNav');
const users=document.querySelector('[data-page="users"]');
if(!nav||!users||document.querySelector('[data-page="challenges"]'))return;

const galleryButton=nav.querySelector('[data-panel="gallery"]');
galleryButton?.insertAdjacentHTML('afterend','<button data-panel="challenges">Desafíos</button>');
if(typeof currentProfile!=='undefined'&&currentProfile&&currentProfile.role!=='superadmin')nav.querySelector('[data-panel="challenges"]')?.classList.toggle('hidden',!currentProfile.permissions?.fanclub);
users.insertAdjacentHTML('beforebegin',`
<section class="panel hidden" data-page="challenges">
 <span class="ey">FAN CLUB · LA MANADA</span><h2>Desafíos e insignias</h2><p class="sub">Crea pruebas basadas en las historias publicadas. Las respuestas correctas permanecen protegidas en la base de datos.</p>
 <div id="challengeAdminMsg"></div><div id="challengeAdminStats" class="stats"></div>
 <div class="challenge-admin-tabs"><button class="mini on" type="button" data-ch-admin-tab="challenges">Desafíos</button><button class="mini" type="button" data-ch-admin-tab="questions">Preguntas</button><button class="mini" type="button" data-ch-admin-tab="results">Resultados</button></div>
 <div data-ch-admin-pane="challenges">
  <form id="challengeAdminForm"><input type="hidden" id="caId"><div class="formgrid">
   <div class="fld"><label>TÍTULO</label><input id="caTitle" required></div><div class="fld"><label>IDENTIFICADOR</label><input id="caSlug" placeholder="capitulo-5" required></div>
   <div class="fld"><label>SUBTÍTULO</label><input id="caSubtitle"></div><div class="fld"><label>ÍCONO</label><input id="caIcon" value="🐺" maxlength="8"></div>
   <div class="fld span2"><label>DESCRIPCIÓN</label><textarea id="caDescription"></textarea></div>
   <div class="fld"><label>TEMPORADA</label><input id="caSeason" type="number" min="1" value="1"></div><div class="fld"><label>CAPÍTULOS</label><input id="caChapters" placeholder="Capítulo 5"></div>
   <div class="fld"><label>CLAVE DE INSIGNIA</label><input id="caBadgeKey" placeholder="insignia-capitulo-5" required></div><div class="fld"><label>NOMBRE DE INSIGNIA</label><input id="caBadgeName" required></div>
   <div class="fld span2"><label>DESCRIPCIÓN DE INSIGNIA</label><textarea id="caBadgeDescription"></textarea></div>
   <div class="fld"><label>PORCENTAJE PARA APROBAR</label><input id="caMin" type="number" min="1" max="100" value="70"></div><div class="fld"><label>ORDEN</label><input id="caOrder" type="number" value="100"></div>
   <div class="fld"><label>ESTADO</label><select id="caStatus"><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></div><div class="fld"><label>DISPONIBLE DESDE</label><input id="caAvailable" type="datetime-local"></div>
  </div><div class="toolbar"><button class="btn pri" type="submit">GUARDAR DESAFÍO</button><button class="btn" type="button" id="caReset">LIMPIAR</button></div></form><div id="challengeAdminTable"></div>
 </div>
 <div class="hidden" data-ch-admin-pane="questions">
  <form id="challengeQuestionForm"><input type="hidden" id="cqId"><div class="formgrid">
   <div class="fld"><label>DESAFÍO</label><select id="cqChallenge" required></select></div><div class="fld"><label>CLAVE DE PREGUNTA</label><input id="cqKey" placeholder="q1" required></div>
   <div class="fld span2"><label>PREGUNTA</label><textarea id="cqQuestion" required></textarea></div><div class="fld span2"><label>EXPLICACIÓN CANÓNICA</label><textarea id="cqExplanation"></textarea></div>
   <div class="fld span2"><label>OPCIONES — UNA POR LÍNEA</label><textarea id="cqOptions" placeholder="Opción 1&#10;Opción 2&#10;Opción 3&#10;Opción 4" required></textarea></div>
   <div class="fld"><label>NÚMERO DE RESPUESTA CORRECTA</label><input id="cqCorrect" type="number" min="1" value="1" required></div><div class="fld"><label>PUNTOS</label><input id="cqPoints" type="number" min="1" max="100" value="10"></div>
   <div class="fld"><label>ORDEN</label><input id="cqOrder" type="number" value="100"></div>
  </div><div class="notice">La explicación sirve para comprobar el canon en el panel. La respuesta correcta nunca se envía al navegador de los fans.</div><div class="toolbar"><button class="btn pri" type="submit">GUARDAR PREGUNTA</button><button class="btn" type="button" id="cqReset">LIMPIAR</button></div></form><div id="challengeQuestionsTable"></div>
 </div>
 <div class="hidden" data-ch-admin-pane="results"><div id="challengeResultsTable"></div></div>
</section>`);

const style=document.createElement('style');style.textContent=`
.challenge-admin-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 22px}.challenge-admin-tabs .on{border-color:#78caff;background:#143247;color:#fff}.challenge-admin-badge{font-size:1.5rem;margin-right:6px}.challenge-admin-note{color:#7890a3;font-size:.72rem}.challenge-admin-empty{padding:18px;border:1px dashed #31506a;border-radius:13px;color:#849bad;text-align:center}`;document.head.appendChild(style);

const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const message=(text,type='')=>{$('#challengeAdminMsg').innerHTML=text?`<div class="msg ${type}">${esc(text)}</div>`:''};
const toLocal=value=>{if(!value)return'';const d=new Date(value),z=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`};
const table=(root,heads,rows)=>{root.innerHTML=rows.length?`<div class="tablewrap"><table class="atable"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`:'<div class="challenge-admin-empty">No hay registros todavía.</div>'};
let sb=null,loaded=false,state={challenges:[],questions:[],options:[],attempts:[],badges:[]};

$$('[data-ch-admin-tab]').forEach(button=>button.addEventListener('click',()=>{$$('[data-ch-admin-tab]').forEach(x=>x.classList.toggle('on',x===button));$$('[data-ch-admin-pane]').forEach(pane=>pane.classList.toggle('hidden',pane.dataset.chAdminPane!==button.dataset.chAdminTab))}));

nav.addEventListener('click',event=>{if(event.target.closest('[data-panel="challenges"]'))loadAll(true)});

async function loadAll(force=false){
 if(loaded&&!force)return;message('Cargando desafíos…');
 try{
  if(!sb){const cfg=await fetch('https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Configuración no disponible');return r.json()});sb=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}
  const [ch,q,o,a,b]=await Promise.all([
   sb.from('fanclub_challenges').select('*').order('sort_order'),
   sb.from('fanclub_challenge_questions').select('*').order('sort_order'),
   sb.from('fanclub_challenge_options').select('*').order('sort_order'),
   sb.from('fanclub_challenge_attempts').select('id,member_id,challenge_id,score,max_points,percent,completed_at').order('completed_at',{ascending:false}),
   sb.from('fanclub_member_badges').select('*').order('awarded_at',{ascending:false})
  ]);
  const firstError=[ch,q,o,a,b].find(x=>x.error)?.error;if(firstError)throw firstError;
  state={challenges:ch.data||[],questions:q.data||[],options:o.data||[],attempts:a.data||[],badges:b.data||[]};loaded=true;message('');renderAll();
 }catch(error){message(error.message||'No se pudo cargar el módulo.','err')}
}

function renderAll(){
 $('#challengeAdminStats').innerHTML=`<div class="stat"><b>${state.challenges.length}</b><small>Desafíos</small></div><div class="stat"><b>${state.questions.length}</b><small>Preguntas</small></div><div class="stat"><b>${state.attempts.length}</b><small>Intentos</small></div><div class="stat"><b>${state.badges.length}</b><small>Insignias</small></div><div class="stat"><b>${new Set(state.attempts.map(x=>x.member_id)).size}</b><small>Participantes</small></div>`;
 $('#cqChallenge').innerHTML='<option value="">Elige un desafío</option>'+state.challenges.map(c=>`<option value="${esc(c.id)}">${esc(c.title)}</option>`).join('');
 table($('#challengeAdminTable'),['Desafío','Contenido','Preguntas','Insignia','Estado','Acciones'],state.challenges.map((c,index)=>`<tr><td><b>${esc(c.title)}</b><div class="challenge-admin-note">${esc(c.slug)}</div></td><td>T${esc(c.season||'—')} · ${esc(c.chapter_range||'')}</td><td>${state.questions.filter(q=>q.challenge_id===c.id).length}</td><td><span class="challenge-admin-badge">${esc(c.icon||'🐺')}</span>${esc(c.badge_name)}</td><td><span class="tag ${c.status==='published'?'ok':c.status==='archived'?'off':''}">${esc(c.status.toUpperCase())}</span></td><td><button class="mini" type="button" data-ca-edit="${index}">Editar</button> <button class="mini" type="button" data-ca-toggle="${index}">${c.status==='published'?'Pasar a borrador':'Publicar'}</button></td></tr>`));
 table($('#challengeQuestionsTable'),['Desafío','Pregunta','Opciones','Correcta','Puntos','Acciones'],state.questions.map((q,index)=>{const c=state.challenges.find(x=>x.id===q.challenge_id),opts=state.options.filter(x=>x.question_id===q.id),correct=opts.findIndex(x=>x.is_correct)+1;return `<tr><td>${esc(c?.title||'')}</td><td><b>${esc(q.question_key)}</b> · ${esc(q.question)}</td><td>${opts.length}</td><td>${correct||'—'}</td><td>${q.points}</td><td><button class="mini" type="button" data-cq-edit="${index}">Editar</button> <button class="mini danger" type="button" data-cq-delete="${index}">Eliminar</button></td></tr>`}));
 const summaries=state.challenges.map(c=>{const attempts=state.attempts.filter(a=>a.challenge_id===c.id),passed=attempts.filter(a=>a.percent>=c.min_score_percent);return `<tr><td>${esc(c.title)}</td><td>${attempts.length}</td><td>${new Set(attempts.map(a=>a.member_id)).size}</td><td>${passed.length}</td><td>${attempts.length?Math.round(attempts.reduce((s,a)=>s+a.percent,0)/attempts.length):0}%</td></tr>`});
 table($('#challengeResultsTable'),['Desafío','Intentos','Participantes','Aprobados','Promedio'],summaries);
 bindActions();
}

function bindActions(){
 $$('[data-ca-edit]').forEach(button=>button.onclick=()=>editChallenge(state.challenges[+button.dataset.caEdit]));
 $$('[data-ca-toggle]').forEach(button=>button.onclick=()=>toggleChallenge(state.challenges[+button.dataset.caToggle]));
 $$('[data-cq-edit]').forEach(button=>button.onclick=()=>editQuestion(state.questions[+button.dataset.cqEdit]));
 $$('[data-cq-delete]').forEach(button=>button.onclick=()=>deleteQuestion(state.questions[+button.dataset.cqDelete]));
}

function editChallenge(c){$('#caId').value=c.id;$('#caTitle').value=c.title||'';$('#caSlug').value=c.slug||'';$('#caSubtitle').value=c.subtitle||'';$('#caIcon').value=c.icon||'🐺';$('#caDescription').value=c.description||'';$('#caSeason').value=c.season||1;$('#caChapters').value=c.chapter_range||'';$('#caBadgeKey').value=c.badge_key||'';$('#caBadgeName').value=c.badge_name||'';$('#caBadgeDescription').value=c.badge_description||'';$('#caMin').value=c.min_score_percent||70;$('#caOrder').value=c.sort_order||100;$('#caStatus').value=c.status||'draft';$('#caAvailable').value=toLocal(c.available_at);$('#challengeAdminForm').scrollIntoView({behavior:'smooth',block:'start'})}
function resetChallenge(){$('#challengeAdminForm').reset();$('#caId').value='';$('#caIcon').value='🐺';$('#caSeason').value=1;$('#caMin').value=70;$('#caOrder').value=100;$('#caStatus').value='draft'}
$('#caReset').onclick=resetChallenge;
$('#caTitle').addEventListener('blur',()=>{if($('#caId').value||$('#caSlug').value)return;const base=$('#caTitle').value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');$('#caSlug').value=base;$('#caBadgeKey').value=`insignia-${base}`});
$('#challengeAdminForm').onsubmit=async event=>{event.preventDefault();const id=$('#caId').value,wantsPublished=$('#caStatus').value==='published',hasQuestions=id&&state.questions.some(q=>q.challenge_id===id),savedAsDraft=wantsPublished&&!hasQuestions,payload={title:$('#caTitle').value.trim(),slug:$('#caSlug').value.trim().toLowerCase(),subtitle:$('#caSubtitle').value.trim()||null,description:$('#caDescription').value.trim()||null,season:+$('#caSeason').value||null,chapter_range:$('#caChapters').value.trim()||null,icon:$('#caIcon').value.trim()||'🐺',badge_key:$('#caBadgeKey').value.trim().toLowerCase(),badge_name:$('#caBadgeName').value.trim(),badge_description:$('#caBadgeDescription').value.trim()||null,min_score_percent:+$('#caMin').value||70,sort_order:+$('#caOrder').value||100,status:savedAsDraft?'draft':$('#caStatus').value,available_at:$('#caAvailable').value?new Date($('#caAvailable').value).toISOString():null,updated_at:new Date().toISOString()};message('Guardando desafío…');const result=id?await sb.from('fanclub_challenges').update(payload).eq('id',id):await sb.from('fanclub_challenges').insert(payload);if(result.error){message(result.error.message,'err');return}message(savedAsDraft?'Desafío guardado como borrador. Agrega al menos una pregunta antes de publicarlo.':'Desafío guardado.','ok');resetChallenge();loaded=false;await loadAll(true)};
async function toggleChallenge(c){const publishing=c.status!=='published';if(publishing&&!state.questions.some(q=>q.challenge_id===c.id)){message('Agrega al menos una pregunta antes de publicar el desafío.','err');return}const status=publishing?'published':'draft';const {error}=await sb.from('fanclub_challenges').update({status,updated_at:new Date().toISOString()}).eq('id',c.id);if(error)message(error.message,'err');else{loaded=false;await loadAll(true)}}

function editQuestion(q){const opts=state.options.filter(x=>x.question_id===q.id);$('#cqId').value=q.id;$('#cqChallenge').value=q.challenge_id;$('#cqKey').value=q.question_key||'';$('#cqQuestion').value=q.question||'';$('#cqExplanation').value=q.explanation||'';$('#cqOptions').value=opts.map(o=>o.label).join('\n');$('#cqCorrect').value=Math.max(1,opts.findIndex(o=>o.is_correct)+1);$('#cqPoints').value=q.points||10;$('#cqOrder').value=q.sort_order||100;document.querySelector('[data-ch-admin-tab="questions"]').click();$('#challengeQuestionForm').scrollIntoView({behavior:'smooth',block:'start'})}
function resetQuestion(){$('#challengeQuestionForm').reset();$('#cqId').value='';$('#cqCorrect').value=1;$('#cqPoints').value=10;$('#cqOrder').value=100}
$('#cqReset').onclick=resetQuestion;
$('#challengeQuestionForm').onsubmit=async event=>{event.preventDefault();const id=$('#cqId').value,options=$('#cqOptions').value.split('\n').map(x=>x.trim()).filter(Boolean),correct=+$('#cqCorrect').value;if(options.length<2||correct<1||correct>options.length){message('Revisa las opciones y el número de la respuesta correcta.','err');return}const payload={challenge_id:$('#cqChallenge').value,question_key:$('#cqKey').value.trim(),question:$('#cqQuestion').value.trim(),explanation:$('#cqExplanation').value.trim()||null,points:+$('#cqPoints').value||10,sort_order:+$('#cqOrder').value||100,updated_at:new Date().toISOString()};message('Guardando pregunta…');let questionId=id;if(id){const r=await sb.from('fanclub_challenge_questions').update(payload).eq('id',id);if(r.error){message(r.error.message,'err');return}}else{const r=await sb.from('fanclub_challenge_questions').insert(payload).select('id').single();if(r.error){message(r.error.message,'err');return}questionId=r.data.id}const removed=await sb.from('fanclub_challenge_options').delete().eq('question_id',questionId);if(removed.error){message(removed.error.message,'err');return}const rows=options.map((label,index)=>({question_id:questionId,option_key:String.fromCharCode(97+index),label,is_correct:index===correct-1,sort_order:(index+1)*10}));const inserted=await sb.from('fanclub_challenge_options').insert(rows);if(inserted.error){message(inserted.error.message,'err');return}message('Pregunta y respuestas guardadas.','ok');resetQuestion();loaded=false;await loadAll(true)};
async function deleteQuestion(q){if(!confirm('¿Eliminar esta pregunta y todas sus opciones?'))return;const {error}=await sb.from('fanclub_challenge_questions').delete().eq('id',q.id);if(error)message(error.message,'err');else{message('Pregunta eliminada.','ok');loaded=false;await loadAll(true)}}
})();
