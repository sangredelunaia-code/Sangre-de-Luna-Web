const SITE='https://sangre-de-luna-public.vercel.app';
const RAW='https://raw.githubusercontent.com/sangredelunaia-code/Sangre-de-Luna-Web/main';
const FALLBACK='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@532117388011ebcf0c8ffe7547c9ddb467d7d1ca';
const CDN='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@main';
const ADMIN_LOADER='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@2f2e53ebcf2ab1f491e5f0c795876faa21d55cd2/desafios-admin.js';
const GUARDIAN='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@0affa5390a92e2ec9d686f93bac6f253203a1538/guardian-wolf.js?v=20260828-2';
const LYKOS_UI='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@05b0fafb641314f1ea0381ba0ea2b79c18f9eac8/lykos-ui-v6.js?v=20260828-6';
const LYKOS_ICON='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@d67913007337fc14a03e48a3851e7fb7af652d25/lykos-icon-v8.js?v=20260828-8';
const ASSETS=`${CDN}/assets`;
const IMAGE=`${ASSETS}/logo-oficial.png`;

const pages={
  home:{file:'index.html',path:'/',title:'Sangre de Luna | Serie Épica y Mundo Interactivo',description:'Sangre de Luna es una serie cinematográfica de fantasía épica donde reinos, linajes, alianzas y secretos despiertan antiguos conflictos. Mira los episodios, lee las historias, explora mapas y tours 360° y únete a La Manada.'},
  personajes:{file:'index.html',path:'/personajes',section:'personajes',title:'Personajes de Sangre de Luna | Conoce la Manada',description:'En el mundo de Sangre de Luna, reinos, linajes y alianzas se sostienen por quienes los defienden. Conoce a los personajes de la serie y descubre sus historias dentro del universo oficial.'},
  historias:{file:'index.html',path:'/historias',section:'historias',title:'Historias de Sangre de Luna | Lee el Universo Oficial',description:'Sangre de Luna narra un mundo de linajes, alianzas, secretos y antiguos conflictos. Lee las historias oficiales y descubre cómo evoluciona la serie capítulo a capítulo.'},
  episodios:{file:'index.html',path:'/episodios',section:'episodios',title:'Sangre de Luna | Mira la Serie y sus Episodios',description:'Sangre de Luna es una serie cinematográfica de fantasía épica sobre reinos, linajes, alianzas y secretos. Mira los episodios y sigue su historia capítulo a capítulo.'},
  musica:{file:'index.html',path:'/musica',section:'musica',title:'Música de Sangre de Luna | Sonidos del Universo',description:'La música acompaña los reinos, alianzas y momentos que construyen el mundo de Sangre de Luna. Escucha las canciones y temas del universo oficial de la serie.'},
  galeria:{file:'index.html',path:'/galeria',section:'galeria',title:'Galería de Sangre de Luna | Arte del Mundo Oficial',description:'Descubre visualmente el mundo de Sangre de Luna, una serie de reinos, linajes, alianzas y secretos. Explora personajes, territorios y escenas de su universo oficial.'},
  desafios:{file:'index.html',path:'/desafios',title:'Desafíos de Sangre de Luna | Pon a Prueba tu Conocimiento',description:'Después de conocer las historias y episodios de Sangre de Luna, pon a prueba cuánto sabes del universo oficial, supera desafíos y avanza dentro de La Manada.'},
  fanclub:{file:'fanclub.html',path:'/fanclub',title:'La Manada | Fan Club Oficial de Sangre de Luna',description:'Sangre de Luna reúne reinos, linajes, alianzas y secretos en una historia que continúa creciendo. Únete a La Manada, participa en desafíos, gana insignias y vive el universo desde dentro.'},
  mapa:{file:'mapa.html',path:'/mapa',title:'Mapa de Sangre de Luna | Explora sus Territorios',description:'Los conflictos de Sangre de Luna recorren reinos, rutas antiguas y territorios conectados. Abre el mapa oficial, descubre sus lugares clave y comienza a explorar su mundo.'},
  tour:{file:'tour.html',path:'/tour',title:'Tour 360° de Sangre de Luna | Recorre sus Territorios',description:'Los escenarios de Sangre de Luna forman parte de un mundo de reinos, alianzas y secretos. Entra a los recorridos 360° y explora sus territorios como si estuvieras dentro de la serie.'},
  viaje:{file:'viaje.html',path:'/viaje',title:'Mi Viaje | Explora el Mundo de Sangre de Luna',description:'El mundo de Sangre de Luna se extiende entre territorios, rutas y lugares ligados a su historia. Elige tu destino, explora las experiencias interactivas y continúa tu viaje.'}
};

