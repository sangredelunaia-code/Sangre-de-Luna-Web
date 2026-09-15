// Keeps the restored single-player dossier progression on the original save system.
const restoredDossierText={
  5:['La ruta fue manipulada mediante señales y registros falsos.','Los aliados del Este organizaron el sabotaje.','Todo fue un error casual sin coordinación.'],
  10:['La provocación buscaba enfrentar a la Ciudadela con sus aliados del Este.','La Guardia del Norte actuó sin autorización por interés propio.','Los incidentes fueron independientes y no tenían relación.'],
  15:['La red combina mensajes interceptados, rutas alteradas y colaboradores dentro del perímetro.','El problema se limita a un mapa mal copiado en el Archivo.','La amenaza procede únicamente de una patrulla extranjera.'],
  20:['El Umbral era una operación coordinada para abrir una ruta interna hacia la Ciudadela.','El Umbral era solo una leyenda usada para asustar a los guardias.','La ruta verdadera no guarda relación con las señales reunidas.']
};
dossier=m=>{
  const xs=restoredDossierText[m.id]||restoredDossierText[5];
  modal(`<div class="ey">EXPEDIENTE DE DEDUCCIÓN</div><h2>${m.n}</h2><p>Lykos: elige la conclusión que mejor encaja con las pistas de este acto.</p><div class="choices">${xs.map((x,i)=>`<button class="choice" data-restored-dossier="${i}">${x}</button>`).join('')}</div>`);
  setTimeout(()=>$$('[data-restored-dossier]').forEach(b=>b.onclick=()=>{
    if(+b.dataset.restoredDossier===0){
      sv.done[m.id]=3;
      sv.u=Math.max(sv.u,Math.min(20,m.id+1));
      sv.cmd+=3;
      sv.st=Object.values(sv.done).reduce((a,b)=>a+b,0);
      save();
      $('#modal').classList.remove('on');
      campaign();
      guide('Expediente resuelto. La investigación avanza.',true);
    }else guide('Esa conclusión no coincide con las pistas. Inténtalo otra vez.');
  }),0);
};
// Load the player identity layer (name + one of the 10 official insignias) from this exact game revision.
(()=>{const here=document.currentScript?.src||'';if(!here)return;const s=document.createElement('script');s.src=here.replace(/dossier-fix\.js(?:\?.*)?$/,'player-identity.js');s.async=false;document.head.appendChild(s)})();

// Badge renderer hotfix: serve the official 5x2 sprite through the project's public Supabase edge endpoint.
(()=>{
  const BADGE_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/game-badges';
  const ids=['mensajero-lunar','cartografo-ciudadela','centinela-torre','guardian-llaves','explorador-valle','cronista-luna','forjador-reino','sanador-manada','lobo-ciudadela','torre-sangre-luna'];
  const css=[`.sdlBadgeIcon{background-image:url("${BADGE_URL}")!important;background-size:400px 160px!important;background-repeat:no-repeat!important}`];
  ids.forEach((id,i)=>{
    const x=(i%5)*80,y=Math.floor(i/5)*80;
    css.push(`#sdlBadgeGrid [data-badge="${id}"] .sdlBadgeIcon{background-position:-${x}px -${y}px!important}`);
    css.push(`#mpRoom [data-badged="${id}"] .sdlMiniBadge{background-image:url("${BADGE_URL}")!important}`);
  });
  const st=document.createElement('style');st.id='sdlBadgeRenderFix';st.textContent=css.join('\n');document.head.appendChild(st);
  const readIdentity=()=>{try{return JSON.parse(localStorage.getItem('sdl_player_identity_v1')||'null')}catch{return null}};
  function paintMini(el,id){
    const i=ids.indexOf(id);if(i<0||!el)return;
    const size=Math.max(1,Math.round(el.getBoundingClientRect().width||34));
    const k=size/80;
    el.style.setProperty('background-image',`url("${BADGE_URL}")`,'important');
    el.style.setProperty('background-size',`${400*k}px ${160*k}px`,'important');
    el.style.setProperty('background-position',`-${(i%5)*80*k}px -${Math.floor(i/5)*80*k}px`,'important');
    el.style.setProperty('background-repeat','no-repeat','important');
  }
  function repaint(){
    const identity=readIdentity();
    if(identity?.badge_id){
      document.querySelectorAll('.sdlPlayerChip .sdlMiniBadge,.sdlMPIdentity .sdlMiniBadge').forEach(el=>paintMini(el,identity.badge_id));
    }
    document.querySelectorAll('#mpRoom [data-badged]').forEach(row=>{
      const id=row.dataset.badged;row.querySelectorAll('.sdlMiniBadge').forEach(el=>paintMini(el,id));
    });
  }
  const obs=new MutationObserver(()=>{requestAnimationFrame(repaint);setTimeout(repaint,80)});
  obs.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('load',()=>setTimeout(repaint,100));
  setTimeout(repaint,500);
})();

