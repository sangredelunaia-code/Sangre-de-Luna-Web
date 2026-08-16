/* SANGRE DE LUNA · CRONISTA GLOBAL
   Widget compartido para Fan Club, La Manada, Mapa, Mi Viaje y Recorridos.
   La portada ya incluye su propia versión; este módulo no la duplica. */
(()=>{
  if(document.getElementById('cronistaWidget')||document.getElementById('sdlgCronista')) return;

  const CONVERSATION_KEY='sdl-cronista-conversation-v2';
  const MEMORY_KEY='sdl-cronista-guide-memory-v2';
  const VOICE_KEY='sdl-cronista-voice';
  const path=(location.pathname.replace(/\/+$/,'')||'/').toLowerCase();
  const page=path.startsWith('/la-manada')?'manada':path.startsWith('/fanclub')?'fanclub':path.startsWith('/mapa')?'mapa':path.startsWith('/tour')?'tour':path.startsWith('/viaje')?'viaje':'general';
  const pageNames={manada:'La Manada',fanclub:'Fan Club',mapa:'Mapa de las Tierras',tour:'Recorrido 360°',viaje:'Viaje del Visitante',general:'Sangre de Luna'};
  const pageName=pageNames[page];
  let spoilers=false;
  let busy=false;
  let voiceEnabled=localStorage.getItem(VOICE_KEY)!=='0';
  let speechId=0;

  const greetingByPage={
    manada:'Bienvenido a La Manada. Desde aquí puedo ayudarte con tu credencial, desafíos, facciones y contenido exclusivo.',
    fanclub:'Bienvenido al Fan Club. Puedo ayudarte a registrarte, iniciar sesión o explicarte cómo funciona La Manada.',
    mapa:'Has abierto el Mapa de las Tierras. Puedo orientarte entre territorios, alianzas, amenazas y accesos a los recorridos.',
    tour:'Estás recorriendo las tierras de Sangre de Luna. Puedo explicarte cómo avanzar, cambiar de territorio o volver al mapa.',
    viaje:'Has iniciado tu Viaje del Visitante. Puedo ayudarte a comprender la prueba de afinidad, tu función y las misiones.',
    general:'Soy el Cronista de la Ciudadela. Puedo guiarte por el universo de Sangre de Luna.'
  };

  function loadConversation(){
    try{
      const saved=JSON.parse(sessionStorage.getItem(CONVERSATION_KEY)||'[]');
      if(Array.isArray(saved)&&saved.length) return saved.slice(-18);
    }catch(_){ }
    return [{role:'assistant',content:greetingByPage[page]}];
  }
  const conversation=loadConversation();
  function save(){
    try{sessionStorage.setItem(CONVERSATION_KEY,JSON.stringify(conversation.slice(-18)))}catch(_){ }
  }

  const style=document.createElement('style');
  style.id='sdlg-cronista-style';
  style.textContent=`
  .sdlg-cronista{position:fixed;right:22px;bottom:22px;z-index:12000;display:grid;justify-items:end;gap:12px;font-family:Arial,sans-serif;color:#eef7ff}
  .sdlg-launch{position:relative;width:70px;height:70px;border:1px solid rgba(169,223,255,.58);border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#173652,#050b11 68%);box-shadow:0 14px 46px rgba(0,0,0,.72),0 0 30px rgba(91,186,255,.22);cursor:pointer;transition:.25s}
  .sdlg-launch:hover{transform:translateY(-3px) scale(1.03);border-color:#d9f1ff}
  .sdlg-launch img{width:94px;height:94px;max-width:none;position:absolute;left:50%;top:41%;transform:translate(-50%,-36%);object-fit:contain;filter:drop-shadow(0 0 10px rgba(142,211,255,.4))}
  .sdlg-launch:after{content:'';position:absolute;inset:5px;border:1px solid rgba(255,255,255,.2);border-radius:50%;pointer-events:none}
  .sdlg-panel{width:min(405px,calc(100vw - 28px));height:min(650px,78svh);display:none;grid-template-rows:auto 1fr auto;background:linear-gradient(180deg,rgba(7,19,30,.98),rgba(4,10,16,.99));border:1px solid #446b89;border-radius:24px;overflow:hidden;box-shadow:0 28px 90px rgba(0,0,0,.86),0 0 42px rgba(62,169,255,.11);backdrop-filter:blur(18px)}
  .sdlg-panel.open{display:grid;animation:sdlgOpen .25s ease-out}.sdlg-cronista:has(.sdlg-panel.open) .sdlg-launch{display:none}@keyframes sdlgOpen{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
  .sdlg-head{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;padding:14px;border-bottom:1px solid #284156;background:linear-gradient(135deg,#0c2132,#07121c)}
  .sdlg-avatar{width:48px;height:48px;border:1px solid rgba(135,207,255,.45);border-radius:50%;overflow:hidden;background:#06101a;position:relative}.sdlg-avatar img{width:68px;max-width:none;position:absolute;left:50%;top:39%;transform:translate(-50%,-34%)}
  .sdlg-title{min-width:0}.sdlg-title b{display:block;font:700 1.02rem Georgia,serif;color:#fff}.sdlg-title span{display:flex;align-items:center;gap:6px;color:#96aec1;font-size:.7rem}.sdlg-title i{width:7px;height:7px;border-radius:50%;background:#79ddb3;box-shadow:0 0 9px #79ddb3}
  .sdlg-tools{display:flex;gap:5px}.sdlg-tool{min-width:34px;height:34px;padding:0 8px;border:1px solid #34536b;border-radius:10px;background:#08141f;color:#d7eaff;cursor:pointer;font-size:.7rem;font-weight:800}.sdlg-tool:hover{border-color:#80cfff}.sdlg-tool.on{background:#12324a;border-color:#76c9ff}.sdlg-spoilers.on{background:#582b32;border-color:#b75d68;color:#ffe5e8}
  .sdlg-body{overflow:auto;padding:14px;scroll-behavior:smooth}.sdlg-quick{display:flex;gap:7px;overflow:auto;padding:3px 0 12px;scrollbar-width:none}.sdlg-quick::-webkit-scrollbar{display:none}.sdlg-quick button{flex:0 0 auto;padding:7px 10px;border:1px solid #2f5069;border-radius:999px;background:#091722;color:#bcd7eb;font-size:.7rem;font-weight:800;cursor:pointer}.sdlg-quick button:hover{border-color:#82cfff;color:#fff}
  .sdlg-messages{display:grid;gap:10px}.sdlg-message{max-width:88%;padding:10px 12px;border-radius:15px;white-space:pre-wrap;font-size:.88rem;line-height:1.47}.sdlg-message.assistant{justify-self:start;background:#0d2030;border:1px solid #294963;color:#dcecff;border-bottom-left-radius:5px}.sdlg-message.user{justify-self:end;background:linear-gradient(135deg,#bfe8ff,#76c5f7);color:#04101a;border-bottom-right-radius:5px;font-weight:700}.sdlg-message.typing{display:flex;gap:5px;align-items:center;width:54px}.sdlg-message.typing i{width:6px;height:6px;border-radius:50%;background:#8fcfff;animation:sdlgDot 1.1s infinite}.sdlg-message.typing i:nth-child(2){animation-delay:.16s}.sdlg-message.typing i:nth-child(3){animation-delay:.32s}@keyframes sdlgDot{50%{opacity:.3;transform:translateY(-3px)}}
  .sdlg-actions{justify-self:start;display:flex;flex-wrap:wrap;gap:7px;margin-top:-3px;max-width:94%}.sdlg-action{padding:7px 11px;border:1px solid #47708e;border-radius:999px;background:#0a1a27;color:#9dd9ff;font-size:.7rem;font-weight:900;cursor:pointer}.sdlg-action:hover{background:#102a3f;color:#fff}.sdlg-action.primary{background:linear-gradient(135deg,#cdeeff,#75c8fb);border-color:transparent;color:#04111c}
  .sdlg-form{padding:11px 12px 12px;border-top:1px solid #243e53;background:#050d14}.sdlg-inputrow{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end}.sdlg-input{width:100%;min-height:43px;max-height:100px;resize:none;padding:11px 12px;border:1px solid #31516a;border-radius:14px;background:#091722;color:#edf7ff;outline:none;font:inherit}.sdlg-input:focus{border-color:#83cfff;box-shadow:0 0 0 3px rgba(120,200,255,.08)}.sdlg-send{width:44px;height:44px;border:0;border-radius:13px;background:linear-gradient(135deg,#d8f1ff,#72c5fa);color:#04111d;font-size:1.1rem;font-weight:900;cursor:pointer}.sdlg-send:disabled{opacity:.45;cursor:wait}.sdlg-note{display:block;margin-top:7px;color:#6f879a;font-size:.65rem;text-align:center}
  @media(max-width:650px){.sdlg-cronista{right:12px;bottom:14px}.sdlg-panel{position:fixed;right:0;bottom:0;width:100vw;height:min(720px,84svh);border-radius:22px 22px 0 0}.sdlg-launch{width:62px;height:62px}.sdlg-head{gap:8px;padding:11px}.sdlg-title b{font-size:.9rem}.sdlg-title span{font-size:.64rem}.sdlg-tool{padding:0 6px}}
  @media(max-width:400px){.sdlg-head{grid-template-columns:40px minmax(72px,1fr) auto;gap:6px;padding:9px}.sdlg-avatar{width:40px;height:40px}.sdlg-title b{font-size:.78rem;line-height:1.1}.sdlg-title span{display:none}.sdlg-tools{gap:3px}.sdlg-tool{height:32px;min-width:32px}.sdlg-voice{width:32px;padding:0;font-size:0}.sdlg-voice:after{content:'🔇';font-size:.72rem}.sdlg-voice.on:after{content:'🔊'}}
  @media(prefers-reduced-motion:reduce){.sdlg-launch,.sdlg-panel,.sdlg-message.typing i{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  const root=document.createElement('aside');
  root.id='sdlgCronista';
  root.className='sdlg-cronista';
  root.setAttribute('aria-label','Cronista de la Ciudadela');
  root.innerHTML=`
    <section class="sdlg-panel" id="sdlgPanel" aria-hidden="true">
      <header class="sdlg-head">
        <div class="sdlg-avatar"><img src="/assets/logo-oficial.png" alt=""></div>
        <div class="sdlg-title"><b>Cronista de la Ciudadela</b><span><i></i> Guía de ${pageName}</span></div>
        <div class="sdlg-tools"><button class="sdlg-tool sdlg-voice" id="sdlgVoice" type="button">Voz</button><button class="sdlg-tool sdlg-spoilers" id="sdlgSpoilers" type="button">Sin spoilers</button><button class="sdlg-tool" id="sdlgClose" type="button" aria-label="Minimizar">—</button></div>
      </header>
      <div class="sdlg-body" id="sdlgBody">
        <div class="sdlg-quick" id="sdlgQuick"></div>
        <div class="sdlg-messages" id="sdlgMessages" aria-live="polite"></div>
      </div>
      <form class="sdlg-form" id="sdlgForm">
        <div class="sdlg-inputrow"><textarea class="sdlg-input" id="sdlgInput" maxlength="600" rows="1" placeholder="Escribe tu pregunta…" aria-label="Pregunta para el Cronista"></textarea><button class="sdlg-send" id="sdlgSend" type="submit" aria-label="Enviar">➤</button></div>
        <small class="sdlg-note">El mismo Cronista te acompaña por todo Sangre de Luna</small>
      </form>
    </section>
    <button class="sdlg-launch" id="sdlgLaunch" type="button" aria-label="Abrir al Cronista de la Ciudadela" aria-expanded="false"><img src="/assets/logo-oficial.png" alt=""></button>`;
  document.body.appendChild(root);

  const $=s=>root.querySelector(s);
  const panel=$('#sdlgPanel'),messages=$('#sdlgMessages'),body=$('#sdlgBody'),input=$('#sdlgInput'),send=$('#sdlgSend');

  const quickByPage={
    manada:[['Mi credencial','¿Cómo veo o imprimo mi credencial?'],['Desafíos','¿Cómo funcionan los Desafíos de la Manada?'],['Wallpapers','¿Dónde están los wallpapers y contenidos exclusivos?'],['Facciones','Explícame las facciones de La Manada']],
    fanclub:[['Registrarme','¿Cómo me registro en el Fan Club?'],['Iniciar sesión','Ya soy miembro, ¿cómo ingreso?'],['La Manada','¿Qué encuentro dentro de La Manada?']],
    mapa:[['Orientarme','Explícame cómo usar este mapa'],['Territorios','¿Qué territorios puedo explorar?'],['Tours 360°','¿Cómo entro a los recorridos desde el mapa?']],
    tour:[['Cómo avanzar','Explícame cómo usar el recorrido 360°'],['Cambiar territorio','¿Cómo cambio de territorio?'],['Mapa','Quiero volver al Mapa de las Tierras']],
    viaje:[['Mi afinidad','¿Cómo funciona la prueba de afinidad?'],['Misiones','¿Qué son las misiones del Viaje?'],['La Manada','¿Cómo conecto mi viaje con La Manada?']],
    general:[['Guíame','No sé por dónde empezar'],['Personajes','Quiero conocer a los personajes'],['Fan Club','¿Cómo me uno a La Manada?']]
  };
  const quick=quickByPage[page]||quickByPage.general;
  $('#sdlgQuick').innerHTML=quick.map(([label,q])=>`<button type="button" data-q="${q.replace(/"/g,'&quot;')}">${label}</button>`).join('');

  function navAction(href,label,primary=true){return {href,label,primary}}
  function fallbackReply(raw){
    const q=String(raw||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(/hola|buenas|saludos/.test(q)) return {reply:`Saludos. Ahora estás en ${pageName}. Puedo orientarte aquí o acompañarte a cualquier otra zona de Sangre de Luna.`,actions:[navAction('/','IR A LA PORTADA')]};
    if(/credencial|tarjeta/.test(q)) return {reply:'Tu credencial pertenece a la zona privada de La Manada. Inicia sesión, entra a La Manada y abre “Mi credencial”. Desde allí puedes imprimirla o guardarla como PDF.',actions:[navAction('/la-manada#mi-credencial','ABRIR MI CREDENCIAL')]};
    if(/desafio|desafío|insignia|puntos/.test(raw.toLowerCase())) return {reply:'Los Desafíos de la Manada se completan dentro de la zona privada. Allí se guardan tus puntos, insignias y progreso como miembro.',actions:[navAction('/la-manada#desafios','VER DESAFÍOS')]};
    if(/wallpaper|contenido exclusivo|descarga/.test(q)) return {reply:'Los wallpapers y contenidos reservados están en La Manada. Debes tener una sesión de miembro activa para acceder a ellos.',actions:[navAction('/la-manada#zona','ABRIR CONTENIDO EXCLUSIVO')]};
    if(/faccion|facción/.test(raw.toLowerCase())) return {reply:'Las facciones forman parte de la identidad de los miembros del Fan Club. Puedes conocerlas y consultar tu elección dentro de La Manada.',actions:[navAction('/la-manada#fanFactions','VER FACCIONES')]};
    if(/registr|unirme|fan club|fanclub/.test(q)) return {reply:'Para unirte, abre el Fan Club, completa el registro y crea tu membresía. Cuando el acceso sea correcto, el sitio te llevará automáticamente a La Manada.',actions:[navAction('/fanclub','IR AL FAN CLUB')]};
    if(/iniciar sesion|ingresar|ya soy miembro/.test(q)) return {reply:'Abre el Fan Club y utiliza el formulario de ingreso con el correo y la contraseña de tu membresía. Después entrarás a La Manada.',actions:[navAction('/fanclub','INICIAR SESIÓN')]};
    if(/mapa|territorio|tierras/.test(q)) return {reply:'El Mapa de las Tierras conecta los lugares principales de Sangre de Luna. Selecciona una señal holográfica para abrir la ficha del territorio y, cuando exista recorrido, entrar directamente a él.',actions:[navAction('/mapa','ABRIR MAPA')]};
    if(/tour|recorrido|360/.test(q)) return {reply:'En Recorridos puedes explorar los territorios disponibles en 360°. Usa los controles de navegación y los puntos interactivos para avanzar entre escenas.',actions:[navAction('/tour','ABRIR RECORRIDOS')]};
    if(/viaje|afinidad|mision|misión/.test(raw.toLowerCase())) return {reply:'El Viaje del Visitante utiliza decisiones narrativas para revelar tu afinidad dentro de la Manada y luego proponerte misiones conectadas con el mapa y los recorridos.',actions:[navAction('/viaje','CONTINUAR MI VIAJE')]};
    if(/personaje|quien es|quién es|biograf/.test(raw.toLowerCase())) return {reply:'El Archivo de Personajes está en la portada oficial. Allí puedes abrir cada retrato y consultar su ficha publicada.',actions:[navAction('/#personajes','VER PERSONAJES')]};
    if(/historia|capitulo|capítulo|temporada|leer/.test(raw.toLowerCase())) return {reply:'Las historias publicadas están en el Archivo de Historias de la portada. Allí puedes elegir temporada y abrir los capítulos disponibles.',actions:[navAction('/#historias','VER HISTORIAS')]};
    if(/episodio|video|youtube/.test(q)) return {reply:'Los episodios están organizados por temporada en la portada. Pulsa el título de un capítulo disponible para reproducirlo.',actions:[navAction('/#episodios','VER EPISODIOS')]};
    if(/musica|música|cancion|canción|audio/.test(raw.toLowerCase())) return {reply:'La Biblioteca Musical está en la portada de Sangre de Luna. La música ambiental también puede silenciarse desde su control de sonido.',actions:[navAction('/#musica','ESCUCHAR MÚSICA')]};
    if(page==='manada') return {reply:'En La Manada puedo ayudarte a encontrar tu credencial, desafíos, facciones, wallpapers y demás contenido exclusivo. Dime qué quieres abrir.',actions:[navAction('#mi-credencial','CREDENCIAL'),navAction('#desafios','DESAFÍOS',false),navAction('#zona','CONTENIDO',false)]};
    if(page==='fanclub') return {reply:'En esta página puedes registrarte o iniciar sesión. Una vez validado el acceso, entrarás a la zona privada de La Manada.',actions:[navAction('/fanclub','ACCESO FAN CLUB')]};
    if(page==='mapa') return {reply:'Estás en el Mapa de las Tierras. Selecciona un marcador para descubrir el lugar, sus conexiones y los accesos disponibles.',actions:[navAction('/tour','IR A RECORRIDOS')]};
    if(page==='tour') return {reply:'Estás en el Recorrido 360°. Puedo ayudarte a avanzar por las escenas, cambiar de territorio o regresar al mapa.',actions:[navAction('/mapa','VOLVER AL MAPA')]};
    if(page==='viaje') return {reply:'Estás en tu Viaje del Visitante. Continúa las decisiones para descubrir tu afinidad y desbloquear la siguiente misión.',actions:[navAction('/la-manada','IR A LA MANADA')]};
    return {reply:'Puedo guiarte por personajes, historias, episodios, música, mapa, recorridos, Fan Club y La Manada. Dime qué deseas encontrar.',actions:[navAction('/','IR A LA PORTADA')]};
  }

  function renderAction(a,index){
    if(!a?.href||!a?.label) return;
    const b=document.createElement('button');b.type='button';b.className='sdlg-action'+((a.primary||index===0)?' primary':'');b.textContent=a.label;
    b.onclick=()=>{
      let href=a.href;
      if(href.startsWith('#')){
        const target=document.querySelector(href);
        if(target){target.scrollIntoView({behavior:'smooth',block:'start'});close();return}
        href='/'+href;
      }
      location.href=href;
    };
    return b;
  }
  function append(role,text,actions=[]){
    const m=document.createElement('div');m.className='sdlg-message '+role;m.textContent=text;messages.appendChild(m);
    if(actions?.length){const group=document.createElement('div');group.className='sdlg-actions';actions.forEach((a,i)=>{const b=renderAction(a,i);if(b)group.appendChild(b)});if(group.children.length)messages.appendChild(group)}
    body.scrollTop=body.scrollHeight;
  }
  function renderHistory(){
    if(messages.children.length) return;
    conversation.forEach(item=>append(item.role==='user'?'user':'assistant',item.content));
  }
  function typing(on){
    $('#sdlgTyping')?.remove();
    if(!on)return;
    const el=document.createElement('div');el.id='sdlgTyping';el.className='sdlg-message assistant typing';el.innerHTML='<i></i><i></i><i></i>';messages.appendChild(el);body.scrollTop=body.scrollHeight;
  }
  function setBusy(v){busy=v;send.disabled=v;input.disabled=v;typing(v)}

  function chosenVoice(){
    if(!('speechSynthesis'in window))return null;
    const voices=speechSynthesis.getVoices();
    return voices.find(v=>/^es-(EC|MX|US|419)$/i.test(v.lang))||voices.find(v=>/^es[-_]/i.test(v.lang))||null;
  }
  function speak(text){
    if(!voiceEnabled||!('speechSynthesis'in window)||!text)return;
    const id=++speechId;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text.replace(/[•·→↗]/g,' '));const v=chosenVoice();if(v){u.voice=v;u.lang=v.lang}else u.lang='es-MX';u.rate=.87;u.pitch=.78;u.volume=1;u.onend=u.onerror=()=>{if(id===speechId){}};speechSynthesis.speak(u);
  }
  function updateVoice(){const b=$('#sdlgVoice');const available='speechSynthesis'in window;b.disabled=!available;b.classList.toggle('on',available&&voiceEnabled);b.textContent=available?(voiceEnabled?'Voz 🔊':'Voz 🔇'):'Sin voz'}

  async function ask(message){
    const user={role:'user',content:message};conversation.push(user);save();append('user',message);setBusy(true);
    let result=null;
    try{
      const history=conversation.slice(0,-1).slice(-8);
      const response=await fetch('/api/cronista',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,spoilers,history})});
      if(response.ok){const data=await response.json();if(data?.reply)result={reply:String(data.reply),actions:data.navigation?[{...data.navigation,primary:true}]:[]}}
    }catch(_){ }
    if(!result)result=fallbackReply(message);
    setBusy(false);
    conversation.push({role:'assistant',content:result.reply});save();append('assistant',result.reply,result.actions||[]);speak(result.reply);
  }

  function open(){renderHistory();panel.classList.add('open');panel.setAttribute('aria-hidden','false');$('#sdlgLaunch').setAttribute('aria-expanded','true');setTimeout(()=>input.focus(),80)}
  function close(){speechId++;if('speechSynthesis'in window)speechSynthesis.cancel();panel.classList.remove('open');panel.setAttribute('aria-hidden','true');$('#sdlgLaunch').setAttribute('aria-expanded','false')}

  $('#sdlgLaunch').onclick=open;$('#sdlgClose').onclick=close;
  $('#sdlgVoice').onclick=()=>{voiceEnabled=!voiceEnabled;localStorage.setItem(VOICE_KEY,voiceEnabled?'1':'0');if(!voiceEnabled&&'speechSynthesis'in window)speechSynthesis.cancel();updateVoice();if(voiceEnabled)speak('La voz del Cronista te acompaña nuevamente.')};
  $('#sdlgSpoilers').onclick=()=>{spoilers=!spoilers;const b=$('#sdlgSpoilers');b.classList.toggle('on',spoilers);b.textContent=spoilers?'Spoilers activos':'Sin spoilers';const text=spoilers?'Modo con spoilers activado. Solo hablaré de información publicada oficialmente.':'Modo sin spoilers activado. Protegeré los giros importantes.';append('assistant',text);speak(text)};
  $('#sdlgQuick').onclick=e=>{const b=e.target.closest('[data-q]');if(b&&!busy)ask(b.dataset.q)};
  $('#sdlgForm').onsubmit=e=>{e.preventDefault();if(busy)return;const value=input.value.trim();if(!value)return;input.value='';input.style.height='';ask(value)};
  input.oninput=e=>{e.target.style.height='';e.target.style.height=Math.min(e.target.scrollHeight,100)+'px'};
  input.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#sdlgForm').requestSubmit()}};
  updateVoice();if('speechSynthesis'in window)speechSynthesis.addEventListener?.('voiceschanged',updateVoice);

  // El historial compartido permite que el Cronista continúe la misma conversación al cambiar de página.
  try{
    const mem=JSON.parse(sessionStorage.getItem(MEMORY_KEY)||'{}');
    sessionStorage.setItem(MEMORY_KEY,JSON.stringify({...mem,lastSection:page,lastPage:path}));
  }catch(_){ }
})();


/* SANGRE DE LUNA · MÚSICA AMBIENTAL GLOBAL */
(()=>{
  if(document.getElementById('sdlAmbientGlobalLoader')) return;
  const s=document.createElement('script');
  s.id='sdlAmbientGlobalLoader';
  s.src='/ambient-global.js';
  s.defer=true;
  document.head.appendChild(s);
})();