const pathAliases={
  '/':'home','/index':'home','/index.html':'home','/personajes':'personajes','/historias':'historias',
  '/episodios':'episodios','/musica':'musica','/galeria':'galeria','/desafios':'desafios',
  '/fanclub':'fanclub','/fanclub.html':'fanclub','/mapa':'mapa','/mapa.html':'mapa',
  '/tour':'tour','/tour.html':'tour','/viaje':'viaje','/viaje.html':'viaje'
};

const cache=new Map();
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));

async function fetchText(url,timeout=2800){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeout);
  try{
    const r=await fetch(url,{signal:controller.signal,headers:{'User-Agent':'Sangre-de-Luna-SEO/3.0'}});
    if(!r.ok)throw new Error(`source ${r.status}`);
    return await r.text();
  }finally{clearTimeout(timer)}
}

async function source(file){
  const hit=cache.get(file);
  if(hit&&Date.now()-hit.at<5*60*1000)return hit.html;
  let html;
  try{html=await fetchText(`${RAW}/${file}`,2800)}
  catch(err){console.warn('SEO raw fallback:',file,err?.message||err);html=await fetchText(`${FALLBACK}/${file}`,3500)}
  cache.set(file,{html,at:Date.now()});
  return html;
}

function resolveKey(req){
  const raw=req.query?.route;
  const queryKey=Array.isArray(raw)?raw[0]:raw;
  if(queryKey&&pages[String(queryKey)])return String(queryKey);
  for(const value of [req.headers?.['x-vercel-original-url'],req.headers?.['x-original-url'],req.url]){
    if(!value)continue;
    try{
      const pathname=new URL(String(value),SITE).pathname.replace(/\/$/,'')||'/';
      if(pathAliases[pathname])return pathAliases[pathname];
    }catch{}
  }
  return 'home';
}

