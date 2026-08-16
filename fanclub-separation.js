/* SANGRE DE LUNA · FAN CLUB / LA MANADA · PORTAL PRIVADO */
(()=>{
  const cleanPath=(location.pathname.replace(/\/+$/,'')||'/');
  const isMemberArea=cleanPath==='/la-manada'||cleanPath==='/la-manada.html'||cleanPath.startsWith('/la-manada/');
  const privatePage=cleanPath.startsWith('/la-manada/')?cleanPath.split('/')[2]:'';
  const allowedPages=new Set(['','credencial','desafios','contenidos','facciones']);
  const page=allowedPages.has(privatePage)?privatePage:'';
  const params=new URLSearchParams(location.search);
  const tokenKey='sdl_fanclub_token';
  const token=()=>sessionStorage.getItem(tokenKey)||'';
  const goMember=()=>location.assign('/la-manada');
  const goAccess=(reason='')=>location.replace('/fanclub'+(reason?`?${reason}`:''));

  document.documentElement.classList.add(isMemberArea?'sdl-manada-private':'sdl-fanclub-access');
  if(isMemberArea)document.documentElement.dataset.manadaPage=page||'portal';

  const style=document.createElement('style');
  style.textContent=`
    .sdl-route-hidden{display:none!important}
    .sdl-access-session{margin-top:18px;padding:18px;border:1px solid #315a76;border-radius:16px;background:linear-gradient(145deg,#0a1a27,#061019);text-align:center}
    .sdl-access-session h4{margin:4px 0 7px;font:700 1.35rem Georgia,serif;color:#e7f7ff}.sdl-access-session p{margin:0 0 14px;color:#9fb3c4}
    .sdl-manada-private .portal{display:none!important}.sdl-manada-private body{overflow:auto!important}
    .sdl-private-credential{padding:58px 0;background:#030a10;border-bottom:1px solid #152a3b}
    .sdl-private-credential .fan-card{max-width:900px;margin:auto}
    .sdl-private-nav{display:flex;gap:9px;flex-wrap:wrap;margin-top:22px}
    .sdl-private-nav a{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;border:1px solid #35546c;border-radius:999px;background:#07131e;color:#dff4ff;font-weight:900;font-size:.78rem;transition:.22s}
    .sdl-private-nav a:hover{border-color:#84d1ff;transform:translateY(-1px)}
    .sdl-manada-portal{padding:50px 0 76px;background:radial-gradient(circle at 50% 0,#0b2132 0,transparent 34%),#02060a}
    .sdl-manada-portal-head{text-align:center;max-width:760px;margin:0 auto 30px}.sdl-manada-portal-head h2{font:700 clamp(2.3rem,6vw,4rem) Georgia,serif;margin:7px 0 10px}.sdl-manada-portal-head p{color:#9fb3c4;margin:0}
    .sdl-manada-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
    .sdl-manada-card{position:relative;min-height:330px;overflow:hidden;border:1px solid #36566e;border-radius:24px;background:#07131e;box-shadow:0 24px 70px #0008;isolation:isolate;transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease}
    .sdl-manada-card:before{content:'';position:absolute;inset:0;background-image:var(--sdl-card-image);background-size:cover;background-position:center;filter:brightness(.48) saturate(.82);transform:scale(1.01);transition:transform .5s ease,filter .4s ease;z-index:-2}
    .sdl-manada-card:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 12%,#02070b38 45%,#02070bf2 100%),linear-gradient(110deg,#07131ea6,transparent 68%);z-index:-1}
    .sdl-manada-card:hover{transform:translateY(-5px);border-color:#8ed8ff;box-shadow:0 30px 85px #000b,0 0 28px #57b9f31c}.sdl-manada-card:hover:before{transform:scale(1.065);filter:brightness(.58) saturate(.94)}
    .sdl-manada-card-body{position:absolute;inset:auto 0 0;padding:27px}.sdl-manada-card .ey{color:#9adfff}.sdl-manada-card h3{font:700 clamp(1.8rem,4vw,2.55rem) Georgia,serif;margin:7px 0 8px}.sdl-manada-card p{max-width:540px;margin:0 0 17px;color:#b5c6d4}.sdl-manada-card-go{display:inline-flex;align-items:center;gap:8px;color:#e9f8ff;font-size:.78rem;font-weight:900;letter-spacing:.08em}.sdl-manada-card-go:after{content:'→';transition:transform .2s}.sdl-manada-card:hover .sdl-manada-card-go:after{transform:translateX(5px)}
    .sdl-private-page-head{padding:38px 0 4px}.sdl-private-page-head .back{display:inline-flex;align-items:center;gap:8px;color:#9edcff;font-size:.78rem;font-weight:900;letter-spacing:.06em}
    .sdl-private-page-head .back:hover{color:#fff}.sdl-private-page-head h2{font:700 clamp(2.3rem,6vw,4rem) Georgia,serif;margin:12px 0 5px}.sdl-private-page-head p{max-width:680px;color:#9fb3c4;margin:0}
    @media(max-width:760px){.sdl-manada-cards{grid-template-columns:1fr}.sdl-manada-card{min-height:285px}.sdl-private-credential{padding:36px 0}.sdl-private-nav a{flex:1 1 44%}}
    @media(max-width:440px){.sdl-manada-card{min-height:260px}.sdl-manada-card-body{padding:21px}.sdl-private-nav a{flex:1 1 100%}}
  `;
  document.head.appendChild(style);

  function revealAccessCard(){
    const portal=document.getElementById('portal');
    if(portal)portal.classList.add('out','hidden');
    document.body.classList.remove('locked');
    requestAnimationFrame(()=>document.getElementById('fanMemberCard')?.scrollIntoView({behavior:'smooth',block:'center'}));
  }

  function hideAccessOnlyContent(){
    const main=document.getElementById('fanMain');
    if(!main)return;
    [...main.children].forEach(section=>{
      const keep=section.id==='acceso'||section.classList.contains('manada-hero');
      if(!keep)section.classList.add('sdl-route-hidden');
    });
    document.getElementById('fanCredential')?.classList.add('sdl-route-hidden');
    const heroTitle=document.querySelector('.manada-hero h2');
    const heroText=document.querySelector('.manada-hero .hero-copy p');
    if(heroTitle)heroTitle.innerHTML='FAN <span>CLUB</span>';
    if(heroText)heroText.textContent='Regístrate o inicia sesión para cruzar las puertas de La Manada. El contenido exclusivo, tu credencial, desafíos, facciones y recompensas se encuentran en una zona privada independiente.';
    const accessHead=document.querySelector('#acceso .head h2');
    const accessCopy=document.querySelector('#acceso .head p');
    if(accessHead)accessHead.textContent='Ingreso y registro';
    if(accessCopy)accessCopy.textContent='Crea tu membresía o utiliza tus datos de acceso para entrar a tu zona privada de La Manada.';
    const already=token();
    const memberCard=document.getElementById('fanMemberCard');
    const loginBox=document.getElementById('fanLoginBox');
    if(already&&memberCard){
      loginBox?.classList.add('hidden');
      let cta=document.getElementById('sdlAccessSession');
      if(!cta){
        cta=document.createElement('div');cta.id='sdlAccessSession';cta.className='sdl-access-session';
        cta.innerHTML='<span class="ey">SESIÓN ACTIVA</span><h4>Ya perteneces a La Manada</h4><p>Tu sesión está abierta. Entra directamente a tu zona privada.</p><button class="btn pri" type="button" id="sdlEnterManada">ENTRAR A LA MANADA</button>';
        memberCard.appendChild(cta);cta.querySelector('#sdlEnterManada')?.addEventListener('click',goMember);
      }
    }
  }

  function bindAccessNavigation(){
    const intercept=selector=>document.querySelector(selector)?.addEventListener('click',event=>{if(!token())return;event.preventDefault();event.stopImmediatePropagation();goMember()},true);
    intercept('#portalMember');intercept('#topMember');
    document.querySelectorAll('[data-go="member"]').forEach(el=>el.addEventListener('click',event=>{if(!token())return;event.preventDefault();event.stopImmediatePropagation();goMember()},true));
    const watchSuccessfulAccess=()=>{let tries=0;const timer=setInterval(()=>{if(token()){clearInterval(timer);goMember();return}if(++tries>100)clearInterval(timer)},100)};
    ['fanJoinForm','fanLoginForm'].forEach(id=>document.getElementById(id)?.addEventListener('submit',watchSuccessfulAccess));
    document.getElementById('fanActivateLegacy')?.addEventListener('click',watchSuccessfulAccess);
  }

  function prepareCredential(main){
    const credential=document.getElementById('fanCredential');
    if(!credential||!main)return null;
    let section=document.getElementById('mi-credencial');
    if(!section){
      section=document.createElement('section');section.className='sdl-private-credential';section.id='mi-credencial';
      section.innerHTML='<div class="w"><div class="head"><div><span class="ey">IDENTIDAD DE MIEMBRO</span><h2>Mi credencial de La Manada</h2></div><p>Tu identidad oficial dentro del Fan Club y acceso a tus logros.</p></div><section class="fan-card" id="sdlCredentialHost"></section></div>';
      main.appendChild(section);section.querySelector('#sdlCredentialHost')?.appendChild(credential);
    }
    credential.classList.remove('sdl-route-hidden');
    return section;
  }

  function portalCards(){
    return `
      <section class="sdl-manada-portal" id="sdlManadaPortal"><div class="w">
        <div class="sdl-manada-portal-head"><span class="ey">TU TERRITORIO PRIVADO</span><h2>Elige tu camino dentro de La Manada</h2><p>Cada espacio tiene ahora su propia página. Entra a tu credencial, acepta desafíos, descubre contenido exclusivo o explora las facciones.</p></div>
        <div class="sdl-manada-cards">
          <a class="sdl-manada-card" href="/la-manada/credencial" style="--sdl-card-image:url('/assets/credencial-diseno-oficial.webp')"><div class="sdl-manada-card-body"><span class="ey">IDENTIDAD DE MIEMBRO</span><h3>Credencial</h3><p>Consulta tu credencial digital oficial, código QR y datos de miembro de La Manada.</p><span class="sdl-manada-card-go">ABRIR CREDENCIAL</span></div></a>
          <a class="sdl-manada-card" href="/la-manada/desafios" style="--sdl-card-image:url('/assets/city-front.webp')"><div class="sdl-manada-card-body"><span class="ey">PONTE A PRUEBA</span><h3>Desafíos</h3><p>Participa en votaciones y trivia, demuestra cuánto conoces Sangre de Luna y avanza en la Manada.</p><span class="sdl-manada-card-go">ENTRAR A DESAFÍOS</span></div></a>
          <a class="sdl-manada-card" href="/la-manada/contenidos" style="--sdl-card-image:url('/assets/hero.webp')"><div class="sdl-manada-card-body"><span class="ey">ARCHIVO EXCLUSIVO</span><h3>Wallpapers y contenidos</h3><p>Desbloquea imágenes, wallpapers, archivos y piezas especiales reservadas para miembros.</p><span class="sdl-manada-card-go">EXPLORAR CONTENIDOS</span></div></a>
          <a class="sdl-manada-card" href="/la-manada/facciones" style="--sdl-card-image:url('/assets/crest.webp')"><div class="sdl-manada-card-body"><span class="ey">ELIGE TU BANDERA</span><h3>Facciones</h3><p>Conoce las facciones de La Manada, sus emblemas y la identidad que representa cada una.</p><span class="sdl-manada-card-go">VER FACCIONES</span></div></a>
        </div>
      </div></section>`;
  }

  function privatePageHeader(title,copy){
    const wrap=document.createElement('div');wrap.className='sdl-private-page-head';
    wrap.innerHTML=`<div class="w"><a class="back" href="/la-manada">← VOLVER A LA MANADA</a><h2>${title}</h2><p>${copy}</p></div>`;
    return wrap;
  }

  function buildPrivateArea(){
    if(!token()){goAccess('acceso=miembro');return false}
    document.body.classList.remove('locked');document.getElementById('portal')?.classList.add('hidden');
    const main=document.getElementById('fanMain');if(!main)return false;
    document.getElementById('acceso')?.classList.add('sdl-route-hidden');
    const hero=document.querySelector('.manada-hero');
    const credentialSection=prepareCredential(main);
    const factionSection=document.getElementById('fanFactions')?.closest('.section');
    const challengeSection=document.getElementById('fanTrivia')?.closest('.section');
    const contentSection=document.getElementById('zona');
    if(challengeSection)challengeSection.id='desafios';
    const privateSections=[credentialSection,factionSection,challengeSection,contentSection].filter(Boolean);
    privateSections.forEach(s=>s.classList.add('sdl-route-hidden'));

    const brandText=document.querySelector('.brand div');
    if(brandText)brandText.innerHTML='<b>La Manada</b><small>ZONA PRIVADA DEL FAN CLUB</small>';
    const topMember=document.getElementById('topMember');
    if(topMember){topMember.textContent='🐺 LA MANADA';topMember.onclick=()=>location.assign('/la-manada')}

    const heroTitle=document.querySelector('.manada-hero h2');
    const heroText=document.querySelector('.manada-hero .hero-copy p');
    const heroToolbar=document.querySelector('.manada-hero .toolbar');
    if(heroToolbar)heroToolbar.innerHTML='<a class="btn pri" href="/la-manada">CENTRO DE LA MANADA</a><a class="btn ghost" href="/">SITIO PRINCIPAL</a>';
    document.querySelector('.sdl-private-nav')?.remove();
    document.getElementById('sdlManadaPortal')?.remove();
    document.querySelector('.sdl-private-page-head')?.remove();

    const pageInfo={
      credencial:['MI <span>CREDENCIAL</span>','Tu identidad oficial dentro de La Manada. Consulta tus datos, código QR y opciones de impresión.'],
      desafios:['DESAFÍOS DE <span>LA MANADA</span>','Pon a prueba tus conocimientos, participa en las decisiones de la comunidad y demuestra hasta dónde llega tu conexión con Sangre de Luna.'],
      contenidos:['ARCHIVO DE <span>LA MANADA</span>','Wallpapers, imágenes y contenidos especiales reservados para miembros del Fan Club.'],
      facciones:['FACCCIONES DE <span>LA MANADA</span>','Conoce las banderas, emblemas e identidades que forman la comunidad de Sangre de Luna.']
    };

    if(!page){
      if(heroTitle)heroTitle.innerHTML='CENTRO DE <span>LA MANADA</span>';
      if(heroText)heroText.textContent='Tu territorio privado dentro de Sangre de Luna. Elige una de las áreas de La Manada y entra a un espacio dedicado para cada experiencia.';
      hero?.insertAdjacentHTML('afterend',portalCards());
      document.title='La Manada | Sangre de Luna';
    }else{
      const info=pageInfo[page];if(heroTitle)heroTitle.innerHTML=info[0];if(heroText)heroText.textContent=info[1];
      const target={credencial:credentialSection,desafios:challengeSection,contenidos:contentSection,facciones:factionSection}[page];
      if(target){target.classList.remove('sdl-route-hidden');target.parentNode?.insertBefore(privatePageHeader(info[0].replace(/<[^>]+>/g,''),info[1]),target)}
      document.title=`${info[0].replace(/<[^>]+>/g,'')} | La Manada`;
    }

    const desc=document.querySelector('meta[name="description"]');
    if(desc)desc.setAttribute('content',page?`Zona privada de La Manada: ${page}. Fan Club de Sangre de Luna.`:'Centro privado de La Manada: credencial, desafíos, facciones y contenido exclusivo del Fan Club de Sangre de Luna.');
    document.addEventListener('click',event=>{if(event.target?.id==='fanLogout')setTimeout(()=>goAccess('sesion=cerrada'),120)},true);
    window.setInterval(()=>{if(!token())goAccess('sesion=expirada')},1200);
    return true;
  }

  function boot(){
    if(isMemberArea){buildPrivateArea();return}
    hideAccessOnlyContent();bindAccessNavigation();
    const observer=new MutationObserver(()=>hideAccessOnlyContent());const main=document.getElementById('fanMain');if(main)observer.observe(main,{childList:true,subtree:false});
    if(params.get('acceso')==='miembro'||params.has('sesion'))setTimeout(revealAccessCard,120);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
