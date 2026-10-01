(()=>{"use strict";
if(window.__SDL_EXPERIENCIA_V2__)return;window.__SDL_EXPERIENCIA_V2__=true;
const body=document.body,root=document.documentElement,path=location.pathname,KEY="sdl-ux-last-place",FONT="sdl-ux-font-scale";const getItem=k=>{try{return localStorage.getItem(k)}catch{return null}},setItem=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
const catalog=[
["Inicio de la Ciudadela","Regresa a la portada y conoce el universo.","/","inicio ciudadela portada"],
["El libro · El origen de la manada","Conoce el primer libro y cómo adquirirlo.","/libro.html","libro amazon leer comprar origen"],
["Personajes","Explora las fichas de los personajes.","/personajes","personajes protagonistas"],
["Historias","Lee relatos y contenido narrativo.","/historias","historias relatos lectura"],
["Episodios","Encuentra temporadas y videos.","/episodios","episodios capítulos temporadas"],
["Música","Escucha los sonidos de Sangre de Luna.","/musica","música canciones audio"],
["Galería","Explora artes e imágenes oficiales.","/galeria","galería arte imágenes"],
["Mapa de las Tierras","Descubre lugares y territorios.","/mapa","mapa tierras territorios"],
["Recorrido por la Ciudadela","Explora el tour interactivo.","/tour","tour recorrido ciudadela 360"],
["Mi viaje · Test y misiones","Encuentra tu lugar y continúa tus misiones.","/viaje","test quiz preguntas viaje misiones insignias"],
["Fan Club · La Manada","Únete, elige facción y participa.","/fanclub","fan club miembros comunidad facciones"],
["Desafíos de la Manada","Ingresa como miembro para consultar retos y logros.","/desafios","desafíos retos insignias logros"]
];
const css='body{font-size:calc(16px * var(--sdl-ux-scale,1))}.sdl-ux-dock{position:fixed;left:14px;bottom:14px;z-index:1200;display:flex;align-items:center;gap:4px;padding:6px;border:1px solid rgba(158,199,226,.28);border-radius:16px;background:rgba(4,12,20,.92);box-shadow:0 8px 30px rgba(0,0,0,.3);backdrop-filter:blur(14px);color:#eef6ff;font:600 13px/1.2 Arial,sans-serif}'+
'.sdl-ux-dock a,.sdl-ux-dock button{min-height:42px;min-width:42px;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 11px;border:0;border-radius:11px;background:transparent;color:inherit;font:inherit;text-decoration:none;cursor:pointer}'+
'.sdl-ux-dock a:hover,.sdl-ux-dock button:hover{background:rgba(130,202,255,.17);color:#9cdbff}'+
'.sdl-ux-dock :focus-visible,.sdl-ux-dialog :focus-visible,.sdl-ux-start a:focus-visible{outline:3px solid #9cdbff;outline-offset:2px}'+
'.sdl-ux-dialog{position:fixed;inset:0;z-index:99990;display:none;place-items:center;padding:16px;background:rgba(0,4,9,.78);backdrop-filter:blur(10px);font:16px/1.5 Arial,sans-serif;color:#edf6ff}.sdl-ux-dialog.open{display:grid}'+
'.sdl-ux-box{width:min(690px,100%);max-height:min(82vh,760px);overflow:hidden;display:grid;grid-template-rows:auto auto minmax(0,1fr);border:1px solid #38566d;border-radius:20px;background:linear-gradient(165deg,#0a1722,#050b11);box-shadow:0 28px 90px #000b}'+
'.sdl-ux-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px 8px}.sdl-ux-head h2{margin:0;font:700 1.5rem Georgia,serif;color:#f5f8fb}'+
'.sdl-ux-close{width:42px;height:42px;border:1px solid #38566d;border-radius:50%;background:#0c1a27;color:#fff;font-size:1.3rem;cursor:pointer}'+
'.sdl-ux-search{width:calc(100% - 40px);margin:8px 20px 14px;padding:13px 15px;border:1px solid #52718a;border-radius:12px;background:#02070c;color:#fff;font:inherit}'+
'.sdl-ux-results{overflow:auto;padding:0 14px 16px}.sdl-ux-result{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 8px;border-top:1px solid #233847}'+
'.sdl-ux-result-main{flex:1;min-width:0;border:0;background:none;color:#eef6ff;text-align:left;cursor:pointer}.sdl-ux-result-main strong{display:block;color:#a9dbff;font-size:.95rem}.sdl-ux-result-main small{display:block;margin-top:3px;color:#a7b7c5;font-size:.8rem}'+
'.sdl-ux-share{flex:0 0 auto;padding:8px 10px;border:1px solid #36556e;border-radius:999px;background:#0a1722;color:#e8f5ff;cursor:pointer}.sdl-ux-empty{padding:20px;color:#a9bac9;text-align:center}'+
'.sdl-ux-start{position:relative;z-index:5;padding:26px 0 32px;background:linear-gradient(180deg,#08111a,#0a1520);border-block:1px solid #20364a}.sdl-ux-start-inner{width:min(1160px,94%);margin:auto}'+
'.sdl-ux-start h2{margin:0 0 5px;color:#f0f6fb;font:700 clamp(1.45rem,3vw,2.15rem) Georgia,serif}.sdl-ux-start p{margin:0 0 15px;color:#a9bac9}.sdl-ux-start-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}'+
'.sdl-ux-start a{min-height:88px;display:flex;flex-direction:column;justify-content:center;gap:5px;padding:14px;border:1px solid #2a4358;border-radius:14px;background:linear-gradient(140deg,#0c1b29,#08111a);color:#eef6ff;text-decoration:none;transition:border-color .18s,transform .18s}.sdl-ux-start a:hover{border-color:#8ed3ff;transform:translateY(-2px)}'+
'.sdl-ux-start a b{color:#9cdbff;font-size:.96rem}.sdl-ux-start a span{color:#a9bac9;font-size:.8rem}.sdl-ux-resume{margin-top:14px;padding:12px 14px;border:1px solid #37566d;border-radius:12px;background:#07111b}'+
'.sdl-ux-resume a{min-height:0;display:inline-flex;flex-direction:row;padding:0;border:0;background:none;color:#9cdbff;font-weight:700}.sdl-ux-resume a:hover{transform:none;text-decoration:underline}'+
'.sdl-ux-toast{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:100000;padding:10px 14px;border-radius:999px;background:#e9f5ff;color:#0a1722;font:700 13px Arial,sans-serif;box-shadow:0 8px 25px #0008}'+
'@media(max-width:760px){body{font-size:calc(16px * var(--sdl-ux-scale,1));padding-bottom:calc(74px + env(safe-area-inset-bottom))!important}.sdl-ux-dock{left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom));justify-content:space-around;gap:1px;padding:5px;border-radius:16px}.sdl-ux-dock a,.sdl-ux-dock button{flex:1;min-width:0;min-height:48px;flex-direction:column;gap:2px;padding:4px 2px;font-size:11px}.sdl-ux-start-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.sdl-ux-start a{min-height:78px;padding:12px}.sdl-ux-dialog{padding:8px}.sdl-ux-box{max-height:88vh;border-radius:16px}#cronistaWidget,#sdlgCronista{bottom:calc(74px + env(safe-area-inset-bottom))!important}.playerbar.show{bottom:calc(76px + env(safe-area-inset-bottom))!important}}'+
'@media(max-width:380px){.sdl-ux-dock a,.sdl-ux-dock button{font-size:10px}.sdl-ux-start-grid{gap:7px}}@media(prefers-reduced-motion:reduce){.sdl-ux-start a{transition:none}.sdl-ux-start a:hover{transform:none}}';
const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);

const lunarStyle=document.createElement("style");lunarStyle.textContent=
'.sdl-ux-dock{border-color:rgba(184,205,222,.35);border-radius:999px;background:linear-gradient(135deg,rgba(7,15,24,.97),rgba(11,27,42,.94));box-shadow:0 8px 28px rgba(0,0,0,.42),inset 0 0 0 1px rgba(231,240,247,.035)}'+
'.sdl-ux-dock:before{content:"";position:absolute;inset:3px;border:1px solid rgba(150,190,219,.12);border-radius:inherit;pointer-events:none}'+
'.sdl-ux-dock a,.sdl-ux-dock button{position:relative;border-radius:999px;letter-spacing:.035em}.sdl-ux-dock [data-sdl-open-menu] span:first-child{color:#b9d8ec;font-size:1.35em}'+
'.sdl-lunar-menu{place-items:stretch end;padding:0;background:rgba(1,5,10,.76)}.sdl-menu-panel{width:min(440px,100%);height:100%;max-height:100%;overflow:auto;padding:clamp(22px,5vw,38px);border-left:1px solid #506a7d;background:radial-gradient(ellipse at 10% 0%,rgba(95,140,171,.18),transparent 37%),linear-gradient(160deg,#0a131d,#03070c 70%);box-shadow:-24px 0 80px #0009}.sdl-menu-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding-bottom:22px;border-bottom:1px solid rgba(186,211,228,.2)}'+
'.sdl-menu-kicker{color:#9abbd2;font:800 .66rem Arial,sans-serif;letter-spacing:.2em}.sdl-menu-head h2{margin:6px 0 0;color:#f1f6f9;font:700 clamp(1.8rem,4vw,2.3rem) Georgia,serif}.sdl-menu-groups{display:grid;gap:6px;padding:16px 0}.sdl-menu-link,.sdl-menu-group summary{min-height:48px;display:flex;align-items:center;padding:10px 12px;border:1px solid transparent;border-radius:11px;color:#e9f1f6;text-decoration:none;font:700 .98rem/1.35 Arial,sans-serif;cursor:pointer}.sdl-menu-link:hover,.sdl-menu-group summary:hover{border-color:rgba(152,190,215,.28);background:rgba(171,207,230,.07);color:#c4e8ff}.sdl-menu-group{border:1px solid rgba(145,174,196,.17);border-radius:13px;background:rgba(10,23,34,.54);overflow:hidden}.sdl-menu-group summary{list-style:none;justify-content:space-between;color:#c8dfef;letter-spacing:.025em}.sdl-menu-group summary::-webkit-details-marker{display:none}.sdl-menu-group summary:after{content:"＋";color:#91b6d1;font-weight:400}.sdl-menu-group[open] summary:after{content:"−"}.sdl-menu-links{display:grid;padding:0 9px 9px 17px}.sdl-menu-links a{padding:8px 10px;border-left:1px solid rgba(145,174,196,.28);color:#b7c4cf;text-decoration:none;font:500 .91rem Arial,sans-serif}.sdl-menu-links a:hover{color:#fff;border-color:#b8d9ee}.sdl-menu-tools{display:flex;gap:9px;flex-wrap:wrap;padding-top:15px;border-top:1px solid rgba(186,211,228,.2)}'+
'.sdl-menu-tools button{min-height:44px;padding:10px 13px;border:1px solid #405b70;border-radius:999px;background:#0b1a27;color:#d8e9f4;font:700 .8rem Arial,sans-serif;cursor:pointer}.sdl-menu-tools button:hover{border-color:#a3c9e2;background:#102638}.sdl-menu-tools button span{margin-left:5px}'+
'.top nav.sdl-site-nav{align-items:center;gap:clamp(5px,1vw,15px);font-size:.84rem;letter-spacing:.04em}.top nav.sdl-site-nav .sdl-nav-link,.top nav.sdl-site-nav .sdl-nav-toggle{min-height:40px;display:inline-flex;align-items:center;padding:8px 10px;border:1px solid transparent;border-radius:999px;background:transparent;color:#dbe7ee;text-decoration:none;font:800 .78rem Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;cursor:pointer}.top nav.sdl-site-nav .sdl-nav-link:hover,.top nav.sdl-site-nav .sdl-nav-toggle:hover,.top nav.sdl-site-nav .sdl-nav-group.is-open>.sdl-nav-toggle{border-color:rgba(169,204,226,.34);background:linear-gradient(135deg,rgba(120,163,190,.12),rgba(21,39,54,.55));color:#c6e6fb}.sdl-nav-group{position:relative}.sdl-nav-panel{position:absolute;top:calc(100% + 8px);left:0;min-width:220px;display:none;gap:2px;padding:9px;border:1px solid #405b70;border-radius:14px;background:linear-gradient(150deg,#0d1a26,#03070c);box-shadow:0 20px 44px #0009}.sdl-nav-group.is-open .sdl-nav-panel{display:grid}.sdl-nav-panel a{padding:10px 11px;border-radius:9px;color:#c8d6df;text-decoration:none;font:600 .86rem Arial,sans-serif}.sdl-nav-panel a:hover{background:rgba(157,197,222,.1);color:#e8f5fc}.sdl-nav-search{min-height:40px;padding:8px 12px;border:1px solid rgba(169,204,226,.28);border-radius:999px;background:rgba(9,22,32,.8);color:#dcebf4;font:700 .78rem Arial,sans-serif;cursor:pointer}.sdl-nav-search:hover{border-color:#9fc6df;color:#c6e6fb}'+
'@media(max-width:900px){.top nav.sdl-site-nav{display:none!important}.sdl-nav-search{display:none}.sdl-ux-dock[data-home="true"]{display:flex!important}}@media(min-width:901px){.sdl-ux-dock[data-home="true"]{display:none!important}}'+
'@media(max-width:760px){.sdl-ux-dock{gap:2px;padding:5px}.sdl-ux-dock a,.sdl-ux-dock button{min-height:49px;font-size:11px}.sdl-menu-panel{width:min(430px,100%);padding:20px 18px calc(22px + env(safe-area-inset-bottom))}.sdl-menu-link,.sdl-menu-group summary{min-height:50px}.top nav.sdl-site-nav .sdl-nav-panel{position:static}}'+
'@media(prefers-reduced-motion:reduce){.sdl-ux-dock *,.sdl-menu-panel *,.sdl-site-nav *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}';
document.head.appendChild(lunarStyle);

const dock=document.createElement("nav");dock.className="sdl-ux-dock";dock.setAttribute("aria-label","Accesos rápidos");
dock.innerHTML='<button type="button" data-sdl-open-menu aria-label="Abrir menú lunar"><span aria-hidden="true">☾</span><span>Menú</span></button><button type="button" data-sdl-open-search aria-label="Buscar en Sangre de Luna"><span aria-hidden="true">⌕</span><span>Buscar</span></button><a href="/" aria-label="Volver al inicio"><span aria-hidden="true">⌂</span><span>Inicio</span></a>';dock.dataset.home=String(path==="/"||path==="/index.html");body.appendChild(dock);
const menu=document.createElement("div");menu.className="sdl-ux-dialog sdl-lunar-menu";menu.id="sdlUxMenu";menu.setAttribute("role","dialog");menu.setAttribute("aria-modal","true");menu.setAttribute("aria-labelledby","sdlMenuTitle");
menu.innerHTML='<section class="sdl-menu-panel"><header class="sdl-menu-head"><div><span class="sdl-menu-kicker">SANGRE DE LUNA</span><h2 id="sdlMenuTitle">Explora el universo</h2></div><button class="sdl-ux-close" type="button" data-sdl-close-menu aria-label="Cerrar menú">×</button></header><div class="sdl-menu-groups"></div><footer class="sdl-menu-tools"><button type="button" data-sdl-font> A↕ <span>Tamaño del texto</span></button><button type="button" data-sdl-share>↗ <span>Compartir esta página</span></button></footer></section>';body.appendChild(menu);
const groupRoot=menu.querySelector(".sdl-menu-groups");
const makeMenuLink=(item)=>{const a=document.createElement("a");a.href=item[2];a.className="sdl-menu-link";a.textContent=item[0];a.addEventListener("click",()=>menu.classList.remove("open"));return a};
const makeDetails=(title,items)=>{const d=document.createElement("details");d.className="sdl-menu-group";const sm=document.createElement("summary");sm.textContent=title;d.appendChild(sm);const list=document.createElement("div");list.className="sdl-menu-links";items.forEach(x=>list.appendChild(makeMenuLink(x)));d.appendChild(list);return d};
const homeEntry=catalog[0],bookEntry=catalog[1],universeEntries=catalog.slice(2,9),communityEntries=catalog.slice(9);
const sagaEntries=[
["El libro","Portada, presentación y compra oficial en Amazon.","https://sangre-de-luna-public.vercel.app/libro.html","libro saga amazon"],
["Por dónde empezar","Una guía para descubrir el libro, la serie y la manada.","https://sangre-de-luna-public.vercel.app/saga#empezar","saga comenzar guía"],
["Temporadas y capítulos","Videos y crónicas organizados por temporada.","https://sangre-de-luna-public.vercel.app/saga#temporadas","saga temporadas capítulos"],
["La historia hasta ahora","Recupera el hilo con aviso antes de acceder a revelaciones.","https://sangre-de-luna-public.vercel.app/saga#resumen","saga resumen sinopsis"]
];
catalog.push(...sagaEntries.slice(1));
const universeMenu=[
["Descubre el universo","Una guía visual para elegir tu próximo recorrido.","https://sangre-de-luna-public.vercel.app/universo","universo guía"],
["Personajes","Retratos oficiales, roles y biografías.","https://sangre-de-luna-public.vercel.app/personajes","personajes fichas"],
["Linajes y grupos","Encuentra a los personajes por su grupo publicado.","https://sangre-de-luna-public.vercel.app/personajes#linajes","linajes facciones grupos"],
["Glosario del universo","Una guía breve para orientarte en el contenido.","https://sangre-de-luna-public.vercel.app/universo#glosario","glosario términos universo"],
["Mapa de las Tierras","Explora los lugares del mundo de Sangre de Luna.","https://sangre-de-luna-public.vercel.app/mapa","territorios reinos mapa"],
["Recorrido por la Ciudadela","Visita sus espacios en el tour interactivo.","https://sangre-de-luna-public.vercel.app/tour","ciudadela tour recorrido"]
];catalog.push(universeMenu[0],universeMenu[2],universeMenu[3]);
groupRoot.appendChild(makeMenuLink(homeEntry));groupRoot.appendChild(makeDetails("LA SAGA",sagaEntries));groupRoot.appendChild(makeDetails("UNIVERSO",universeMenu));groupRoot.appendChild(makeDetails("MULTIMEDIA",universeEntries.slice(3,5)));groupRoot.appendChild(makeDetails("EXPLORAR",universeEntries.slice(5)));groupRoot.appendChild(makeDetails("COMUNIDAD",communityEntries));
const gameUrl="https://sangre-de-luna-ecos-ciudadela.vercel.app/";const gameItem=["Jugar · Crónicas de la Ciudadela","Entra al juego de Sangre de Luna.",gameUrl,"juego jugar"];
groupRoot.appendChild(makeMenuLink(gameItem));
const isWelcome=()=>{const splash=document.getElementById("splash");return !!(splash&&!splash.classList.contains("hide"))};
const openMenu=()=>{if(isWelcome())return;menu.classList.add("open");const first=menu.querySelector(".sdl-menu-link");setTimeout(()=>first&&first.focus(),20)};
const closeMenu=()=>menu.classList.remove("open");
dock.querySelector("[data-sdl-open-menu]").addEventListener("click",openMenu);
menu.querySelector("[data-sdl-close-menu]").addEventListener("click",closeMenu);
menu.addEventListener("click",e=>{if(e.target===menu)closeMenu()});
menu.querySelectorAll("a[href]").forEach(a=>a.addEventListener("click",()=>closeMenu()));

const SDL_SITE="https://sangre-de-luna-public.vercel.app";
const onGame=location.origin!==SDL_SITE;
if(onGame)catalog.forEach(x=>{if(x[2].startsWith('/'))x[2]=SDL_SITE+x[2]});
if(!document.querySelector(".top nav.nav")){
 const previous=document.querySelector('header.top,header.topbar');
 if(previous){previous.classList.remove('top','topbar','wrap');previous.classList.add('sdl-local-header')}
 const shared=document.createElement('header');shared.className='top sdl-common-header';shared.setAttribute('aria-label','Encabezado de Sangre de Luna');
 shared.innerHTML='<a href="'+SDL_SITE+'/" aria-label="Sangre de Luna · Inicio"><img src="'+SDL_SITE+'/assets/logo-oficial.png" alt="Sangre de Luna"></a><nav class="nav" aria-label="Navegación principal"></nav>'+"<div class=\"head-actions\"><div class=\"socials\"><a class=\"social\" href=\"https://www.instagram.com/sangredelunaia\" target=\"_blank\" rel=\"noopener\" aria-label=\"Instagram\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.4A5.6 5.6 0 1 1 6.4 12 5.61 5.61 0 0 1 12 6.4Zm0 1.8A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2Z\"/></svg></a><a class=\"social\" href=\"https://www.youtube.com/@SangredeLunaIA\" target=\"_blank\" rel=\"noopener\" aria-label=\"YouTube\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M23 12.01s0-3.51-.45-5.2a2.95 2.95 0 0 0-2.08-2.09C18.79 4.27 12 4.27 12 4.27s-6.79 0-8.47.45A2.95 2.95 0 0 0 1.45 6.8C1 8.5 1 12 1 12s0 3.51.45 5.2a2.95 2.95 0 0 0 2.08 2.09c1.68.45 8.47.45 8.47.45s6.79 0 8.47-.45a2.95 2.95 0 0 0 2.08-2.09c.45-1.69.45-5.19.45-5.19ZM9.2 15.52V8.5l6.07 3.51-6.07 3.51Z\"/></svg></a><a class=\"social\" href=\"https://www.tiktok.com/@hamunaptsoon\" target=\"_blank\" rel=\"noopener\" aria-label=\"TikTok\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M14.6 2h2.59c.2 1.68 1.2 3.24 2.81 4.01.86.42 1.79.61 2.7.64v2.66c-1.27-.04-2.53-.3-3.68-.84-.77-.36-1.46-.85-2.1-1.43v7.65a6.54 6.54 0 1 1-6.54-6.54c.29 0 .57.02.85.06v2.72a3.86 3.86 0 1 0 2.93 3.76V2Z\"/></svg></a></div><a class=\"btn ghost fanclub-head-btn\" href=\"/fanclub.html\" aria-label=\"Abrir Fan Club\">Fan Club</a><a class=\"btn ghost admin-entry\" href=\"?admin=1\">Ingresar</a></div>";
 shared.querySelectorAll('a[href^="/"],a[href^="?"]').forEach(a=>a.href=new URL(a.getAttribute('href'),SDL_SITE+'/').href);
 body.prepend(shared);dock.querySelector('a[aria-label="Volver al inicio"]').href=SDL_SITE+'/';
 body.classList.add('sdl-has-shared-header');if(onGame)body.classList.add('sdl-game-header');
 const sizeHeader=()=>root.style.setProperty('--sdl-header-height',shared.offsetHeight+'px');
 new ResizeObserver(sizeHeader).observe(shared);sizeHeader();
 const base=document.createElement('style');base.textContent=`
 .sdl-common-header{height:auto!important;min-height:0!important;position:relative!important;inset:auto!important;z-index:100!important;width:100%!important;max-width:none!important;margin:0!important;pointer-events:auto!important;color:#eef6ff;font:16px/1.55 Arial,sans-serif;border-bottom:1px solid #203040}
 .sdl-common-header *{box-sizing:border-box}
 .sdl-common-header a{text-decoration:none;color:inherit}
 .sdl-common-header .nav{display:flex;align-items:center;justify-content:space-evenly}
 .sdl-common-header .socials{display:flex;align-items:center;gap:8px}
 .sdl-common-header .social{display:grid;place-items:center;width:38px;height:38px;border:1px solid #35506a;border-radius:50%;background:#09131d;color:#eef6ff}
 .sdl-common-header .social svg{width:18px;height:18px;fill:currentColor}
 .sdl-common-header .btn{padding:10px 16px!important;font-size:16px!important;border-radius:999px!important;display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border:1px solid #35506a;border-radius:999px;background:#0d1823;color:#eef6ff;font:800 16px/1.55 Arial;white-space:nowrap}
 .sdl-common-header .btn:hover,.sdl-common-header .social:hover{border-color:#b8d5e9}
 .sdl-local-header{position:relative!important;inset:auto!important;display:flex!important;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:12px 3%!important;background:#09131d!important;border-bottom:1px solid #294053;pointer-events:auto!important;z-index:30}
 .sdl-local-header .brand img{display:none}
 .sdl-local-header .brand{justify-self:auto}
 .sdl-has-shared-header .top-actions{display:flex;flex-wrap:wrap;gap:8px}
 .sdl-has-shared-header #intro,.sdl-has-shared-header .portal{top:var(--sdl-header-height)!important;max-height:calc(100svh - var(--sdl-header-height));overflow:auto!important;align-items:start;padding-top:24px;padding-bottom:24px}
 .sdl-has-shared-header .portal{z-index:80}
 .sdl-has-shared-header #intro>div{margin:auto}
 .sdl-has-shared-header:has(#tour){height:auto;overflow:auto}
 .sdl-has-shared-header:has(#tour) .sdl-common-header{position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:100!important}
 .sdl-has-shared-header #tour,.sdl-has-shared-header #sdl360App{position:fixed!important;top:var(--sdl-header-height,179px)!important;bottom:0!important;left:0!important;right:0!important;height:calc(100dvh - var(--sdl-header-height,179px))!important;min-height:0!important;z-index:80!important}
 .sdl-has-shared-header #sdl360App .s360-overlay{max-height:100%;overflow-y:auto!important;overscroll-behavior:contain}
 .sdl-has-shared-header #sdl360App .s360-panel{margin:auto}
 @media(max-height:800px){.sdl-has-shared-header #sdl360App .s360-panel h2{font-size:clamp(2rem,4.3vw,3.5rem)}.sdl-has-shared-header #sdl360App .s360-panel>img{width:95px}.sdl-has-shared-header #sdl360App .s360-territory{min-height:125px}}

 .sdl-has-shared-header #world .legend,.sdl-has-shared-header #world .panel{top:calc(var(--sdl-header-height) + 86px);max-height:calc(100svh - var(--sdl-header-height) - 150px)}
 .sdl-game-header #mode .modeBrand>img,.sdl-game-header #menu .hero>div>img[src$="/logo.webp"]{display:none!important}
 .sdl-game-header{height:100dvh!important;overflow:hidden!important}
 .sdl-game-header>.screen{height:calc(100dvh - var(--sdl-header-height))!important;min-height:0!important;overflow-x:hidden!important;overflow-y:scroll!important;scrollbar-gutter:stable;scrollbar-width:auto;scrollbar-color:#a5bdce #0b1622;overscroll-behavior-y:contain;padding-bottom:80px;box-sizing:border-box}
 .sdl-game-header>.screen::-webkit-scrollbar{width:12px}
 .sdl-game-header>.screen::-webkit-scrollbar-track{background:#0b1622}
 .sdl-game-header>.screen::-webkit-scrollbar-thumb{background:#a5bdce;border:3px solid #0b1622;border-radius:12px}
 .sdl-game-header .screen .hero,.sdl-game-header .screen .campaign,.sdl-game-header .screen .game{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}
 .sdl-game-header .screen .hero{padding:30px clamp(16px,3vw,40px)!important}
 .sdl-game-header .screen .campaign{padding:18px!important;grid-template-columns:245px minmax(0,1fr)!important}
 .sdl-game-header .campaign>div:last-child{grid-template-rows:auto auto auto!important;overflow:visible!important}
 .sdl-game-header .screen .side{height:auto!important;max-height:none!important;overflow:visible!important}
 .sdl-game-header .campaign .mission{height:380px!important;min-height:300px!important}
 .sdl-game-header .screen .game{padding:18px!important;grid-template-rows:auto auto!important}
 .sdl-game-header .screen .board{height:auto!important;min-height:0!important;overflow:visible!important;align-items:start;grid-template-columns:225px minmax(0,1fr) 250px!important}
 .sdl-game-header .board>.panel,.sdl-game-header .board>div:nth-child(2),.sdl-game-header .board>div:nth-child(2)>.panel{height:auto!important;min-height:0!important;overflow:visible!important}
 .sdl-game-header .board>div:nth-child(2){grid-template-rows:auto auto auto!important}
 .sdl-game-header .screen .event{max-height:none!important;min-height:140px!important}
 .sdl-game-header .screen .event p,.sdl-game-header .screen .guide p,.sdl-game-header .screen .goal,.sdl-game-header .screen .threat,.sdl-game-header .screen .choice{font-size:12px!important;line-height:1.5!important}
 .sdl-game-header .screen .play{max-height:none!important;min-height:110px!important;overflow:visible!important;flex-wrap:wrap}
 .sdl-game-header .screen .hand{max-height:none!important;overflow:visible!important;flex-wrap:wrap;justify-content:flex-start!important;gap:8px!important;padding:12px 0!important}
 .sdl-game-header .screen .card{flex:0 0 125px!important;width:125px!important;min-width:0!important;max-width:none!important}
 .sdl-game-header .screen .card .copy b{font-size:13px!important}
 .sdl-game-header .screen .card .copy p,.sdl-game-header .screen .card .copy small{font-size:10px!important;line-height:1.35!important}
 .sdl-game-header #log{max-height:none!important;overflow:visible!important;font-size:12px!important;line-height:1.5!important}
 .sdl-game-header .screen .btn{min-height:44px;font-size:13px!important;padding:10px 14px!important}
 .sdl-game-header .screen .top{height:auto!important;min-height:60px!important;flex-wrap:wrap}
 .sdl-game-header .screen .actions{flex-wrap:wrap}
 .sdl-game-header .modal,.sdl-game-header .tutorial{z-index:200}
 .sdl-game-header .tutorial{overflow-y:auto!important}
 @media(max-width:1100px){.sdl-game-header .screen .board{grid-template-columns:210px minmax(0,1fr)!important}.sdl-game-header .board>div:last-child{grid-column:1/-1}}
 @media(max-width:900px){.sdl-game-header .screen .campaign{grid-template-columns:1fr!important}}
 @media(max-width:760px){.sdl-game-header .screen .board{grid-template-columns:minmax(0,1fr)!important}.sdl-game-header .board>div:last-child{grid-column:auto}.sdl-game-header .screen .game,.sdl-game-header .screen .campaign{padding:12px!important}.sdl-game-header .screen .card{flex-basis:calc((100% - 16px)/3)!important;width:auto!important}.sdl-game-header .screen .event{grid-template-columns:90px minmax(0,1fr)!important}.sdl-game-header .screen .cardHero{width:min(250px,70vw)!important}}
 @media(max-width:430px){.sdl-game-header .screen .card{flex-basis:calc((100% - 8px)/2)!important}}
 @media(max-width:900px){.sdl-common-header .head-actions{padding:0!important;min-height:0}.sdl-local-header{font-size:13px}.sdl-has-shared-header #world .legend{position:relative;top:auto;left:auto;margin:12px}.sdl-has-shared-header #world .panel{top:12px;max-height:calc(100svh - 24px);z-index:150}}
 `;document.head.appendChild(base);
}

if(document.querySelector(".top nav.nav")){
 const nav=document.querySelector(".top nav.nav");
 if(nav){
  nav.classList.add("sdl-site-nav");nav.setAttribute("aria-label","Navegación principal");nav.replaceChildren();
  const addTopLink=(label,href)=>{const a=document.createElement("a");a.className="sdl-nav-link";a.href=href;a.textContent=label;nav.appendChild(a)};
  const closeGroups=()=>nav.querySelectorAll('.sdl-nav-group').forEach(g=>{g.classList.remove('is-open');g.querySelector('button').setAttribute('aria-expanded','false')});
  const addGroup=(label,items)=>{const wrap=document.createElement('div');wrap.className='sdl-nav-group';const b=document.createElement('button');b.type='button';b.className='sdl-nav-toggle';b.setAttribute('aria-expanded','false');b.textContent=label+'  ⌄';const panel=document.createElement('section');panel.className='sdl-nav-panel';panel.id='sdlMega'+label;b.setAttribute('aria-controls',panel.id);const head=document.createElement('header');head.className='sdl-mega-head';const title=document.createElement('h2');title.textContent=label+' · SANGRE DE LUNA';const close=document.createElement('button');close.type='button';close.className='sdl-mega-close';close.textContent='×';close.setAttribute('aria-label','Cerrar menú '+label);close.onclick=()=>{closeGroups();b.focus()};head.append(title,close);const grid=document.createElement('div');grid.className='sdl-mega-grid';const sections=label==='LA SAGA'?[['El libro y el comienzo',items.slice(0,2)],['La historia',items.slice(2)]]:label==='UNIVERSO'?[['PERSONAJES',items.slice(0,2)],['LINAJES Y GRUPOS',items.slice(2,4)],['TERRITORIOS',items.slice(4)]]:label==='MULTIMEDIA'?[['Música original',[items[0]]],['Galería oficial',[items[1]]]]:label==='EXPLORAR'?[['Territorios',[items[0]]],['Recorridos',[items[1]]]]:[['Tu recorrido',items.slice(0,1)],['La Manada',items.slice(1,2)],['Participa',items.slice(2)]];sections.forEach(([heading,entries])=>{const col=document.createElement('div');const h=document.createElement('h3');h.textContent=heading;col.appendChild(h);entries.forEach(x=>{const a=document.createElement('a');a.href=x[2];const strong=document.createElement('strong');strong.textContent=x[0];const small=document.createElement('small');small.textContent=x[1];a.append(strong,small);a.onclick=closeGroups;col.appendChild(a)});grid.appendChild(col)});panel.append(head,grid);b.addEventListener('click',()=>{const open=!wrap.classList.contains('is-open');closeGroups();wrap.classList.toggle('is-open',open);b.setAttribute('aria-expanded',String(open))});wrap.append(b,panel);nav.appendChild(wrap)};
  addTopLink("INICIO",homeEntry[2]);addGroup("LA SAGA",sagaEntries);addGroup("UNIVERSO",universeMenu);addGroup("MULTIMEDIA",universeEntries.slice(3,5));addGroup("EXPLORAR",universeEntries.slice(5));addGroup("COMUNIDAD",communityEntries);addTopLink("JUGAR",gameUrl);
  document.addEventListener("click",e=>{if(!e.target.closest(".sdl-nav-group"))nav.querySelectorAll(".sdl-nav-group").forEach(g=>{g.classList.remove("is-open");g.querySelector("button").setAttribute("aria-expanded","false")})});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){nav.querySelectorAll(".sdl-nav-group").forEach(g=>{g.classList.remove("is-open");g.querySelector("button").setAttribute("aria-expanded","false")})}});
 }
 const actions=document.querySelector('.head-actions');if(actions){const fan=actions.querySelector('.fanclub-head-btn'),admin=actions.querySelector('.admin-entry');if(fan)fan.textContent='FAN CLUB';if(admin){admin.textContent='INGRESAR';admin.href=SDL_SITE+'/?admin=1'}actions.querySelectorAll('[data-sdl-open-search]').forEach(x=>x.remove());const form=document.createElement('form');form.className='sdl-header-search';form.setAttribute('role','search');form.innerHTML='<input type="search" placeholder="Buscar en Sangre de Luna" aria-label="Buscar en Sangre de Luna"><button type="submit" aria-label="Buscar"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg></button>';form.onsubmit=e=>{e.preventDefault();openSearch();input.value=form.querySelector('input').value;showResults()};actions.appendChild(form)}
 const navStyle=document.createElement('style');navStyle.textContent=`
 .foot img{width:104px;height:auto;object-fit:contain} .top:has(.sdl-site-nav){display:grid!important;grid-template-columns:auto 1fr;padding:0 3%!important;gap:0 24px;background:linear-gradient(110deg,#263441,#111c29)!important;overflow:visible!important}.top:has(.sdl-site-nav)>a{grid-column:1;grid-row:1/3;align-self:center;position:relative;z-index:2;display:flex;align-items:center;justify-content:center;width:178px;height:178px;background:transparent;border:0;box-shadow:none;box-sizing:border-box}.top:has(.sdl-site-nav)>a>img{display:block;width:170px;height:170px;max-height:170px;object-fit:contain}@media(max-width:900px){.top:has(.sdl-site-nav)>a>img{width:140px;height:140px;max-height:140px}}.top:has(.sdl-site-nav) .head-actions{grid-column:2;grid-row:1;justify-content:flex-end;display:flex;align-items:center;flex-wrap:wrap;gap:12px;min-height:62px;padding:8px 0;box-sizing:border-box}.top nav.sdl-site-nav{position:relative;grid-column:1/-1;grid-row:2;width:auto!important;box-sizing:border-box;display:flex!important;gap:0;margin:0 -3.2%;padding:0 3% 0 calc(3% + 202px);background:linear-gradient(180deg,#566574,#344352);border-top:1px solid #9ba8b6;min-height:50px}.top nav.sdl-site-nav>.sdl-nav-link,.top nav.sdl-site-nav .sdl-nav-toggle{border-radius:0;min-height:50px;padding:14px 20px;font-size:.85rem;text-transform:uppercase;letter-spacing:.055em}.top nav.sdl-site-nav>.sdl-nav-link:not(.sdl-nav-link),.top nav.sdl-site-nav>a:not(.sdl-nav-link){display:none!important}.sdl-nav-group{position:static}.sdl-nav-group.is-open>.sdl-nav-toggle{background:#263645!important;position:relative}.sdl-nav-group.is-open>.sdl-nav-toggle:after{content:'';position:absolute;bottom:-1px;left:calc(50% - 8px);border:8px solid transparent;border-bottom-color:#112334}.sdl-nav-panel{top:100%;left:3%;right:3%;width:auto;min-width:0;padding:24px 30px 30px;border-radius:0 0 16px 16px;background:#112334;box-shadow:0 24px 50px #000b;max-height:70vh;overflow:auto}.sdl-mega-head{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #365065;padding-bottom:14px;margin-bottom:22px}.sdl-mega-head h2{font:700 1.45rem Georgia;margin:0;color:#e7f2fa}.sdl-mega-close{border:0;background:none;color:#e2eef6;font-size:28px;cursor:pointer;width:44px;height:44px}.sdl-mega-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px}.sdl-mega-grid h3{color:#9ec8e3;font:700 .72rem Arial;letter-spacing:.13em;text-transform:uppercase;margin:0 0 12px}.sdl-nav-panel a{display:block;padding:12px 0;border-radius:0;border-bottom:1px solid #284155}.sdl-nav-panel a strong{font-size:.95rem;display:block}.sdl-nav-panel a small{font-size:.8rem;display:block;color:#a5bacb;margin-top:5px;line-height:1.5}.sdl-header-search{display:flex;width:clamp(210px,24vw,340px);height:42px;border:1px solid #57758a;background:#f0f5f8;border-radius:4px;overflow:hidden}.sdl-header-search input{min-width:0;flex:1;padding:10px 12px;border:0;background:transparent;color:#122638;font:14px Arial}.sdl-header-search button{width:44px;border:0;border-left:1px solid #a9bbc7;background:#cfdee8;color:#193c54;cursor:pointer}.sdl-header-search svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8}.sdl-site-nav :focus-visible,.sdl-header-search :focus-visible{outline:2px solid #b4dfff;outline-offset:-3px}
 @media(max-width:900px){.top:has(.sdl-site-nav){grid-template-columns:1fr;gap:10px;padding:10px 14px!important}.top:has(.sdl-site-nav) .head-actions{grid-column:1;grid-row:2;justify-content:flex-start;gap:8px}.top nav.sdl-site-nav{display:none!important}.sdl-header-search{width:100%;order:10}.head-actions .game-head-btn{display:none!important}.top:has(.sdl-site-nav)>a{justify-self:start;grid-row:1;width:148px;height:148px}}`;
 document.head.appendChild(navStyle);

}