function externalizeStatic(html){
  html=html.replace(/([("'`])\/?assets\//g,`$1${ASSETS}/`);
  html=html.replace(/href=(["'])\/(?!api\/)([^"']+\.css(?:\?[^"']*)?)\1/gi,(_,q,file)=>`href=${q}${CDN}/${file}${q}`);
  html=html.replace(/src=(["'])\/desafios-admin\.js(?:\?[^"']*)?\1/gi,(_,q)=>`src=${q}${ADMIN_LOADER}${q}`);
  html=html.replace(/src=(["'])\/(?!api\/)([^"']+\.js(?:\?[^"']*)?)\1/gi,(_,q,file)=>`src=${q}${CDN}/${file}${q}`);
  return html;
}

function rebrandLykos(html){
  return html
    .replace(/aria-label="Cronista de la Ciudadela"/g,'aria-label="Lykos, Guardián de la Ciudadela"')
    .replace(/<b>Cronista de la Ciudadela<\/b><span><i><\/i> Guía del archivo oficial<\/span>/g,'<b>LYKOS</b><span><i></i> Guardián de la Ciudadela</span>')
    .replace(/Abrir al Cronista de la Ciudadela/g,'Abrir a Lykos, Guardián de la Ciudadela')
    .replace(/Pregunta para el Cronista/g,'Pregunta para Lykos')
    .replace("const cronistaGreeting='Bienvenido a la Ciudadela. Soy el Cronista de la Manada. Si es tu primera visita, puedo acompañarte paso a paso; si ya conoces estas tierras, dime qué deseas encontrar.';","const cronistaGreeting='Bienvenido a la Ciudadela. Soy Lykos, el Guardián de la Ciudadela. Si es tu primera visita, puedo guiarte paso a paso; si ya conoces estas tierras, dime qué deseas encontrar.';")
    .replace(/La voz del Cronista ha despertado\./g,'La voz de Lykos ha despertado.')
    .replace(/El Cronista no encontró una respuesta en el archivo\./g,'Lykos no encontró una respuesta en el archivo.');
}

function injectScript(html,src,needle){
  if(html.includes(needle))return html;
  const tag=`<script src="${src}" defer></script>`;
  return /<\/body>/i.test(html)?html.replace(/<\/body>/i,`${tag}</body>`):html.replace(/<\/html>/i,`${tag}</html>`);
}

function inject(html,p){
  const canonical=`${SITE}${p.path==='/'?'':p.path}`;
  const meta=`\n<meta name="description" content="${esc(p.description)}">\n<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">\n<link rel="canonical" href="${canonical}">\n<meta property="og:locale" content="es_EC">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Sangre de Luna">\n<meta property="og:title" content="${esc(p.title)}">\n<meta property="og:description" content="${esc(p.description)}">\n<meta property="og:url" content="${canonical}">\n<meta property="og:image" content="${IMAGE}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${esc(p.title)}">\n<meta name="twitter:description" content="${esc(p.description)}">\n<meta name="twitter:image" content="${IMAGE}">`;
  const schema={'@context':'https://schema.org','@graph':[{'@type':'WebSite','@id':`${SITE}/#website`,url:`${SITE}/`,name:'Sangre de Luna',inLanguage:'es',description:pages.home.description},{'@type':'WebPage','@id':`${canonical}#webpage`,url:canonical,name:p.title,description:p.description,inLanguage:'es',isPartOf:{'@id':`${SITE}/#website`},primaryImageOfPage:{'@type':'ImageObject',url:IMAGE}},...(p.path==='/'?[{'@type':'CreativeWorkSeries','@id':`${SITE}/#series`,name:'Sangre de Luna',url:`${SITE}/`,description:pages.home.description,inLanguage:'es',image:IMAGE}]:[])]};
  const structured=`\n<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>\n`;
  const focus=p.section?`\n<script>addEventListener('DOMContentLoaded',()=>{const target=document.getElementById(${JSON.stringify(p.section)});if(target)setTimeout(()=>target.scrollIntoView({block:'start'}),80)},{once:true});</script>\n`:'';

  html=rebrandLykos(externalizeStatic(html))
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi,'')
    .replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi,'')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi,'')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi,'')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi,'')
    .replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,'');

  if(p.file==='fanclub.html'&&!html.includes('fanclub-registration-email.js')){
    html=html.replace(/<\/body>/i,`<script src="${CDN}/fanclub-registration-email.js?v=20260817" defer></script></body>`);
  }
  html=injectScript(html,GUARDIAN,'guardian-wolf.js');
  html=injectScript(html,LYKOS_UI,'lykos-ui-v6.js');
  html=injectScript(html,LYKOS_ICON,'lykos-icon-v8.js');

  if(/<title>[\s\S]*?<\/title>/i.test(html))html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${esc(p.title)}</title>`);
  else html=html.replace(/<head([^>]*)>/i,`<head$1>\n<title>${esc(p.title)}</title>`);
  return html.replace(/<\/head>/i,`${meta}${structured}${focus}</head>`);
}

module.exports=async(req,res)=>{
  const key=resolveKey(req);
  const p=pages[key];
  if(!p){res.statusCode=404;return res.end('Not found')}
  try{
    const html=inject(await source(p.file),p);
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, s-maxage=30, stale-while-revalidate=120');
    res.setHeader('Vary','Accept-Encoding');
    res.setHeader('Link',`<${SITE}${p.path==='/'?'':p.path}>; rel="canonical"`);
    res.setHeader('X-Robots-Tag',req.query?.admin==='1'?'noindex, nofollow, nosnippet':'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    res.statusCode=200;
    return res.end(html);
  }catch(err){
    console.error('SEO gateway:',key,err?.message||err);
    res.statusCode=502;
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    return res.end('Sangre de Luna está actualizando esta ruta. Inténtalo nuevamente en unos instantes.');
  }
};
