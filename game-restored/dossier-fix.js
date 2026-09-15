// Keeps the restored single-player dossier progression on the original save system.
const restoredDossierText={
  5:['La ruta fue manipulada mediante señales y registros falsos.','Los aliados del Este organizaron el sabotaje.','Todo fue un error casual sin coordinación.'],
  10:['La provocación buscaba enfrentar a la Ciudadela con sus aliados del Este.','La Guardia del Norte actuó sola por interés propio.','Los incidentes fueron independientes.'],
  15:['La red combina mensajes interceptados, rutas alteradas y colaboradores internos.','El problema se limita a un mapa mal copiado.','La amenaza procede únicamente de una patrulla extranjera.'],
  20:['El Umbral era una operación coordinada para abrir una ruta interna hacia la Ciudadela.','El Umbral era solo una leyenda.','La ruta verdadera no guarda relación con las señales.']
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
