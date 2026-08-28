const RAW='https://raw.githubusercontent.com/sangredelunaia-code/Sangre-de-Luna-Web/main/fanclub.html';
const REV='13b2bc12f6076c88c734b00b73c9aea92967d724';
const CDN=`https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@${REV}`;
const LIVE='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@main';
const ASSETS=`${CDN}/assets`;
const CONTENT_UX='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@47e120e875e5330d28661476611406add0da03e3/fanclub-content-ux.js';
const GUARDIAN=`${LIVE}/guardian-wolf.js?v=20260827-3`;
const LYKOS_WAKE='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@3317acb5db25b1057b41d9355a7e3ff5e0133b8c/guardian-wake.js';

function injectBodyScript(html,src,needle){
  if(html.includes(needle))return html;
  const tag=`<script src="${src}" defer></script>`;
  return /<\/body>/i.test(html)?html.replace(/<\/body>/i,`${tag}</body>`):html.replace(/<\/html>/i,`${tag}</html>`);
}

function externalizeStatic(html){
  // El gateway de Vercel no publica los archivos estáticos del repositorio.
  // Convertimos todos los recursos locales del Fan Club a URLs públicas del CDN.
  html=html.replace(/([("'`])\/?assets\//g,`$1${ASSETS}/`);
  html=html.replace(/href=(["'])\/(?!api\/)([^"']+\.css(?:\?[^"']*)?)\1/gi,(_,q,file)=>`href=${q}${CDN}/${file}${q}`);
  html=html.replace(/src=(["'])\/(?!api\/)([^"']+\.js(?:\?[^"']*)?)\1/gi,(_,q,file)=>`src=${q}${CDN}/${file}${q}`);
  if(!html.includes('fanclub-registration-email.js')){
    html=html.replace(/<\/body>/i,`<script src="${CDN}/fanclub-registration-email.js?v=20260817" defer></script></body>`);
  }
  if(!html.includes('fanclub-content-ux.js')){
    html=html.replace(/<\/body>/i,`<script src="${CONTENT_UX}?v=20260817-1" defer></script></body>`);
  }

  html=injectBodyScript(html,GUARDIAN,'guardian-wolf.js');
  html=injectBodyScript(html,LYKOS_WAKE,'guardian-wake.js');

  // Failsafe de producción: la ruta de Contenido debe mostrar #zona al principio,
  // incluso si una revisión antigua del JS quedó cacheada en el CDN.
  const contenidoRouteFix=`<script id="sdl-contenido-route-fix">(function(){
    function placeContenidoFirst(){
      var path=location.pathname.replace(/\\/+$/,'')||'/';
      if(path!=='/la-manada/contenidos')return;
      var main=document.getElementById('fanMain');
      var zone=document.getElementById('zona');
      var hero=document.getElementById('fcbHero');
      var head=document.getElementById('fanHead');
      if(hero)hero.hidden=true;
      if(head)head.hidden=true;
      if(main&&zone&&main.firstElementChild!==zone)main.insertBefore(zone,main.firstElementChild);
      if(zone){
        zone.hidden=false;
        zone.removeAttribute('aria-hidden');
      }
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',placeContenidoFirst,{once:true});
    else placeContenidoFirst();
  })();</script>`;
  if(!html.includes('sdl-contenido-route-fix')){
    html=html.replace(/<\/body>/i,`${contenidoRouteFix}</body>`);
  }
  return html;
}

module.exports=async(req,res)=>{
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8000);
    let response;
    try{
      response=await fetch(RAW,{signal:controller.signal,headers:{'User-Agent':'Sangre-de-Luna-Manada/1.6'}});
    }finally{
      clearTimeout(timer);
    }
    if(!response.ok)throw new Error(`source ${response.status}`);
    const html=externalizeStatic(await response.text());
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-store, no-cache, must-revalidate');
    res.setHeader('X-Robots-Tag','noindex, nofollow, nosnippet');
    res.setHeader('Vary','Accept-Encoding');
    res.statusCode=200;
    return res.end(html);
  }catch(err){
    console.error('La Manada gateway:',err?.message||err);
    res.statusCode=502;
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    return res.end('La Manada está actualizándose. Inténtalo nuevamente en unos instantes.');
  }
};
