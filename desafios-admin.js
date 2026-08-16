/* ENTRADA SONORA · AULLIDO DE LA MANADA */
(()=>{
 const WOLF_SRC='/assets/wolf-entry.mp3?v=2';
 const wolf=new Audio(WOLF_SRC);
 wolf.preload='auto';
 wolf.volume=.86;
 let entering=false;

 document.addEventListener('click',event=>{
  const enter=event.target.closest?.('#enterSite');
  if(!enter)return;

  if(enter.dataset.wolfBypass==='1'){
   delete enter.dataset.wolfBypass;
   return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  if(entering)return;

  entering=true;
  enter.disabled=true;
  const originalText=enter.textContent;
  enter.textContent='LA MANADA DESPIERTA…';
  wolf.currentTime=0;

  let finished=false;
  let safetyTimer;
  const proceed=()=>{
   if(finished)return;
   finished=true;
   clearTimeout(safetyTimer);
   wolf.onended=null;
   wolf.onerror=null;
   enter.dataset.wolfBypass='1';
   enter.disabled=false;
   enter.textContent=originalText||'ENTRAR AL UNIVERSO';
   entering=false;
   enter.click();
  };

  wolf.onended=proceed;
  wolf.onerror=()=>setTimeout(proceed,120);
  safetyTimer=setTimeout(proceed,4700);
  wolf.play().catch(()=>setTimeout(proceed,120));
 },true);
})();

/* CARGA LA NAVEGACION, FAN CLUB Y ADMIN ESTABLES DE LA VERSION ANTERIOR */
(()=>{
 const stable=document.createElement('script');
 stable.src='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@3b01e9c337d39526842f6800e3957b00f050cc21/desafios-admin.js';
 stable.async=false;
 document.head.appendChild(stable);
})();
