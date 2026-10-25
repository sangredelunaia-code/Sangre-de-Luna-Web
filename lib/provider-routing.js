'use strict';

/**
 * Internal, fail-closed fulfilment selector for Sangre de Luna.
 * Supply ONLY verified provider quotes from server-side API calls/manual confirmations.
 * This module never creates orders or assumes a colour/size is available.
 */
const PROVIDERS = Object.freeze({
  gelato: {label:'Gelato', integration:'api', priority:1},
  gooten: {label:'Gooten', integration:'api', priority:2}
});
const COUNTRIES = Object.freeze(['EC','US','CA','ES','MX','CO','PE','CL','GB']);
const CORE_SIZES = Object.freeze(['S','M','L','XL']);
function selectFulfillment({country,sku,color,size,quotes,requireCoreSize=false}={}){
  const destination=String(country||'').trim().toUpperCase();
  if(!COUNTRIES.includes(destination))return {available:false,reason:'unsupported_destination'};
  if(!sku||!color||!size)return {available:false,reason:'variant_required'};
  const normalizedSize=String(size).trim().toUpperCase();
  if(requireCoreSize&&!CORE_SIZES.includes(normalizedSize))return {available:false,reason:'outside_core_sizes'};
  const offers=(Array.isArray(quotes)?quotes:[]).filter(q=>
    q && Object.prototype.hasOwnProperty.call(PROVIDERS,q.provider) &&
    q.verified===true && q.canShip===true && q.inStock===true &&
    q.country===destination && q.sku===sku &&
    q.color===color && String(q.size).toUpperCase()===normalizedSize &&
    Number.isFinite(q.totalCostUsd) && q.totalCostUsd>=0 &&
    typeof q.verificationId==='string' && q.verificationId.length>0 &&
    (!q.expiresAt || (Number.isFinite(Date.parse(q.expiresAt)) && Date.parse(q.expiresAt)>Date.now()))
  );
  if(!offers.length)return {available:false,reason:'no_verified_fulfillment'};
  const ordering=['gelato','gooten'];
  offers.sort((a,b)=>ordering.indexOf(a.provider)-ordering.indexOf(b.provider) || a.totalCostUsd-b.totalCostUsd);
  const best=offers[0];
  // Provider selection is private to the server; do not expose provider/quote IDs to customers.
  return {available:true,fulfillment:{provider:best.provider,verificationId:best.verificationId,totalCostUsd:best.totalCostUsd}};
}
module.exports={PROVIDERS,COUNTRIES,CORE_SIZES,selectFulfillment};
