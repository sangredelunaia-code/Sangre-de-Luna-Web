/* SANGRE DE LUNA · MÚSICA AMBIENTAL GLOBAL
   Mantiene la ambientación del sitio en Fan Club, La Manada, Mapa,
   Mi Viaje y Recorridos, compartiendo muteo y posición con la portada. */
(()=>{
  if(document.getElementById('ambientAudio')||document.getElementById('sdlAmbientGlobal')) return;

  const MUTED_KEY='sdl-ambient-muted';
  const POS_KEY='sdl-ambient-position-v1';
  const SOURCE_KEY='sdl-ambient-source-v1';
  const CONFIG_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';
  const FALLBACK={is_active:true,audio_url:'/assets/blood-moon-theme.mp3',volume:.22};
  let saveAt=0;
  let armed=false;

  const audio=new Audio();
  audio.id='sdlAmbientGlobal';
  audio.loop=true;
  audio.preload='auto';
  audio.playsInline=true;
  document.body.appendChild(audio);

  const style=document.createElement('style');
  style.id='sdlAmbientGlobalStyle';
  style.textContent=`
    .sdl-ambient-global-toggle{position:fixed;left:18px;bottom:18px;z-index:11980;width:46px;height:46px;display:none;place-items:center;border:1px solid #42637d;border-radius:50%;background:rgba(6,16,25,.9);color:#eef8ff;box-shadow:0 12px 34px rgba(0,0,0,.55),0 0 20px rgba(99,190,247,.12);backdrop-filter:blur(12px);cursor:pointer;font-size:1.05rem;transition:.2s}
    .sdl-ambient-global-toggle.show{display:grid}.sdl-ambient-global-toggle:hover{border-color:#87d2ff;transform:translateY(-2px)}
    .sdl-ambient-global-toggle:focus-visible{outline:2px solid #8ad5ff;outline-offset:3px}
    @media(max-width:650px){.sdl-ambient-global-toggle{left:12px;bottom:14px;width:42px;height:42px}}
  `;
  document.head.appendChild(style);

  const toggle=document.createElement('button');
  toggle.id='sdlAmbientGlobalToggle';
  toggle.className='sdl-ambient-global-toggle';
  toggle.type='button';
  document.body.appendChild(toggle);

  function muted(){return localStorage.getItem(MUTED_KEY)==='1'}
  function updateButton(){
    const off=muted();
    toggle.textContent=off?'🔇':'🔊';
    toggle.title=toggle.ariaLabel=off?'Activar música ambiental':'Silenciar música ambiental';
    toggle.setAttribute('aria-pressed',String(off));
  }
  function savePosition(){
    try{
      if(!audio.src||!Number.isFinite(audio.currentTime))return;
      sessionStorage.setItem(POS_KEY,String(audio.currentTime));
      sessionStorage.setItem(SOURCE_KEY,audio.currentSrc||audio.src);
    }catch(_){ }
  }
  function restorePosition(source){
    try{
      const savedSource=sessionStorage.getItem(SOURCE_KEY);
      const saved=Number(sessionStorage.getItem(POS_KEY));
      if(savedSource!==source||!Number.isFinite(saved)||saved<=0)return;
      const apply=()=>{try{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=saved%audio.duration;else audio.currentTime=saved}catch(_){}};
      if(audio.readyState>=1)apply();else audio.addEventListener('loadedmetadata',apply,{once:true});
    }catch(_){ }
  }
  function armResume(){
    if(armed||muted())return;
    armed=true;
    const resume=()=>{
      armed=false;
      audio.muted=false;
      audio.play().catch(()=>{});
    };
    document.addEventListener('pointerdown',resume,{once:true,capture:true});
    document.addEventListener('keydown',resume,{once:true,capture:true});
    document.addEventListener('touchstart',resume,{once:true,capture:true,passive:true});
  }
  function start(){
    if(muted())return;
    audio.muted=false;
    audio.play().catch(armResume);
  }

  toggle.addEventListener('click',()=>{
    const off=!muted();
    localStorage.setItem(MUTED_KEY,off?'1':'0');
    audio.muted=off;
    updateButton();
    if(off){savePosition();audio.pause()}else start();
  });

  audio.addEventListener('timeupdate',()=>{
    if(Date.now()-saveAt>900){saveAt=Date.now();savePosition()}
  });
  addEventListener('pagehide',savePosition);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')savePosition()});
  addEventListener('storage',e=>{
    if(e.key!==MUTED_KEY)return;
    audio.muted=muted();updateButton();
    if(muted())audio.pause();else start();
  });

  async function getConfig(){
    try{
      const cfg=await fetch(CONFIG_URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('config');return r.json()});
      const url=String(cfg.url||'').replace(/\/$/,'');
      const key=cfg.key;
      if(!url||!key)throw new Error('config');
      const r=await fetch(`${url}/rest/v1/site_ambient_audio?id=eq.1&select=is_active,audio_url,volume`,{
        cache:'no-store',headers:{apikey:key,Authorization:`Bearer ${key}`,Accept:'application/json'}
      });
      if(!r.ok)throw new Error('ambient');
      const rows=await r.json();
      return rows?.[0]||FALLBACK;
    }catch(_){return FALLBACK}
  }

  (async()=>{
    const cfg=await getConfig();
    if(!cfg?.is_active||!cfg.audio_url){audio.pause();toggle.classList.remove('show');return}
    const source=new URL(cfg.audio_url,location.href).href;
    audio.src=cfg.audio_url;
    audio.volume=Math.min(.6,Math.max(.05,Number(cfg.volume)||.22));
    audio.muted=muted();
    updateButton();
    toggle.classList.add('show');
    restorePosition(source);
    if(!muted())start();
  })();
})();
