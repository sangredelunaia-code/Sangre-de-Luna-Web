/* SANGRE DE LUNA · LYKOS UI V6
   Correccion visual responsive: panel solido, cabecera sin compresion y lobo visible.
*/
(()=>{
  if(window.__SDL_LYKOS_UI_V6__)return;
  window.__SDL_LYKOS_UI_V6__=true;

  const ICON_SOURCE='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@b297c4a187db9fcb0c0173c108513f779b57bb06/lykos-ui-fix.js?v=20260828-3';
  let icon='';

  const style=document.createElement('style');
  style.id='sdl-lykos-v6-style';
  style.textContent=`
#cronistaWidget.sdl-lykos-v6,#sdlgCronista.sdl-lykos-v6{position:fixed!important;inset:auto 0 0 0!important;width:100vw!important;max-width:100vw!important;height:0!important;margin:0!important;padding:0!important;overflow:visible!important;z-index:2147482000!important;pointer-events:none!important;transform:none!important;opacity:1!important;filter:none!important}

#cronistaWidget.sdl-lykos-v6 .cronista-launch,#sdlgCronista.sdl-lykos-v6 .sdlg-launch{position:fixed!important;right:max(16px,env(safe-area-inset-right))!important;bottom:max(16px,env(safe-area-inset-bottom))!important;left:auto!important;top:auto!important;width:76px!important;height:76px!important;margin:0!important;padding:0!important;border-radius:50%!important;overflow:hidden!important;pointer-events:auto!important;background:radial-gradient(circle at 50% 34%,#274d66 0,#07121b 58%,#020609 100%)!important;border:1px solid #c5eeffcc!important;box-shadow:0 16px 46px #000d,0 0 0 1px #7bdcff22,0 0 38px #71d9ff66!important;transform:none!important;opacity:1!important;filter:none!important;isolation:isolate!important}
#cronistaWidget.sdl-lykos-v6 .cronista-launch .sdl-wolf-core,#sdlgCronista.sdl-lykos-v6 .sdlg-launch .sdl-wolf-core{display:grid!important;inset:4px!important;z-index:1!important;filter:brightness(1.18) contrast(1.08)!important}
.sdl-lykos-photo-v6{position:absolute!important;inset:0!important;z-index:3!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:cover!important;object-position:center!important;transform:none!important;filter:brightness(1.28) contrast(1.10) saturate(.92)!important;pointer-events:none!important;opacity:1!important}

#cronistaWidget.sdl-lykos-v6 .cronista-panel,#sdlgCronista.sdl-lykos-v6 .sdlg-panel{position:fixed!important;left:auto!important;right:18px!important;top:auto!important;bottom:18px!important;width:min(430px,calc(100vw - 36px))!important;max-width:calc(100vw - 36px)!important;height:min(650px,calc(100dvh - 36px))!important;max-height:calc(100dvh - 36px)!important;min-width:0!important;margin:0!important;transform:none!important;overflow:hidden!important;border-radius:22px!important;pointer-events:auto!important;box-sizing:border-box!important;opacity:1!important;filter:none!important;isolation:isolate!important;background:linear-gradient(180deg,#081622 0%,#050d14 52%,#03080d 100%)!important;border:1px solid #5c819d!important;box-shadow:0 28px 90px #000f,0 0 44px #4dbdff22!important;backdrop-filter:blur(22px) saturate(1.12)!important;-webkit-backdrop-filter:blur(22px) saturate(1.12)!important;color:#eef8ff!important}
#cronistaWidget.sdl-lykos-v6 .cronista-panel.open,#sdlgCronista.sdl-lykos-v6 .sdlg-panel.open{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important}
#cronistaWidget.sdl-lykos-v6:has(.cronista-panel.open) .cronista-launch,#sdlgCronista.sdl-lykos-v6:has(.sdlg-panel.open) .sdlg-launch{display:none!important}

#cronistaWidget.sdl-lykos-v6 .cronista-head,#sdlgCronista.sdl-lykos-v6 .sdlg-head{display:grid!important;grid-template-columns:50px minmax(0,1fr) auto!important;gap:10px!important;align-items:center!important;padding:13px!important;min-width:0!important;background:linear-gradient(135deg,#10283a,#081520)!important;border-bottom:1px solid #35526a!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-avatar,#sdlgCronista.sdl-lykos-v6 .sdlg-avatar{width:50px!important;height:50px!important;min-width:50px!important;border-radius:50%!important;overflow:hidden!important;position:relative!important;background:radial-gradient(circle,#244d67,#06101a 68%)!important;border:1px solid #9ee2ff99!important;box-shadow:0 0 20px #65ceff22!important}
#cronistaWidget.sdl-lykos-v6 .cronista-avatar .sdl-wolf-core,#sdlgCronista.sdl-lykos-v6 .sdlg-avatar .sdl-wolf-core{display:grid!important;inset:2px!important;z-index:1!important;filter:brightness(1.16)!important}
#cronistaWidget.sdl-lykos-v6 .cronista-title,#sdlgCronista.sdl-lykos-v6 .sdlg-title{min-width:0!important;overflow:visible!important;text-align:left!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-title b,#sdlgCronista.sdl-lykos-v6 .sdlg-title b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;color:#f5fbff!important;font:700 1rem/1.15 Georgia,serif!important;letter-spacing:.03em!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-title span,#sdlgCronista.sdl-lykos-v6 .sdlg-title span{display:flex!important;align-items:center!important;gap:6px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;color:#a7c1d2!important;font-size:.69rem!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-tools,#sdlgCronista.sdl-lykos-v6 .sdlg-tools{display:flex!important;gap:5px!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:flex-end!important;min-width:0!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-tool,#sdlgCronista.sdl-lykos-v6 .sdlg-tool,#cronistaWidget.sdl-lykos-v6 .sdl-guardian-mic,#sdlgCronista.sdl-lykos-v6 .sdl-guardian-mic{flex:0 0 auto!important;min-width:32px!important;height:33px!important;padding:0 7px!important;font-size:.63rem!important;color:#dff3ff!important;background:#091722!important;border-color:#3c6079!important;opacity:1!important}

#cronistaWidget.sdl-lykos-v6 .cronista-body,#sdlgCronista.sdl-lykos-v6 .sdlg-body{width:100%!important;min-width:0!important;min-height:0!important;overflow:auto!important;padding:14px!important;background:linear-gradient(180deg,#06111a 0%,#040b11 100%)!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-quick,#sdlgCronista.sdl-lykos-v6 .sdlg-quick{display:flex!important;gap:7px!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;padding:2px 0 12px!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-quick button,#sdlgCronista.sdl-lykos-v6 .sdlg-quick button{color:#c7dfef!important;background:#0b1b28!important;border-color:#35576f!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-message,#sdlgCronista.sdl-lykos-v6 .sdlg-message{overflow-wrap:anywhere!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-message.assistant,#sdlgCronista.sdl-lykos-v6 .sdlg-message.assistant{background:#0d2232!important;border-color:#31526b!important;color:#deeffa!important}
#cronistaWidget.sdl-lykos-v6 .cronista-message.user,#sdlgCronista.sdl-lykos-v6 .sdlg-message.user{background:linear-gradient(135deg,#d6f1ff,#86cef8)!important;color:#03111b!important}
#cronistaWidget.sdl-lykos-v6 .cronista-form,#sdlgCronista.sdl-lykos-v6 .sdlg-form{width:100%!important;min-width:0!important;padding:11px 12px 12px!important;background:#040b11!important;border-top:1px solid #29465b!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-input,#sdlgCronista.sdl-lykos-v6 .sdlg-input{background:#081722!important;border-color:#365c76!important;color:#eef9ff!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-send,#sdlgCronista.sdl-lykos-v6 .sdlg-send{background:linear-gradient(135deg,#dcf3ff,#75c8f6)!important;color:#04121c!important;opacity:1!important}
#cronistaWidget.sdl-lykos-v6 .cronista-note,#sdlgCronista.sdl-lykos-v6 .sdlg-note{color:#7e98aa!important;opacity:1!important}

@media(max-width:600px){
 #cronistaWidget.sdl-lykos-v6 .cronista-panel,#sdlgCronista.sdl-lykos-v6 .sdlg-panel{left:10px!important;right:10px!important;bottom:max(10px,env(safe-area-inset-bottom))!important;width:auto!important;max-width:none!important;height:min(680px,calc(100dvh - 20px))!important;max-height:calc(100dvh - 20px)!important;border-radius:20px!important}
 #cronistaWidget.sdl-lykos-v6 .cronista-head,#sdlgCronista.sdl-lykos-v6 .sdlg-head{grid-template-columns:46px minmax(0,1fr)!important;gap:8px!important;padding:10px!important}
 #cronistaWidget.sdl-lykos-v6 .cronista-avatar,#sdlgCronista.sdl-lykos-v6 .sdlg-avatar{width:46px!important;height:46px!important;min-width:46px!important}
 #cronistaWidget.sdl-lykos-v6 .cronista-tools,#sdlgCronista.sdl-lykos-v6 .sdlg-tools{grid-column:1/-1!important;width:100%!important;justify-content:flex-start!important;overflow-x:auto!important;padding-top:2px!important;scrollbar-width:none!important}
 #cronistaWidget.sdl-lykos-v6 .cronista-tools::-webkit-scrollbar,#sdlgCronista.sdl-lykos-v6 .sdlg-tools::-webkit-scrollbar{display:none!important}
 #cronistaWidget.sdl-lykos-v6 .cronista-title b,#sdlgCronista.sdl-lykos-v6 .sdlg-title b{font-size:.95rem!important}
 #cronistaWidget.sdl-lykos-v6 .cronista-title span,#sdlgCronista.sdl-lykos-v6 .sdlg-title span{font-size:.66rem!important;white-space:normal!important;line-height:1.2!important}
}
@media(max-width:430px){
 #cronistaWidget.sdl-lykos-v6 .cronista-panel,#sdlgCronista.sdl-lykos-v6 .sdlg-panel{left:8px!important;right:8px!important;bottom:max(8px,env(safe-area-inset-bottom))!important;height:min(640px,calc(100dvh - 16px))!important;max-height:calc(100dvh - 16px)!important}
 #cronistaWidget.sdl-lykos-v6 .cronista-body,#sdlgCronista.sdl-lykos-v6 .sdlg-body{padding:11px!important}
 #cronistaWidget.sdl-lykos-v6 .cronista-form,#sdlgCronista.sdl-lykos-v6 .sdlg-form{padding:9px!important}
 #cronistaWidget.sdl-lykos-v6 .cronista-launch,#sdlgCronista.sdl-lykos-v6 .sdlg-launch{right:12px!important;bottom:12px!important;width:70px!important;height:70px!important}
}
`;
  document.head.appendChild(style);

  function setPhoto(target){
    if(!target||!icon)return;
    let img=target.querySelector(':scope>.sdl-lykos-photo-v6');
    if(!img){img=document.createElement('img');img.className='sdl-lykos-photo-v6';img.alt='Lykos';img.decoding='async';target.appendChild(img)}
    if(img.src!==icon)img.src=icon;
  }

  function patchRoot(root){
    if(!root)return;
    root.classList.remove('sdl-lykos-v4','sdl-lykos-v5');
    root.classList.add('sdl-lykos-v6');
    root.setAttribute('aria-label','Lykos, Guardián de la Ciudadela');
    const home=root.id==='cronistaWidget';
    const launch=root.querySelector(home?'#cronistaLaunch':'#sdlgLaunch');
    const avatar=root.querySelector(home?'.cronista-avatar':'.sdlg-avatar');
    setPhoto(launch);setPhoto(avatar);
    if(launch){launch.setAttribute('aria-label','Abrir a Lykos, Guardián de la Ciudadela');launch.title='Lykos · Guardián de la Ciudadela'}
    const title=root.querySelector(home?'.cronista-title b':'.sdlg-title b');
    if(title)title.textContent='LYKOS';
    const sub=root.querySelector(home?'.cronista-title span':'.sdlg-title span');
    if(sub)sub.innerHTML='<i></i> Guardián de la Ciudadela';
  }

  const apply=()=>{patchRoot(document.getElementById('cronistaWidget'));patchRoot(document.getElementById('sdlgCronista'))};
  apply();
  [250,700,1400,2600].forEach(ms=>setTimeout(apply,ms));
  addEventListener('resize',()=>requestAnimationFrame(apply),{passive:true});
  document.addEventListener('click',()=>setTimeout(apply,0),true);

  fetch(ICON_SOURCE,{cache:'force-cache'}).then(r=>r.ok?r.text():'').then(text=>{
    const match=text.match(/data:image\/webp;base64,[A-Za-z0-9+/=]+/);
    if(match){icon=match[0];apply()}
  }).catch(()=>{});
})();