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
