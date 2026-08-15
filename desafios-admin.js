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
})();

/* ADMINISTRACION · CARGA DEL MODULO ESTABLE DE DESAFIOS */
(()=>{
 const legacy=document.createElement('script');
 legacy.src='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@d526469b05b8746e177053a33743fbfaef049d93/desafios-admin.js';
 legacy.async=false;
 document.head.appendChild(legacy);
})();
