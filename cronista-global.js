/* SANGRE DE LUNA · CRONISTA GLOBAL + PUENTE TOUR 360
   Conserva el Cronista estable, activa el gestor 360 y la recuperación del Fan Club. */
(()=>{
  const STABLE='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@b501154b5d97d09ed75271267e221a8744be6da6/cronista-global.js';
  const isTour=((location.pathname||'/').replace(/\.html$/,'').replace(/\/+$/,'')||'/')==='/tour';
  const addTourScrollbarFix=()=>{
    if(!isTour||document.getElementById('sdl-tour-scrollbar-fix'))return;
    const style=document.createElement('style');
    style.id='sdl-tour-scrollbar-fix';
    style.textContent=`
      /* El desplazamiento pertenece a toda la ventana del Tour.
         Así la barra aparece en el borde derecho del viewport, no dentro del panel central. */
      #sdl360App .s360-overlay,
      .overlay{
        overflow-y:auto !important;
        overflow-x:hidden !important;
        scrollbar-width:auto !important;
        -ms-overflow-style:auto !important;
        scrollbar-gutter:stable;
        overscroll-behavior:contain;
        align-items:safe center;
        justify-items:center;
      }
      #sdl360App .s360-panel,
      #sdl360App .s360-detail,
      .intro-panel,
      .map-panel,
      .detail-panel{
        max-height:none !important;
        overflow:visible !important;
        scrollbar-width:auto !important;
        -ms-overflow-style:auto !important;
      }
      #sdl360App .s360-panel::-webkit-scrollbar,
      #sdl360App .s360-detail::-webkit-scrollbar,
      .intro-panel::-webkit-scrollbar,
      .map-panel::-webkit-scrollbar,
      .detail-panel::-webkit-scrollbar{
        width:auto !important;
        height:auto !important;
        display:initial !important;
      }

      /* Garantiza contraste del CTA principal del Tour. */
      #sdl360App .s360-btn.primary,
      #sdl360App .s360-start,
      #sdl360App button[data-action="start"],
      #startButton,
      #chooseTerritoryButton{
        color:#07101a !important;
        -webkit-text-fill-color:#07101a !important;
        text-shadow:none !important;
        opacity:1 !important;
      }

      @media(max-height:760px){
        #sdl360App .s360-overlay,
        .overlay{
          align-items:start;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const repairTourCTA=()=>{
    if(!isTour)return;
    const legacyStart=document.getElementById('startButton');
    if(legacyStart&&!legacyStart.textContent.trim()) legacyStart.textContent='Explorar La Ciudadela';
    document.querySelectorAll('#sdl360App .s360-btn.primary,#sdl360App .s360-start,#sdl360App button[data-action="start"]').forEach(button=>{
      button.style.setProperty('color','#07101a','important');
      button.style.setProperty('-webkit-text-fill-color','#07101a','important');
      if(!button.textContent.trim()) button.textContent='Explorar ahora';
    });
  };

  const observeTourCTA=()=>{
    repairTourCTA();
    if(!isTour)return;
    const observer=new MutationObserver(()=>repairTourCTA());
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),12000);
  };

  const loadTour=()=>{
    if(!isTour)return;
    addTourScrollbarFix();
    observeTourCTA();
    if(window.__SDL_TOUR360_MANAGER__||document.querySelector('script[data-sdl360-manager]'))return;
    const s=document.createElement('script');s.src='/tour360-manager.js?v=20260816';s.defer=true;s.dataset.sdl360Manager='1';s.onload=repairTourCTA;document.head.appendChild(s);
  };

  const loadPasswordRecovery=()=>{
    if(window.__SDL_FAN_PASSWORD_RECOVERY__||document.querySelector('script[data-sdl-password-recovery]'))return;
    const s=document.createElement('script');
    s.src='/fanclub-password-recovery.js?v=20260816-2';
    s.defer=true;
    s.dataset.sdlPasswordRecovery='1';
    document.head.appendChild(s);
  };

  const afterLegacy=()=>{loadTour();loadPasswordRecovery()};
  const legacy=document.createElement('script');legacy.src=STABLE;legacy.async=false;legacy.onload=afterLegacy;legacy.onerror=afterLegacy;document.head.appendChild(legacy);
})();