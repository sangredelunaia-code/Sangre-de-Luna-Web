// Sangre de Luna — SUPREMAS LUNARES · ASCENSO FINAL
// Official 10-card final reward collection. Unlocks after completing mission 20.
(()=>{
  const here=document.currentScript?.src||'';
  const SPRITE=here ? here.replace(/supremas-addon\.js(?:\?.*)?$/,'supremas-lunares-ascenso-final.webp') : 'https://raw.githubusercontent.com/sangredelunaia-code/Sangre-de-Luna-Web/main/game-restored/supremas-lunares-ascenso-final.webp';
  const cards=[
    ['ethan','Ethan'],['peter','Peter'],['tyren','Tyren'],['chris','Chris'],['darien','Darien'],
    ['nine','Nine'],['gabriel','Gabriel'],['sehan','Sehan'],['ella','Ella'],['varkos','Varkos']
  ];

  const st=document.createElement('style');
  st.id='sdlSupremeCardsStyle';
  st.textContent=`
    .sdlSupremeGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin:8px 0 16px}
    .sdlSupremeCard{position:relative;aspect-ratio:2/3;border:1px solid #d8e4ffb0;border-radius:14px;overflow:hidden;background:#040811;box-shadow:0 16px 40px #0009,0 0 0 1px #a9c7ff30 inset,0 0 24px #7da8ff16}
    .sdlSupremeArt{position:absolute;inset:0;background-image:url("${SPRITE}");background-size:500% 200%;background-repeat:no-repeat;background-color:#060a13}
    .sdlSupremeCard:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 55%,#01040bf2 94%);pointer-events:none}
    .sdlSupremeName{position:absolute;z-index:2;left:8px;right:8px;bottom:8px;text-align:center;font:600 15px Georgia;color:#f5f8ff;text-shadow:0 2px 10px #000,0 0 12px #7da8ff55}
    .sdlSupremeTag{position:absolute;z-index:2;top:7px;left:7px;padding:4px 7px;border-radius:999px;background:#040812e6;border:1px solid #c9d9ff88;font-size:8px;letter-spacing:.11em;color:#eef4ff}
    @media(max-width:700px){.sdlSupremeGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.sdlSupremeName{font-size:13px}}
  `;
  document.head.appendChild(st);

  function grid(){
    return `<div class="sdlSupremeGrid" data-reward-tier="suprema-lunar-ascenso-final">${cards.map(([id,name],i)=>`<div class="sdlSupremeCard" data-supreme="${id}"><div class="sdlSupremeArt" style="background-position:${(i%5)*25}% ${Math.floor(i/5)*100}%"></div><span class="sdlSupremeTag">ASCENSO FINAL</span><div class="sdlSupremeName">Suprema Lunar ${name}</div></div>`).join('')}</div>`;
  }

  function mission20Done(){
    try{return !!(typeof sv!=='undefined' && sv && sv.done && Number(sv.done[20]||0)>0)}catch{return false}
  }

  function patch(){
    const mb=document.querySelector('#mb');
    if(!mb)return;
    let title=[...mb.querySelectorAll('.rTier')].find(x=>/SUPREMA/i.test(x.textContent||'')||/ASCENSO\s*FINAL/i.test(x.textContent||''));

    // Fallback: if the restored panel predates the final tier label, add it after Míticas.
    if(!title){
      const myth=document.querySelector('.sdlMythicGrid');
      if(myth && !mb.querySelector('[data-supreme-tier-title]')){
        const t=document.createElement('div');
        t.className='rTier'; t.dataset.supremeTierTitle='1'; t.textContent='SUPREMAS LUNARES · ASCENSO FINAL';
        const g=document.createElement('div');
        g.className='goal'; g.textContent=mission20Done()?'Recompensa final disponible':'Completa la MISIÓN 20 para desbloquear el Ascenso Final.';
        myth.insertAdjacentElement('afterend',t); t.insertAdjacentElement('afterend',g); title=t;
      } else return;
    }

    const next=title.nextElementSibling;
    if(!next||next.classList.contains('sdlSupremeGrid'))return;
    const locked=/MISIÓN\s*20/i.test(next.textContent||'') && !mission20Done();
    if(locked)return;
    if(mission20Done() || /arte adicional pendiente/i.test(next.textContent||'') || /disponible/i.test(next.textContent||'') || next.classList.contains('goal')){
      next.outerHTML=grid();
    }
  }

  const obs=new MutationObserver(()=>setTimeout(patch,0));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('load',patch);
  setTimeout(patch,500);
})();
