/* ENTRADA SONORA · AULLIDO RETIRADO */
/* La portada entra directamente al universo y conserva únicamente la música ambiental configurada. */

/* CARGA LA NAVEGACION, FAN CLUB Y ADMIN ESTABLES DE LA VERSION ANTERIOR */
(()=>{
 const stable=document.createElement('script');
 stable.src='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@3b01e9c337d39526842f6800e3957b00f050cc21/desafios-admin.js';
 stable.async=false;
 document.head.appendChild(stable);
})();

/* ADMINISTRACION · RESTAURA EL CENTRO DE CONTROL Y LAS CARGAS DEL FAN CLUB */
(()=>{
 let loading=false;
 const loadFanclubAdmin=()=>{
  if(loading||document.querySelector('[data-page="fanclub"]')||document.querySelector('script[data-fanclub-admin-module]'))return;
  if(!document.getElementById('adminApp')||!document.getElementById('adminNav'))return;
  loading=true;
  const module=document.createElement('script');
  module.src='/fanclub.js?v=admin-restore-20260816';
  module.async=false;
  module.dataset.fanclubAdminModule='1';
  module.onload=()=>{loading=false};
  module.onerror=()=>{loading=false;module.remove()};
  document.head.appendChild(module);
 };
 const adminVisible=()=>new URLSearchParams(location.search).get('admin')==='1'||!document.getElementById('adminApp')?.classList.contains('hidden');
 if(adminVisible())setTimeout(loadFanclubAdmin,0);
 document.addEventListener('click',event=>{
  if(event.target.closest?.('.admin-entry'))setTimeout(loadFanclubAdmin,80);
 },true);
 addEventListener('popstate',()=>{
  if(new URLSearchParams(location.search).get('admin')==='1')setTimeout(loadFanclubAdmin,0);
 });
})();

