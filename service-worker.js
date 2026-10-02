/* Sangre de Luna · Service Worker mínimo y seguro.
   No guarda HTML, sesiones, páginas privadas ni respuestas de Supabase. */
const VERSION='sdl-pwa-v1';
const STATIC=['/assets/logo-oficial.png','/manifest.webmanifest'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(STATIC)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==VERSION).map(key=>caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(!STATIC.includes(url.pathname))return;
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{const copy=res.clone();caches.open(VERSION).then(cache=>cache.put(req,copy));return res})));
});
