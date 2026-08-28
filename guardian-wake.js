/* SANGRE DE LUNA · LYKOS WAKE WORD
   Activa al Guardián al reconocer la frase "Lykos Despierta".
   El reconocimiento queda local en el navegador hasta detectar la frase. */
(()=>{
  if(window.__SDL_LYKOS_WAKE__)return;
  window.__SDL_LYKOS_WAKE__=true;

  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const WAKE_LABEL='Lykos Despierta';
  const ROOTS='#cronistaWidget,#sdlgCronista';
  const LAUNCH='#cronistaLaunch,#sdlgLaunch';
  const PANEL='.cronista-panel,.sdlg-panel';
  const INPUT='#cronistaInput,#sdlgInput';
  let wakeRecognition=null;
  let recognizing=false;
  let armed=false;
  let awake=false;
  let restartTimer=0;
  let lastWakeAt=0;

  const normalize=value=>String(value||'')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9ñ ]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();

  const isWakePhrase=value=>{
    const text=normalize(value);
    return /\b(?:lykos|lycos|likos|licos|laikos)\s+despierta\b/.test(text);
  };

  const style=document.createElement('style');
  style.id='sdl-lykos-wake-style';
  style.textContent=`
    ${ROOTS}.sdl-lykos-dormant .cronista-launch,${ROOTS}.sdl-lykos-dormant .sdlg-launch{filter:saturate(.68) brightness(.72)!important;box-shadow:0 12px 40px rgba(0,0,0,.76),0 0 20px rgba(91,170,222,.10)!important;transition:filter .35s ease,box-shadow .35s ease,transform .35s ease}
    ${ROOTS}.sdl-lykos-armed .cronista-launch,${ROOTS}.sdl-lykos-armed .sdlg-launch{filter:saturate(.82) brightness(.88)!important;box-shadow:0 16px 48px rgba(0,0,0,.78),0 0 32px rgba(108,205,255,.24)!important;animation:sdlLykosDormant 2.4s ease-in-out infinite!important}
    ${ROOTS}.sdl-lykos-awake .cronista-launch,${ROOTS}.sdl-lykos-awake .sdlg-launch{filter:none!important;box-shadow:0 18px 56px rgba(0,0,0,.8),0 0 48px rgba(120,216,255,.48)!important}
    .sdl-lykos-arm{position:fixed;right:22px;bottom:118px;z-index:2147483000;display:none;align-items:center;gap:8px;max-width:min(310px,calc(100vw - 30px));padding:10px 13px;border:1px solid rgba(137,214,255,.46);border-radius:999px;background:rgba(4,14,23,.94);color:#e9f8ff;box-shadow:0 16px 52px rgba(0,0,0,.72),0 0 24px rgba(93,190,255,.12);font:800 12px/1.2 Arial,sans-serif;letter-spacing:.02em;cursor:pointer;backdrop-filter:blur(12px)}
    .sdl-lykos-arm.show{display:inline-flex}
    .sdl-lykos-arm strong{color:#9ee2ff}
    .sdl-lykos-toast{position:fixed;left:50%;bottom:28px;z-index:2147483001;transform:translate(-50%,18px);max-width:min(520px,calc(100vw - 34px));padding:11px 15px;border:1px solid rgba(141,220,255,.38);border-radius:14px;background:rgba(3,14,23,.94);color:#e9f8ff;box-shadow:0 20px 70px rgba(0,0,0,.78),0 0 34px rgba(93,199,255,.12);font:700 13px/1.35 Arial,sans-serif;text-align:center;opacity:0;pointer-events:none;transition:.28s ease;backdrop-filter:blur(12px)}
    .sdl-lykos-toast.show{opacity:1;transform:translate(-50%,0)}
    @keyframes sdlLykosDormant{50%{transform:scale(1.025);filter:saturate(.92) brightness(.98)}}
    @media(max-width:650px){.sdl-lykos-arm{right:14px;bottom:98px;font-size:11px}.sdl-lykos-toast{bottom:18px}}
    @media(prefers-reduced-motion:reduce){${ROOTS}.sdl-lykos-armed .cronista-launch,${ROOTS}.sdl-lykos-armed .sdlg-launch{animation:none!important}.sdl-lykos-toast{transition:none}}
  `;
  document.head.appendChild(style);

  const armButton=document.createElement('button');
  armButton.type='button';
  armButton.className='sdl-lykos-arm';
  armButton.innerHTML='🎙 <span>Activar escucha de <strong>Lykos</strong></span>';
  armButton.setAttribute('aria-label','Activar escucha para la frase Lykos Despierta');
  document.body.appendChild(armButton);

  const toast=document.createElement('div');
  toast.className='sdl-lykos-toast';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);

  let toastTimer=0;
  function showToast(message,ms=3000){
    toast.textContent=message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('show'),ms);
  }

  function roots(){return [...document.querySelectorAll(ROOTS)]}
  function refreshVisuals(){
    roots().forEach(root=>{
      root.classList.toggle('sdl-lykos-awake',awake);
      root.classList.toggle('sdl-lykos-armed',!awake&&armed);
      root.classList.toggle('sdl-lykos-dormant',!awake&&!armed);
      root.dataset.lykosWake=awake?'awake':armed?'armed':'dormant';
      const nudge=root.querySelector('#cronistaNudge');
      if(nudge&&!awake){
        nudge.innerHTML=armed
          ? '<b>Lykos está atento.</b>Di “Lykos Despierta” para activar al Guardián.'
          : '<b>Lykos está en reposo.</b>Activa el micrófono y di “Lykos Despierta”.';
      }
    });
  }

  function panelIsOpen(root){
    const panel=root?.querySelector(PANEL);
    if(!panel)return false;
    if(panel.hidden||panel.getAttribute('aria-hidden')==='true')return false;
    const css=getComputedStyle(panel);
    if(css.display==='none'||css.visibility==='hidden'||Number(css.opacity)===0)return false;
    const rect=panel.getBoundingClientRect();
    return rect.width>20&&rect.height>20;
  }

  function openGuardian(){
    for(const root of roots()){
      const launch=root.querySelector(LAUNCH);
      if(launch&&!panelIsOpen(root)){
        const event=new MouseEvent('click',{bubbles:true,cancelable:true,view:window});
        Object.defineProperty(event,'__sdlLykosWake',{value:true});
        launch.dispatchEvent(event);
      }
      const input=root.querySelector(INPUT);
      if(input)setTimeout(()=>input.focus({preventScroll:true}),350);
    }
  }

  function stopWakeRecognition(){
    clearTimeout(restartTimer);
    restartTimer=0;
    try{wakeRecognition?.stop()}catch{}
  }

  function wake(){
    const now=Date.now();
    if(awake||now-lastWakeAt<1600)return;
    lastWakeAt=now;
    awake=true;
    armed=false;
    armButton.classList.remove('show');
    stopWakeRecognition();
    refreshVisuals();
    openGuardian();
    showToast('🐺 Lykos ha despertado. El Guardián está listo.',3600);
    document.dispatchEvent(new CustomEvent('sdl:lykos-awake',{detail:{phrase:WAKE_LABEL}}));
  }

  function scheduleRestart(delay=450){
    if(!Recognition||awake||!armed||document.hidden)return;
    clearTimeout(restartTimer);
    restartTimer=setTimeout(()=>startWakeRecognition(false),delay);
  }

  function buildRecognition(){
    if(!Recognition||wakeRecognition)return;
    wakeRecognition=new Recognition();
    wakeRecognition.lang='es-EC';
    wakeRecognition.interimResults=true;
    wakeRecognition.continuous=true;
    wakeRecognition.maxAlternatives=3;
    wakeRecognition.onstart=()=>{
      recognizing=true;
      armed=true;
      armButton.classList.remove('show');
      refreshVisuals();
    };
    wakeRecognition.onresult=event=>{
      for(let i=event.resultIndex;i<event.results.length;i++){
        const result=event.results[i];
        for(let alt=0;alt<result.length;alt++){
          if(isWakePhrase(result[alt]?.transcript||'')){
            wake();
            return;
          }
        }
      }
    };
    wakeRecognition.onerror=event=>{
      recognizing=false;
      const blocked=event.error==='not-allowed'||event.error==='service-not-allowed';
      if(blocked){
        armed=false;
        refreshVisuals();
        armButton.classList.add('show');
        showToast('Autoriza el micrófono una vez y luego di “Lykos Despierta”.',4200);
        return;
      }
      if(event.error!=='aborted')scheduleRestart(event.error==='network'?1600:600);
    };
    wakeRecognition.onend=()=>{
      recognizing=false;
      if(!awake&&armed)scheduleRestart(400);
    };
  }

  function startWakeRecognition(userInitiated=false){
    if(!Recognition||awake||recognizing)return;
    buildRecognition();
    armed=true;
    refreshVisuals();
    try{
      wakeRecognition.start();
      if(userInitiated)showToast('Escucha activada. Di “Lykos Despierta”.',2800);
    }catch{
      if(userInitiated){
        armed=false;
        refreshVisuals();
        armButton.classList.add('show');
      }else scheduleRestart(800);
    }
  }

  // Mientras Lykos está dormido, pulsar su emblema arma la escucha en vez de abrir el chat.
  document.addEventListener('click',event=>{
    const launch=event.target?.closest?.(LAUNCH);
    if(!launch||awake||event.__sdlLykosWake)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    startWakeRecognition(true);
  },true);

  armButton.addEventListener('click',()=>startWakeRecognition(true));

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      if(!awake)stopWakeRecognition();
      return;
    }
    if(!awake&&armed)scheduleRestart(250);
  });

  const scanObserver=new MutationObserver(refreshVisuals);
  scanObserver.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>scanObserver.disconnect(),22000);

  refreshVisuals();
  if(!Recognition){
    armButton.classList.add('show');
    armButton.disabled=true;
    armButton.innerHTML='🎙 <span>Activación por voz no disponible aquí</span>';
    showToast('Este navegador no admite la activación por voz de Lykos.',4200);
    return;
  }

  // Intento automático: funciona cuando el permiso ya fue concedido.
  // Si el navegador exige interacción, el emblema de Lykos o el botón de permiso lo habilitan.
  setTimeout(()=>startWakeRecognition(false),900);
})();