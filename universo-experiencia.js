/* SANGRE DE LUNA · CARGADOR DE EXPERIENCIA
   Mantiene la experiencia editorial vigente y añade el sistema 360 administrable. */
(()=>{
  const LEGACY='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@956f18b6f95258b4ada2402585f81e61f6d45b48/universo-experiencia.js';
  const loadTourManager=()=>{
    if(window.__SDL_TOUR360_MANAGER__||document.querySelector('script[data-sdl360-manager]'))return;
    const s=document.createElement('script');s.src='/tour360-manager.js?v=20260816';s.defer=true;s.dataset.sdl360Manager='1';document.head.appendChild(s);
  };
  const legacy=document.createElement('script');legacy.src=LEGACY;legacy.async=false;legacy.onload=loadTourManager;legacy.onerror=loadTourManager;document.head.appendChild(legacy);
})();
