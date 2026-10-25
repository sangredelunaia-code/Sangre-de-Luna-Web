'use strict';
const COUNTRIES=new Set(['EC','US','CA','ES','MX','CO','PE','CL','GB']);
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({ok:false,reason:'method_not_allowed'}));}
 const country=String(req.query?.country||'EC').trim().toUpperCase();
 const productId=String(req.query?.productId||'').trim();
 if(!COUNTRIES.has(country)||!/^\d{1,12}$/.test(productId)){res.statusCode=400;return res.end(JSON.stringify({ok:false,reason:'valid_country_and_numeric_product_id_required'}));}
 if(!process.env.GOOTEN_RECIPE_ID){res.statusCode=503;return res.end(JSON.stringify({ok:false,reason:'gooten_credentials_missing'}));}
 const url=new URL('https://api.print.io/api/v/5/source/api/productvariants');
 url.searchParams.set('recipeId',process.env.GOOTEN_RECIPE_ID);
 url.searchParams.set('productId',productId);
 url.searchParams.set('countryCode',country);
 url.searchParams.set('currencyCode','USD');
 const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),12000);
 try{
  const response=await fetch(url,{headers:{Accept:'application/json'},signal:ctl.signal});
  if(!response.ok){const raw=(await response.text()).slice(0,1500);let details={};try{const parsed=JSON.parse(raw);details={vendorCode:String(parsed.ErrorCode||parsed.ErrorReferenceCode||'').slice(0,80),vendorMessage:String(parsed.Message||parsed.ErrorMessage||parsed.Error||'').replace(/[A-Za-z0-9_-]{28,}/g,'[redacted]').slice(0,180)};}catch(_){} console.error('gooten_variant_rejection',response.status,details.vendorCode||'',details.vendorMessage||'');res.statusCode=502;return res.end(JSON.stringify({ok:false,reason:'gooten_http_'+response.status,vendorMessage:details.vendorMessage||null,vendorCode:details.vendorCode||null}));}
  const data=await response.json();
  if(data?.HadError===true){res.statusCode=502;return res.end(JSON.stringify({ok:false,reason:'gooten_rejected_variant_lookup'}));}
  if(!Array.isArray(data?.ProductVariants)){res.statusCode=502;return res.end(JSON.stringify({ok:false,reason:'unexpected_variant_response'}));}
  const variants=data.ProductVariants.slice(0,100).map(x=>({
   sku:String(x.Sku||'').slice(0,120),
   options:Array.isArray(x.Options)?x.Options.map(y=>({name:String(y.Name||'').slice(0,80),value:String(y.Value||'').slice(0,80)})):[],
   // Supplier price data not shown publicly; availability requires a separate stock-and-shipping check.
   purchasable:false
  })).filter(x=>x.sku);
  res.end(JSON.stringify({ok:true,provider:'Gooten',country,productId,returned:variants.length,variants,stockVerified:false,shippingVerified:false,checkoutEnabled:false}));
 }catch(e){res.statusCode=503;res.end(JSON.stringify({ok:false,reason:e?.name==='AbortError'?'gooten_timeout':'gooten_unavailable'}));}
 finally{clearTimeout(timeout);}
};
