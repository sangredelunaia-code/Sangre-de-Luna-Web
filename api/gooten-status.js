'use strict';
const {configured}=require('../lib/gooten-client');
const ALLOWED=new Set(['EC','US','CA','ES','MX','CO','PE','CL','GB']);
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({ok:false}));}
 const state={ok:true,provider:'Gooten',credentialsConfigured:configured(),mode:'read_only',authenticationVerified:false,shippingVerified:false,checkoutEnabled:false,ordersEnabled:false};
 if(!configured())return res.end(JSON.stringify(state));
 const url=new URL('https://api.print.io/api/v/5/source/api/countries');
 url.searchParams.set('recipeId',process.env.GOOTEN_RECIPE_ID);
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),9000);
 try{
  const response=await fetch(url,{headers:{Accept:'application/json'},signal:controller.signal});
  if(!response.ok){state.reason='gooten_http_'+response.status;return res.end(JSON.stringify(state));}
  const payload=await response.json();
  if(payload?.HadError===true){state.reason='gooten_rejected';return res.end(JSON.stringify(state));}
  state.authenticationVerified=true;
  const entries=Array.isArray(payload)?payload:Array.isArray(payload?.Countries)?payload.Countries:Array.isArray(payload?.Result)?payload.Result:null;
  if(entries){const supported=new Set(entries.map(x=>typeof x==='string'?x:String(x?.Code||x?.CountryCode||x?.IsoCode||x?.Country||'').toUpperCase()));state.supportedCountryCodes=[...ALLOWED].filter(x=>supported.has(x));state.ecuadorCountryListed=supported.has('EC');}
  else{state.countryListParsed=false;}
  state.note='A supported country is not proof of availability for a particular SKU, color or size.';
  return res.end(JSON.stringify(state));
 }catch(e){state.reason=e?.name==='AbortError'?'gooten_timeout':'gooten_unavailable';return res.end(JSON.stringify(state));}
 finally{clearTimeout(timer);}
};