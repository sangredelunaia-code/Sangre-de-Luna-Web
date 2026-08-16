/* SANGRE DE LUNA · CRONISTA GLOBAL + PUENTE TOUR 360
   Conserva el Cronista estable, activa Tour, recuperación, insignias, expediciones, progreso, ranking, ruta guiada y tarjetas compartibles. */
(()=>{
  const STABLE='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@b501154b5d97d09ed75271267e221a8744be6da6/cronista-global.js';
  const isTour=((location.pathname||'/').replace(/\.html$/,'').replace(/\/+$/,'')||'/')==='/tour';
  const addTourScrollbarFix=()=>{
    if(!isTour||document.getElementById('sdl-tour-scrollbar-fix'))return;
    const style=document.createElement('style');style.id='sdl-tour-scrollbar-fix';style.textContent=`
      #sdl360App .s360-overlay,.overlay{overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:auto!important;-ms-overflow-style:auto!important;scrollbar-gutter:stable;overscroll-behavior:contain;align-items:safe center;justify-items:center}
      #sdl360App .s360-panel,#sdl360App .s360-detail,.intro-panel,.map-panel,.detail-panel{max-height:none!important;overflow:visible!important;scrollbar-width:auto!important;-ms-overflow-style:auto!important}
      #sdl360App .s360-panel::-webkit-scrollbar,#sdl360App .s360-detail::-webkit-scrollbar,.intro-panel::-webkit-scrollbar,.map-panel::-webkit-scrollbar,.detail-panel::-webkit-scrollbar{width:auto!important;height:auto!important;display:initial!important}
      #sdl360App .s360-btn.primary,#sdl360App .s360-start,#sdl360App button[data-action="start"],#startButton,#chooseTerritoryButton{color:#07101a!important;-webkit-text-fill-color:#07101a!important;text-shadow:none!important;opacity:1!important}
      @media(max-height:760px){#sdl360App .s360-overlay,.overlay{align-items:start}}
    `;document.head.appendChild(style);
  };
  const repairTourCTA=()=>{if(!isTour)return;const legacyStart=document.getElementById('startButton');if(legacyStart&&!legacyStart.textContent.trim())legacyStart.textContent='Explorar La Ciudadela';document.querySelectorAll('#sdl360App .s360-btn.primary,#sdl360App .s360-start,#sdl360App button[data-action="start"]').forEach(button=>{button.style.setProperty('color','#07101a','important');button.style.setProperty('-webkit-text-fill-color','#07101a','important');if(!button.textContent.trim())button.textContent='Explorar ahora'})};
  const observeTourCTA=()=>{repairTourCTA();if(!isTour)return;const observer=new MutationObserver(()=>repairTourCTA());observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),12000)};
  const loadTour=()=>{if(!isTour)return;addTourScrollbarFix();observeTourCTA();if(window.__SDL_TOUR360_MANAGER__||document.querySelector('script[data-sdl360-manager]'))return;const s=document.createElement('script');s.src='/tour360-manager.js?v=20260816';s.defer=true;s.dataset.sdl360Manager='1';s.onload=repairTourCTA;document.head.appendChild(s)};
  const loadPasswordRecovery=()=>{if(window.__SDL_FAN_PASSWORD_RECOVERY__||document.querySelector('script[data-sdl-password-recovery]'))return;const s=document.createElement('script');s.src='/fanclub-password-recovery.js?v=20260816-2';s.defer=true;s.dataset.sdlPasswordRecovery='1';document.head.appendChild(s)};
  const loadAchievements=()=>{if(window.__SDL_FAN_ACHIEVEMENTS__||document.querySelector('script[data-sdl-achievements]'))return;const s=document.createElement('script');s.src='/fanclub-achievements.js?v=20260816-1';s.defer=true;s.dataset.sdlAchievements='1';document.head.appendChild(s)};
  const loadExpeditions=()=>{if(window.__SDL_FAN_EXPEDITIONS__||document.querySelector('script[data-sdl-expeditions]'))return;const s=document.createElement('script');s.src='/fanclub-expeditions.js?v=20260816-1';s.defer=true;s.dataset.sdlExpeditions='1';document.head.appendChild(s)};
  const loadProgress=()=>{if(window.__SDL_FAN_PROGRESS__||document.querySelector('script[data-sdl-progress]'))return;const s=document.createElement('script');s.src='/fanclub-progress.js?v=20260816-1';s.defer=true;s.dataset.sdlProgress='1';document.head.appendChild(s)};
  const loadMissionPath=()=>{if(window.__SDL_MISSION_PATH__||document.querySelector('script[data-sdl-mission-path]'))return;const s=document.createElement('script');s.src='/fanclub-mission-path.js?v=20260816-1';s.defer=true;s.dataset.sdlMissionPath='1';document.head.appendChild(s)};
  const loadSharing=()=>{if(window.__SDL_ACHIEVEMENT_SHARING__||document.querySelector('script[data-sdl-achievement-sharing]'))return;const s=document.createElement('script');s.src='/fanclub-achievement-sharing.js?v=20260816-1';s.defer=true;s.dataset.sdlAchievementSharing='1';document.head.appendChild(s)};
  const afterLegacy=()=>{loadTour();loadPasswordRecovery();loadAchievements();loadExpeditions();loadProgress();setTimeout(loadMissionPath,120);setTimeout(loadSharing,260)};
  const legacy=document.createElement('script');legacy.src=STABLE;legacy.async=false;legacy.onload=afterLegacy;legacy.onerror=afterLegacy;document.head.appendChild(legacy);
})();