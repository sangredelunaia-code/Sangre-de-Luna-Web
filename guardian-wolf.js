/* SANGRE DE LUNA · GUARDIÁN LOBO
   Capa visual e interactiva sobre el asistente existente.
   Mantiene el archivo oficial, memoria y navegación; añade identidad lobo,
   estados visuales y dictado por micrófono cuando el navegador lo permite. */
(()=>{
  if(window.__SDL_GUARDIAN_WOLF__) return;
  window.__SDL_GUARDIAN_WOLF__=true;

  const WOLF='/assets/credencial-lobo-luna.webp';
  const FALLBACK='/assets/logo-oficial.png';
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const upgraded=new WeakSet();

  const style=document.createElement('style');
  style.id='sdl-guardian-wolf-style';
  style.textContent=`
    #cronistaWidget.sdl-guardian-ready,#sdlgCronista.sdl-guardian-ready{--guardian-cyan:#8bd9ff;--guardian-ice:#e8f8ff;--guardian-deep:#04101a;--guardian-line:rgba(139,217,255,.42)}
    #cronistaWidget.sdl-guardian-ready .cronista-panel,#sdlgCronista.sdl-guardian-ready .sdlg-panel{border-color:rgba(128,207,255,.54)!important;box-shadow:0 28px 90px rgba(0,0,0,.88),0 0 50px rgba(62,169,255,.14)!important}
    #cronistaWidget.sdl-guardian-ready .cronista-head,#sdlgCronista.sdl-guardian-ready .sdlg-head{background:linear-gradient(135deg,rgba(9,31,48,.98),rgba(4,13,21,.99))!important;position:relative;overflow:hidden}
    #cronistaWidget.sdl-guardian-ready .cronista-head:after,#sdlgCronista.sdl-guardian-ready .sdlg-head:after{content:'';position:absolute;inset:auto 0 0;height:1px;background:linear-gradient(90deg,transparent,#8bd9ff,transparent);opacity:.7}
    #cronistaWidget.sdl-guardian-ready .cronista-avatar,#sdlgCronista.sdl-guardian-ready .sdlg-avatar{border-color:rgba(171,228,255,.62)!important;background:radial-gradient(circle at 50% 35%,#173c58,#040a10 70%)!important;box-shadow:0 0 20px rgba(94,193,255,.18);overflow:hidden!important}
    #cronistaWidget.sdl-guardian-ready .cronista-avatar img,#sdlgCronista.sdl-guardian-ready .sdlg-avatar img{width:100%!important;height:100%!important;max-width:none!important;left:0!important;top:0!important;transform:none!important;object-fit:cover!important;object-position:center!important;filter:saturate(.82) contrast(1.1) brightness(1.08) drop-shadow(0 0 9px rgba(142,211,255,.28))}
    #cronistaWidget.sdl-guardian-ready .cronista-launch,#sdlgCronista.sdl-guardian-ready .sdlg-launch{width:88px!important;height:88px!important;border-radius:46% 54% 48% 52%/55% 48% 52% 45%!important;border:1px solid rgba(180,230,255,.7)!important;background:radial-gradient(circle at 50% 40%,#143b57,#03080d 72%)!important;box-shadow:0 18px 56px rgba(0,0,0,.78),0 0 40px rgba(74,184,255,.28)!important;overflow:visible!important;isolation:isolate}
    #cronistaWidget.sdl-guardian-ready .cronista-launch:before,#sdlgCronista.sdl-guardian-ready .sdlg-launch:before{content:'';position:absolute;inset:-9px;border-radius:inherit;border:1px solid rgba(113,204,255,.28);box-shadow:inset 0 0 22px rgba(92,192,255,.1);animation:sdlGuardianHalo 3.2s ease-in-out infinite;z-index:-2}
    #cronistaWidget.sdl-guardian-ready .cronista-launch:after,#sdlgCronista.sdl-guardian-ready .sdlg-launch:after{content:''!important;position:absolute!important;inset:-18px!important;border-radius:50%!important;background:conic-gradient(from 0deg,transparent 0 16%,rgba(124,212,255,.26) 22%,transparent 30% 58%,rgba(202,240,255,.18) 66%,transparent 74%)!important;animation:sdlGuardianOrbit 8s linear infinite!important;z-index:-3!important;border:0!important;pointer-events:none}
    #cronistaWidget.sdl-guardian-ready .cronista-launch img,#sdlgCronista.sdl-guardian-ready .sdlg-launch img{position:absolute!important;inset:4px!important;width:calc(100% - 8px)!important;height:calc(100% - 8px)!important;max-width:none!important;transform:none!important;object-fit:cover!important;object-position:center!important;border-radius:43% 57% 48% 52%/55% 46% 54% 45%!important;filter:saturate(.82) contrast(1.13) brightness(1.08) drop-shadow(0 0 12px rgba(133,216,255,.45))!important}
    #cronistaWidget.sdl-guardian-ready[data-guardian-state="listening"] .cronista-launch,#sdlgCronista.sdl-guardian-ready[data-guardian-state="listening"] .sdlg-launch{box-shadow:0 18px 56px rgba(0,0,0,.78),0 0 0 7px rgba(110,213,255,.08),0 0 58px rgba(94,211,255,.62)!important;animation:sdlGuardianListen .9s ease-in-out infinite alternate}
    #cronistaWidget.sdl-guardian-ready[data-guardian-state="thinking"] .cronista-avatar,#sdlgCronista.sdl-guardian-ready[data-guardian-state="thinking"] .sdlg-avatar{animation:sdlGuardianThink 1.05s ease-in-out infinite}
    #cronistaWidget.sdl-guardian-ready[data-guardian-state="speaking"] .cronista-avatar,#sdlgCronista.sdl-guardian-ready[data-guardian-state="speaking"] .sdlg-avatar{box-shadow:0 0 0 4px rgba(121,211,255,.08),0 0 28px rgba(121,211,255,.48)!important;animation:sdlGuardianSpeak .72s ease-in-out infinite alternate}
    .sdl-guardian-mic{min-width:36px;height:34px;padding:0 9px;border:1px solid #34536b;border-radius:10px;background:#08141f;color:#d7eaff;cursor:pointer;font-size:.78rem;font-weight:900;transition:.2s}
    .sdl-guardian-mic:hover{border-color:#80cfff;box-shadow:0 0 16px rgba(102,201,255,.12)}
    .sdl-guardian-mic.listening{background:#12374e;border-color:#8bdcff;color:#fff;box-shadow:0 0 20px rgba(95,203,255,.3);animation:sdlGuardianMic .75s ease-in-out infinite alternate}
    .sdl-guardian-mic:disabled{opacity:.42;cursor:not-allowed}
    .sdl-guardian-state{display:inline-flex!important;align-items:center;gap:6px}
    .sdl-guardian-state:before{content:'';width:7px;height:7px;border-radius:50%;background:#79ddb3;box-shadow:0 0 9px #79ddb3;flex:none}
    [data-guardian-state="listening"] .sdl-guardian-state:before{background:#8bdcff;box-shadow:0 0 12px #8bdcff}
    [data-guardian-state="thinking"] .sdl-guardian-state:before{background:#d7c68b;box-shadow:0 0 12px #d7c68b}
    [data-guardian-state="speaking"] .sdl-guardian-state:before{background:#cfefff;box-shadow:0 0 13px #8bdcff}
    @keyframes sdlGuardianOrbit{to{transform:rotate(360deg)}}
    @keyframes sdlGuardianHalo{50%{transform:scale(1.07);opacity:.45}}
    @keyframes sdlGuardianListen{to{transform:translateY(-2px) scale(1.025)}}
    @keyframes sdlGuardianThink{50%{filter:brightness(1.2);transform:scale(.96)}}
    @keyframes sdlGuardianSpeak{to{transform:scale(1.035)}}
    @keyframes sdlGuardianMic{to{transform:scale(1.06)}}
    @media(max-width:650px){#cronistaWidget.sdl-guardian-ready .cronista-launch,#sdlgCronista.sdl-guardian-ready .sdlg-launch{width:72px!important;height:72px!important}.sdl-guardian-mic{min-width:32px;padding:0 7px}}
    @media(prefers-reduced-motion:reduce){#cronistaWidget.sdl-guardian-ready *,#sdlgCronista.sdl-guardian-ready *{animation:none!important}}
  `;
  document.head.appendChild(style);

  const setWolfImage=img=>{
    if(!img)return;
    img.src=WOLF;
    img.alt='Guardián lobo de Sangre de Luna';
    img.onerror=()=>{img.onerror=null;img.src=FALLBACK};
  };

  function upgrade(root,mode){
    if(!root||upgraded.has(root))return;
    upgraded.add(root);
    root.classList.add('sdl-guardian-ready');
    root.dataset.guardianState='idle';
    root.setAttribute('aria-label','Guardián de la Ciudadela');

    const home=mode==='home';
    const title=root.querySelector(home?'.cronista-title b':'.sdlg-title b');
    const subtitle=root.querySelector(home?'.cronista-title span':'.sdlg-title span');
    const tools=root.querySelector(home?'.cronista-tools':'.sdlg-tools');
    const input=root.querySelector(home?'#cronistaInput':'#sdlgInput');
    const form=root.querySelector(home?'#cronistaForm':'#sdlgForm');
    const launch=root.querySelector(home?'#cronistaLaunch':'#sdlgLaunch');
    const avatar=root.querySelector(home?'.cronista-avatar img':'.sdlg-avatar img');
    const note=root.querySelector(home?'.cronista-note':'.sdlg-note');
    const nudge=root.querySelector('#cronistaNudge');

    if(title)title.textContent='Guardián de la Ciudadela';
    if(subtitle){subtitle.innerHTML='';subtitle.classList.add('sdl-guardian-state');subtitle.append(document.createTextNode('Asistente lobo · Sangre de Luna'))}
    if(note)note.textContent='Voz · Dictado · Memoria de la visita · Archivo oficial';
    if(nudge)nudge.innerHTML='<b>El Guardián está despierto.</b>Puedo escucharte, orientarte y acompañarte por la Ciudadela.';
    if(launch){launch.setAttribute('aria-label','Despertar al Guardián de la Ciudadela');setWolfImage(launch.querySelector('img'))}
    setWolfImage(avatar);

    const replaceVisibleName=node=>{
      if(!node||node.nodeType!==Node.TEXT_NODE)return;
      if(/Cronista de la Ciudadela/i.test(node.nodeValue||''))node.nodeValue=node.nodeValue.replace(/Cronista de la Ciudadela/gi,'Guardián de la Ciudadela');
      else if(/\bCronista\b/i.test(node.nodeValue||''))node.nodeValue=node.nodeValue.replace(/\bCronista\b/gi,'Guardián');
    };
    root.querySelectorAll('*').forEach(el=>el.childNodes.forEach(replaceVisibleName));

    let recognition=null;
    let listening=false;
    const mic=document.createElement('button');
    mic.type='button';mic.className='sdl-guardian-mic';mic.textContent='🎙';mic.title=Recognition?'Hablar con el Guardián':'El dictado por voz no está disponible en este navegador';mic.setAttribute('aria-label','Hablar con el Guardián');
    mic.disabled=!Recognition;
    if(tools)tools.insertBefore(mic,tools.firstChild);

    const setState=state=>{root.dataset.guardianState=state};
    const stopRecognition=()=>{try{recognition?.stop()}catch{}};

    if(Recognition&&input&&form){
      recognition=new Recognition();
      recognition.lang='es-EC';
      recognition.interimResults=true;
      recognition.continuous=false;
      recognition.maxAlternatives=1;
      recognition.onstart=()=>{listening=true;mic.classList.add('listening');mic.textContent='●';mic.title='Escuchando…';setState('listening');if(launch)launch.setAttribute('aria-label','El Guardián está escuchando')};
      recognition.onresult=event=>{
        let finalText='',interim='';
        for(let i=event.resultIndex;i<event.results.length;i++){
          const text=event.results[i][0]?.transcript||'';
          if(event.results[i].isFinal)finalText+=text;else interim+=text;
        }
        input.value=(finalText||interim).trim();
        input.dispatchEvent(new Event('input',{bubbles:true}));
        if(finalText.trim()){
          stopRecognition();
          setTimeout(()=>{if(input.value.trim())form.requestSubmit()},90);
        }
      };
      recognition.onerror=event=>{
        listening=false;mic.classList.remove('listening');mic.textContent='🎙';setState('idle');
        mic.title=event.error==='not-allowed'?'Permite el uso del micrófono en tu navegador':'No pude escuchar con claridad. Intenta nuevamente.';
      };
      recognition.onend=()=>{listening=false;mic.classList.remove('listening');mic.textContent='🎙';if(root.dataset.guardianState==='listening')setState('idle');mic.title='Hablar con el Guardián'};
      mic.onclick=()=>{if(listening){stopRecognition();return}try{recognition.start()}catch{}};
    }

    const observer=new MutationObserver(()=>{
      root.querySelectorAll('*').forEach(el=>el.childNodes.forEach(replaceVisibleName));
      const thinking=Boolean(root.querySelector(home?'#cronistaTyping':'#sdlgTyping'));
      if(!listening&&thinking)setState('thinking');
      else if(!listening&&!thinking&&!('speechSynthesis'in window&&speechSynthesis.speaking))setState('idle');
    });
    observer.observe(root,{childList:true,subtree:true,characterData:true});

    if('speechSynthesis'in window){
      const speechWatch=setInterval(()=>{
        if(!document.documentElement.contains(root)){clearInterval(speechWatch);return}
        if(listening)return;
        const thinking=Boolean(root.querySelector(home?'#cronistaTyping':'#sdlgTyping'));
        if(thinking)setState('thinking');
        else if(speechSynthesis.speaking)setState('speaking');
        else setState('idle');
      },220);
    }
  }

  function scan(){
    upgrade(document.getElementById('cronistaWidget'),'home');
    upgrade(document.getElementById('sdlgCronista'),'global');
  }
  scan();
  const pageObserver=new MutationObserver(scan);
  pageObserver.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>pageObserver.disconnect(),20000);
})();