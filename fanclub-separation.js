/* SANGRE DE LUNA · FAN CLUB / LA MANADA · PORTAL PRIVADO */
(()=>{
  const path=location.pathname.replace(/\/+$/,'')||'/';
  const isPrivate=path==='/la-manada'||path==='/la-manada.html'||path.startsWith('/la-manada/');
  const requested=path.startsWith('/la-manada/')?path.split('/')[2]:'';
  const valid=new Set(['','credencial','desafios','contenidos','facciones']);
  const page=valid.has(requested)?requested:'';
  const params=new URLSearchParams(location.search);
  const token=()=>sessionStorage.getItem('sdl_fanclub_token')||'';
  const goManada=()=>location.assign('/la-manada');
  const goAccess=(reason='')=>location.replace('/fanclub'+(reason?`?${reason}`:''));

  document.documentElement.classList.add(isPrivate?'sdl-manada-private':'sdl-fanclub-access');
  if(isPrivate)document.documentElement.dataset.manadaPage=page||'portal';

  const css=document.createElement('style');
  css.textContent=`
  .sdl-route-hidden{display:none!important}.sdl-manada-private .portal{display:none!important}.sdl-manada-private body{overflow:auto!important}
  .sdl-access-session{margin-top:18px;padding:18px;border:1px solid #315a76;border-radius:16px;background:linear-gradient(145deg,#0a1a27,#061019);text-align:center}.sdl-access-session h4{margin:4px 0 7px;font:700 1.35rem Georgia,serif;color:#e7f7ff}.sdl-access-session p{margin:0 0 14px;color:#9fb3c4}
  .sdl-private-credential{padding:58px 0;background:#030a10;border-bottom:1px solid #152a3b}.sdl-private-credential .fan-card{max-width:900px;margin:auto}
  .sdl-manada-portal{padding:50px 0 76px;background:radial-gradient(circle at 50% 0,#0b2132 0,transparent 34%),#02060a}.sdl-manada-portal-head{text-align:center;max-width:760px;margin:0 auto 30px}.sdl-manada-portal-head h2{font:700 clamp(2.3rem,6vw,4rem) Georgia,serif;margin:7px 0 10px}.sdl-manada-portal-head p{color:#9fb3c4;margin:0}
  .sdl-manada-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.sdl-manada-card{position:relative;min-height:330px;overflow:hidden;border:1px solid #36566e;border-radius:24px;background:#07131e;box-shadow:0 24px 70px #0008;isolation:isolate;transition:.3s}.sdl-manada-card:before{content:'';position:absolute;inset:0;background-image:var(--img);background-size:cover;background-position:center;filter:brightness(.48) saturate(.82);transform:scale(1.01);transition:.5s;z-index:-2}.sdl-manada-card:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 12%,#02070b38 45%,#02070bf2 100%),linear-gradient(110deg,#07131ea6,transparent 68%);z-index:-1}.sdl-manada-card:hover{transform:translateY(-5px);border-color:#8ed8ff;box-shadow:0 30px 85px #000b,0 0 28px #57b9f31c}.sdl-manada-card:hover:before{transform:scale(1.065);filter:brightness(.58) saturate(.94)}
  .sdl-manada-card-body{position:absolute;inset:auto 0 0;padding:27px}.sdl-manada-card .ey{color:#9adfff}.sdl-manada-card h3{font:700 clamp(1.8rem,4vw,2.55rem) Georgia,serif;margin:7px 0 8px}.sdl-manada-card p{max-width:540px;margin:0 0 17px;color:#b5c6d4}.sdl-card-go{display:inline-flex;align-items:center;gap:8px;color:#e9f8ff;font-size:.78rem;font-weight:900;letter-spacing:.08em}.sdl-card-go:after{content:'→';transition:.2s}.sdl-manada-card:hover .sdl-card-go:after{transform:translateX(5px)}
  .sdl-private-page-head{padding:38px 0 4px}.sdl-private-page-head .back{display:inline-flex;align-items:center;gap:8px;color:#9edcff;font-size:.78rem;font-weight:900;letter-spacing:.06em}.sdl-private-page-head .back:hover{color:#fff}.sdl-private-page-head h2{font:700 clamp(2.3rem,6vw,4rem) Georgia,serif;margin:12px 0 5px}.sdl-private-page-head p{max-width:680px;color:#9fb3c4;margin:0}
  html.sdl-manada-private[data-manada-page="contenidos"] .manada-hero,html.sdl-manada-private[data-manada-page="contenidos"] .sdl-private-page-head{display:none!important}
  html.sdl-manada-private[data-manada-page="contenidos"] #zona{padding-top:28px!important;min-height:auto!important;border-top:0!important}
  html.sdl-manada-private[data-manada-page="contenidos"] #zona>.w{padding-top:0!important}
  html.sdl-manada-private[data-manada-page="contenidos"] #zona .head{margin-bottom:18px!important;align-items:end}
  html.sdl-manada-private[data-manada-page="contenidos"] #zona .head h2{margin-top:4px;font-size:clamp(2.15rem,4.6vw,3.6rem)}
  html.sdl-manada-private[data-manada-page="contenidos"] #fanContent{scroll-margin-top:88px}
  html.sdl-manada-private[data-manada-page="contenidos"] .fan-content-grid{margin-top:6px}
  html.sdl-manada-private[data-manada-page="contenidos"] .fan-content{transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
  html.sdl-manada-private[data-manada-page="contenidos"] .fan-content:hover{transform:translateY(-3px);border-color:#5f9bc3;box-shadow:0 16px 38px rgba(0,0,0,.24)}
  @media(max-width:760px){.sdl-manada-cards{grid-template-columns:1fr}.sdl-manada-card{min-height:285px}.sdl-private-credential{padding:36px 0}html.sdl-manada-private[data-manada-page="contenidos"] #zona{padding-top:20px!important}html.sdl-manada-private[data-manada-page="contenidos"] #zona .head{margin-bottom:14px!important}html.sdl-manada-private[data-manada-page="contenidos"] #zona .head h2{font-size:clamp(2rem,9vw,2.8rem)}}@media(max-width:440px){.sdl-manada-card{min-height:260px}.sdl-manada-card-body{padding:21px}}
  `;
  document.head.appendChild(css);

  const revealAccess=()=>{document.getElementById('portal')?.classList.add('out','hidden');document.body.classList.remove('locked');requestAnimationFrame(()=>document.getElementById('fanMemberCard')?.scrollIntoView({behavior:'smooth',block:'center'}))};

  function accessPage(){
    const main=document.getElementById('fanMain');if(!main)return;
    [...main.children].forEach(s=>{if(s.id!=='acceso'&&!s.classList.contains('manada-hero'))s.classList.add('sdl-route-hidden')});
    document.getElementById('fanCredential')?.classList.add('sdl-route-hidden');
    const title=document.querySelector('.manada-hero h2'),copy=document.querySelector('.manada-hero .hero-copy p');
    if(title)title.innerHTML='FAN <span>CLUB</span>';if(copy)copy.textContent='Regístrate o inicia sesión para cruzar las puertas de La Manada. Tu credencial, desafíos, facciones y contenido exclusivo están dentro de una zona privada independiente.';
    const h=document.querySelector('#acceso .head h2'),p=document.querySelector('#acceso .head p');if(h)h.textContent='Ingreso y registro';if(p)p.textContent='Crea tu membresía o utiliza tus datos para entrar a La Manada.';
    if(token()){
      document.getElementById('fanLoginBox')?.classList.add('hidden');const card=document.getElementById('fanMemberCard');
      if(card&&!document.getElementById('sdlAccessSession')){const c=document.createElement('div');c.id='sdlAccessSession';c.className='sdl-access-session';c.innerHTML='<span class="ey">SESIÓN ACTIVA</span><h4>Ya perteneces a La Manada</h4><p>Tu sesión está abierta. Entra directamente a tu zona privada.</p><button class="btn pri" id="sdlEnterManada" type="button">ENTRAR A LA MANADA</button>';card.appendChild(c);c.querySelector('button')?.addEventListener('click',goManada)}
    }
  }

  function bindAccess(){
    const intercept=el=>el?.addEventListener('click',e=>{if(!token())return;e.preventDefault();e.stopImmediatePropagation();goManada()},true);
    intercept(document.getElementById('portalMember'));intercept(document.getElementById('topMember'));document.querySelectorAll('[data-go="member"]').forEach(intercept);
    const watch=()=>{let n=0;const t=setInterval(()=>{if(token()){clearInterval(t);goManada()}else if(++n>100)clearInterval(t)},100)};
    ['fanJoinForm','fanLoginForm'].forEach(id=>document.getElementById(id)?.addEventListener('submit',watch));document.getElementById('fanActivateLegacy')?.addEventListener('click',watch);
  }

  function credentialSection(main){
    const cred=document.getElementById('fanCredential');if(!cred)return null;let section=document.getElementById('mi-credencial');
    if(!section){section=document.createElement('section');section.className='sdl-private-credential';section.id='mi-credencial';section.innerHTML='<div class="w"><div class="head"><div><span class="ey">IDENTIDAD DE MIEMBRO</span><h2>Mi credencial de La Manada</h2></div><p>Tu identidad oficial dentro del Fan Club y acceso a tus logros.</p></div><section class="fan-card" id="sdlCredentialHost"></section></div>';main.appendChild(section);section.querySelector('#sdlCredentialHost')?.appendChild(cred)}
    cred.classList.remove('sdl-route-hidden');return section;
  }

  const cards=()=>`<section class="sdl-manada-portal" id="sdlManadaPortal"><div class="w"><div class="sdl-manada-portal-head"><span class="ey">TU TERRITORIO PRIVADO</span><h2>Elige tu camino dentro de La Manada</h2><p>Cada espacio tiene su propia página. Accede a tu credencial, acepta desafíos, descubre contenido exclusivo o explora las facciones.</p></div><div class="sdl-manada-cards">
  <a class="sdl-manada-card" href="/la-manada/credencial" style="--img:url('/assets/credencial-diseno-oficial.webp')"><div class="sdl-manada-card-body"><span class="ey">IDENTIDAD DE MIEMBRO</span><h3>Credencial</h3><p>Consulta tu credencial digital oficial, código QR y datos de miembro.</p><span class="sdl-card-go">ABRIR CREDENCIAL</span></div></a>
  <a class="sdl-manada-card" href="/la-manada/desafios" style="--img:url('/assets/city-front.webp')"><div class="sdl-manada-card-body"><span class="ey">PONTE A PRUEBA</span><h3>Desafíos</h3><p>Participa en votaciones y trivia y demuestra cuánto conoces Sangre de Luna.</p><span class="sdl-card-go">ENTRAR A DESAFÍOS</span></div></a>
  <a class="sdl-manada-card" href="/la-manada/contenidos" style="--img:url('/assets/hero.webp')"><div class="sdl-manada-card-body"><span class="ey">ARCHIVO EXCLUSIVO</span><h3>Wallpapers y contenidos</h3><p>Desbloquea imágenes, wallpapers, archivos y piezas especiales para miembros.</p><span class="sdl-card-go">EXPLORAR CONTENIDOS</span></div></a>
  <a class="sdl-manada-card" href="/la-manada/facciones" style="--img:url('/assets/crest.webp')"><div class="sdl-manada-card-body"><span class="ey">ELIGE TU BANDERA</span><h3>Facciones</h3><p>Conoce las facciones de La Manada, sus emblemas y lo que representa cada una.</p><span class="sdl-card-go">VER FACCIONES</span></div></a>
  </div></div></section>`;

  function pageHead(title,copy){const e=document.createElement('div');e.className='sdl-private-page-head';e.innerHTML=`<div class="w"><a class="back" href="/la-manada">← VOLVER A LA MANADA</a><h2>${title}</h2><p>${copy}</p></div>`;return e}

  function contentFirst(main,content){
    if(page!=='contenidos'||!main||!content)return;
    main.insertBefore(content,main.firstChild);
    const rank=card=>{const type=(card.querySelector('.ey')?.textContent||'').trim().toUpperCase();if(type.includes('WALLPAPER'))return 0;if(type.includes('IMAGEN'))return 1;return 2};
    let busy=false;
    const sort=()=>{const grid=content.querySelector('.fan-content-grid');if(!grid||busy)return;busy=true;requestAnimationFrame(()=>{const cards=[...grid.children],ordered=[...cards].sort((a,b)=>rank(a)-rank(b));if(ordered.some((c,i)=>c!==cards[i]))ordered.forEach(c=>grid.appendChild(c));busy=false})};
    const host=document.getElementById('fanContent');if(host)new MutationObserver(sort).observe(host,{childList:true,subtree:true});sort();
    requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
  }

  function privateArea(){
    if(!token()){goAccess('acceso=miembro');return}document.body.classList.remove('locked');document.getElementById('portal')?.classList.add('hidden');
    const main=document.getElementById('fanMain');if(!main)return;document.getElementById('acceso')?.classList.add('sdl-route-hidden');
    const hero=document.querySelector('.manada-hero'),cred=credentialSection(main),factions=document.getElementById('fanFactions')?.closest('.section'),challenges=document.getElementById('fanTrivia')?.closest('.section'),content=document.getElementById('zona');if(challenges)challenges.id='desafios';
    [cred,factions,challenges,content].filter(Boolean).forEach(s=>s.classList.add('sdl-route-hidden'));
    const brand=document.querySelector('.brand div');if(brand)brand.innerHTML='<b>La Manada</b><small>ZONA PRIVADA DEL FAN CLUB</small>';
    const top=document.getElementById('topMember');if(top){top.textContent='🐺 LA MANADA';top.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();goManada()},true)}
    const heroTitle=document.querySelector('.manada-hero h2'),heroText=document.querySelector('.manada-hero .hero-copy p'),toolbar=document.querySelector('.manada-hero .toolbar');if(toolbar)toolbar.innerHTML='<a class="btn pri" href="/la-manada">CENTRO DE LA MANADA</a><a class="btn ghost" href="/">SITIO PRINCIPAL</a>';
    const info={credencial:['MI CREDENCIAL','Tu identidad oficial dentro de La Manada. Consulta tus datos, código QR y opciones de impresión.'],desafios:['DESAFÍOS DE LA MANADA','Pon a prueba tus conocimientos, participa en las decisiones de la comunidad y demuestra tu conexión con Sangre de Luna.'],contenidos:['ARCHIVO DE LA MANADA','Wallpapers, imágenes y contenidos especiales reservados para miembros del Fan Club.'],facciones:['FACCIONES DE LA MANADA','Conoce las banderas, emblemas e identidades que forman la comunidad de Sangre de Luna.']};
    if(!page){if(heroTitle)heroTitle.innerHTML='CENTRO DE <span>LA MANADA</span>';if(heroText)heroText.textContent='Tu territorio privado dentro de Sangre de Luna. Elige una de las áreas de La Manada y entra a un espacio dedicado para cada experiencia.';hero?.insertAdjacentHTML('afterend',cards());document.title='La Manada | Sangre de Luna'}
    else{const [title,copy]=info[page],target={credencial:cred,desafios:challenges,contenidos:content,facciones:factions}[page];if(heroTitle)heroTitle.innerHTML=title.replace('LA MANADA','<span>LA MANADA</span>');if(heroText)heroText.textContent=copy;if(target){target.classList.remove('sdl-route-hidden');if(page==='contenidos')contentFirst(main,target);else target.parentNode?.insertBefore(pageHead(title,copy),target)}document.title=`${title} | La Manada`}
    const desc=document.querySelector('meta[name="description"]');if(desc)desc.content=page?`${info[page][0]}. Zona privada del Fan Club de Sangre de Luna.`:'Centro privado de La Manada: credencial, desafíos, facciones y contenido exclusivo.';
    document.addEventListener('click',e=>{if(e.target?.id==='fanLogout')setTimeout(()=>goAccess('sesion=cerrada'),120)},true);setInterval(()=>{if(!token())goAccess('sesion=expirada')},1200);
  }

  function boot(){if(isPrivate){privateArea();return}accessPage();bindAccess();const main=document.getElementById('fanMain');if(main)new MutationObserver(accessPage).observe(main,{childList:true,subtree:false});if(params.get('acceso')==='miembro'||params.has('sesion'))setTimeout(revealAccess,120)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
