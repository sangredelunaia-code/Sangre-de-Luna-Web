// Sangre de Luna — MÍTICAS · ASCENSO IV
// Official 10-card reward collection. Unlocks after mission 18.
(()=>{
  const here=document.currentScript?.src||'';
  const SPRITE=here ? here.replace(/miticas-addon\.js(?:\?.*)?$/,'miticas-ascenso4.webp') : 'https://raw.githubusercontent.com/sangredelunaia-code/Sangre-de-Luna-Web/main/game-restored/miticas-ascenso4.webp';
  const cards=[
    ['ethan','Ethan'],['nine','Nine'],['peter','Peter'],['tyren','Tyren'],['ella','Ella'],
    ['chris','Chris'],['darien','Darien'],['varkos','Varkos'],['gabriel','Gabriel'],['sehan','Sehan']
  ];

  const st=document.createElement('style');
  st.id='sdlMythicCardsStyle';
  st.textContent=`
    .sdlMythicGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin:8px 0 14px}
    .sdlMythicCard{position:relative;aspect-ratio:2/3;border:1px solid #c9bddf99;border-radius:14px;overflow:hidden;background:#070912;box-shadow:0 14px 35px #0008,0 0 0 1px #7c65a522 inset}
    .sdlMythicArt{position:absolute;inset:0;background-image:url("${SPRITE}");background-size:500% 200%;background-repeat:no-repeat;background-color:#090b12}
    .sdlMythicCard:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 56%,#02040af2 94%);pointer-events:none}
    .sdlMythicName{position:absolute;z-index:2;left:8px;right:8px;bottom:8px;text-align:center;font:600 16px Georgia;color:#f4e9ff;text-shadow:0 2px 9px #000}
    .sdlMythicTag{position:absolute;z-index:2;top:7px;left:7px;padding:4px 7px;border-radius:999px;background:#070711df;border:1px solid #b9a4df77;font-size:8px;letter-spacing:.12em;color:#eadfff}
    @media(max-width:700px){.sdlMythicGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.sdlMythicName{font-size:14px}}
  `;
  document.head.appendChild(st);

  function grid(){
    return `<div class="sdlMythicGrid" data-reward-tier="mitica-ascenso-iv">${cards.map(([id,name],i)=>`<div class="sdlMythicCard" data-mythic="${id}"><div class="sdlMythicArt" style="background-position:${(i%5)*25}% ${Math.floor(i/5)*100}%"></div><span class="sdlMythicTag">ASCENSO IV</span><div class="sdlMythicName">Mítica ${name}</div></div>`).join('')}</div>`;
  }

  function patch(){
    const mb=document.querySelector('#mb');
    if(!mb)return;
    const title=[...mb.querySelectorAll('.rTier')].find(x=>/ASCENSO\s*IV/i.test(x.textContent||'')||/M[IÍ]TICA/i.test(x.textContent||''));
    if(!title)return;
    const next=title.nextElementSibling;
    if(!next||next.classList.contains('sdlMythicGrid'))return;
    // Keep the tier visibly locked until its intended progression point.
    if(/MISIÓN\s*18/i.test(next.textContent||''))return;
    if(/arte adicional pendiente/i.test(next.textContent||'')||next.classList.contains('goal')||/disponible/i.test(next.textContent||'')){
      next.outerHTML=grid();
    }
  }

  const obs=new MutationObserver(()=>setTimeout(patch,0));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('load',patch);
  setTimeout(patch,500);
})();
