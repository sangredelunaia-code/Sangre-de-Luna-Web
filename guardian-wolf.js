/* SANGRE DE LUNA · LYKOS / GUARDIÁN V2
   - Wake word fiable: "Lykos Despierta"
   - Permiso de micrófono ligado a una acción real del usuario
   - Emblema de lobo vectorial sin imagen cuadrada
   - Sin observadores globales ni trabajo pesado durante el splash
*/
(()=>{
  if(window.__SDL_GUARDIAN_WOLF__)return;
  window.__SDL_GUARDIAN_WOLF__=true;
  // Evita que una versión antigua de guardian-wake.js se active en paralelo.
  window.__SDL_LYKOS_WAKE__=true;

  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const ROOTS='#cronistaWidget,#sdlgCronista';
  const LAUNCH='#cronistaLaunch,#sdlgLaunch';
  const PANEL='.cronista-panel,.sdlg-panel';
  const INPUT='#cronistaInput,#sdlgInput';
  const ENTRY_AUDIO='/assets/wolf-entry.mp3';

  let awake=false;
  let armed=false;
  let wakeRec=null;
  let wakeRunning=false;
  let restartTimer=0;
  let lastWakeAt=0;
  let micState='unknown'; // unknown | prompt | granted | denied | unsupported

  const roots=()=>[...document.querySelectorAll(ROOTS)];
  const norm=v=>String(v||'')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9ñ ]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();

  function distance(a,b){
    a=String(a||'');b=String(b||'');
    const m=Array.from({length:a.length+1},(_,i)=>[i]);
    for(let j=1;j<=b.length;j++)m[0][j]=j;
    for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
      m[i][j]=Math.min(
        m[i-1][j]+1,
        m[i][j-1]+1,
        m[i-1][j-1]+(a[i-1]===b[j-1]?0:1)
      );
    }
    return m[a.length][b.length];
  }

  function isWake(value){
    const t=norm(value);
    if(!t)return false;
    if(/\b(?:lykos|lycos|likos|licos|laikos|laicos|likus|licus|lycus)\s+(?:despierta|despiertame|despiertate)\b/.test(t))return true;
    if(/\b(?:despierta|despiertame|despiertate)\s+(?:lykos|lycos|likos|licos|laikos|laicos|likus|licus|lycus)\b/.test(t))return true;
    const words=t.split(' ');
    const wakeIndex=words.findIndex(w=>w.startsWith('despiert'));
    if(wakeIndex<0)return false;
    return words.some((w,i)=>Math.abs(i-wakeIndex)<=3&&w.length>=4&&distance(w.replace(/^l+y?/,'l'),'likos')<=2);
  }

  const style=document.createElement('style');
  style.textContent=`
    #cronistaWidget.sdl-guardian-ready,#sdlgCronista.sdl-guardian-ready{--lykos:#80d8ff;--lykos2:#d9f6ff}
    #cronistaWidget.sdl-guardian-ready .cronista-launch,#sdlgCronista.sdl-guardian-ready .sdlg-launch{
      width:82px!important;height:82px!important;padding:0!important;border:1px solid #9edfff99!important;
      border-radius:50%!important;background:radial-gradient(circle at 50% 38%,#173c56 0,#07131e 58%,#02070b 100%)!important;
      box-shadow:0 16px 48px #000c,0 0 28px #56c9ff35!important;overflow:visible!important;isolation:isolate;
      transition:filter .25s,box-shadow .25s,transform .25s!important
    }
    #cronistaWidget.sdl-guardian-ready .cronista-launch:hover,#sdlgCronista.sdl-guardian-ready .sdlg-launch:hover{transform:translateY(-2px) scale(1.03)}
    #cronistaWidget.sdl-guardian-ready .cronista-launch>img,#sdlgCronista.sdl-guardian-ready .sdlg-launch>img{display:none!important}
    .sdl-wolf-core{position:absolute;inset:3px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:radial-gradient(circle at 50% 32%,#163a54,#06101a 64%,#02060a);pointer-events:none}
    .sdl-wolf-core:before{content:'';position:absolute;inset:1px;border-radius:50%;border:1px solid #d7f4ff55;box-shadow:inset 0 0 24px #56c8ff1f}
    .sdl-wolf-svg{width:92%;height:92%;overflow:visible;filter:drop-shadow(0 0 7px #65ceff3a)}
    .sdl-wolf-moon{fill:#9bdfff12;stroke:#9bdfff55;stroke-width:1.5}
    .sdl-wolf-head{fill:#0b2132;stroke:#bcecff;stroke-width:2;stroke-linejoin:round}
    .sdl-wolf-ear-in{fill:#5fc7f024;stroke:#6dd2ff99;stroke-width:1.2}
    .sdl-wolf-mask{fill:#143c56;stroke:#8bdcff88;stroke-width:1.2}
    .sdl-wolf-muzzle{fill:#07141e;stroke:#8bdcff66;stroke-width:1.1}
    .sdl-wolf-eye{fill:#79d8ff;filter:drop-shadow(0 0 4px #8ce5ff);transition:.25s}
    .sdl-wolf-nose{fill:#d7f5ff}
    .sdl-wolf-line{fill:none;stroke:#a9e8ff99;stroke-width:1.2;stroke-linecap:round}
    .sdl-wolf-pulse{position:absolute;inset:-5px;border:1px solid #79d9ff66;border-radius:50%;opacity:0;pointer-events:none}
    ${ROOTS}.sdl-lykos-dormant .cronista-launch,${ROOTS}.sdl-lykos-dormant .sdlg-launch{filter:saturate(.72) brightness(.72)!important}
    ${ROOTS}.sdl-lykos-dormant .sdl-wolf-eye{opacity:.34}
    ${ROOTS}.sdl-lykos-armed .cronista-launch,${ROOTS}.sdl-lykos-armed .sdlg-launch{filter:saturate(.96) brightness(.98)!important;box-shadow:0 16px 48px #000c,0 0 36px #72d6ff66!important}
    ${ROOTS}.sdl-lykos-armed .sdl-wolf-pulse{animation:sdlLykosListen 1.8s ease-out infinite}
    ${ROOTS}.sdl-lykos-armed .sdl-wolf-eye{animation:sdlLykosEyes 1.8s ease-in-out infinite}
    ${ROOTS}.sdl-lykos-awake .cronista-launch,${ROOTS}.sdl-lykos-awake .sdlg-launch{filter:none!important;box-shadow:0 16px 52px #000c,0 0 46px #72dfff99!important}
    ${ROOTS}.sdl-lykos-awake .sdl-wolf-core{animation:sdlLykosBreathe 2.7s ease-in-out infinite}
    ${ROOTS}.sdl-lykos-awake .sdl-wolf-eye{fill:#e8fbff;filter:drop-shadow(0 0 7px #90e7ff)}
    ${ROOTS}.sdl-mic-needed .cronista-launch:after,${ROOTS}.sdl-mic-needed .sdlg-launch:after{
      content:'🎙';position:absolute;right:-6px;bottom:-5px;z-index:4;width:26px;height:26px;display:grid;place-items:center;
      border-radius:50%;border:1px solid #8bdcff88;background:#071521;color:white;font-size:12px;box-shadow:0 6px 16px #0009
    }
    .sdl-guardian-avatar{position:absolute;inset:0;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:radial-gradient(circle,#173d57,#06101a 68%)}
    .sdl-guardian-avatar .sdl-wolf-svg{width:88%;height:88%}
    .sdl-guardian-mic{min-width:34px;height:34px;padding:0 8px;border:1px solid #34536b;border-radius:10px;background:#08141f;color:#d7eaff;cursor:pointer;font-weight:900}
    .sdl-guardian-mic.listening{border-color:#8bdcff;background:#12374e;box-shadow:0 0 14px #6ed4ff44}
    .sdl-lykos-arm{position:fixed;right:18px;bottom:108px;z-index:2147483000;display:none;padding:9px 12px;border:1px solid #89d6ff70;border-radius:999px;background:#04101aee;color:#e9f8ff;font:800 12px Arial;cursor:pointer;box-shadow:0 12px 38px #0009;backdrop-filter:blur(10px)}
    .sdl-lykos-arm.show{display:block}
    .sdl-lykos-toast{position:fixed;left:50%;bottom:24px;z-index:2147483001;transform:translateX(-50%);max-width:calc(100vw - 34px);padding:10px 14px;border:1px solid #8ddcff55;border-radius:14px;background:#03101af2;color:#eefbff;font:700 13px/1.35 Arial;text-align:center;opacity:0;pointer-events:none;transition:opacity .2s;box-shadow:0 12px 36px #0009}
    .sdl-lykos-toast.show{opacity:1}
    @keyframes sdlLykosListen{0%{transform:scale(.92);opacity:.72}80%,100%{transform:scale(1.22);opacity:0}}
    @keyframes sdlLykosEyes{0%,100%{opacity:.68}50%{opacity:1}}
    @keyframes sdlLykosBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
    @media(max-width:650px){#cronistaWidget.sdl-guardian-ready .cronista-launch,#sdlgCronista.sdl-guardian-ready .sdlg-launch{width:70px!important;height:70px!important}.sdl-lykos-arm{right:12px;bottom:92px}.sdl-lykos-toast{bottom:16px}}
    @media(prefers-reduced-motion:reduce){.sdl-wolf-pulse,.sdl-wolf-core,.sdl-wolf-eye{animation:none!important}}
  `;
  document.head.appendChild(style);

  const arm=document.createElement('button');
  arm.type='button';
  arm.className='sdl-lykos-arm';
  arm.textContent='🎙 Activar voz de Lykos';
  document.body.appendChild(arm);

  const toast=document.createElement('div');
  toast.className='sdl-lykos-toast';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);
  let toastTimer=0;
  const notify=(m,ms=3000)=>{
    toast.textContent=m;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('show'),ms);
  };

  function wolfMarkup(){
    return `<span class="sdl-wolf-core" aria-hidden="true">
      <svg class="sdl-wolf-svg" viewBox="0 0 120 120" focusable="false">
        <circle class="sdl-wolf-moon" cx="60" cy="60" r="53"/>
        <path class="sdl-wolf-head" d="M31 43 20 17 47 32Q60 23 73 32L100 17 89 43 86 73Q82 91 60 104 38 91 34 73Z"/>
        <path class="sdl-wolf-ear-in" d="M31 38 25 24 43 34ZM89 38 95 24 77 34Z"/>
        <path class="sdl-wolf-mask" d="M39 49Q49 39 60 43Q71 39 81 49L76 66Q68 61 60 64 52 61 44 66Z"/>
        <path class="sdl-wolf-eye" d="M42 52Q50 48 56 53 49 57 43 55ZM78 52Q70 48 64 53 71 57 77 55Z"/>
        <path class="sdl-wolf-muzzle" d="M46 68Q60 61 74 68L70 86 60 96 50 86Z"/>
        <path class="sdl-wolf-nose" d="M54 72Q60 69 66 72L63 77H57Z"/>
        <path class="sdl-wolf-line" d="M60 77V88M53 88Q60 93 67 88"/>
      </svg>
      <span class="sdl-wolf-pulse"></span>
    </span>`;
  }

  function sync(){
    roots().forEach(root=>{
      root.classList.toggle('sdl-lykos-awake',awake);
      root.classList.toggle('sdl-lykos-armed',!awake&&armed);
      root.classList.toggle('sdl-lykos-dormant',!awake&&!armed);
      root.classList.toggle('sdl-mic-needed',!awake&&micState!=='granted');
    });
  }

  function mountWolf(target,avatar=false){
    if(!target||target.dataset.lykosWolf==='1')return;
    target.dataset.lykosWolf='1';
    target.querySelectorAll(':scope > img').forEach(img=>img.style.display='none');
    if(avatar){
      const wrap=document.createElement('span');
      wrap.className='sdl-guardian-avatar';
      wrap.innerHTML=wolfMarkup().replace('class="sdl-wolf-core"','class="sdl-wolf-core sdl-guardian-avatar-core"');
      target.appendChild(wrap);
    }else target.insertAdjacentHTML('beforeend',wolfMarkup());
  }

  function upgrade(root,home){
    if(!root)return;
    root.classList.add('sdl-guardian-ready');
    const title=root.querySelector(home?'.cronista-title b':'.sdlg-title b');
    if(title)title.textContent='LYKOS · Guardián de la Ciudadela';
    const sub=root.querySelector(home?'.cronista-title span':'.sdlg-title span');
    if(sub)sub.textContent='Asistente lobo · Sangre de Luna';

    const launch=root.querySelector(home?'#cronistaLaunch':'#sdlgLaunch');
    if(launch){
      mountWolf(launch,false);
      launch.setAttribute('aria-label','Abrir a Lykos, Guardián de la Ciudadela');
      launch.title=micState==='granted'?'Lykos está escuchando':'Lykos · activa el micrófono para usar la frase de despertar';
    }

    const avatar=root.querySelector(home?'.cronista-avatar':'.sdlg-avatar');
    if(avatar)mountWolf(avatar,true);

    const input=root.querySelector(home?'#cronistaInput':'#sdlgInput');
    const form=root.querySelector(home?'#cronistaForm':'#sdlgForm');
    const tools=root.querySelector(home?'.cronista-tools':'.sdlg-tools');
    if(Recognition&&input&&form&&tools&&!tools.querySelector('.sdl-guardian-mic')){
      const mic=document.createElement('button');
      mic.type='button';mic.className='sdl-guardian-mic';mic.textContent='🎙';mic.title='Hablar con Lykos';
      tools.insertBefore(mic,tools.firstChild);
      const dict=new Recognition();
      dict.lang='es-EC';dict.interimResults=false;dict.continuous=false;dict.maxAlternatives=2;
      dict.onstart=()=>mic.classList.add('listening');
      dict.onend=()=>mic.classList.remove('listening');
      dict.onerror=()=>mic.classList.remove('listening');
      dict.onresult=e=>{
        const t=e.results?.[0]?.[0]?.transcript?.trim();
        if(t){
          input.value=t;
          input.dispatchEvent(new Event('input',{bubbles:true}));
          setTimeout(()=>form.requestSubmit(),80);
        }
      };
      mic.onclick=async()=>{
        if(micState!=='granted'){
          const ok=await ensureMicrophone(true);
          if(!ok)return;
        }
        try{dict.start()}catch{}
      };
    }
  }

  function scan(){
    upgrade(document.getElementById('cronistaWidget'),true);
    upgrade(document.getElementById('sdlgCronista'),false);
    sync();
  }

  function panelOpen(root){
    const p=root?.querySelector(PANEL);
    return !!p&&(p.classList.contains('open')||p.getAttribute('aria-hidden')==='false');
  }

  function openGuardian(){
    roots().forEach(root=>{
      const launch=root.querySelector(LAUNCH);
      if(launch&&!panelOpen(root))launch.click();
      const input=root.querySelector(INPUT);
      if(input)setTimeout(()=>input.focus({preventScroll:true}),260);
    });
  }

  function stopWake(){
    clearTimeout(restartTimer);restartTimer=0;
    try{wakeRec?.stop()}catch{}
  }

  function playWakeSound(){
    try{
      const audio=new Audio(ENTRY_AUDIO);
      audio.volume=.42;
      audio.play().catch(()=>{});
    }catch{}
  }

  function wake(){
    const now=Date.now();
    if(awake||now-lastWakeAt<1300)return;
    lastWakeAt=now;
    awake=true;armed=false;
    arm.classList.remove('show');
    stopWake();sync();scan();
    playWakeSound();
    openGuardian();
    notify('🐺 Lykos ha despertado. El Guardián está listo.',3600);
    window.dispatchEvent(new CustomEvent('sdl:lykos-awake'));
  }

  function scheduleWake(ms=650){
    if(!Recognition||awake||!armed||document.hidden||micState!=='granted')return;
    clearTimeout(restartTimer);
    restartTimer=setTimeout(()=>startWake(false),ms);
  }

  function buildWake(){
    if(!Recognition||wakeRec)return;
    wakeRec=new Recognition();
    wakeRec.lang='es-EC';
    wakeRec.interimResults=true;
    wakeRec.continuous=true;
    wakeRec.maxAlternatives=5;
    wakeRec.onstart=()=>{
      wakeRunning=true;armed=true;micState='granted';
      arm.classList.remove('show');sync();scan();
    };
    wakeRec.onresult=e=>{
      for(let i=e.resultIndex;i<e.results.length;i++){
        const result=e.results[i];
        for(let a=0;a<result.length;a++){
          const transcript=result[a]?.transcript||'';
          if(isWake(transcript)){wake();return;}
        }
      }
    };
    wakeRec.onerror=e=>{
      wakeRunning=false;
      if(e.error==='not-allowed'||e.error==='service-not-allowed'){
        micState='denied';armed=false;sync();scan();
        arm.classList.add('show');
        notify('El micrófono está bloqueado. Pulsa “Activar voz de Lykos” y autorízalo.',4200);
        return;
      }
      if(e.error==='audio-capture'){
        armed=false;sync();
        notify('No encuentro un micrófono disponible.',3200);
        return;
      }
      if(e.error!=='aborted'&&e.error!=='no-speech')scheduleWake(e.error==='network'?1800:850);
    };
    wakeRec.onend=()=>{
      wakeRunning=false;
      if(!awake&&armed&&micState==='granted')scheduleWake(500);
    };
  }

  function startWake(user=false){
    if(!Recognition||awake||wakeRunning||document.hidden)return;
    if(micState!=='granted'){
      if(user)ensureMicrophone(true);
      return;
    }
    buildWake();armed=true;sync();scan();
    try{
      wakeRec.start();
      if(user)notify('🎙 Lykos está escuchando. Di “Lykos Despierta”.',3000);
    }catch{
      if(user){armed=false;sync();arm.classList.add('show')}
      else scheduleWake(900);
    }
  }

  async function ensureMicrophone(user=false){
    if(!Recognition){
      micState='unsupported';sync();
      if(user)notify('La activación por voz no está disponible en este navegador.',3600);
      return false;
    }
    if(!navigator.mediaDevices?.getUserMedia){
      micState='unsupported';sync();
      if(user)notify('Este navegador no permite activar el micrófono desde la página.',3600);
      return false;
    }
    try{
      // La llamada se hace directamente desde el clic del usuario cuando corresponde.
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      stream.getTracks().forEach(t=>t.stop());
      micState='granted';
      try{localStorage.setItem('sdl-lykos-mic-ready','1')}catch{}
      arm.classList.remove('show');sync();scan();
      startWake(user);
      return true;
    }catch(err){
      micState='denied';armed=false;sync();scan();
      arm.classList.add('show');
      if(user)notify('Autoriza el micrófono para que Lykos pueda oír “Lykos Despierta”.',4200);
      return false;
    }
  }

  async function inspectPermission(){
    if(!Recognition){micState='unsupported';sync();return;}
    try{
      if(navigator.permissions?.query){
        const p=await navigator.permissions.query({name:'microphone'});
        micState=p.state;
        p.onchange=()=>{
          micState=p.state;sync();scan();
          if(micState==='granted'&&!awake)startWake(false);
          else if(micState!=='granted')arm.classList.add('show');
        };
        if(micState==='granted')startWake(false);
        else if(micState==='denied')arm.classList.add('show');
        else if(micState==='prompt')arm.classList.add('show');
        sync();scan();
        return;
      }
    }catch{}
    try{
      if(localStorage.getItem('sdl-lykos-mic-ready')==='1'){
        micState='granted';sync();startWake(false);return;
      }
    }catch{}
    micState='prompt';sync();arm.classList.add('show');
  }

  // El clic de entrada desbloquea el audio/micrófono sin bloquear la navegación.
  const enter=document.getElementById('enterSite');
  enter?.addEventListener('click',()=>{
    document.getElementById('splash')?.classList.add('hide');
    try{sessionStorage.setItem('sdl-entered','1')}catch{}
    // getUserMedia se invoca en el mismo gesto de usuario para que Chrome/Edge puedan pedir permiso.
    if(Recognition&&!awake)ensureMicrophone(false);
  },{capture:true});

  // El botón flotante aparece sólo cuando hace falta conceder/reconceder permiso.
  arm.onclick=()=>ensureMicrophone(true);

  // El icono sigue funcionando como apertura manual; no lo bloqueamos para forzar la voz.
  document.addEventListener('click',e=>{
    const launch=e.target?.closest?.(LAUNCH);
    if(!launch)return;
    if(!awake&&micState!=='granted')setTimeout(()=>arm.classList.add('show'),120);
  },true);

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(!awake)stopWake();}
    else if(!awake&&micState==='granted'){armed=true;scheduleWake(350);}
  });

  scan();
  setTimeout(scan,500);
  setTimeout(scan,1500);

  if(!Recognition){
    micState='unsupported';
    arm.disabled=true;
    arm.textContent='🎙 Voz no disponible';
    sync();
  }else{
    const entered=(()=>{try{return sessionStorage.getItem('sdl-entered')==='1'}catch{return false}})();
    if(entered)setTimeout(inspectPermission,450);
    else{
      // Antes de entrar sólo preparamos la interfaz; nada escucha en segundo plano.
      micState='unknown';sync();
    }
  }
})();
