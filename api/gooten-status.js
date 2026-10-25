'use strict';
const {configured}=require('../lib/gooten-client');
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'){res.statusCode=405;return res.end(JSON.stringify({ok:false}));}
 // Status only: never disclose credentials, SKUs, private prices or process orders.
 return res.end(JSON.stringify({ok:true,provider:'Gooten',credentialsConfigured:configured(),mode:'read_only',stockValidationReady:configured(),shippingVerified:false,checkoutEnabled:false,ordersEnabled:false}));
};
