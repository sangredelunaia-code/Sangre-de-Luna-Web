/* Conteo de visitas públicas: incrementa en cada carga o recarga de página. */
(()=>{
  if(new URLSearchParams(location.search).has('admin'))return;
  const configUrl='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';
  (async()=>{
    try{
      const cfg=await fetch(configUrl,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('config');return r.json()});
      const url=String(cfg.url||'').replace(/\/$/,'');
      const key=cfg.key;
      if(!url||!key)throw new Error('config');
      const r=await fetch(url+'/rest/v1/rpc/register_site_visit',{
        method:'POST',
        headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},
        body:'{}'
      });
      if(!r.ok)throw new Error('visit');
    }catch(_){}
  })();
})();
