/* SANGRE DE LUNA · LYKOS ICON V8
   Usa el emblema plateado aprobado como único icono visible.
*/
(()=>{
  if(window.__SDL_LYKOS_ICON_V8__)return;
  window.__SDL_LYKOS_ICON_V8__=true;

  const ICON='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@512137f407dc5a1bff0c7db9ca143bf6255005b2/assets/lykos-guardian-approved.webp';

  const style=document.createElement('style');
  style.id='sdl-lykos-icon-v8-style';
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

    #cronistaLaunch>img:not(.sdl-lykos-photo-v8),
    #sdlgLaunch>img:not(.sdl-lykos-photo-v8),
    .cronista-avatar>img:not(.sdl-lykos-photo-v8),
    .sdlg-avatar>img:not(.sdl-lykos-photo-v8),
    .sdl-lykos-photo-v6,
    .sdl-lykos-photo-v7{
      display:none!important;
      visibility:hidden!important;
    }

    #cronistaWidget .cronista-launch,
    #sdlgCronista .sdlg-launch{
      position:relative!important;
      width:78px!important;
      height:78px!important;
      padding:0!important;
      overflow:hidden!important;
      border-radius:50%!important;
      background:#02080d!important;
      border:1px solid rgba(159,228,255,.82)!important;
      box-shadow:0 14px 42px rgba(0,0,0,.86),0 0 0 3px rgba(111,216,255,.08),0 0 27px rgba(105,212,255,.36)!important;
    }

    .sdl-lykos-photo-v8{
      position:absolute!important;
      inset:3px!important;
      z-index:2147480000!important;
      display:block!important;
      visibility:visible!important;
      opacity:1!important;
      width:calc(100% - 6px)!important;
      height:calc(100% - 6px)!important;
      max-width:none!important;
      max-height:none!important;
      object-fit:cover!important;
      object-position:50% 50%!important;
      border-radius:50%!important;
      transform:none!important;
      filter:brightness(1.07) contrast(1.05)!important;
      pointer-events:none!important;
    }

    #cronistaWidget .cronista-avatar,
    #sdlgCronista .sdlg-avatar{
      position:relative!important;
      overflow:hidden!important;
      border-radius:50%!important;
      background:#02080d!important;
    }

    #cronistaWidget .cronista-avatar .sdl-lykos-photo-v8,
    #sdlgCronista .sdlg-avatar .sdl-lykos-photo-v8{
      inset:1px!important;
      width:calc(100% - 2px)!important;
      height:calc(100% - 2px)!important;
    }

    @media(max-width:600px){
      #cronistaWidget .cronista-launch,
      #sdlgCronista .sdlg-launch{
        width:72px!important;
        height:72px!important;
      }
    }

    @media(max-width:360px){
      #cronistaWidget .cronista-launch,
      #sdlgCronista .sdlg-launch{
        width:68px!important;
        height:68px!important;
      }
    }
  `;
  document.head.appendChild(style);

  function place(target){
    if(!target)return;
    target.querySelectorAll('.sdl-lykos-photo-v6,.sdl-lykos-photo-v7,.sdl-lykos-photo-v8').forEach(el=>el.remove());
    target.querySelectorAll('.sdl-wolf-core,.sdl-guardian-avatar').forEach(el=>{el.style.setProperty('display','none','important');});
    const img=document.createElement('img');
    img.className='sdl-lykos-photo-v8';
    img.src=ICON;
    img.alt='Lykos';
    img.decoding='async';
    img.draggable=false;
    target.appendChild(img);
  }

  function apply(){
    const home=document.getElementById('cronistaWidget');
    const manada=document.getElementById('sdlgCronista');
    if(home){
      place(home.querySelector('#cronistaLaunch'));
      place(home.querySelector('.cronista-avatar'));
    }
    if(manada){
      place(manada.querySelector('#sdlgLaunch'));
      place(manada.querySelector('.sdlg-avatar'));
    }
  }

  const run=()=>requestAnimationFrame(apply);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
  [80,250,700,1400].forEach(ms=>setTimeout(apply,ms));
})();
