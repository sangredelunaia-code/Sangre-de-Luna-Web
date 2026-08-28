/* SANGRE DE LUNA · LYKOS POSITION V10
   Posicionamiento robusto en el viewport visible.
   Mantiene el lanzador y el panel siempre dentro de pantalla.
*/
(()=>{
  if(window.__SDL_LYKOS_POSITION_V10__)return;
  window.__SDL_LYKOS_POSITION_V10__=true;

  const GAP_DESKTOP=20;
  const GAP_MOBILE=14;
  const PLAYER_GAP=108;

  const important=(el,prop,value)=>el&&el.style.setProperty(prop,value,'important');
  const px=n=>`${Math.max(0,Math.round(n))}px`;

  const style=document.createElement('style');
  style.id='sdl-lykos-position-v10-style';
  style.textContent=`
    #cronistaWidget,#sdlgCronista{
      position:fixed!important;
      inset:auto!important;
      margin:0!important;
      padding:0!important;
      width:auto!important;
      height:auto!important;
      max-width:none!important;
      max-height:none!important;
      overflow:visible!important;
      z-index:2147482500!important;
      transform:none!important;
      contain:layout style!important;
      pointer-events:none!important;
    }
    #cronistaWidget>*,#sdlgCronista>*{pointer-events:auto!important}
    #cronistaLaunch,#sdlgLaunch{
      position:relative!important;
      inset:auto!important;
      margin:0!important;
      transform:none!important;
      flex:none!important;
    }
    #cronistaPanel,#sdlgPanel{
      margin:0!important;
      transform:none!important;
      box-sizing:border-box!important;
    }
    #cronistaNudge,.cronista-nudge,.sdlg-nudge{
      margin:0!important;
      box-sizing:border-box!important;
    }
    @media(max-width:650px){
      #cronistaWidget,#sdlgCronista{max-width:none!important}
      #cronistaPanel,#sdlgPanel{border-radius:20px!important}
    }
  `;
  document.head.appendChild(style);

  function visibleMetrics(){
    const vv=window.visualViewport;
    if(vv){
      return {
        width:vv.width,
        height:vv.height,
        rightInset:Math.max(0,window.innerWidth-(vv.offsetLeft+vv.width)),
        bottomInset:Math.max(0,window.innerHeight-(vv.offsetTop+vv.height))
      };
    }
    return {width:window.innerWidth,height:window.innerHeight,rightInset:0,bottomInset:0};
  }

  function playerOffset(){
    const bar=document.querySelector('.playerbar.show');
    if(!bar)return 0;
    const r=bar.getBoundingClientRect();
    return Math.max(PLAYER_GAP,Math.ceil(r.height+28));
  }

  function layoutRoot(root,home){
    if(!root)return;
    const m=visibleMetrics();
    const mobile=m.width<=650;
    const gap=mobile?GAP_MOBILE:GAP_DESKTOP;
    const right=gap+m.rightInset;
    const bottom=gap+m.bottomInset+playerOffset();

    important(root,'position','fixed');
    important(root,'left','auto');
    important(root,'top','auto');
    important(root,'right',px(right));
    important(root,'bottom',px(bottom));
    important(root,'margin','0');
    important(root,'transform','none');
    important(root,'width','auto');
    important(root,'height','auto');
    important(root,'overflow','visible');
    important(root,'z-index','2147482500');

    const launch=root.querySelector(home?'#cronistaLaunch':'#sdlgLaunch');
    if(launch){
      important(launch,'position','relative');
      important(launch,'left','auto');
      important(launch,'right','auto');
      important(launch,'top','auto');
      important(launch,'bottom','auto');
      important(launch,'margin','0');
      important(launch,'transform','none');
    }

    const panel=root.querySelector(home?'#cronistaPanel':'#sdlgPanel');
    if(panel){
      const panelGap=mobile?12:14;
      const width=Math.min(mobile?430:405,Math.max(260,m.width-(gap*2)));
      const launchHeight=launch?.getBoundingClientRect().height||78;
      const maxH=Math.max(280,m.height-bottom-launchHeight-panelGap-gap);

      important(panel,'position','fixed');
      important(panel,'left','auto');
      important(panel,'top','auto');
      important(panel,'right',px(right));
      important(panel,'bottom',px(bottom+launchHeight+panelGap));
      important(panel,'width',px(width));
      important(panel,'max-width',px(width));
      important(panel,'height',`min(650px, ${px(maxH)})`);
      important(panel,'max-height',px(maxH));
      important(panel,'margin','0');
      important(panel,'transform','none');
    }

    const nudge=root.querySelector(home?'#cronistaNudge':'.sdlg-nudge');
    if(nudge){
      const launchHeight=launch?.getBoundingClientRect().height||78;
      if(m.width<430){
        const nw=Math.max(180,Math.min(260,m.width-gap*2));
        important(nudge,'position','fixed');
        important(nudge,'left','auto');
        important(nudge,'top','auto');
        important(nudge,'right',px(right));
        important(nudge,'bottom',px(bottom+launchHeight+10));
        important(nudge,'width',px(nw));
        important(nudge,'max-width',px(nw));
      }else{
        const nw=Math.min(245,Math.max(180,m.width-right-110));
        important(nudge,'position','fixed');
        important(nudge,'left','auto');
        important(nudge,'top','auto');
        important(nudge,'right',px(right+launchHeight+10));
        important(nudge,'bottom',px(bottom+4));
        important(nudge,'width',px(nw));
        important(nudge,'max-width',px(nw));
      }
      important(nudge,'margin','0');
      important(nudge,'transform','none');
    }
  }

  function apply(){
    layoutRoot(document.getElementById('cronistaWidget'),true);
    layoutRoot(document.getElementById('sdlgCronista'),false);
  }

  let raf=0;
  const schedule=()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(apply);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();

  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',schedule,{passive:true});
  window.addEventListener('pageshow',schedule,{passive:true});
  window.visualViewport?.addEventListener('resize',schedule,{passive:true});
  window.visualViewport?.addEventListener('scroll',schedule,{passive:true});

  document.addEventListener('click',e=>{
    if(e.target.closest('#cronistaLaunch,#cronistaClose,#sdlgLaunch,#sdlgClose,#closePlayer,.play,[data-track]'))setTimeout(schedule,30);
  },true);

  // Recalcula solo cuando cambia el estado del reproductor o del propio widget.
  const bodyObserver=new MutationObserver(muts=>{
    if(muts.some(m=>m.target?.matches?.('#cronistaWidget,#sdlgCronista,#cronistaPanel,#sdlgPanel,.playerbar')))schedule();
  });
  bodyObserver.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class','aria-hidden']});

  [80,250,700,1500].forEach(ms=>setTimeout(schedule,ms));
})();
