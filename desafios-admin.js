/* NAVEGACION PUBLICA · ACCESOS AL FAN CLUB */
(()=>{
 const publicNav=document.querySelector('#publicApp .nav');
 const exploreLink=publicNav?.querySelector('a[href="/tour.html"]');
 if(publicNav&&exploreLink&&!publicNav.querySelector('a[href="/fanclub.html"]')){
  const fanclubLink=document.createElement('a');
  fanclubLink.href='/fanclub.html';
  fanclubLink.textContent='Fan Club';
  publicNav.insertBefore(fanclubLink,exploreLink);
 }

 const headActions=document.querySelector('#publicApp .head-actions');
 const adminEntry=headActions?.querySelector('.admin-entry');
 if(headActions&&adminEntry&&!headActions.querySelector('.fanclub-head-btn')){
  const fanclubButton=document.createElement('a');
  fanclubButton.className='btn ghost fanclub-head-btn';
  fanclubButton.href='/fanclub.html';
  fanclubButton.textContent='Fan Club';
  fanclubButton.setAttribute('aria-label','Abrir Fan Club');
  headActions.insertBefore(fanclubButton,adminEntry);
 }

 /* MENU PRINCIPAL · ESCRITORIO, TABLET Y MOVIL */
 if(!document.getElementById('sdl-nav-upgrade')){
  const navStyle=document.createElement('style');
  navStyle.id='sdl-nav-upgrade';
  navStyle.textContent=`
   #publicApp .top{padding:9px 2.2%;gap:14px}
   #publicApp .nav{flex:1;align-items:center;justify-content:center;gap:clamp(11px,1.15vw,18px);font-size:clamp(.79rem,.84vw,.92rem);white-space:nowrap}
   #publicApp .nav a{position:relative;padding:9px 2px;transition:color .2s ease,transform .2s ease}
   #publicApp .nav a:after{content:'';position:absolute;left:50%;right:50%;bottom:3px;height:2px;border-radius:2px;background:#82caff;opacity:0;transition:left .2s ease,right .2s ease,opacity .2s ease}
   #publicApp .nav a:hover{color:#bfe8ff;transform:translateY(-1px)}
   #publicApp .nav a:hover:after{left:0;right:0;opacity:.85}
   #publicApp .nav a[href="/fanclub.html"]{padding:7px 11px;border:1px solid #5f9bc66b;border-radius:999px;background:#0a1925;color:#bfe8ff;box-shadow:inset 0 0 18px #66c4ff12}
   #publicApp .nav a[href="/fanclub.html"]:after{display:none}
   #publicApp .nav-toggle{display:none;width:42px;height:42px;padding:0;border:1px solid #35506a;border-radius:12px;background:#09131d;color:#eef6ff;place-items:center;cursor:pointer}
   #publicApp .nav-toggle span{display:block;width:19px;height:2px;margin:3px 0;border-radius:2px;background:currentColor;transition:.2s}
   #publicApp .nav-toggle.is-open span:nth-child(1){transform:translateY(5px) rotate(45deg)}
   #publicApp .nav-toggle.is-open span:nth-child(2){opacity:0}
   #publicApp .nav-toggle.is-open span:nth-child(3){transform:translateY(-5px) rotate(-45deg)}

   @media (max-width:1450px) and (min-width:901px){
    #publicApp .top{flex-wrap:wrap;padding:8px 2% 0}
    #publicApp .top>nav.nav{order:3;flex:0 0 100%;width:100%;min-height:46px;padding:3px 0 7px;border-top:1px solid #16293a;gap:clamp(15px,2vw,27px);font-size:.89rem}
    #publicApp .hero{min-height:calc(100svh - 114px)}
   }

   @media (max-width:900px){
    #publicApp .top{min-height:68px;flex-wrap:nowrap;padding:7px 12px;gap:8px}
    #publicApp .top>a:first-child{flex:0 0 auto}
    #publicApp .top>a:first-child img{width:88px;max-height:48px}
    #publicApp .head-actions{margin-left:auto;gap:6px;flex-wrap:nowrap}
    #publicApp .nav-toggle{display:grid;flex:0 0 auto}
    #publicApp .top>nav.nav{display:none!important;position:absolute;top:calc(100% + 1px);left:10px;right:10px;width:auto;margin:0;padding:10px;z-index:120;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;background:#06101af7;border:1px solid #29475f;border-radius:16px;box-shadow:0 22px 60px #000c;backdrop-filter:blur(18px);white-space:normal}
    #publicApp .top>nav.nav.is-open{display:grid!important}
    #publicApp .top>nav.nav a{display:flex;align-items:center;min-height:42px;padding:10px 12px;border:1px solid transparent;border-radius:11px;background:#0a1722;color:#dcecff;font-size:.84rem}
    #publicApp .top>nav.nav a:hover{transform:none;border-color:#355b78;background:#0d2030}
    #publicApp .top>nav.nav a:after{display:none}
    #publicApp .top>nav.nav a[href="/fanclub.html"]{border-color:#5f9bc66b;background:#10283a;color:#c9ecff}
   }

   @media (max-width:650px){
    #publicApp .top>a:first-child img{width:74px}
    #publicApp .socials a.social{display:none}
    #publicApp .social{width:34px;height:34px}
    #publicApp .top .fanclub-head-btn,#publicApp .top .admin-entry{padding:8px 10px;font-size:.74rem}
    #publicApp .nav-toggle{width:36px;height:36px;border-radius:10px}
   }

   @media (max-width:430px){
    #publicApp .top{padding-inline:9px}
    #publicApp .top>a:first-child img{width:62px}
    #publicApp .top .fanclub-head-btn,#publicApp .top .admin-entry{padding:7px 8px;font-size:.68rem}
    #publicApp .top>nav.nav{left:7px;right:7px;grid-template-columns:1fr}
   }
  `;
  document.head.appendChild(navStyle);
 }

 if(publicNav&&headActions&&!document.querySelector('#publicApp .nav-toggle')){
  const toggle=document.createElement('button');
  toggle.className='nav-toggle';
  toggle.type='button';
  toggle.setAttribute('aria-label','Abrir menú');
  toggle.setAttribute('aria-controls','publicMainNav');
  toggle.setAttribute('aria-expanded','false');
  toggle.innerHTML='<span></span><span></span><span></span>';
  publicNav.id='publicMainNav';
  headActions.appendChild(toggle);

  const setMenuOpen=open=>{
   publicNav.classList.toggle('is-open',open);
   toggle.classList.toggle('is-open',open);
   toggle.setAttribute('aria-expanded',String(open));
   toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  };
  toggle.addEventListener('click',e=>{
   e.stopPropagation();
   setMenuOpen(!publicNav.classList.contains('is-open'));
  });
  publicNav.addEventListener('click',e=>{if(e.target.closest('a'))setMenuOpen(false)});
  document.addEventListener('click',e=>{
   if(innerWidth<=900&&publicNav.classList.contains('is-open')&&!publicNav.contains(e.target)&&!toggle.contains(e.target))setMenuOpen(false);
  });
  window.addEventListener('resize',()=>{if(innerWidth>900)setMenuOpen(false)});
 }
})();

/* ADMINISTRACION · CARGA DEL MODULO ESTABLE DE DESAFIOS */
(()=>{
 const legacy=document.createElement('script');
 legacy.src='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@d526469b05b8746e177053a33743fbfaef049d93/desafios-admin.js';
 legacy.async=false;
 document.head.appendChild(legacy);
})();
