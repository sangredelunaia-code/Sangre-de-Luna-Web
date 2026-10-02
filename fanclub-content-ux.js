/* SANGRE DE LUNA · UX DE WALLPAPERS Y CONTENIDO EXCLUSIVO */
(()=>{
  const path=(location.pathname||'/').replace(/\/+$/,'')||'/';
  if(path!=='/la-manada/contenidos')return;

  document.documentElement.classList.add('sdl-content-first');

  const style=document.createElement('style');
  style.id='sdl-content-first-style';
  style.textContent=`
    html.sdl-content-first .manada-hero,
    html.sdl-content-first .sdl-private-page-head{display:none!important}
    html.sdl-content-first #zona{padding-top:28px!important;min-height:auto!important}
    html.sdl-content-first #zona>.w{padding-top:0!important}
    html.sdl-content-first #zona .head{margin-bottom:18px!important;align-items:end}
    html.sdl-content-first #zona .head h2{margin-top:4px;font-size:clamp(2.15rem,4.6vw,3.6rem)}
    html.sdl-content-first #zona .head p{max-width:520px}
    html.sdl-content-first #fanContent{scroll-margin-top:88px}
    html.sdl-content-first .fan-content-grid{margin-top:6px}
    html.sdl-content-first .fan-content{transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
    html.sdl-content-first .fan-content:hover{transform:translateY(-3px);border-color:#5f9bc3;box-shadow:0 16px 38px rgba(0,0,0,.24)}
    @media(max-width:760px){
      html.sdl-content-first #zona{padding-top:20px!important}
      html.sdl-content-first #zona .head{margin-bottom:14px!important}
      html.sdl-content-first #zona .head h2{font-size:clamp(2rem,9vw,2.8rem)}
    }
  `;
  document.head.appendChild(style);

  const rank=card=>{
    const type=(card.querySelector('.ey')?.textContent||'').trim().toUpperCase();
    if(type.includes('WALLPAPER'))return 0;
    if(type.includes('IMAGEN'))return 1;
    return 2;
  };

  let scheduled=false;
  const improve=()=>{
    const zone=document.getElementById('zona');
    if(zone)zone.classList.remove('sdl-route-hidden');

    const grid=document.querySelector('#fanContent .fan-content-grid');
    if(!grid||scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      const cards=[...grid.children];
      const desired=[...cards].sort((a,b)=>rank(a)-rank(b));
      if(desired.some((card,index)=>card!==cards[index]))desired.forEach(card=>grid.appendChild(card));
      scheduled=false;
    });
  };

  const boot=()=>{
    improve();
    const root=document.getElementById('fanContent');
    if(root)new MutationObserver(improve).observe(root,{childList:true,subtree:true});
    requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
