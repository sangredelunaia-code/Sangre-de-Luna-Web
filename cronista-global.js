/* SANGRE DE LUNA · CRONISTA GLOBAL + PUENTE TOUR 360
   Conserva el Cronista estable y activa el gestor administrable en /tour. */
(()=>{
  const STABLE='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@b501154b5d97d09ed75271267e221a8744be6da6/cronista-global.js';
  const isTour=((location.pathname||'/').replace(/\.html$/,'').replace(/\/+$/,'')||'/')==='/tour';
  const loadTour=()=>{
    if(!isTour||window.__SDL_TOUR360_MANAGER__||document.querySelector('script[data-sdl360-manager]'))return;
    const s=document.createElement('script');s.src='/tour360-manager.js?v=20260816';s.defer=true;s.dataset.sdl360Manager='1';document.head.appendChild(s);
  };
  const legacy=document.createElement('script');legacy.src=STABLE;legacy.async=false;legacy.onload=loadTour;legacy.onerror=loadTour;document.head.appendChild(legacy);
})();
