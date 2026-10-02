/* SANGRE DE LUNA · LYKOS WAKE WORD
   Activación ligera por voz: "Lykos Despierta".
   Prioridad: no bloquear la entrada ni la carga inicial del sitio. */
(()=>{
  if(window.__SDL_LYKOS_WAKE__)return;
  window.__SDL_LYKOS_WAKE__=true;

  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const ROOTS='#cronistaWidget,#sdlgCronista';
  const LAUNCH='#cronistaLaunch,#sdlgLaunch';
  const PANEL='.cronista-panel,.sdlg-panel';
  const INPUT='#cronistaInput,#sdlgInput';
  let rec=null,recognizing=false,armed=false,awake=false,restartTimer=0,lastWakeAt=0;

  // El botón de entrada debe responder aunque la configuración remota todavía esté cargando.
  const enter=document.getElementById('enterSite');
  const fastEnter=()=>{
    document.getElementById('splash')?.classList.add('hide');
    try{sessionStorage.setItem('sdl-entered','1')}catch{}
    // Lykos se arma después de entrar, nunca durante la pantalla inicial.
    if(Recognition&&!awake)setTimeout(()=>start(false),1800);
  };
  enter?.addEventListener('click',fastEnter,{capture:true});

  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ ]+/g,' ').replace(/\s+/g,' ').trim();
  const isWake=v=>/\b(?:lykos|lycos|likos|licos|laikos)\s+despierta\b/.test(norm(v));
  const roots=()=>[...document.querySelectorAll(ROOTS)];

  const style=document.createElement('style');
  style.textContent=`
    ${ROOTS}.sdl-lykos-dormant .cronista-launch,${ROOTS}.sdl-lykos-dormant .sdlg-launch{filter:saturate(.72) brightness(.78)!important;transition:.25s}
    ${ROOTS}.sdl-lykos-armed .cronista-launch,${ROOTS}.sdl-lykos-armed .sdlg-launch{filter:saturate(.88) brightness(.92)!important;box-shadow:0 14px 42px #000b,0 0 26px #72c9ff33!important}
    ${ROOTS}.sdl-lykos-awake .cronista-launch,${ROOTS}.sdl-lykos-awake .sdlg-launch{filter:none!important;box-shadow:0 16px 48px #000b,0 0 38px #78d8ff66!important}
    .sdl-lykos-arm{position:fixed;right:18px;bottom:108px;z-index:2147483000;display:none;padding:9px 12px;border:1px solid #89d6ff70;border-radius:999px;background:#04101aee;color:#e9f8ff;font:800 12px Arial;cursor:pointer;box-shadow:0 12px 38px #0009}
    .sdl-lykos-arm.show{display:block}
    .sdl-lykos-toast{position:fixed;left:50%;bottom:24px;z-index:2147483001;transform:translateX(-50%);max-width:calc(100vw - 34px);padding:10px 14px;border:1px solid #8ddcff55;border-radius:14px;background:#03101aee;color:#eefbff;font:700 13px/1.35 Arial;text-align:center;opacity:0;pointer-events:none;transition:opacity .2s}
    .sdl-lykos-toast.show{opacity:1}
    @media(max-width:650px){.sdl-lykos-arm{right:12px;bottom:92px}.sdl-lykos-toast{bottom:16px}}
  `;
  document.head.appendChild(style);

  const arm=document.createElement('button');
  arm.type='button';arm.className='sdl-lykos-arm';arm.textContent='🎙 Activar escucha de Lykos';
  document.body.appendChild(arm);
  const toast=document.createElement('div');toast.className='sdl-lykos-toast';toast.setAttribute('role','status');document.body.appendChild(toast);
  let toastTimer=0;
  const say=(m,ms=2800)=>{toast.textContent=m;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),ms)};

  function sync(){
    roots().forEach(root=>{
      root.classList.toggle('sdl-lykos-awake',awake);
      root.classList.toggle('sdl-lykos-armed',!awake&&armed);
      root.classList.toggle('sdl-lykos-dormant',!awake&&!armed);
    });
  }

  function panelOpen(root){
    const p=root?.querySelector(PANEL);if(!p)return false;
    return p.classList.contains('open')||p.getAttribute('aria-hidden')==='false';
  }

  function openGuardian(){
    roots().forEach(root=>{
      const launch=root.querySelector(LAUNCH);
      if(launch&&!panelOpen(root))launch.click();
      const input=root.querySelector(INPUT);if(input)setTimeout(()=>input.focus({preventScroll:true}),250);
    });
  }

  function stop(){clearTimeout(restartTimer);restartTimer=0;try{rec?.stop()}catch{}}
  function wake(){
    const now=Date.now();if(awake||now-lastWakeAt<1500)return;lastWakeAt=now;
    awake=true;armed=false;arm.classList.remove('show');stop();sync();openGuardian();say('🐺 Lykos ha despertado. El Guardián está listo.',3400);
  }
  function schedule(ms=700){
    if(!Recognition||awake||!armed||document.hidden)return;
    clearTimeout(restartTimer);restartTimer=setTimeout(()=>start(false),ms);
  }
  function build(){
    if(!Recognition||rec)return;
    rec=new Recognition();rec.lang='es-EC';rec.interimResults=false;rec.continuous=false;rec.maxAlternatives=3;
    rec.onstart=()=>{recognizing=true;armed=true;arm.classList.remove('show');sync()};
    rec.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)for(let a=0;a<e.results[i].length;a++)if(isWake(e.results[i][a]?.transcript)){wake();return}};
    rec.onerror=e=>{
      recognizing=false;
      if(e.error==='not-allowed'||e.error==='service-not-allowed'){
        armed=false;sync();arm.classList.add('show');say('Autoriza el micrófono una vez para usar “Lykos Despierta”.',3800);return;
      }
      if(e.error!=='aborted')schedule(e.error==='network'?1800:800);
    };
    rec.onend=()=>{recognizing=false;if(!awake&&armed)schedule(700)};
  }
  function start(user=false){
    if(!Recognition||awake||recognizing||document.hidden)return;
    build();armed=true;sync();
    try{rec.start();if(user)say('Escucha activada. Di “Lykos Despierta”.',2500)}catch{if(user){armed=false;sync();arm.classList.add('show')}else schedule(1000)}
  }

  document.addEventListener('click',e=>{
    const launch=e.target?.closest?.(LAUNCH);if(!launch||awake)return;
    e.preventDefault();e.stopImmediatePropagation();start(true);
  },true);
  arm.addEventListener('click',()=>start(true));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(!awake)stop()}else if(!awake&&armed)schedule(400)});

  // Sin observadores globales: solo sincronizaciones breves para evitar carga extra.
  sync();let scans=0;const scan=setInterval(()=>{sync();if(++scans>=12||roots().length)clearInterval(scan)},500);

  if(!Recognition){arm.disabled=true;arm.textContent='🎙 Activación por voz no disponible';}
  else if(sessionStorage.getItem('sdl-entered'))setTimeout(()=>start(false),2200);
})();
