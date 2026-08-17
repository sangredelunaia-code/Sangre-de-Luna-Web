const RAW='https://raw.githubusercontent.com/sangredelunaia-code/Sangre-de-Luna-Web/main/fanclub.html';
const CDN='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@main';
const ASSETS=`${CDN}/assets`;

function externalizeStatic(html){
  // El gateway de Vercel no publica los archivos estáticos del repositorio.
  // Convertimos todos los recursos locales del Fan Club a URLs públicas del CDN.
  html=html.replace(/([("'`])\/?assets\//g,`$1${ASSETS}/`);
  html=html.replace(/href=(["'])\/(?!api\/)([^"']+\.css(?:\?[^"']*)?)\1/gi,(_,q,file)=>`href=${q}${CDN}/${file}${q}`);
  html=html.replace(/src=(["'])\/(?!api\/)([^"']+\.js(?:\?[^"']*)?)\1/gi,(_,q,file)=>`src=${q}${CDN}/${file}${q}`);
  if(!html.includes('fanclub-registration-email.js')){
    html=html.replace(/<\/body>/i,`<script src="${CDN}/fanclub-registration-email.js?v=20260817" defer></script></body>`);
  }
  return html;
}

module.exports=async(req,res)=>{
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8000);
    let response;
    try{
      response=await fetch(RAW,{signal:controller.signal,headers:{'User-Agent':'Sangre-de-Luna-Manada/1.3'}});
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
