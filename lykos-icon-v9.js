/* SANGRE DE LUNA · LYKOS ICON V9
   Corrección definitiva: el emblema se aplica como fondo directo con inline !important,
   evitando la regla heredada que oculta los <img> del botón.
*/
(()=>{
  if(window.__SDL_LYKOS_ICON_V9__)return;
  window.__SDL_LYKOS_ICON_V9__=true;

  const ICON='https://sangre-de-luna-public.vercel.app/assets/lykos-guardian-approved.webp?v=20260828-9';

  const style=document.createElement('style');
  style.id='sdl-lykos-icon-v9-style';
  style.textContent=`
    #cronistaWidget .sdl-wolf-core,
    #sdlgCronista .sdl-wolf-core,
    #cronistaWidget .sdl-guardian-avatar,
    #sdlgCronista .sdl-guardian-avatar,
    #cronistaWidget .sdl-wolf-svg,
    #sdlgCronista .sdl-wolf-svg{
      display:none!important;
      visibility:hidden!important;
      opacity:0!important;
    }

    #cronistaLaunch>img,
    #sdlgLaunch>img,
    .cronista-avatar>img,
    .sdlg-avatar>img,
    .sdl-lykos-photo-v6,
    .sdl-lykos-photo-v7,
    .sdl-lykos-photo-v8{
      display:none!important;
      visibility:hidden!important;
      opacity:0!important;
    }

    #cronistaWidget.sdl-guardian-ready #cronistaLaunch.cronista-launch,
    #sdlgCronista.sdl-guardian-ready #sdlgLaunch.sdlg-launch,
    #cronistaWidget #cronistaLaunch.cronista-launch,
    #sdlgCronista #sdlgLaunch.sdlg-launch{
      position:relative!important;
      width:82px!important;
      height:82px!important;
      padding:0!important;
      overflow:hidden!important;
      border-radius:50%!important;
      border:1px solid rgba(159,228,255,.86)!important;
      background-color:#02080d!important;
      background-repeat:no-repeat!important;
      background-position:center!important;
      background-size:cover!important;
      box-shadow:0 14px 42px rgba(0,0,0,.86),0 0 0 3px rgba(111,216,255,.08),0 0 30px rgba(105,212,255,.42)!important;
    }

    #cronistaWidget .cronista-avatar,
    #sdlgCronista .sdlg-avatar{
      position:relative!important;
      overflow:hidden!important;
      border-radius:50%!important;
      background-color:#02080d!important;
      background-repeat:no-repeat!important;
      background-position:center!important;
      background-size:cover!important;
      border-color:rgba(159,228,255,.7)!important;
    }

    #cronistaWidget #cronistaLaunch:before,
    #sdlgCronista #sdlgLaunch:before{
      content:'';
      position:absolute;
      inset:4px;
      border-radius:50%;
      border:1px solid rgba(220,247,255,.25);
      box-shadow:inset 0 0 16px rgba(115,216,255,.12);
      pointer-events:none;
      z-index:2;
    }

    @media(max-width:650px){
      #cronistaWidget.sdl-guardian-ready #cronistaLaunch.cronista-launch,
      #sdlgCronista.sdl-guardian-ready #sdlgLaunch.sdlg-launch,
      #cronistaWidget #cronistaLaunch.cronista-launch,
      #sdlgCronista #sdlgLaunch.sdlg-launch{
        width:72px!important;
        height:72px!important;
      }
    }
  `;
  document.head.appendChild(style);

  function forceBackground(target){
    if(!target)return;
    target.querySelectorAll('.sdl-wolf-core,.sdl-guardian-avatar,.sdl-lykos-photo-v6,.sdl-lykos-photo-v7,.sdl-lykos-photo-v8,.sdl-lykos-photo-v9').forEach(el=>el.remove());
    target.querySelectorAll(':scope > img').forEach(img=>{
      img.style.setProperty('display','none','important');
      img.style.setProperty('visibility','hidden','important');
    });
    target.style.setProperty('background-image',`url("${ICON}")`,'important');
    target.style.setProperty('background-size','cover','important');
    target.style.setProperty('background-position','center','important');
    target.style.setProperty('background-repeat','no-repeat','important');
    target.style.setProperty('background-color','#02080d','important');
  }

  function apply(){
    const home=document.getElementById('cronistaWidget');
    const manada=document.getElementById('sdlgCronista');
    if(home){
      forceBackground(home.querySelector('#cronistaLaunch'));
      forceBackground(home.querySelector('.cronista-avatar'));
    }
    if(manada){
      forceBackground(manada.querySelector('#sdlgLaunch'));
      forceBackground(manada.querySelector('.sdlg-avatar'));
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  [50,150,350,800,1600,3000].forEach(ms=>setTimeout(apply,ms));
})();
