/* SANGRE DE LUNA · LYKOS UI V5 — estable, sin observadores globales */
(()=>{
  if(window.__SDL_LYKOS_UI_V5__)return;
  window.__SDL_LYKOS_UI_V5__=true;

  const ICON_SOURCE='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@b297c4a187db9fcb0c0173c108513f779b57bb06/lykos-ui-fix.js?v=20260828-3';
  const FALLBACK='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@main/assets/logo-oficial.png';
  let icon=FALLBACK;

  const replaceIdentity=value=>String(value||'')
    .replace(/Soy el Cronista de la Manada/gi,'Soy Lykos, el Guardián de la Ciudadela')
    .replace(/Soy el Cronista de la Ciudadela/gi,'Soy Lykos, el Guardián de la Ciudadela')
    .replace(/La voz del Cronista ha despertado/gi,'La voz de Lykos ha despertado')
    .replace(/Cronista de la Ciudadela/gi,'Lykos, Guardián de la Ciudadela');

  const style=document.createElement('style');
  style.id='sdl-lykos-v5-style';
  style.textContent=`
#cronistaWidget.sdl-lykos-v5,#sdlgCronista.sdl-lykos-v5{position:fixed!important;inset:auto 0 0 0!important;width:100vw!important;max-width:100vw!important;height:0!important;margin:0!important;padding:0!important;overflow:visible!important;z-index:2147482000!important;pointer-events:none!important;transform:none!important}
#cronistaWidget.sdl-lykos-v5 .cronista-launch,#sdlgCronista.sdl-lykos-v5 .sdlg-launch{position:fixed!important;right:max(12px,env(safe-area-inset-right))!important;bottom:max(12px,env(safe-area-inset-bottom))!important;left:auto!important;top:auto!important;width:72px!important;height:72px!important;margin:0!important;padding:0!important;border-radius:50%!important;overflow:hidden!important;pointer-events:auto!important;background:#02080d!important;border:1px solid #b7eaff99!important;box-shadow:0 14px 42px #000c,0 0 30px #77dcff55!important;transform:none!important}
#cronistaWidget.sdl-lykos-v5 .cronista-launch>img:not(.sdl-lykos-photo),#sdlgCronista.sdl-lykos-v5 .sdlg-launch>img:not(.sdl-lykos-photo),#cronistaWidget.sdl-lykos-v5 .sdl-wolf-core,#sdlgCronista.sdl-lykos-v5 .sdl-wolf-core{display:none!important}
.sdl-lykos-photo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:cover!important;object-position:center!important;transform:none!important;filter:brightness(.95) contrast(1.04)!important;pointer-events:none!important}
#cronistaWidget.sdl-lykos-v5 .cronista-panel,#sdlgCronista.sdl-lykos-v5 .sdlg-panel{position:fixed!important;left:auto!important;right:16px!important;top:auto!important;bottom:16px!important;width:min(420px,calc(100vw - 32px))!important;max-width:calc(100vw - 32px)!important;height:min(650px,calc(100dvh - 32px))!important;max-height:calc(100dvh - 32px)!important;min-width:0!important;margin:0!important;transform:none!important;overflow:hidden!important;border-radius:22px!important;pointer-events:auto!important;box-sizing:border-box!important}
#cronistaWidget.sdl-lykos-v5 .cronista-panel.open,#sdlgCronista.sdl-lykos-v5 .sdlg-panel.open{display:grid!important}
#cronistaWidget.sdl-lykos-v5:has(.cronista-panel.open) .cronista-launch,#sdlgCronista.sdl-lykos-v5:has(.sdlg-panel.open) .sdlg-launch{display:none!important}
#cronistaWidget.sdl-lykos-v5 .cronista-head,#sdlgCronista.sdl-lykos-v5 .sdlg-head{grid-template-columns:48px minmax(0,1fr) auto!important;gap:9px!important;padding:12px!important;min-width:0!important;align-items:center!important}
#cronistaWidget.sdl-lykos-v5 .cronista-avatar,#sdlgCronista.sdl-lykos-v5 .sdlg-avatar{width:48px!important;height:48px!important;min-width:48px!important;border-radius:50%!important;overflow:hidden!important;position:relative!important;background:#02080d!important}
#cronistaWidget.sdl-lykos-v5 .cronista-avatar>img:not(.sdl-lykos-photo),#sdlgCronista.sdl-lykos-v5 .sdlg-avatar>img:not(.sdl-lykos-photo),#cronistaWidget.sdl-lykos-v5 .sdl-guardian-avatar,#sdlgCronista.sdl-lykos-v5 .sdl-guardian-avatar{display:none!important}
#cronistaWidget.sdl-lykos-v5 .cronista-title,#sdlgCronista.sdl-lykos-v5 .sdlg-title{min-width:0!important;overflow:hidden!important;text-align:left!important}
#cronistaWidget.sdl-lykos-v5 .cronista-title b,#sdlgCronista.sdl-lykos-v5 .sdlg-title b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;word-break:normal!important;writing-mode:horizontal-tb!important;line-height:1.15!important}
#cronistaWidget.sdl-lykos-v5 .cronista-title span,#sdlgCronista.sdl-lykos-v5 .sdlg-title span{display:flex!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;word-break:normal!important;writing-mode:horizontal-tb!important}
#cronistaWidget.sdl-lykos-v5 .cronista-tools,#sdlgCronista.sdl-lykos-v5 .sdlg-tools{display:flex!important;gap:4px!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:flex-end!important;min-width:0!important}
#cronistaWidget.sdl-lykos-v5 .cronista-tool,#sdlgCronista.sdl-lykos-v5 .sdlg-tool,#cronistaWidget.sdl-lykos-v5 .sdl-guardian-mic,#sdlgCronista.sdl-lykos-v5 .sdl-guardian-mic{flex:0 0 auto!important;min-width:32px!important;height:32px!important;padding:0 7px!important;font-size:.63rem!important}
#cronistaWidget.sdl-lykos-v5 .cronista-body,#sdlgCronista.sdl-lykos-v5 .sdlg-body,#cronistaWidget.sdl-lykos-v5 .cronista-form,#sdlgCronista.sdl-lykos-v5 .sdlg-form{width:100%!important;min-width:0!important}
#cronistaWidget.sdl-lykos-v5 .cronista-quick,#sdlgCronista.sdl-lykos-v5 .sdlg-quick{max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important}
#cronistaWidget.sdl-lykos-v5 .cronista-message,#sdlgCronista.sdl-lykos-v5 .sdlg-message{overflow-wrap:anywhere!important}
@media(max-width:720px){#cronistaWidget.sdl-lykos-v5 .cronista-panel,#sdlgCronista.sdl-lykos-v5 .sdlg-panel{left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;width:auto!important;max-width:none!important;height:min(700px,calc(100dvh - 16px))!important;max-height:calc(100dvh - 16px)!important;border-radius:20px!important}}
@media(max-width:390px){#cronistaWidget.sdl-lykos-v5 .cronista-head,#sdlgCronista.sdl-lykos-v5 .sdlg-head{grid-template-columns:42px minmax(0,1fr)!important;gap:7px!important;padding:9px!important}#cronistaWidget.sdl-lykos-v5 .cronista-avatar,#sdlgCronista.sdl-lykos-v5 .sdlg-avatar{width:42px!important;height:42px!important;min-width:42px!important}#cronistaWidget.sdl-lykos-v5 .cronista-tools,#sdlgCronista.sdl-lykos-v5 .sdlg-tools{grid-column:1/-1!important;width:100%!important;justify-content:flex-end!important;overflow-x:auto!important}#cronistaWidget.sdl-lykos-v5 .cronista-title b,#sdlgCronista.sdl-lykos-v5 .sdlg-title b{font-size:.88rem!important}#cronistaWidget.sdl-lykos-v5 .cronista-title span,#sdlgCronista.sdl-lykos-v5 .sdlg-title span{font-size:.61rem!important}}
`;
  document.head.appendChild(style);

  function setPhoto(target){
    if(!target)return;
    let img=target.querySelector(':scope>.sdl-lykos-photo');
    if(!img){img=document.createElement('img');img.className='sdl-lykos-photo';img.alt='Lykos';img.decoding='async';target.appendChild(img)}
    if(img.src!==icon)img.src=icon;
  }

  function patchRoot(root){
    if(!root)return;
    root.classList.add('sdl-lykos-v5');
    root.setAttribute('aria-label','Lykos, Guardián de la Ciudadela');
    const home=root.id==='cronistaWidget';
    const launch=root.querySelector(home?'#cronistaLaunch':'#sdlgLaunch');
    const avatar=root.querySelector(home?'.cronista-avatar':'.sdlg-avatar');
    setPhoto(launch);setPhoto(avatar);
    if(launch){launch.setAttribute('aria-label','Abrir a Lykos, Guardián de la Ciudadela');launch.title='Lykos · Guardián de la Ciudadela'}
    const title=root.querySelector(home?'.cronista-title b':'.sdlg-title b');
    if(title&&title.textContent!=='LYKOS')title.textContent='LYKOS';
    const sub=root.querySelector(home?'.cronista-title span':'.sdlg-title span');
    if(sub&&sub.textContent.trim()!=='Guardián de la Ciudadela')sub.innerHTML='<i></i> Guardián de la Ciudadela';
  }

  function patchMessages(){
    document.querySelectorAll('.cronista-message,.sdlg-message').forEach(el=>{const next=replaceIdentity(el.textContent);if(next!==el.textContent)el.textContent=next});
  }
  function apply(){patchRoot(document.getElementById('cronistaWidget'));patchRoot(document.getElementById('sdlgCronista'));patchMessages()}

  try{
    const key='sdl-cronista-conversation-v2';
    const arr=JSON.parse(sessionStorage.getItem(key)||'[]');
    if(Array.isArray(arr)){let dirty=false;arr.forEach(m=>{if(m&&typeof m.content==='string'){const n=replaceIdentity(m.content);if(n!==m.content){m.content=n;dirty=true}}});if(dirty)sessionStorage.setItem(key,JSON.stringify(arr))}
  }catch{}

  try{
    if(window.speechSynthesis&&!window.speechSynthesis.__sdlLykosV5){
      const synth=window.speechSynthesis;
      const nativeSpeak=synth.speak.bind(synth);
      synth.speak=utterance=>{try{if(utterance&&typeof utterance.text==='string')utterance.text=replaceIdentity(utterance.text)}catch{}return nativeSpeak(utterance)};
      synth.__sdlLykosV5=true;
    }
  }catch{}

  apply();
  [250,800,1600,3000].forEach(ms=>setTimeout(apply,ms));
  addEventListener('resize',apply,{passive:true});
  document.addEventListener('click',()=>setTimeout(apply,0),true);

  fetch(ICON_SOURCE,{cache:'force-cache'}).then(r=>r.ok?r.text():'').then(text=>{
    const match=text.match(/data:image\/webp;base64,[A-Za-z0-9+/=]+/);
    if(match){icon=match[0];apply()}
  }).catch(()=>{});
})();