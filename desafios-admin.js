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