'use strict';
const ALLOWED=new Set(['EC','US','CA','ES','MX','CO','PE','CL','GB']);
async function get(url){
 const ctl=new AbortController();const timeout=setTimeout(()=>ctl.abort(),10000);
 try{const r=await fetch(url,{headers:{Accept:'application/json'},signal:ctl.signal});if(!r.ok)throw Error('upstream_http_'+r.status);return await r.json();}
 finally{clearTimeout(timeout);}
}
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({ok:false,reason:'method_not_allowed'}));}
 const recipe=process.env.GOOTEN_RECIPE_ID;
 if(!recipe){res.statusCode=503;return res.end(JSON.stringify({ok:false,reason:'gooten_not_configured'}));}
 const country=String(req.query?.country||'EC').toUpperCase();
 if(!ALLOWED.has(country)){res.statusCode=400;return res.end(JSON.stringify({ok:false,reason:'unsupported_country'}));}
 try{
  const u=new URL('https://api.print.io/api/v/5/source/api/products');
  u.searchParams.set('recipeId',recipe);u.searchParams.set('countryCode',country);
  const data=await get(u);
  if(data?.HadError)throw Error('gooten_catalog_error');
  const products=Array.isArray(data?.Products)?data.Products:Array.isArray(data)?data:null;
  if(!products)throw Error('unrecognized_catalog_response');
  const matches=products.filter(x=>/crew neck|t.?shirt|tee\b/i.test(String(x.Name||x.ProductName||x.name||''))).slice(0,30).map(x=>({
   id:x.Id??x.ProductId??x.id??null,
   name:String(x.Name||x.ProductName||x.name||'').slice(0,120),
   type:String(x.Type||x.ProductType||'').slice(0,80)
  }));
  res.end(JSON.stringify({ok:true,country,mode:'read_only',catalogProductCount:products.length,shirtCandidates:matches,variantsVerified:false,shippingVerified:false,checkoutEnabled:false,ordersEnabled:false}));
 }catch(error){
  res.statusCode=503;res.end(JSON.stringify({ok:false,reason:error?.name==='AbortError'?'gooten_timeout':String(error.message||'gooten_unavailable').slice(0,90),checkoutEnabled:false}));
 }
};
