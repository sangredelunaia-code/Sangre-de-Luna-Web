const RAW='https://raw.githubusercontent.com/sangredelunaia-code/Sangre-de-Luna-Web/main/fanclub.html';
const CDN='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@main';
const ASSETS=`${CDN}/assets`;

function externalizeStatic(html){
  html=html.replace(/([("'`])\/?assets\//g,`$1${ASSETS}/`);
  for(const file of ['desafios-admin.js','cronista-global.js','fanclub-separation.js']){
    html=html
      .replaceAll(`src="/${file}"`,`src="${CDN}/${file}"`)
      .replaceAll(`src='/${file}'`,`src='${CDN}/${file}'`)
      .replaceAll(`src=\`/${file}\``,`src=\`${CDN}/${file}\``);
  }
  return html;
}

module.exports=async(req,res)=>{
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8000);
    let response;
    try{
      response=await fetch(RAW,{signal:controller.signal,headers:{'User-Agent':'Sangre-de-Luna-Manada/1.1'}});
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
