/* SANGRE DE LUNA · CRONISTA GLOBAL + PUENTE TOUR 360
   Conserva el Cronista estable y activa el gestor administrable en /tour. */
(()=>{
  const STABLE='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@b501154b5d97d09ed75271267e221a8744be6da6/cronista-global.js';
  const isTour=((location.pathname||'/').replace(/\.html$/,'').replace(/\/+$/,'')||'/')==='/tour';
  const addTourScrollbarFix=()=>{
    if(!isTour||document.getElementById('sdl-tour-scrollbar-fix'))return;
    const style=document.createElement('style');
    style.id='sdl-tour-scrollbar-fix';
    style.textContent=`
      #sdl360App .s360-panel,
      #sdl360App .s360-detail,
      .intro-panel,.map-panel,.detail-panel{
        scrollbar-width:none;
        -ms-overflow-style:none;
        overscroll-behavior:contain;
      }
      #sdl360App .s360-panel::-webkit-scrollbar,
      #sdl360App .s360-detail::-webkit-scrollbar,
      .intro-panel::-webkit-scrollbar,
      .map-panel::-webkit-scrollbar,
      .detail-panel::-webkit-scrollbar{
        width:0;
        height:0;
        display:none;
      }
    `;
    document.head.appendChild(style);
  };
  const loadTour=()=>{
    if(!isTour)return;
    addTourScrollbarFix();
    if(window.__SDL_TOUR360_MANAGER__||document.querySelector('script[data-sdl360-manager]'))return;
    const s=document.createElement('script');s.src='/tour360-manager.js?v=20260816';s.defer=true;s.dataset.sdl360Manager='1';document.head.appendChild(s);
  };
  const legacy=document.createElement('script');legacy.src=STABLE;legacy.async=false;legacy.onload=loadTour;legacy.onerror=loadTour;document.head.appendChild(legacy);
})();
