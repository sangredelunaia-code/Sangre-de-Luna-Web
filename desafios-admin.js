/* SANGRE DE LUNA · CARGADOR DE COMPATIBILIDAD
   Conserva navegación, Fan Club y portal, y añade Tour 360, recuperación, reenvío de bienvenida, insignias, expediciones, progreso, ranking, ruta guiada y tarjetas compartibles. */
(()=>{
  const STABLE_REF='f52310ad74363701dbbbebe6baa8e78627b55f3c';
  const CDN=`https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@${STABLE_REF}`;
  const LEGACY='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@956f18b6f95258b4ada2402585f81e61f6d45b48/desafios-admin.js';
  const PASSWORD_RECOVERY='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@bcf92b7c3b24cb07e08b8392bc506146d26833fd/fanclub-password-recovery.js';
  const ADMIN_WELCOME='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@4e4489428bc7988f21065a912dc707ab16f0ca92/fanclub-admin-welcome.js';
  const CFG_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';

  const resetEntryExperience=()=>{
    try{
      sessionStorage.removeItem('sdl-entered');
      sessionStorage.removeItem('sdl-admin-active');
    }catch{}
  };

  const goFreshPublic=()=>{
    resetEntryExperience();
    location.replace('/');
  };

  const signOutAndGoPublic=async()=>{
    try{
      const cfg=await fetch(CFG_URL,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
      if(cfg?.url&&cfg?.key&&window.supabase?.createClient){
        const client=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:false,detectSessionInUrl:false}});
        await client.auth.signOut({scope:'local'}).catch(()=>{});
      }
    }finally{
      goFreshPublic();
    }
  };

  /* Al salir del administrador no mostramos el DOM público que quedó cargado en memoria.
     Siempre volvemos a / y recargamos la experiencia vigente desde cero. */
  document.addEventListener('click',event=>{
    const publicExit=event.target.closest?.('.public-entry');
    if(publicExit){
      event.preventDefault();
      event.stopImmediatePropagation();
      goFreshPublic();
      return;
    }
    const signOut=event.target.closest?.('#signOutBtn,#signOutBtn2');
    if(signOut){
      event.preventDefault();
      event.stopImmediatePropagation();
      signOut.disabled=true;
      signOutAndGoPublic();
    }
  },true);

  const ensureFanclubButton=()=>{
    const nav=document.getElementById('adminNav');
    if(!nav||nav.querySelector('[data-panel="fanclub"]'))return;
    const anchor=nav.querySelector('[data-panel="challenges"]')||nav.querySelector('[data-panel="gallery"]');
    if(anchor)anchor.insertAdjacentHTML('afterend','<button data-panel="fanclub">Fan Club</button>');
  };

  const loadFanclubAdmin=(retry=0)=>{
    if(document.querySelector('[data-page="fanclub"]')){ensureFanclubButton();return}
    if(!document.getElementById('adminApp')||!document.getElementById('adminNav'))return;

    const legacyPublic=document.getElementById('fanclub');
    if(legacyPublic)legacyPublic.remove();

    const old=document.querySelector('script[data-fanclub-admin-module]');
    if(old)old.remove();
    const s=document.createElement('script');
    s.src=`${CDN}/fanclub.js?v=admin-fixed-20260817-${retry}`;
    s.async=false;
    s.dataset.fanclubAdminModule='1';
    s.onload=()=>{
      setTimeout(()=>{
        if(document.querySelector('[data-page="fanclub"]'))ensureFanclubButton();
        else if(retry<2)loadFanclubAdmin(retry+1);
      },350);
    };
    s.onerror=()=>{if(retry<2)setTimeout(()=>loadFanclubAdmin(retry+1),500)};
    document.head.appendChild(s);
  };

  const loadTourManager=()=>{if(window.__SDL_TOUR360_MANAGER__||document.querySelector('script[data-sdl360-manager]'))return;const s=document.createElement('script');s.src=`${CDN}/tour360-manager.js?v=20260816`;s.defer=true;s.dataset.sdl360Manager='1';document.head.appendChild(s)};
  const loadPasswordRecovery=()=>{if(window.__SDL_FAN_PASSWORD_RECOVERY__||document.querySelector('script[data-sdl-password-recovery]'))return;const s=document.createElement('script');s.src=`${PASSWORD_RECOVERY}?v=20260817-3`;s.defer=true;s.dataset.sdlPasswordRecovery='1';document.head.appendChild(s)};
  const loadAdminWelcome=()=>{if(window.__SDL_FAN_ADMIN_WELCOME__||document.querySelector('script[data-sdl-admin-welcome]'))return;const s=document.createElement('script');s.src=`${ADMIN_WELCOME}?v=20260817-1`;s.defer=true;s.dataset.sdlAdminWelcome='1';document.head.appendChild(s)};
  const loadAchievements=()=>{if(window.__SDL_FAN_ACHIEVEMENTS__||document.querySelector('script[data-sdl-achievements]'))return;const s=document.createElement('script');s.src=`${CDN}/fanclub-achievements.js?v=20260816-1`;s.defer=true;s.dataset.sdlAchievements='1';document.head.appendChild(s)};
  const loadExpeditions=()=>{if(window.__SDL_FAN_EXPEDITIONS__||document.querySelector('script[data-sdl-expeditions]'))return;const s=document.createElement('script');s.src=`${CDN}/fanclub-expeditions.js?v=20260816-1`;s.defer=true;s.dataset.sdlExpeditions='1';document.head.appendChild(s)};
  const loadProgress=()=>{if(window.__SDL_FAN_PROGRESS__||document.querySelector('script[data-sdl-progress]'))return;const s=document.createElement('script');s.src=`${CDN}/fanclub-progress.js?v=20260816-1`;s.defer=true;s.dataset.sdlProgress='1';document.head.appendChild(s)};
  const loadMissionPath=()=>{if(window.__SDL_MISSION_PATH__||document.querySelector('script[data-sdl-mission-path]'))return;const s=document.createElement('script');s.src=`${CDN}/fanclub-mission-path.js?v=20260816-1`;s.defer=true;s.dataset.sdlMissionPath='1';document.head.appendChild(s)};
  const loadSharing=()=>{if(window.__SDL_ACHIEVEMENT_SHARING__||document.querySelector('script[data-sdl-achievement-sharing]'))return;const s=document.createElement('script');s.src=`${CDN}/fanclub-achievement-sharing.js?v=20260816-1`;s.defer=true;s.dataset.sdlAchievementSharing='1';document.head.appendChild(s)};
  const loadGuardian=()=>{if(window.__SDL_GUARDIAN_WOLF__||document.querySelector('script[data-sdl-guardian]'))return;const s=document.createElement('script');s.src='/guardian-wolf.js?v=20260827-1';s.defer=true;s.dataset.sdlGuardian='1';document.head.appendChild(s)};

  const ensureFanclubAdmin=()=>{
    const adminVisible=new URLSearchParams(location.search).get('admin')==='1'||!document.getElementById('adminApp')?.classList.contains('hidden');
    if(adminVisible){
      try{sessionStorage.setItem('sdl-admin-active','1')}catch{}
      ensureFanclubButton();
      setTimeout(()=>loadFanclubAdmin(),40);
    }
  };

  const afterLegacy=()=>{
    ensureFanclubAdmin();
    loadTourManager();loadPasswordRecovery();loadAdminWelcome();loadAchievements();loadExpeditions();loadProgress();loadGuardian();
    setTimeout(loadMissionPath,120);setTimeout(loadSharing,260);
  };

  const legacy=document.createElement('script');legacy.src=LEGACY;legacy.async=false;legacy.onload=afterLegacy;legacy.onerror=afterLegacy;document.head.appendChild(legacy);

  document.addEventListener('click',event=>{if(event.target.closest?.('.admin-entry'))setTimeout(ensureFanclubAdmin,120)},true);
  addEventListener('popstate',()=>{
    let wasAdmin=false;try{wasAdmin=sessionStorage.getItem('sdl-admin-active')==='1'}catch{}
    const stillAdmin=new URLSearchParams(location.search).get('admin')==='1';
    if(wasAdmin&&!stillAdmin){goFreshPublic();return}
    ensureFanclubAdmin();
  });
  const watchdog=setInterval(()=>{
    const adminVisible=new URLSearchParams(location.search).get('admin')==='1'||!document.getElementById('adminApp')?.classList.contains('hidden');
    if(adminVisible&&!document.querySelector('[data-page="fanclub"]'))loadFanclubAdmin();
    else if(adminVisible)ensureFanclubButton();
  },2000);
  setTimeout(()=>clearInterval(watchdog),30000);
  setTimeout(ensureFanclubAdmin,900);
})();