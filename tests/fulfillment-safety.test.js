'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {selectFulfillment,PROVIDERS}=require('../lib/provider-routing');
const catalog=require('../data/tienda-catalogo.json');
const validation=require('../data/proveedores-validacion.json');
const quote=(provider,overrides={})=>({
 provider,country:'EC',sku:'SDL-ORI-001',color:'Negro',size:'M',
 verified:true,canShip:true,inStock:true,verificationId:'test-verified-01',totalCostUsd:17,...overrides
});
test('Only configured providers are accepted',()=>{
 assert.deepEqual(Object.keys(PROVIDERS).sort(),['gelato','gooten']);
 assert.equal(selectFulfillment({country:'EC',sku:'SDL-ORI-001',color:'Negro',size:'M',quotes:[quote('infrarojo')]}).available,false);
});
test('No verified quote means no sales',()=>{
 assert.equal(selectFulfillment({country:'EC',sku:'SDL-ORI-001',color:'Negro',size:'M',quotes:[]}).available,false);
 assert.equal(selectFulfillment({country:'EC',sku:'SDL-ORI-001',color:'Negro',size:'M',quotes:[quote('gelato',{inStock:false})]}).available,false);
 assert.equal(selectFulfillment({country:'EC',sku:'SDL-ORI-001',color:'Negro',size:'M',quotes:[quote('gooten',{canShip:false})]}).available,false);
});
test('Wrong country, size and expired quotes are rejected',()=>{
 assert.equal(selectFulfillment({country:'US',sku:'SDL-ORI-001',color:'Negro',size:'M',quotes:[quote('gelato')]}).available,false);
 assert.equal(selectFulfillment({country:'EC',sku:'SDL-ORI-001',color:'Negro',size:'S',quotes:[quote('gelato')]}).available,false);
 assert.equal(selectFulfillment({country:'EC',sku:'SDL-ORI-001',color:'Negro',size:'M',quotes:[quote('gelato',{expiresAt:'2000-01-01T00:00:00Z'})]}).available,false);
});
test('Provider is selected only from verified exact matches',()=>{
 const result=selectFulfillment({country:'EC',sku:'SDL-ORI-001',color:'Negro',size:'M',quotes:[quote('gooten'),quote('gelato',{totalCostUsd:19})]});
 assert.equal(result.available,true);
 assert.equal(result.fulfillment.provider,'gelato');
});
test('Store and validation matrix remain blocked until fulfillment is verified',()=>{
 assert.equal(catalog.checkoutEnabled,false);
 assert.equal(catalog.ordersEnabled,false);
 assert.equal(validation.publicationAllowed,false);
 assert.equal(validation.releaseGate.salesEnabled,false);
});
