'use strict';
const {checkStock,configured}=require('../lib/gooten-client');
const SKU='Apparel-DTG-TShirt-NL-3900-S-Navy-Womens-CF';
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({ok:false,reason:'method_not_allowed'}));}
 if(!configured()){res.statusCode=503;return res.end(JSON.stringify({ok:false,reason:'credentials_not_configured'}));}
 try{
  const result=await checkStock({skus:[SKU],country:'US',state:'NY',postalCode:'10019'});
  return res.end(JSON.stringify({ok:true,test:'read_only_us_stock_check',country:'US',sku:SKU,outOfStock:result.outOfStock,stockCheckPassed:true,ecuadorShippingVerified:false,shippingPriceVerified:false,checkoutEnabled:false,ordersEnabled:false}));
 }catch(err){
  res.statusCode=502;return res.end(JSON.stringify({ok:false,reason:String(err.code||err.name||'stock_check_failed').slice(0,70),checkoutEnabled:false}));
 }
};