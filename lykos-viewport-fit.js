/* SANGRE DE LUNA · LYKOS VIEWPORT FIT
   Keeps the open assistant panel inside the visible viewport, including mobile keyboards.
*/
(()=> {
  if(window.__SDL_LYKOS_VIEWPORT_FIT_V1__)return;
  window.__SDL_LYKOS_VIEWPORT_FIT_V1__=true;

  const set=(el,name,value)=>el&&el.style.setProperty(name,value,'important');
  function fit(){
    const vv=window.visualViewport;
    const width=vv?.width||window.innerWidth;
    const height=vv?.height||window.innerHeight;
    const offsetLeft=vv?.offsetLeft||0;
    const offsetTop=vv?.offsetTop||0;
    const rightInset=Math.max(0,window.innerWidth-(offsetLeft+width));
    const bottomInset=Math.max(0,window.innerHeight-(offsetTop+height));
    const gap=width<=650?12:18;
    const player=document.querySelector('.playerbar.show');
    const playerOffset=player?Math.max(108,Math.ceil(player.getBoundingClientRect().height+28)):0;

    for(const [rootId,panelId,bodySelector] of [
      ['cronistaWidget','cronistaPanel','#cronistaBody'],
      ['sdlgCronista','sdlgPanel','.sdlg-body']
    ]){
      const root=document.getElementById(rootId);
      const panel=document.getElementById(panelId);
      if(!root||!panel||!(panel.classList.contains('open')||panel.getAttribute('aria-hidden')==='false'))continue;

      const panelWidth=Math.max(0,Math.min(width-gap*2,width<=650?430:405));
      const maxHeight=Math.max(160,height-gap*2-playerOffset);
      set(panel,'position','fixed');
      set(panel,'left','auto');
      set(panel,'top','auto');
      set(panel,'right',Math.round(rightInset+gap)+'px');
      set(panel,'bottom',Math.round(bottomInset+gap+playerOffset)+'px');
      set(panel,'width',Math.round(panelWidth)+'px');
      set(panel,'max-width',Math.round(panelWidth)+'px');
      set(panel,'height',`min(650px, ${Math.round(maxHeight)}px)`);
      set(panel,'max-height',Math.round(maxHeight)+'px');
      set(panel,'margin','0');
      set(panel,'transform','none');
      set(panel,'overflow','hidden');
      set(panel,'grid-template-rows','auto minmax(0,1fr) auto');

      const body=panel.querySelector(bodySelector);
      set(body,'min-height','0');
      set(body,'overflow-y','auto');
      set(body,'overscroll-behavior','contain');
    }
  }

  let timer=0;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(fit,60)};
  window.addEventListener('resize',schedule,{passive:true});
  window.visualViewport?.addEventListener('resize',schedule,{passive:true});
  window.visualViewport?.addEventListener('scroll',schedule,{passive:true});
  document.addEventListener('click',event=>{if(event.target?.closest?.('#cronistaLaunch,#sdlgLaunch'))schedule()},true);
  document.addEventListener('focusin',event=>{if(event.target?.matches?.('#cronistaInput,#sdlgInput'))schedule()},true);

  const observe=()=>{
    if(!document.body)return;
    new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-hidden']});
    schedule();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});
  else observe();
})();