/* PORTAL CINEMATOGRAFICO · INICIO POR TARJETAS Y SECCIONES EN PAGINAS INDEPENDIENTES */
(()=>{
 if(new URLSearchParams(location.search).get('admin')==='1')return;

 const cleanPath=()=>{
  let path=(location.pathname||'/').replace(/\/+$/,'')||'/';
  path=path.replace(/\.html$/,'');
  return path==='/index'?'/':path;
 };
 const path=cleanPath();
 if(path==='/desafios'){
  location.replace('/la-manada#desafios');
  return;
 }

 const pages={
  '/personajes':{id:'personajes',title:'Personajes',eyebrow:'ARCHIVO DE PERSONAJES',description:'Conoce a los héroes, aliados, guardianes y amenazas que forjan el destino de Sangre de Luna.',image:'/assets/ella.webp'},
  '/historias':{id:'historias',title:'Historias',eyebrow:'ARCHIVO DE LA CIUDADELA',description:'Adéntrate en las temporadas, capítulos y acontecimientos que construyen la leyenda.',image:'/assets/tour-360-archivo-nine.webp'},
  '/episodios':{id:'episodios',title:'Episodios',eyebrow:'CRÓNICAS EN PANTALLA',description:'Revive cada capítulo publicado y sigue la historia audiovisual de Sangre de Luna.',image:'/assets/chris.webp'},
  '/musica':{id:'musica',title:'Música Original',eyebrow:'SONIDOS DE SANGRE DE LUNA',description:'Escucha la música original que acompaña a la Ciudadela, sus alianzas y sus leyendas.',image:'/assets/city-front.webp'},
  '/galeria':{id:'galeria',title:'Galería',eyebrow:'ARTE OFICIAL',description:'Explora afiches, portadas y piezas visuales del universo de Sangre de Luna.',image:'/assets/mesa-mapa-ciudadela.webp'}
 };

 const cards=[
  {title:'Personajes',desc:'Conoce a los héroes, aliados y enemigos que forjan la leyenda.',href:'/personajes',image:'/assets/ella.webp',cta:'VER PERSONAJES',icon:'◐'},
  {title:'Historias',desc:'Adéntrate en las temporadas, capítulos y secretos del universo.',href:'/historias',image:'/assets/tour-360-archivo-nine.webp',cta:'LEER HISTORIAS',icon:'✦'},
  {title:'Episodios',desc:'Revive cada capítulo y sus momentos más épicos.',href:'/episodios',image:'/assets/chris.webp',cta:'VER EPISODIOS',icon:'▶'},
  {title:'Música Original',desc:'Escucha la banda sonora original de Sangre de Luna.',href:'/musica',image:'/assets/city-front.webp',cta:'ESCUCHAR MÚSICA',icon:'♫'},
  {title:'Galería',desc:'Explora imágenes, arte y momentos oficiales del universo.',href:'/galeria',image:'/assets/mesa-mapa-ciudadela.webp',cta:'VER GALERÍA',icon:'◇'},
  {title:'Desafíos',desc:'Pon a prueba cuánto conoces y consigue recompensas de la Manada.',href:'/desafios',image:'/assets/credencial-lobo-luna.webp',cta:'VER DESAFÍOS',icon:'✧'}
 ];

 const style=document.createElement('style');
 style.id='sdl-portal-style';
 style.textContent=`
  body.portal-home{background:#02070c}
  body.portal-home main>section.sec{display:none!important}
  body.portal-home #inicio.hero{min-height:auto;padding:clamp(48px,6vw,82px) 0 54px;align-items:flex-start}
  body.portal-home #inicio .hero-bg{filter:brightness(.42) saturate(.9);transform:scale(1.015)}
  body.portal-home #inicio:after{background:linear-gradient(90deg,#02060ad9,#02060a70 52%,#02060a45),linear-gradient(0deg,#02070cf8 0%,transparent 48%,#02070c38)}
  body.portal-home #inicio .hi{max-width:none;width:min(1320px,94%);margin:auto;text-align:center}
  .portal-copy{max-width:1000px;margin:0 auto 34px;display:flex;flex-direction:column;align-items:center}
  .portal-copy .portal-kicker{color:#d0a65e;font:700 clamp(.78rem,1.3vw,1rem) Georgia,serif;letter-spacing:.24em;text-transform:uppercase}
  .portal-copy h1{margin:12px 0 4px;font:500 clamp(3rem,7vw,6.4rem)/.96 Georgia,serif;letter-spacing:.025em;color:#e7e0d4;text-shadow:0 4px 28px #000,0 0 34px #8ccaff18}
  .portal-copy .portal-tagline{margin:8px 0 24px;color:#d0d5dc;font:500 clamp(.9rem,1.6vw,1.18rem) Georgia,serif;letter-spacing:.16em;text-transform:uppercase}
  .portal-actions{width:100%;display:flex;flex-direction:column;align-items:center;gap:11px}
  .portal-explore{border-color:#9d7238!important;color:#f4dfb7!important;background:linear-gradient(180deg,#152130e6,#09111ae6)!important;border-radius:5px!important;padding:13px 27px!important;letter-spacing:.09em;box-shadow:inset 0 0 0 1px #c89b4c20,0 10px 34px #0008}
  .portal-explore:hover{border-color:#d6a75d!important;box-shadow:0 0 28px #c6924142,0 12px 34px #0009}
  .portal-quick-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;width:100%;max-width:980px}
  .portal-quick{min-height:42px;padding:10px 15px!important;border:1px solid #506476!important;border-radius:5px!important;background:linear-gradient(180deg,#0d1925dc,#071019e8)!important;color:#d9e6f1!important;font-size:.75rem!important;font-weight:900!important;letter-spacing:.055em;box-shadow:inset 0 0 18px #7fcaff08,0 8px 24px #0005;transition:transform .2s ease,border-color .2s ease,color .2s ease,box-shadow .2s ease}
  .portal-quick:hover{transform:translateY(-2px);border-color:#c69a55!important;color:#f7e4c0!important;box-shadow:0 0 22px #b6803930,0 10px 28px #0007}
  .portal-quick .portal-quick-icon{margin-right:7px;color:#d7aa60;font-size:.92rem}
  .portal-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;text-align:left;scroll-margin-top:88px}
  .portal-card{position:relative;min-height:390px;display:flex;align-items:flex-end;overflow:hidden;border:1px solid #7f633b;border-radius:4px;background:#07101a;color:#fff;isolation:isolate;box-shadow:0 18px 45px #0007;transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}
  .portal-card:before{content:'';position:absolute;inset:0;z-index:-2;background-image:var(--portal-image);background-size:cover;background-position:center 20%;transition:transform .5s ease,filter .35s ease;filter:saturate(.82) brightness(.73)}
  .portal-card:after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,#03101a0a 20%,#02070c6b 55%,#02070cf7 86%),linear-gradient(90deg,#07121c30,#02070c20)}
  .portal-card:hover{transform:translateY(-5px);border-color:#d0a256;box-shadow:0 22px 55px #000a,0 0 28px #b4813630}
  .portal-card:hover:before{transform:scale(1.045);filter:saturate(.95) brightness(.82)}
  .portal-card-body{width:100%;padding:24px 22px 22px;position:relative}
  .portal-card-icon{width:42px;height:42px;display:grid;place-items:center;margin-bottom:10px;border:1px solid #a67a3c;border-radius:50%;background:#07121cd9;color:#e3bd77;font-size:1.15rem}
  .portal-card h2{margin:0 0 6px;font:500 clamp(1.5rem,2vw,2rem) Georgia,serif;color:#e3bd77;letter-spacing:.035em}
  .portal-card p{min-height:48px;margin:0 0 16px;color:#d1d7df;font-size:.9rem;line-height:1.55}
  .portal-card-cta{display:flex;align-items:center;justify-content:space-between;border:1px solid #886632;padding:9px 12px;background:#07101acc;color:#f0dfc1;font-size:.72rem;font-weight:900;letter-spacing:.08em}
  .portal-card-cta span:last-child{font-size:1.1rem;color:#d9a95b}
  body.portal-section #inicio{display:none!important}
  body.portal-section main>section.sec{display:none!important}
  body.portal-section main>section.portal-section-hero{display:block!important}
  .portal-section-hero{position:relative;min-height:330px;display:flex;align-items:flex-end;overflow:hidden;border-bottom:1px solid #273a4c;background:#07101a}
  .portal-section-hero:before{content:'';position:absolute;inset:0;background-image:var(--section-image);background-size:cover;background-position:center 30%;filter:brightness(.42) saturate(.8);transform:scale(1.015)}
  .portal-section-hero:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,#02070cf4,#02070c9d 58%,#02070c45),linear-gradient(0deg,#03070cfb,transparent 70%)}
  .portal-section-hero .w{position:relative;z-index:2;padding:64px 0 38px}
  .portal-back{display:inline-flex;margin-bottom:22px;color:#b7c8d8;font-size:.76rem;font-weight:900;letter-spacing:.08em}
  .portal-back:hover{color:#e1b56b}
  .portal-section-hero .ey{color:#d6a75d}
  .portal-section-hero h1{margin:7px 0 8px;font:500 clamp(2.6rem,6vw,5rem)/1 Georgia,serif;color:#eee7dc}
  .portal-section-hero p{max-width:680px;margin:0;color:#c3ccd5;font-size:1rem}
  body.portal-section main>section.portal-active-section{display:block!important;padding-top:48px}
  body.portal-section .top>a:first-child{cursor:pointer}
  @media(max-width:1000px){.portal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.portal-card{min-height:360px}}
  @media(max-width:650px){
   body.portal-home #inicio.hero{padding-top:38px}
   .portal-copy h1{font-size:clamp(2.6rem,13vw,4.2rem)}
   .portal-copy .portal-tagline{letter-spacing:.1em}
   .portal-quick-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));max-width:520px}
   .portal-quick{width:100%;padding:10px 8px!important;font-size:.7rem!important}
   .portal-grid{grid-template-columns:1fr;gap:13px}
   .portal-card{min-height:340px}
   .portal-section-hero{min-height:290px}
  }
  @media(max-width:410px){.portal-quick-actions{grid-template-columns:1fr}.portal-explore{width:100%;max-width:320px}}
 `;
 document.head.appendChild(style);

 const navRouteMap=new Map([
  ['#inicio','/'],['#personajes','/personajes'],['#historias','/historias'],['#episodios','/episodios'],['#musica','/musica'],['#galeria','/galeria'],
  ['/fanclub.html','/fanclub'],['/mapa.html','/mapa'],['/tour.html','/tour'],['/viaje.html','/viaje']
 ]);
 function normalizeNav(){
  const nav=document.querySelector('#publicApp .nav');if(!nav)return;
  nav.querySelectorAll('a').forEach(link=>{
   const raw=link.getAttribute('href')||'';
   if(navRouteMap.has(raw))link.setAttribute('href',navRouteMap.get(raw));
  });
  let challenge=nav.querySelector('a[data-portal-desafios]');
  if(!challenge){
   challenge=document.createElement('a');challenge.href='/desafios';challenge.textContent='Desafíos';challenge.dataset.portalDesafios='1';
   const explore=[...nav.querySelectorAll('a')].find(a=>/Explorar/i.test(a.textContent||''));
   explore?nav.insertBefore(challenge,explore):nav.appendChild(challenge);
  }
  const home=[...nav.querySelectorAll('a')].find(a=>/Inicio/i.test(a.textContent||''));if(home)home.href='/';
  const logo=document.querySelector('#publicApp .top>a:first-child');if(logo)logo.href='/';
 }
 setTimeout(normalizeNav,80);setTimeout(normalizeNav,500);
 const nav=document.querySelector('#publicApp .nav');if(nav)new MutationObserver(normalizeNav).observe(nav,{childList:true,subtree:false});

 function setCanonical(route,title,description){
  document.title=`${title} | Sangre de Luna`;
  let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}
  canonical.href='https://sangre-de-luna-public.vercel.app'+route;
  const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=description;
 }

 function buildHome(){
  document.body.classList.add('portal-home');
  const hero=document.getElementById('inicio'),hi=hero?.querySelector('.hi');if(!hero||!hi)return;
  const premiere=hi.querySelector('#premiereAlert');
  hi.innerHTML=`<div class="portal-copy"><span class="portal-kicker">BIENVENIDO AL UNIVERSO</span><h1>SANGRE DE LUNA</h1><p class="portal-tagline">DONDE LA LEYENDA COBRA VIDA</p><div class="portal-actions"><a class="btn portal-explore" href="#portalSections">EXPLORAR AHORA&nbsp; ›</a><div class="portal-quick-actions" aria-label="Accesos directos al universo"><a class="btn portal-quick" href="/viaje"><span class="portal-quick-icon">◈</span>DESCUBRE MI LUGAR</a><a class="btn portal-quick" href="/episodios"><span class="portal-quick-icon">▶</span>VER EPISODIOS</a><a class="btn portal-quick" href="/mapa"><span class="portal-quick-icon">⌖</span>MAPAS DE LA TIERRA</a><a class="btn portal-quick" href="/tour"><span class="portal-quick-icon">✦</span>EXPLORAR TERRITORIOS</a></div></div></div><div class="portal-grid" id="portalSections"></div>`;
  if(premiere)hi.querySelector('.portal-copy')?.appendChild(premiere);
  const grid=hi.querySelector('#portalSections');
  grid.innerHTML=cards.map(card=>`<a class="portal-card" href="${card.href}" style="--portal-image:url('${card.image}')"><div class="portal-card-body"><div class="portal-card-icon">${card.icon}</div><h2>${card.title}</h2><p>${card.desc}</p><div class="portal-card-cta"><span>${card.cta}</span><span>›</span></div></div></a>`).join('');
  setCanonical('/','Sangre de Luna','Sitio oficial de Sangre de Luna. Explora personajes, historias, episodios, música original, galería y desafíos de la Manada.');
 }

 function buildSection(page){
  document.body.classList.add('portal-section');
  const splash=document.getElementById('splash');if(splash){splash.classList.add('hidden');splash.style.display='none'}
  const target=document.getElementById(page.id);if(!target)return;
  target.classList.add('portal-active-section');
  const banner=document.createElement('section');banner.className='portal-section-hero';banner.style.setProperty('--section-image',`url('${page.image}')`);
  banner.innerHTML=`<div class="w"><a class="portal-back" href="/">‹ VOLVER AL INICIO</a><span class="ey">${page.eyebrow}</span><h1>${page.title}</h1><p>${page.description}</p></div>`;
  target.parentNode.insertBefore(banner,target);
  setCanonical(path,page.title,page.description);
  requestAnimationFrame(()=>scrollTo({top:0,behavior:'auto'}));
 }

 if(path==='/'||path==='')buildHome();
 else if(pages[path])buildSection(pages[path]);
})();