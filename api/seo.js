const SITE='https://sangre-de-luna-public.vercel.app';
const RAW='https://raw.githubusercontent.com/sangredelunaia-code/Sangre-de-Luna-Web/main';
const IMAGE=`${SITE}/assets/logo-oficial.png`;

const pages={
  home:{file:'index.html',path:'/',title:'Sangre de Luna | Historias, Serie y Mundo Interactivo',description:'Adéntrate en Sangre de Luna, un universo épico de alianzas, secretos y territorios por descubrir. Lee las historias, mira la serie, explora mapas y recorridos 360° y únete a La Manada.'},
  personajes:{file:'index.html',path:'/personajes',title:'Personajes de Sangre de Luna | Conoce la Manada',description:'Conoce a los personajes, alianzas y fuerzas que dan vida al mundo de Sangre de Luna. Descubre quiénes son y adéntrate en sus historias dentro del universo oficial.'},
  historias:{file:'index.html',path:'/historias',title:'Historias de Sangre de Luna | Lee el Universo Oficial',description:'Lee las historias oficiales de Sangre de Luna y descubre alianzas, secretos, territorios y decisiones que transforman el destino de la Manada capítulo a capítulo.'},
  episodios:{file:'index.html',path:'/episodios',title:'Sangre de Luna | Mira la Serie y sus Episodios',description:'Mira los episodios de Sangre de Luna y vive en pantalla sus historias, personajes, alianzas y conflictos. Entra al universo oficial y sigue la serie capítulo a capítulo.'},
  musica:{file:'index.html',path:'/musica',title:'Música de Sangre de Luna | Sonidos del Universo',description:'Escucha la música de Sangre de Luna y acompaña cada historia con los sonidos que dan identidad a su mundo. Descubre canciones y temas del universo oficial.'},
  galeria:{file:'index.html',path:'/galeria',title:'Galería de Sangre de Luna | Arte del Mundo Oficial',description:'Explora la galería oficial de Sangre de Luna y descubre imágenes, personajes, territorios y escenas que dan forma visual a este universo épico.'},
  desafios:{file:'index.html',path:'/desafios',title:'Desafíos de Sangre de Luna | Pon a Prueba tu Conocimiento',description:'Pon a prueba cuánto conoces de Sangre de Luna con desafíos inspirados en el contenido oficial. Avanza, explora y demuestra tu lugar dentro de La Manada.'},
  fanclub:{file:'fanclub.html',path:'/fanclub',title:'La Manada | Fan Club Oficial de Sangre de Luna',description:'Únete a La Manada, el Fan Club oficial de Sangre de Luna. Regístrate, participa en desafíos, gana insignias y comienza tu propio recorrido dentro del universo.'},
  mapa:{file:'mapa.html',path:'/mapa',title:'Mapa de Sangre de Luna | Explora sus Territorios',description:'Abre el mapa de Sangre de Luna y explora sus territorios, rutas y lugares clave. Descubre el mundo de la serie y decide hacia dónde continuará tu viaje.'},
  tour:{file:'tour.html',path:'/tour',title:'Tour 360° de Sangre de Luna | Recorre sus Territorios',description:'Entra a los recorridos 360° de Sangre de Luna y visita sus territorios como si estuvieras dentro de la historia. Explora escenarios, detalles y lugares del universo oficial.'},
  viaje:{file:'viaje.html',path:'/viaje',title:'Mi Viaje | Explora el Mundo de Sangre de Luna',description:'Elige tu próximo destino dentro de Sangre de Luna. Recorre mapas, territorios y experiencias interactivas y construye paso a paso tu viaje por este universo.'}
};

const cache=new Map();
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function source(file){
  const hit=cache.get(file);
  if(hit&&Date.now()-hit.at<300000)return hit.html;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8000);
  try{
    const r=await fetch(`${RAW}/${file}`,{signal:controller.signal,headers:{'User-Agent':'Sangre-de-Luna-SEO/1.0'}});
    if(!r.ok)throw new Error(`source ${r.status}`);
    const html=await r.text();
    cache.set(file,{html,at:Date.now()});
    return html;
  }finally{clearTimeout(timer)}
}

function inject(html,p){
  const canonical=`${SITE}${p.path==='/'?'':p.path}`;
  const meta=`\n<meta name="description" content="${esc(p.description)}">\n<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">\n<link rel="canonical" href="${canonical}">\n<meta property="og:locale" content="es_EC">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Sangre de Luna">\n<meta property="og:title" content="${esc(p.title)}">\n<meta property="og:description" content="${esc(p.description)}">\n<meta property="og:url" content="${canonical}">\n<meta property="og:image" content="${IMAGE}">\n<meta property="og:image:alt" content="Sangre de Luna — universo oficial">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${esc(p.title)}">\n<meta name="twitter:description" content="${esc(p.description)}">\n<meta name="twitter:image" content="${IMAGE}">`;
  const schema={
    '@context':'https://schema.org',
    '@graph':[
      {'@type':'WebSite','@id':`${SITE}/#website`,url:`${SITE}/`,name:'Sangre de Luna',inLanguage:'es',description:pages.home.description},
      {'@type':'WebPage','@id':`${canonical}#webpage`,url:canonical,name:p.title,description:p.description,inLanguage:'es',isPartOf:{'@id':`${SITE}/#website`},primaryImageOfPage:{'@type':'ImageObject',url:IMAGE}},
      ...(p.path==='/'?[{'@type':'CreativeWorkSeries','@id':`${SITE}/#series`,name:'Sangre de Luna',url:`${SITE}/`,description:pages.home.description,inLanguage:'es',image:IMAGE}]:[])
    ]
  };
  const structured=`\n<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>\n`;
  html=html
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi,'')
    .replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi,'')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi,'')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi,'')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi,'')
    .replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,'');
  if(/<title>[\s\S]*?<\/title>/i.test(html))html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${esc(p.title)}</title>`);
  else html=html.replace(/<head([^>]*)>/i,`<head$1>\n<title>${esc(p.title)}</title>`);
  return html.replace(/<\/head>/i,`${meta}${structured}</head>`);
}

module.exports=async(req,res)=>{
  const key=String(req.query?.route||'home');
  const p=pages[key];
  if(!p){res.statusCode=404;return res.end('Not found')}
  try{
    const html=inject(await source(p.file),p);
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=86400');
    res.setHeader('Vary','Accept-Encoding');
    res.setHeader('Link',`<${SITE}${p.path==='/'?'':p.path}>; rel="canonical"`);
    res.setHeader('X-Robots-Tag',req.query?.admin==='1'?'noindex, nofollow, nosnippet':'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    res.statusCode=200;
    return res.end(html);
  }catch(err){
    console.error('SEO gateway:',err?.message||err);
    res.statusCode=502;
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    return res.end('Sangre de Luna está actualizando esta ruta. Inténtalo nuevamente en unos instantes.');
  }
};
