/* SANGRE DE LUNA · LYKOS / GUARDIÁN LIGERO
   Hotfix de rendimiento: sin observadores globales ni escucha durante el splash. */
(()=>{
  if(window.__SDL_GUARDIAN_WOLF__)return;
  window.__SDL_GUARDIAN_WOLF__=true;
  // Neutraliza la versión antigua de guardian-wake.js que producción aún puede tener cacheada.
  window.__SDL_LYKOS_WAKE__=true;

  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const WOLF='/assets/credencial-lobo-luna.webp';
  const FALLBACK='/assets/logo-oficial.png';
  const ROOTS='#cronistaWidget,#sdlgCronista';
  const LAUNCH='#cronistaLaunch,#sdlgLaunch';
  const PANEL='.cronista-panel,.sdlg-panel';
  const INPUT='#cronistaInput,#sdlgInput';
  let awake=false,armed=false,wakeRec=null,wakeRunning=false,restartTimer=0;

  // Entrada inmediata: nunca depende de Supabase ni de Lykos.
  const fastEnter=()=>{
    document.getElementById('splash')?.classList.add('hide');
    try{sessionStorage.setItem('sdl-entered','1')}catch{}
    if(Recognition&&!awake)setTimeout(()=>startWake(false),1800);
  };
  document.getElementById('enterSite')?.addEventListener('click',fastEnter,{capture:true});

  const style=document.createElement('style');
  style.textContent=`
    #cronistaWidget.sdl-guardian-ready,#sdlgCronista.sdl-guardian-ready{--gc:#8bd9ff}
    #cronistaWidget.sdl-guardian-ready .cronista-avatar img,#sdlgCronista.sdl-guardian-ready .sdlg-avatar img{width:100%!important;height:100%!important;max-width:none!important;left:0!important;top:0!important;transform:none!important;object-fit:cover!important;object-position:center!important}
    #cronistaWidget.sdl-guardian-ready .cronista-launch,#sdlgCronista.sdl-guardian-ready .sdlg-launch{width:82px!important;height:82px!important;border:1px solid #b4e6ff99!important;border-radius:48%!important;background:radial-gradient(circle,#143b57,#03080d 72%)!important;box-shadow:0 16px 48px #000c,0 0 30px #4ab8ff33!important}
    #cronistaWidget.sdl-guardian-ready .cronista-launch img,#sdlgCronista.sdl-guardian-ready .sdlg-launch img{position:absolute!important;inset:4px!important;width:calc(100% - 8px)!important;height:calc(100% - 8px)!important;max-width:none!important;transform:none!important;object-fit:cover!important;border-radius:46%!important}
    ${ROOTS}.sdl-lykos-dormant .cronista-launch,${ROOTS}.sdl-lykos-dormant .sdlg-launch{filter:saturate(.72) brightness(.78)!important}
    ${ROOTS}.sdl-lykos-armed .cronista-launch,${ROOTS}.sdl-lykos-armed .sdlg-launch{filter:saturate(.9) brightness(.94)!important;box-shadow:0 16px 48px #000c,0 0 34px #72c9ff55!important}
    ${ROOTS}.sdl-lykos-awake .cronista-launch,${ROOTS}.sdl-lykos-awake .sdlg-launch{filter:none!important;box-shadow:0 16px 48px #000c,0 0 42px #78d8ff77!important}
    .sdl-guardian-mic{min-width:34px;height:34px;padding:0 8px;border:1px solid #34536b;border-radius:10px;background:#08141f;color:#d7eaff;cursor:pointer;font-weight:900}.sdl-guardian-mic.listening{border-color:#8bdcff;background:#12374e}
    .sdl-lykos-arm{position:fixed;right:18px;bottom:108px;z-index:2147483000;display:none;padding:9px 12px;border:1px solid #89d6ff70;border-radius:999px;background:#04101aee;color:#e9f8ff;font:800 12px Arial;cursor:pointer;box-shadow:0 12px 38px #0009}.sdl-lykos-arm.show{display:block}
    .sdl-lykos-toast{position:fixed;left:50%;bottom:24px;z-index:2147483001;transform:translateX(-50%);max-width:calc(100vw - 34px);padding:10px 14px;border:1px solid #8ddcff55;border-radius:14px;background:#03101aee;color:#eefbff;font:700 13px/1.35 Arial;text-align:center;opacity:0;pointer-events:none;transition:opacity .2s}.sdl-lykos-toast.show{opacity:1}
    @media(max-width:650px){#cronistaWidget.sdl-guardian-ready .cronista-launch,#sdlgCronista.sdl-guardian-ready .sdlg-launch{width:70px!important;height:70px!important}.sdl-lykos-arm{right:12px;bottom:92px}.sdl-lykos-toast{bottom:16px}}
  `;
  document.head.appendChild(style);

  const arm=document.createElement('button');arm.type='button';arm.className='sdl-lykos-arm';arm.textContent='🎙 Activar escucha de Lykos';document.body.appendChild(arm);
  const toast=document.createElement('div');toast.className='sdl-lykos-toast';toast.setAttribute('role','status');document.body.appendChild(toast);
  let toastTimer=0;const notify=(m,ms=2800)=>{toast.textContent=m;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),ms)};
  const roots=()=>[...document.querySelectorAll(ROOTS)];
  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ ]+/g,' ').replace(/\s+/g,' ').trim();
  const isWake=v=>/\b(?:lykos|lycos|likos|licos|laikos)\s+despierta\b/.test(norm(v));
  const setWolf=img=>{if(!img)return;img.src=WOLF;img.alt='Lykos, Guardián de la Ciudadela';img.onerror=()=>{img.onerror=null;img.src=FALLBACK}};

  function syncWake(){roots().forEach(r=>{r.classList.toggle('sdl-lykos-awake',awake);r.classList.toggle('sdl-lykos-armed',!awake&&armed);r.classList.toggle('sdl-lykos-dormant',!awake&&!armed)})}
  function upgrade(root,home){
    if(!root||root.dataset.guardianLite==='1')return;root.dataset.guardianLite='1';root.classList.add('sdl-guardian-ready');
    const title=root.querySelector(home?'.cronista-title b':'.sdlg-title b');if(title)title.textContent='Guardián de la Ciudadela';
    const sub=root.querySelector(home?'.cronista-title span':'.sdlg-title span');if(sub)sub.textContent='Asistente lobo · Sangre de Luna';
    const launch=root.querySelector(home?'#cronistaLaunch':'#sdlgLaunch');setWolf(launch?.querySelector('img'));
    setWolf(root.querySelector(home?'.cronista-avatar img':'.sdlg-avatar img'));
    const input=root.querySelector(home?'#cronistaInput':'#sdlgInput'),form=root.querySelector(home?'#cronistaForm':'#sdlgForm'),tools=root.querySelector(home?'.cronista-tools':'.sdlg-tools');
    if(Recognition&&input&&form&&tools&&!tools.querySelector('.sdl-guardian-mic')){
      const mic=document.createElement('button');mic.type='button';mic.className='sdl-guardian-mic';mic.textContent='🎙';mic.title='Hablar con el Guardián';tools.insertBefore(mic,tools.firstChild);
      const dict=new Recognition();dict.lang='es-EC';dict.interimResults=false;dict.continuous=false;dict.maxAlternatives=1;
      dict.onstart=()=>mic.classList.add('listening');dict.onend=()=>mic.classList.remove('listening');dict.onerror=()=>mic.classList.remove('listening');
      dict.onresult=e=>{const t=e.results?.[0]?.[0]?.transcript?.trim();if(t){input.value=t;input.dispatchEvent(new Event('input',{bubbles:true}));setTimeout(()=>form.requestSubmit(),80)}};
      mic.onclick=()=>{try{dict.start()}catch{}};
    }
  }
  function scan(){upgrade(document.getElementById('cronistaWidget'),true);upgrade(document.getElementById('sdlgCronista'),false);syncWake()}
  scan();setTimeout(scan,700);setTimeout(scan,2200);

  function stopWake(){clearTimeout(restartTimer);try{wakeRec?.stop()}catch{}}
  function scheduleWake(ms=800){if(!Recognition||awake||!armed||document.hidden)return;clearTimeout(restartTimer);restartTimer=setTimeout(()=>startWake(false),ms)}
  function buildWake(){
    if(!Recognition||wakeRec)return;wakeRec=new Recognition();wakeRec.lang='es-EC';wakeRec.interimResults=false;wakeRec.continuous=false;wakeRec.maxAlternatives=3;
    wakeRec.onstart=()=>{wakeRunning=true;armed=true;arm.classList.remove('show');syncWake()};
    wakeRec.onresult=e=>{for(let i=0;i<e.results.length;i++)for(let a=0;a<e.results[i].length;a++)if(isWake(e.results[i][a]?.transcript)){awake=true;armed=false;stopWake();syncWake();roots().forEach(r=>{const p=r.querySelector(PANEL),l=r.querySelector(LAUNCH);if(l&&!(p?.classList.contains('open')||p?.getAttribute('aria-hidden')==='false'))l.click();setTimeout(()=>r.querySelector(INPUT)?.focus({preventScroll:true}),250)});notify('🐺 Lykos ha despertado. El Guardián está listo.',3400);return}};
    wakeRec.onerror=e=>{wakeRunning=false;if(e.error==='not-allowed'||e.error==='service-not-allowed'){armed=false;syncWake();arm.classList.add('show');notify('Autoriza el micrófono una vez para usar “Lykos Despierta”.',3800)}else if(e.error!=='aborted')scheduleWake(e.error==='network'?1800:900)};
    wakeRec.onend=()=>{wakeRunning=false;if(!awake&&armed)scheduleWake(800)};
  }
  function startWake(user=false){if(!Recognition||awake||wakeRunning||document.hidden)return;buildWake();armed=true;syncWake();try{wakeRec.start();if(user)notify('Escucha activada. Di “Lykos Despierta”.',2500)}catch{if(user){armed=false;syncWake();arm.classList.add('show')}else scheduleWake(1000)}}

  document.addEventListener('click',e=>{const l=e.target?.closest?.(LAUNCH);if(!l||awake)return;e.preventDefault();e.stopImmediatePropagation();startWake(true)},true);
  arm.onclick=()=>startWake(true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(!awake)stopWake()}else if(!awake&&armed)scheduleWake(500)});
  if(!Recognition){arm.disabled=true;arm.textContent='🎙 Activación por voz no disponible'}
  else if(sessionStorage.getItem('sdl-entered'))setTimeout(()=>startWake(false),2200);
})();
