'use strict';
const BASE='https://api.print.io/api/v/5/source/api';
const COUNTRIES=new Set(['EC','US','CA','ES','MX','CO','PE','CL','GB']);
function configured(){return Boolean(process.env.GOOTEN_RECIPE_ID && process.env.GOOTEN_PARTNER_BILLING_KEY);}
function fail(message){const e=new Error(message);e.code=message;throw e;}
async function request(path,{method='GET',body}={}){
  if(!configured())fail('gooten_credentials_missing');
  const u=new URL(BASE+'/'+path.replace(/^\//,''));
  u.searchParams.set('recipeid',process.env.GOOTEN_RECIPE_ID);
  const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),12000);
  try{
    const response=await fetch(u,{method,headers:{Accept:'application/json',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});
    if(!response.ok)fail('gooten_upstream_'+response.status);
    const data=await response.json();
    if(data?.HadError===true)fail('gooten_validation_failed');
    return data;
  }finally{clearTimeout(timer);}
}
/* Only supply SKUs previously mapped from a verified Gooten product-variants result. */
async function checkStock({skus,country,state='',postalCode=''}={}){
 if(!COUNTRIES.has(country))fail('country_not_supported_by_store');
 if(!Array.isArray(skus)||!skus.length||skus.length>30||skus.some(s=>typeof s!=='string'||s.length>160))fail('invalid_skus');
 if(typeof state!=='string'||state.length>80||typeof postalCode!=='string'||postalCode.length>24)fail('invalid_address');
 const unavailable=await request('variantstatus',{method:'POST',body:{Skus:skus,CountryCode:country,State:state,PostalCode:postalCode}});
 if(!Array.isArray(unavailable))fail('unrecognized_gooten_response');
 return {country,checked:skus.length,outOfStock:unavailable,availableSkus:skus.filter(s=>!unavailable.some(x=>String(x).toLowerCase()===s.toLowerCase())),warning:'SKU stock check is not a shipping quote or production guarantee'};
}
module.exports={configured,checkStock};