const dialog=document.createElement("div");dialog.className="sdl-ux-dialog";dialog.id="sdlUxSearch";dialog.setAttribute("role","dialog");dialog.setAttribute("aria-modal","true");dialog.setAttribute("aria-labelledby","sdlUxTitle");
dialog.innerHTML='<div class="sdl-ux-box"><div class="sdl-ux-head"><h2 id="sdlUxTitle">Buscar en Sangre de Luna</h2><button class="sdl-ux-close" type="button" aria-label="Cerrar búsqueda">×</button></div><input class="sdl-ux-search" type="search" autocomplete="off" placeholder="Personaje, lugar, capítulo, libro…" aria-label="Escribe qué quieres encontrar"><div class="sdl-ux-results" aria-live="polite"></div></div>';body.appendChild(dialog);
const input=dialog.querySelector("input"),results=dialog.querySelector(".sdl-ux-results"),close=dialog.querySelector(".sdl-ux-close");
function slug(s){return(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48)||"contenido"}
function localItems(){return Array.from(document.querySelectorAll(".person,.story,.etitle,.gallery-card,.track,.territory-copy,.hotspot,[data-challenge-card]")).filter(el=>el.getClientRects().length).map((el,i)=>{const title=(el.innerText||el.getAttribute("aria-label")||"").replace(/\s+/g," ").trim().slice(0,110);if(!title)return null;if(!el.id)el.id="sdl-contenido-"+slug(title)+"-"+i;return{title:title.split(" · ")[0],desc:"Contenido de esta página",href:location.pathname+location.search+"#"+el.id,terms:title.toLowerCase(),target:el}}).filter(Boolean)}
function norm(s){return(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function showResults(){const q=norm(input.value.trim()),local=localItems(),all=[...catalog.map(x=>({title:x[0],desc:x[1],href:x[2],terms:x[0]+" "+x[1]+" "+x[3]})),...local];const found=(q?all.filter(x=>norm(x.title+" "+x.desc+" "+x.terms).includes(q)):all.slice(0,catalog.length)).slice(0,22);results.replaceChildren();if(!found.length){const p=document.createElement("p");p.className="sdl-ux-empty";p.textContent="No encontré coincidencias. Prueba con otro nombre, lugar o capítulo.";results.appendChild(p);return}found.forEach(item=>{const row=document.createElement("div");row.className="sdl-ux-result";const main=document.createElement("button");main.type="button";main.className="sdl-ux-result-main";const b=document.createElement("strong");b.textContent=item.title;const sm=document.createElement("small");sm.textContent=item.desc;main.append(b,sm);main.addEventListener("click",()=>{dialog.classList.remove("open");if(item.target){item.target.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});if(item.target.matches(".person,.story-click,.etitle,.gallery-card,.hotspot"))setTimeout(()=>item.target.click(),120)}else location.href=item.href});const sh=document.createElement("button");sh.type="button";sh.className="sdl-ux-share";sh.textContent="Compartir";sh.addEventListener("click",()=>shareUrl(new URL(item.href,location.origin).href,item.title));row.append(main,sh);results.appendChild(row)})}
function openSearch(){if(isWelcome())return;dialog.classList.add("open");input.value="";showResults();setTimeout(()=>input.focus(),30)}
function toast(s){const t=document.createElement("div");t.className="sdl-ux-toast";t.setAttribute("role","status");t.textContent=s;body.appendChild(t);setTimeout(()=>t.remove(),2300)}
async function shareUrl(url,title){const data={title:title||document.title,text:"Explora "+(title||document.title)+" en Sangre de Luna.",url};try{if(navigator.share)await navigator.share(data);else if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(url);toast("Enlace copiado para compartir.")}else{const x=document.createElement("textarea");x.value=url;body.appendChild(x);x.select();document.execCommand("copy");x.remove();toast("Enlace copiado para compartir.")}}catch(e){if(e.name!=="AbortError")toast("No se pudo compartir. Puedes copiar el enlace desde el navegador.")}}
document.querySelectorAll("[data-sdl-open-search]").forEach(b=>b.addEventListener("click",openSearch));input.addEventListener("input",showResults);close.addEventListener("click",()=>dialog.classList.remove("open"));dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.classList.remove("open")});document.addEventListener("keydown",e=>{if(e.key==="Escape"){dialog.classList.remove("open");closeMenu()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}});
document.querySelectorAll("[data-sdl-font]").forEach(b=>b.addEventListener("click",()=>{const levels=[1,1.1,1.2],current=Number(getItem(FONT)||1),next=levels[(levels.indexOf(current)+1)%levels.length];setItem(FONT,String(next));root.style.setProperty("--sdl-ux-scale",String(next));toast("Texto al "+Math.round(next*100)+"%.")}));
const savedScale=Number(getItem(FONT)||1);if([1,1.1,1.2].includes(savedScale))root.style.setProperty("--sdl-ux-scale",String(savedScale));menu.querySelector("[data-sdl-share]").addEventListener("click",()=>shareUrl(location.href,document.title));
const last=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null}})();
function remember(url,title){try{setItem(KEY,JSON.stringify({url,title}))}catch{}}
if(path!=="/"&&path!=="/index.html")remember(location.pathname+location.search+location.hash,document.title.replace(/\s*\|\s*Sangre de Luna.*/i,""));
document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a)return;try{const u=new URL(a.href,location.href);if(u.origin===location.origin&&u.pathname!=="/"&&u.pathname!=="/index.html")remember(u.pathname+u.search+u.hash,(a.innerText||a.getAttribute("aria-label")||document.title).replace(/\s+/g," ").trim())}catch{}});
if(path==="/"||path==="/index.html"){const hero=document.querySelector("#inicio.hero");if(hero&&!document.querySelector(".sdl-ux-start")){const section=document.createElement("section");section.className="sdl-ux-start";section.setAttribute("aria-labelledby","sdlStartTitle");section.innerHTML='<div class="sdl-ux-start-inner"><h2 id="sdlStartTitle">¿Qué quieres descubrir?</h2><p>Elige cómo comenzar tu recorrido por Sangre de Luna.</p><div class="sdl-ux-start-grid"><a href="/libro.html"><b>Leer el libro</b><span>Conoce el origen de la Manada.</span></a><a href="/mapa"><b>Explorar las Tierras</b><span>Descubre lugares y territorios.</span></a><a href="/viaje"><b>Hacer el test</b><span>Encuentra tu lugar y empieza tus misiones.</span></a><a href="/fanclub"><b>Unirme a la Manada</b><span>Participa en el Fan Club oficial.</span></a></div></div>';hero.after(section)}if(last&&last.url&&last.url!=="/"){const start=document.querySelector(".sdl-ux-start");if(start){const box=document.createElement("div");box.className="sdl-ux-resume";const label=document.createElement("b");label.textContent="¿Quieres continuar? ";const a=document.createElement("a");a.href=last.url;a.textContent="Retomar: "+(last.title||"tu última visita")+" →";box.append(label,a);start.querySelector(".sdl-ux-start-inner").appendChild(box)}}}
// Keep published videos before the optional expedition activities.
if(path.replace(/\\.html$/,'')==='/episodios'||path.replace(/\/$/,'')==='/musica'){
 if(path.replace(/\/$/,'')==='/musica'){
  const musicStyle=document.createElement('style');
  musicStyle.textContent='#musica .head{margin-bottom:24px}#musica .head p{max-width:none;margin:0;color:#b6c8d7;font:400 clamp(1rem,2vw,1.2rem)/1.65 Georgia,serif}.portal-section-hero .portal-back{display:inline-flex;margin-bottom:18px}';
  document.head.appendChild(musicStyle);
 }
 const cleanMusicHeading=()=>{
  if(path.replace(/\/$/,'')!=='/musica')return;
  document.querySelector('.portal-section-hero .ey')?.remove();
  const head=document.querySelector('#musica .head');
  head?.querySelector('div')?.remove();
  const phrase=head?.querySelector('p'),text='Melodías que acompañan cada juramento, batalla y descubrimiento de la manada.';
  if(phrase&&phrase.textContent!==text)phrase.textContent=text;
 };
 const placeEpisodesFirst=()=>{cleanMusicHeading();const section=document.getElementById(location.pathname.replace(/\/$/,'')==='/musica'?'musica':'episodios'),hub=document.getElementById('liveHub');if(section&&hub&&section.parentElement===hub.parentElement&&section.nextElementSibling!==hub)section.after(hub)};
 placeEpisodesFirst();new MutationObserver(placeEpisodesFirst).observe(document.getElementById('publicApp')||body,{childList:true,subtree:true});
}

