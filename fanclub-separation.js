/* SANGRE DE LUNA · SEPARACIÓN FAN CLUB / LA MANADA */
(()=>{
  const cleanPath=location.pathname.replace(/\/+$/,'')||'/';
  const isMemberArea=cleanPath==='/la-manada'||cleanPath==='/la-manada.html';
  const tokenKey='sdl_fanclub_token';
  const token=()=>sessionStorage.getItem(tokenKey)||'';
  const goMember=()=>location.assign('/la-manada');
  const goAccess=(reason='')=>location.replace('/fanclub'+(reason?`?${reason}`:''));

  document.documentElement.classList.add(isMemberArea?'sdl-manada-private':'sdl-fanclub-access');

  const style=document.createElement('style');
  style.textContent=`
    .sdl-route-hidden{display:none!important}
    .sdl-access-session{margin-top:18px;padding:18px;border:1px solid #315a76;border-radius:16px;background:linear-gradient(145deg,#0a1a27,#061019);text-align:center}
    .sdl-access-session h4{margin:4px 0 7px;font:700 1.35rem Georgia,serif;color:#e7f7ff}
    .sdl-access-session p{margin:0 0 14px;color:#9fb3c4}
    .sdl-private-credential{padding:58px 0;background:#030a10;border-bottom:1px solid #152a3b}
    .sdl-private-credential .fan-card{max-width:900px;margin:auto}
    .sdl-private-nav{display:flex;gap:9px;flex-wrap:wrap;margin-top:22px}
    .sdl-private-nav a{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;border:1px solid #35546c;border-radius:999px;background:#07131e;color:#dff4ff;font-weight:900;font-size:.78rem}
    .sdl-private-nav a:hover{border-color:#84d1ff}
    .sdl-manada-private .portal{display:none!important}
    .sdl-manada-private body{overflow:auto!important}
    @media(max-width:700px){.sdl-private-credential{padding:36px 0}.sdl-private-nav a{flex:1 1 44%}}
  `;
  document.head.appendChild(style);

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
        cta=document.createElement('div');
        cta.id='sdlAccessSession';
        cta.className='sdl-access-session';
        cta.innerHTML='<span class="ey">SESIÓN ACTIVA</span><h4>Ya perteneces a La Manada</h4><p>Tu sesión está abierta. Entra directamente a tu zona privada.</p><button class="btn pri" type="button" id="sdlEnterManada">ENTRAR A LA MANADA</button>';
        memberCard.appendChild(cta);
        cta.querySelector('#sdlEnterManada')?.addEventListener('click',goMember);
      }
    }
  }

  function bindAccessNavigation(){
    const intercept=(selector)=>document.querySelector(selector)?.addEventListener('click',event=>{
      if(!token())return;
      event.preventDefault();event.stopImmediatePropagation();goMember();
    },true);
    intercept('#portalMember');
    intercept('#topMember');
    document.querySelectorAll('[data-go="member"]').forEach(el=>el.addEventListener('click',event=>{
      if(!token())return;
      event.preventDefault();event.stopImmediatePropagation();goMember();
    },true));

    const watchSuccessfulAccess=()=>{
      let tries=0;
      const timer=setInterval(()=>{
        if(token()){clearInterval(timer);goMember();return}
        if(++tries>100)clearInterval(timer);
      },100);
    };
    ['fanJoinForm','fanLoginForm'].forEach(id=>document.getElementById(id)?.addEventListener('submit',watchSuccessfulAccess));
    document.getElementById('fanActivateLegacy')?.addEventListener('click',watchSuccessfulAccess);
  }

  function buildPrivateArea(){
    if(!token()){goAccess('acceso=miembro');return false}
    document.body.classList.remove('locked');
    document.getElementById('portal')?.classList.add('hidden');

    const access=document.getElementById('acceso');
    access?.classList.add('sdl-route-hidden');

    const heroTitle=document.querySelector('.manada-hero h2');
    const heroText=document.querySelector('.manada-hero .hero-copy p');
    const heroToolbar=document.querySelector('.manada-hero .toolbar');
    if(heroTitle)heroTitle.innerHTML='CENTRO DE <span>LA MANADA</span>';
    if(heroText)heroText.textContent='Tu territorio privado dentro de Sangre de Luna. Consulta tu credencial, participa en desafíos, elige tu facción y desbloquea contenido reservado para miembros.';
    if(heroToolbar)heroToolbar.innerHTML='<a class="btn pri" href="#mi-credencial">MI CREDENCIAL</a><a class="btn" href="#desafios">DESAFÍOS</a><a class="btn ghost" href="#zona">CONTENIDO EXCLUSIVO</a>';

    const brandText=document.querySelector('.brand div');
    if(brandText)brandText.innerHTML='<b>La Manada</b><small>ZONA PRIVADA DEL FAN CLUB</small>';
    const topMember=document.getElementById('topMember');
    if(topMember){topMember.textContent='◈ MI CREDENCIAL';topMember.onclick=()=>document.getElementById('mi-credencial')?.scrollIntoView({behavior:'smooth',block:'start'})}

    const credential=document.getElementById('fanCredential');
    const main=document.getElementById('fanMain');
    const firstPrivateSection=main?.querySelector('#acceso')?.nextElementSibling;
    if(credential&&main&&!document.getElementById('mi-credencial')){
      credential.classList.remove('sdl-route-hidden');
      const section=document.createElement('section');
      section.className='sdl-private-credential';
      section.id='mi-credencial';
      section.innerHTML='<div class="w"><div class="head"><div><span class="ey">IDENTIDAD DE MIEMBRO</span><h2>Mi credencial de La Manada</h2></div><p>Tu identidad oficial dentro del Fan Club y acceso a tus logros.</p></div><section class="fan-card" id="sdlCredentialHost"></section></div>';
      main.insertBefore(section,firstPrivateSection||null);
      section.querySelector('#sdlCredentialHost')?.appendChild(credential);
    }

    const nav=document.createElement('div');
    nav.className='sdl-private-nav';
    nav.innerHTML='<a href="#mi-credencial">Credencial</a><a href="#desafios">Desafíos</a><a href="#zona">Wallpapers y contenidos</a><a href="#fanFactions">Facciones</a>';
    document.querySelector('.manada-hero .hero-copy')?.appendChild(nav);

    document.title='La Manada | Sangre de Luna';
    const desc=document.querySelector('meta[name="description"]');
    if(desc)desc.setAttribute('content','Zona privada de La Manada: credencial, desafíos, facciones y contenido exclusivo del Fan Club de Sangre de Luna.');

    document.addEventListener('click',event=>{
      if(event.target?.id==='fanLogout')setTimeout(()=>goAccess('sesion=cerrada'),120);
    },true);
    window.setInterval(()=>{if(!token())goAccess('sesion=expirada')},1200);
    return true;
  }

  function boot(){
    if(isMemberArea){buildPrivateArea();return}
    hideAccessOnlyContent();
    bindAccessNavigation();
    const observer=new MutationObserver(()=>hideAccessOnlyContent());
    const main=document.getElementById('fanMain');
    if(main)observer.observe(main,{childList:true,subtree:false});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