// Top-bar layout hotfix: reserve a dedicated area for Music/Lykos and keep action buttons separated.
(()=>{
  const st=document.createElement('style');
  st.id='sdlTopBarLayoutFix';
  st.textContent=`
  @media (min-width:981px){
    .top{padding-right:160px!important;gap:10px!important}
    .top>.actions{display:flex!important;align-items:center!important;justify-content:flex-end!important;flex-wrap:nowrap!important;gap:6px!important;margin:0 0 0 auto!important;min-width:0!important}
    .top>.actions>.btn,.top>.actions>.sdlPlayerChip{position:relative!important;flex:0 0 auto!important;white-space:nowrap!important;margin:0!important}
    #campaign .top>.actions>.btn,#mp .top>.actions>.btn{padding:6px 8px!important;font-size:10px!important}
    .audio{position:fixed!important;top:8px!important;right:8px!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:5px!important;width:145px!important;max-width:145px!important;z-index:30!important}
    .audio button{position:relative!important;flex:0 0 auto!important;margin:0!important;padding:6px 8px!important;font-size:10px!important;white-space:nowrap!important}
  }
  @media (max-width:1180px) and (min-width:981px){
    .top{padding-left:12px!important}
    .brand{min-width:0!important;gap:7px!important}
    .brand img{width:34px!important}
    .brand b{font-size:12px!important;white-space:nowrap!important}
    .top>.actions{gap:5px!important}
    #campaign .top>.actions>.btn,#mp .top>.actions>.btn{padding:5px 7px!important;font-size:9px!important}
    .sdlPlayerChip{padding:4px 6px!important;gap:5px!important;font-size:9px!important}
    .sdlPlayerChip .sdlMiniBadge{width:26px!important;height:26px!important}
  }
  @media (max-width:980px){
    .top>.actions{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:7px!important;width:100%!important;margin:0!important}
    .top>.actions>.btn,.top>.actions>.sdlPlayerChip{position:relative!important;margin:0!important;white-space:nowrap!important}
    .audio{gap:6px!important}
    .audio button{margin:0!important;white-space:nowrap!important}
  }`;
  document.head.appendChild(st);
})();

// Legendarias · Ascenso III — official 10-card reward collection, unlocked after mission 16.
(()=>{
  const SPRITE='https://raw.githubusercontent.com/sangredelunaia-code/Sangre-de-Luna-Web/main/game-restored/legendarias-ascenso3.webp';
  const cards=[['peter','Peter'],['tyren','Tyren'],['ethan','Ethan'],['chris','Chris'],['darien','Darien'],['nine','Nine'],['varkos','Varkos'],['gabriel','Gabriel'],['sehan','Sehan'],['ella','Ella']];
  const st=document.createElement('style');
  st.id='sdlLegendaryCardsStyle';
  st.textContent=`
    .sdlLegendaryGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin:8px 0 14px}
    .sdlLegendaryCard{position:relative;aspect-ratio:2/3;border:1px solid #d7b66f88;border-radius:14px;overflow:hidden;background:#070b10;box-shadow:0 14px 35px #0007}
    .sdlLegendaryArt{position:absolute;inset:0;background-image:url("${SPRITE}");background-size:500% 200%;background-repeat:no-repeat}
    .sdlLegendaryCard:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 54%,#02050af2 92%);pointer-events:none}
    .sdlLegendaryName{position:absolute;z-index:2;left:8px;right:8px;bottom:8px;text-align:center;font:600 16px Georgia;color:#ffe7ad;text-shadow:0 2px 8px #000}
    .sdlLegendaryTag{position:absolute;z-index:2;top:7px;left:7px;padding:4px 6px;border-radius:999px;background:#05090ddd;border:1px solid #d7b66f66;font-size:8px;letter-spacing:.12em;color:#f4dca7}
  `;
  document.head.appendChild(st);
  function grid(){
    return `<div class="sdlLegendaryGrid">${cards.map(([id,name],i)=>`<div class="sdlLegendaryCard"><div class="sdlLegendaryArt" style="background-position:${(i%5)*25}% ${Math.floor(i/5)*100}%"></div><span class="sdlLegendaryTag">ASCENSO III</span><div class="sdlLegendaryName">Legendaria ${name}</div></div>`).join('')}</div>`;
  }
  function patch(){
    const mb=document.querySelector('#mb'); if(!mb)return;
    const title=[...mb.querySelectorAll('.rTier')].find(x=>/LEGENDARIA/i.test(x.textContent||'')); if(!title)return;
    const next=title.nextElementSibling; if(!next||next.classList.contains('sdlLegendaryGrid'))return;
    if(/MISIÓN 16/i.test(next.textContent||''))return;
    if(/arte adicional pendiente/i.test(next.textContent||'')||next.classList.contains('goal'))next.outerHTML=grid();
  }
  const obs=new MutationObserver(()=>setTimeout(patch,0));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('load',patch);
  setTimeout(patch,500);
})();