// Keep seven navigation entries clear of the large logo.
const sagaNavStyle=document.createElement('style');
sagaNavStyle.textContent='@media(min-width:901px){.top nav.sdl-site-nav{padding:0 3% 0 calc(3% + 202px)!important;justify-content:space-evenly!important}.top nav.sdl-site-nav>.sdl-nav-link{padding:14px 12px!important;min-height:50px!important}.top nav.sdl-site-nav .sdl-nav-panel{z-index:110!important}}@media(min-width:901px) and (max-width:1150px){.top nav.sdl-site-nav .sdl-nav-toggle,.top nav.sdl-site-nav>.sdl-nav-link{padding:14px 7px!important;font-size:.73rem!important;letter-spacing:.02em!important}}';
document.head.appendChild(sagaNavStyle);


const motionRoot=document.getElementById('publicApp');
if(motionRoot&&'IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
 const seen=new WeakSet();
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('sdl-reveal-wait');entry.target.classList.add('sdl-reveal-ready');observer.unobserve(entry.target)}})},{threshold:.08});
 const collect=()=>{motionRoot.querySelectorAll('.sdl-highlight,.sec .head').forEach(el=>{if(seen.has(el))return;seen.add(el);el.classList.add('sdl-reveal-wait');observer.observe(el)})};
 collect();new MutationObserver(collect).observe(motionRoot,{childList:true,subtree:true});
}
})();
