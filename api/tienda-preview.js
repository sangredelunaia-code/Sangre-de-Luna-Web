const crypto = require('node:crypto');

const COOKIE = '__Host-sdl_store_preview';
const PREVIEW_PATH = '/tienda-privada';
const MAX_AGE = 8 * 60 * 60;
const HASH = process.env.SDL_STORE_PREVIEW_KEY_SHA256 || '';
const SESSION_SECRET = process.env.SDL_STORE_PREVIEW_SESSION_SECRET || '';
const DB_URL=process.env.SDL_STORE_SUPABASE_URL||'',DB_KEY=process.env.SDL_STORE_SUPABASE_PUBLISHABLE_KEY||'';
async function rpc(name,payload){const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),6000);try{const r=await fetch(DB_URL+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:DB_KEY,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:ctl.signal});if(!r.ok)throw Error('Credential service unavailable');return await r.json()}finally{clearTimeout(timeout)}}
function rateKey(req){return crypto.createHmac('sha256',SESSION_SECRET).update(String(req.headers['x-forwarded-for']||req.headers['x-real-ip']||'unknown').split(',')[0].trim()).digest('hex')}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
function createSession(version){const expiry=Date.now()+MAX_AGE*1000,payload=expiry+'.'+version,mac=crypto.createHmac('sha256',SESSION_SECRET).update('sdl-store:'+payload).digest('hex');return payload+'.'+mac}
async function isValidSession(req){const pair=String(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='));if(!pair)return false;const m=pair.slice(COOKIE.length+1).match(/^(\d{13})\.(\d+)\.([a-f0-9]{64})$/);if(!m||Number(m[1])<Date.now()||Number(m[1])>Date.now()+MAX_AGE*1000)return false;const mac=crypto.createHmac('sha256',SESSION_SECRET).update('sdl-store:'+m[1]+'.'+m[2]).digest('hex');if(!safeEqual(mac,m[3]))return false;return Number(await rpc('sdl_store_version',{}))===Number(m[2])}
function page(title, body) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive"><meta name="theme-color" content="#060c15">
<title>${escapeHtml(title)} | Sangre de Luna</title>
<style>
:root{--bg:#050a12;--ink:#f2f7ff;--muted:#a1b2c7;--line:#2a4057;--lunar:#a8d6f7;--gold:#d5b77a}*{box-sizing:border-box}
body{margin:0;min-height:100svh;background:radial-gradient(ellipse at 78% 12%,#22394d 0,transparent 30%),radial-gradient(ellipse at 8% 95%,#111a30 0,transparent 42%),var(--bg);color:var(--ink);font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
body:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.27;background-image:radial-gradient(1px 1px at 9% 19%,white 99%,transparent),radial-gradient(1px 1px at 43% 12%,white 99%,transparent),radial-gradient(1px 1px at 80% 33%,white 99%,transparent),radial-gradient(1px 1px at 64% 69%,white 99%,transparent)}
a{color:inherit;text-decoration:none}.wrap{width:min(1080px,92%);margin:auto}.top{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0;border-bottom:1px solid #ffffff20}.brand{display:flex;align-items:center;gap:12px;font-weight:800;letter-spacing:.04em}.brand img{width:58px;max-height:52px;object-fit:contain}.tag{font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--lunar)}.pill{border:1px solid #50728c;border-radius:999px;padding:9px 15px;background:#102337a0;font-size:.84rem;white-space:nowrap}
main{position:relative;z-index:1;padding:58px 0 95px}.eyebrow{color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:.23em;font-size:.76rem}.hero{text-align:center;max-width:850px;margin:0 auto 45px}.hero h1{font-size:clamp(2.4rem,7vw,5.1rem);letter-spacing:-.06em;font-family:Georgia,serif;line-height:1.08;font-weight:500;margin:14px 0 22px}.lead{font-size:clamp(1rem,2vw,1.18rem);color:var(--muted);max-width:680px;margin:0 auto}.moon{width:92px;height:92px;border-radius:50%;background:radial-gradient(circle at 32% 30%,#f7fcff,#9ab6cc 55%,#607996);box-shadow:0 0 58px #7cc7fc45;position:relative;margin:0 auto 22px}.moon:after{content:"";position:absolute;inset:0;transform:translate(18px,-5px);border-radius:50%;background:#081321}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.card{border:1px solid var(--line);border-radius:20px;overflow:hidden;background:linear-gradient(135deg,#0b1826,#101c2b);box-shadow:0 18px 40px #0004}.product-art{height:240px;display:grid;place-items:center;position:relative;overflow:hidden;background:radial-gradient(circle at 50% 27%,#273d53,transparent 65%),#0b121c}.product-art:after{content:"";position:absolute;inset:auto 0 0;height:50px;background:linear-gradient(transparent,#0b121c)}.product-art svg{width:68%;max-height:205px;filter:drop-shadow(0 20px 17px #0009)}.product-info{padding:20px 22px}.product-info h2{margin:4px 0 8px;font-size:1.15rem}.product-info p{color:var(--muted);font-size:.91rem;margin:0 0 18px}.sdl-shirt-proposal{position:relative;width:100%;height:100%;display:grid;place-items:center}.sdl-shirt-garment{position:relative;width:80%;height:90%}.sdl-shirt-garment svg{width:100%!important;height:100%!important;max-height:none!important}.sdl-shirt-garment img{position:absolute;left:34%;top:32%;width:32%;height:30%;object-fit:contain;mix-blend-mode:screen}.sdl-shirt-proposal>span{position:absolute;bottom:8px;font-size:10px;color:#d5e8f7;background:#0b1724ee;padding:3px 8px;border-radius:8px}.sdl-shirt-duo{display:grid;grid-template-columns:1fr 1fr;gap:5px;width:97%;height:100%;align-items:center}.sdl-shirt-mini{width:100%;aspect-ratio:240/220;position:relative}.sdl-shirt-mini svg{width:100%!important;height:100%!important;max-height:none!important}.sdl-shirt-mini img{position:absolute;left:31%;top:30%;width:38%;height:34%;object-fit:contain;mix-blend-mode:screen}.sdl-shirt-mini>span{position:absolute;bottom:3%;left:0;right:0;text-align:center;color:#a9c2d7;font-size:8px;letter-spacing:.1em}.sdl-back-print{position:absolute;left:30%;top:31%;width:40%;height:37%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#d8e7f1;text-align:center}.sdl-back-print b{font-size:23px;font-weight:400;line-height:1}.sdl-back-print small{font-size:7px;line-height:1.1;font-family:Georgia,serif}.sdl-chris-duo .sdl-shirt-mini{isolation:isolate}.sdl-chris-print{position:absolute;left:31%;top:29%;width:38%;height:53%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;overflow:hidden;border:1px solid #b99b58a0;border-radius:4px;background:#090c10}.sdl-chris-print img{position:static;width:100%;height:76%;object-fit:contain;mix-blend-mode:normal;background:#090d13}.sdl-chris-print strong{font:700 9px Georgia,serif;letter-spacing:.13em;color:#e4c68a;line-height:1.4}.sdl-chris-print small{font-size:5px;letter-spacing:.13em;color:#caa65f}.sdl-chris-back{position:absolute;left:31%;top:31%;width:38%;height:48%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#e0bd77}.sdl-chris-back>span{font-size:24px;line-height:1.1}.sdl-chris-back strong{font:700 8px Georgia,serif;letter-spacing:.045em}.sdl-chris-back small{font:6px Georgia,serif;color:#b9a080}.sdl-chris-duo .sdl-shirt-mini>span{bottom:1%}
.sdl-character-print{position:absolute;left:31%;top:29%;width:38%;height:53%;display:flex;flex-direction:column;align-items:center;overflow:hidden;border:1px solid var(--character-color);border-radius:4px;background:#090c10}.sdl-character-print img{position:static;width:100%;height:76%;object-fit:contain;mix-blend-mode:normal;background:#090d13}.sdl-character-print strong{font:700 9px Georgia,serif;letter-spacing:.08em;color:var(--character-color);line-height:1.4}.sdl-character-print small{font:5px Georgia,serif;color:var(--character-color);letter-spacing:.08em}.catalog-table-wrap{overflow-x:auto;border:1px solid #354d63;border-radius:16px}.catalog-table{width:100%;border-collapse:collapse;min-width:720px;background:#0b1725}.catalog-table input,.catalog-table textarea{background:#071521;color:#eaf3ff;border:1px solid #536c84;border-radius:8px;padding:9px;width:100%;font:inherit}.catalog-table .small-save{margin-top:7px;padding:7px 14px;font-size:.8rem}.catalog-table th,.catalog-table td{text-align:left;border-bottom:1px solid #273c50;padding:12px 14px;font-size:.85rem}.catalog-table th{color:#a9cde6;background:#102338}.catalog-table td{color:#d9e8f5}.catalog-nav{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:22px 0 4px}.catalog-nav a{border:1px solid #42627b;border-radius:99px;padding:8px 15px;color:#e5f5ff;font-size:.83rem;background:#0f2434;transition:.16s}.catalog-nav a:hover{border-color:#a4d9f5;background:#172f43}
.catalog-section{margin:45px 0 65px;scroll-margin-top:22px}.section-head{margin:0 0 22px}.section-head h2{font:500 clamp(2rem,4vw,3rem) Georgia,serif;margin:5px 0 4px}.section-head p{margin:0;color:var(--muted)}.product-info h3{margin:14px 0 8px;font-size:1.12rem;line-height:1.3}.product-top{display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap}.product-code{color:#7596ad;font-size:.67rem;letter-spacing:.035em}
.product-art{border-bottom:2px solid var(--product-accent,#84c5ef);background:radial-gradient(circle at 50% 30%,color-mix(in srgb,var(--product-accent) 20%,transparent),transparent 70%),#0b121c}.product-art img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 22%}.product-art-logo img{object-fit:contain;width:80%;height:80%;filter:drop-shadow(0 15px 15px #000)}.product-art-scenery img{object-position:center center}.image-note{position:absolute;z-index:2;left:12px;bottom:12px;padding:5px 8px;border-radius:99px;color:#e9f4ff;background:#05101ccf;border:1px solid #607e9866;font-size:.67rem;letter-spacing:.015em}.product-art::after{pointer-events:none}
.concept{border-top:1px solid #34495b;padding-top:12px!important;color:#a8c7da!important}.concept b{color:#e9f5ff}
@media(max-width:750px){.catalog-nav{gap:8px}.catalog-nav a{font-size:.75rem;padding:8px 11px}.catalog-section{margin-bottom:52px}}
.badge{display:inline-block;color:#9dd7fe;text-transform:uppercase;font-size:.69rem;font-weight:700;letter-spacing:.13em;border:1px solid #486983;border-radius:99px;padding:5px 10px}.note{margin:34px 0 0;border:1px dashed #456078;padding:18px 22px;border-radius:12px;color:var(--muted);font-size:.9rem}.login{max-width:440px;margin:0 auto;border:1px solid #3b536a;border-radius:22px;background:#0b1725e5;padding:35px;box-shadow:0 20px 70px #0006}.login h1{font:500 2.45rem Georgia,serif;margin:10px 0 16px}.login p{color:var(--muted)}.login label{font-size:.85rem;display:block;margin:22px 0 8px}.login input{width:100%;border:1px solid #4b6984;border-radius:12px;background:#08121c;color:var(--ink);font-size:1rem;padding:13px}.btn{background:linear-gradient(120deg,#aacfea,#d7eaf6);border:0;border-radius:100px;padding:12px 22px;color:#071420;font-size:.94rem;font-weight:800;cursor:pointer}.login .btn{width:100%;margin-top:20px}.error{color:#ffd4d4!important;background:#6c26342f;padding:10px;border-radius:8px}.logout{display:inline-block}.logout button{color:#daeafb;background:#1b3242;border:1px solid #47637c;border-radius:99px;cursor:pointer;padding:8px 14px}.change-panel{margin:30px 0;border:1px solid #536b82;border-radius:18px;padding:22px;background:#0b1725}.change-panel summary{cursor:pointer;font-weight:750;color:#d6eafe}.change-panel label{display:block;margin:14px 0 5px;font-size:.9rem}.change-panel input{display:block;width:min(440px,100%);padding:12px;border-radius:9px;border:1px solid #526a84;color:#fff;background:#07121f}.change-panel .btn{margin-top:19px}.meta{text-align:center;color:#94b0c9;margin:32px auto 0;font-size:.9rem}.foot{border-top:1px solid #ffffff20;padding:22px 0;text-align:center;color:#70869d;font-size:.78rem}
@media(max-width:750px){.grid{grid-template-columns:1fr}.product-art{height:210px}.login{padding:25px}.brand img{width:45px}.top{gap:10px}.tag{font-size:.61rem}}
</style></head><body><div class="wrap"><header class="top"><a class="brand" href="/"><img src="/assets/logo-oficial.png" alt="Logo oficial"><span>SANGRE DE LUNA<br><small class="tag">Laboratorio creativo</small></span></a><span class="pill">Acceso privado</span></header><main>${body}</main><footer class="foot">© Sangre de Luna · Propuesta en desarrollo, sin ventas activas.</footer></div></body></html>`;
}
function shirtSvg(){
  const shape='<svg viewBox="0 0 240 220" aria-hidden="true"><path fill="#151d28" stroke="#66839d" stroke-width="2.5" d="M64 28 L91 14 Q120 33 149 14 L176 28 L220 73 L187 111 L170 96 L170 205 L70 205 L70 96 L53 111 L20 73 Z"/><path d="M91 14 Q120 64 149 14" fill="none" stroke="#66839d" stroke-width="2"/></svg>';
  return '<div class="sdl-shirt-duo"><div class="sdl-shirt-mini">'+shape+'<img src="/assets/logo-oficial.png" alt="Logotipo original al frente"><span>FRENTE</span></div><div class="sdl-shirt-mini">'+shape+'<div class="sdl-back-print"><b>☾</b><small>EL LEGADO<br>DE LA LUNA</small></div><span>ESPALDA</span></div></div>';
}
function chrisShirtSvg(){
  const shape='<svg viewBox="0 0 240 220" aria-hidden="true"><path fill="#13171c" stroke="#8e7856" stroke-width="2.5" d="M64 28 L91 14 Q120 33 149 14 L176 28 L220 73 L187 111 L170 96 L170 205 L70 205 L70 96 L53 111 L20 73 Z"/><path d="M91 14 Q120 64 149 14" fill="none" stroke="#8e7856" stroke-width="2"/></svg>';
  return '<div class="sdl-shirt-duo sdl-chris-duo"><div class="sdl-shirt-mini">'+shape+'<div class="sdl-chris-print"><img src="/assets/chris.webp" alt="Retrato original de Chris sin modificaciones"/><strong>CHRIS</strong><small>EDICIÓN DORADA</small></div><span>FRENTE</span></div><div class="sdl-shirt-mini">'+shape+'<div class="sdl-chris-back"><span aria-hidden="true">☾</span><strong>SANGRE DE LUNA</strong><small>EL LEGADO CONTINÚA</small></div><span>ESPALDA</span></div></div>';
}
function characterShirtSvg(name,image,color,edition,caption){
 const shape='<svg viewBox="0 0 240 220" aria-hidden="true"><path fill="#131820" stroke="'+color+'" stroke-width="2.5" d="M64 28 L91 14 Q120 33 149 14 L176 28 L220 73 L187 111 L170 96 L170 205 L70 205 L70 96 L53 111 L20 73 Z"/><path d="M91 14 Q120 64 149 14" fill="none" stroke="'+color+'" stroke-width="2"/></svg>';
 return '<div class="sdl-shirt-duo sdl-chris-duo"><div class="sdl-shirt-mini">'+shape+'<div class="sdl-character-print" style="--character-color:'+color+'"><img src="'+image+'" loading="lazy" alt="Retrato original de '+name+' sin modificaciones"><strong>'+name.toUpperCase()+'</strong><small>'+edition.toUpperCase()+'</small></div><span>FRENTE</span></div><div class="sdl-shirt-mini">'+shape+'<div class="sdl-chris-back" style="color:'+color+'"><span aria-hidden="true">☾</span><strong>SANGRE DE LUNA</strong><small>'+caption+'</small></div><span>ESPALDA</span></div></div>';
}
function hoodieSvg(){
return '<svg viewBox="0 0 240 220" role="img" aria-label="Boceto de sudadera azul oscuro"><path fill="#15263c" stroke="#728aa5" stroke-width="2.5" d="M81 31 Q82 5 120 4 Q158 5 159 31 L186 47 L217 178 L186 191 L170 131 L170 209 L70 209 L70 131 L54 191 L23 178 L54 47 Z"/><path fill="#0a1625" stroke="#728aa5" d="M81 31 Q120 78 159 31 Q120 97 81 31Z"/><circle cx="120" cy="116" r="22" fill="#bedef4"/><circle cx="132" cy="110" r="22" fill="#15263c"/><path d="M90 156 H150" stroke="#c7a86a" stroke-width="2"/><text x="120" y="171" fill="#e1ecf8" font-family="Georgia" font-size="12" text-anchor="middle">EL LEGADO</text></svg>';
}
function mugSvg(){
return '<svg viewBox="0 0 240 220" role="img" aria-label="Boceto de taza lunar"><path fill="#d2dce5" stroke="#7890a4" stroke-width="3" d="M44 57 H171 V183 Q103 209 44 183Z"/><path fill="none" stroke="#a8bdce" stroke-width="16" d="M171 78 H188 Q218 78 218 120 Q218 158 177 158"/><path fill="none" stroke="#41576c" stroke-width="2" d="M46 57 H169"/><circle cx="109" cy="111" r="29" fill="#243a50"/><circle cx="123" cy="105" r="29" fill="#d2dce5"/><text x="107" y="166" fill="#243a50" font-family="Georgia" font-size="12" text-anchor="middle">SANGRE DE LUNA</text></svg>';
}
async function catalogConfigurationPanel(){
 const catalog=require('../data/tienda-catalogo.json');
 const edits=await rpc('sdl_store_draft_list',{p_admin_secret:SESSION_SECRET});
 const bySku=new Map(edits.map(x=>[x.sku,x]));
 const rows=catalog.products.map(p=>{const d=bySku.get(p.sku)||p;return '<tr><td>'+escapeHtml(p.sku)+'</td><td><form id="edit-'+escapeHtml(p.sku)+'" method="post" action="'+PREVIEW_PATH+'"><input type="hidden" name="action" value="save_product"><input type="hidden" name="sku" value="'+escapeHtml(p.sku)+'"></form><input form="edit-'+escapeHtml(p.sku)+'" name="product_name" maxlength="120" required value="'+escapeHtml(d.name)+'" aria-label="Nombre de '+escapeHtml(p.sku)+'"></td><td>'+escapeHtml(p.collection)+'</td><td><input form="edit-'+escapeHtml(p.sku)+'" name="retail_usd" inputmode="decimal" type="number" min="0.01" max="10000" step="0.01" value="'+(d.retail_usd==null?'':escapeHtml(d.retail_usd))+'" placeholder="Sin definir" aria-label="Precio USD"></td><td><textarea form="edit-'+escapeHtml(p.sku)+'" name="product_description" rows="2" maxlength="700" placeholder="Descripción">'+escapeHtml(d.description||'')+'</textarea><button form="edit-'+escapeHtml(p.sku)+'" class="btn small-save" type="submit">Guardar</button></td></tr>'}).join('');
 return '<section class="catalog-section" id="configuracion"><div class="section-head"><span class="eyebrow">Administración · Configuración</span><h2>Base de productos</h2><p>'+catalog.productCount+' productos estructurados · '+catalog.collections.length+' colecciones · moneda USD. No hay ventas activas.</p></div><div class="catalog-table-wrap"><table class="catalog-table"><thead><tr><th>SKU</th><th>Producto</th><th>Colección</th><th>Precio</th><th>Estado</th></tr></thead><tbody>'+rows+'</tbody></table></div><p class="note">Los datos de producto están guardados en un catálogo de configuración. Las imágenes actuales son solo referencias. Precios, tallas definitivas, proveedor, stock e impresión se completarán antes de activar compras.</p></section>';
}
async function catalogPage(){
  const products=[
    {id:'SDL-ORI-001',collection:'Origen',name:'Camiseta Origen',desc:'Camiseta negra con el logotipo oficial plateado. Diseño limpio para llevar la identidad de Sangre de Luna.',concept:'Logotipo oficial · negro y plata',art:shirtSvg(),kind:'graphic',accent:'#a6c9e2'},
    {id:'SDL-ORI-002',collection:'Origen',name:'Camiseta La Ciudadela',desc:'Prenda azul noche con una composición inspirada en el paisaje y la luna de la Ciudadela.',concept:'Ciudadela · azul nocturno',image:'/assets/hero.webp',kind:'scenery',accent:'#8abfe1'},
    {id:'SDL-ORI-003',collection:'Origen',name:'Sudadera El Legado',desc:'Sudadera de inspiración minimalista: luna plateada y detalles discretos en azul profundo.',concept:'Luna creciente · azul profundo',art:hoodieSvg(),kind:'graphic',accent:'#a8c9f3'},
    {id:'SDL-ORI-004',collection:'Origen',name:'Taza Luna Primera',desc:'Taza coleccionable con marca lunar. Propuesta inicial con combinación negro, plata y blanco.',concept:'Luna · plata y negro',art:mugSvg(),kind:'graphic',accent:'#d2dfe9'},
    {id:'SDL-ORI-005',collection:'Origen',name:'Póster El Reino Lunar',desc:'Lámina vertical cinematográfica de la Ciudadela, la luna y sus paisajes emblemáticos.',concept:'Arte de la Ciudadela · póster',image:'/assets/admin-ciudadela-bg.webp',kind:'scenery',accent:'#94c6df'},
    {id:'SDL-ORI-006',collection:'Origen',name:'Stickers del Universo',desc:'Propuesta de pegatinas con logotipo y elementos narrativos: luna, ciudadela y estrellas.',concept:'Logotipo oficial · símbolos',image:'/assets/logo-oficial.png',kind:'logo',accent:'#bfcde2'},
    {id:'SDL-PER-001',collection:'Personajes',name:'Camiseta Chris — Edición Dorada',desc:'Dos vistas conceptuales de una camiseta negra: retrato oficial intacto de Chris en el frente y emblema lunar dorado discreto en la espalda.',concept:'Retrato original sin retoques · negro y oro · frente y espalda',art:chrisShirtSvg(),kind:'graphic',accent:'#d6b16a'},
    {id:'SDL-PER-002',collection:'Personajes',name:'Camiseta Gabriel — Edición Blanca',desc:'Dos vistas de una camiseta negra: retrato original de Gabriel al frente, composición blanco lunar y sello plateado posterior.',concept:'Gabriel sin alteraciones · blanco y plata · frente y espalda',art:characterShirtSvg('Gabriel','/assets/gabriel.webp','#e4ebf7','Edición Blanca','LA LUZ PERMANECE'),kind:'graphic',accent:'#e4ebf7'},
    {id:'SDL-PER-003',collection:'Personajes',name:'Camiseta Ella — Edición Plata',desc:'Propuesta de camiseta negra en dos vistas: fotografía original de Ella al frente y distintivo lunar plateado en la espalda.',concept:'Ella sin alteraciones · plata · frente y espalda',art:characterShirtSvg('Ella','/assets/ella.webp','#ccd3e0','Edición Plata','BAJO LA MISMA LUNA'),kind:'graphic',accent:'#ccd3e0'},
    {id:'SDL-PER-004',collection:'Personajes',name:'Póster Varkos — Guardián Azul',desc:'Retrato original de Varkos con una composición azul profundo, sobria y estratégica.',concept:'Varkos · azul profundo',image:'/assets/varkos.webp',kind:'portrait',accent:'#579ee1'},
    {id:'SDL-PER-005',collection:'Personajes',name:'Taza Nine — Edición Violeta',desc:'Rostro original de Nine en una composición elegante con símbolos lunares morados.',concept:'Nine · violeta',image:'/assets/nine.webp',kind:'portrait',accent:'#b094eb'},
    {id:'SDL-PER-006',collection:'Personajes',name:'Libreta Ethan — Edición Carmesí',desc:'Retrato original de Ethan y acentos rojo oscuro, sin recursos visuales violentos.',concept:'Ethan · rojo carmesí',image:'/assets/ethan.webp',kind:'portrait',accent:'#ce6c70'}
  ];
  const renderCard=(p)=>{
    const art=p.art||'<img src="'+escapeHtml(p.image)+'" loading="lazy" alt="'+escapeHtml((p.kind==='portrait'?'Retrato original de ':'Referencia visual de ')+p.name)+'">';
    return '<article class="card" style="--product-accent:'+escapeHtml(p.accent)+'">'+
      '<div class="product-art product-art-'+escapeHtml(p.kind)+'">'+art+
      '<span class="image-note">'+(p.kind==='portrait'?'Rostro oficial de referencia':'Concepto visual inicial')+'</span></div>'+
      '<div class="product-info"><div class="product-top"><span class="badge">'+escapeHtml(p.collection)+'</span><span class="product-code">'+escapeHtml(p.id)+'</span></div>'+
      '<h3>'+escapeHtml(p.name)+'</h3><p>'+escapeHtml(p.desc)+'</p>'+
      '<p class="concept"><b>Dirección artística:</b> '+escapeHtml(p.concept)+'</p>'+
      '<span class="tag">Borrador · pendiente de aprobación</span></div></article>';
  };
  const origen=products.filter(p=>p.collection==='Origen').map(renderCard).join('');
  const personajes=products.filter(p=>p.collection==='Personajes').map(renderCard).join('');
  const body='<div class="hero"><div class="moon" aria-hidden="true"></div><div class="eyebrow">Etapa 2 · Catálogo privado</div>'+
    '<h1>El legado de la luna</h1><p class="lead">12 artículos propuestos para la primera colección. Los retratos mostrados proceden de los archivos oficiales existentes en Sangre de Luna. Revisa nombres, diseño y descripción antes de aprobarlos.</p>'+
    '<div class="catalog-nav"><a href="#coleccion-origen">Colección Origen · 6</a><a href="#coleccion-personajes">Colección Personajes · 6</a><a href="#configuracion">Configuración de productos</a></div></div>'+
    '<section id="coleccion-origen" class="catalog-section"><div class="section-head"><span class="eyebrow">Colección 01</span><h2>Origen</h2><p>Identidad de marca, emblemas narrativos y paisajes de la Ciudadela.</p></div><div class="grid" aria-label="Productos de la colección Origen">'+origen+'</div></section>'+
    '<section id="coleccion-personajes" class="catalog-section"><div class="section-head"><span class="eyebrow">Colección 02</span><h2>Personajes</h2><p>Ediciones con los rostros originales de Chris, Gabriel, Ella, Varkos, Nine y Ethan.</p></div><div class="grid" aria-label="Productos de personajes">'+personajes+'</div></section>'+
    (await catalogConfigurationPanel())+
    '<p class="note"><b>CATÁLOGO EN REVISIÓN:</b> Las imágenes son referencias de diseño, no fotografías del producto final ni archivos listos para impresión. No se han publicado artículos en Fourthwall, no hay precios ni compras activas. Fabricación, tamaños, comisiones y envíos se verificarán antes de la venta. Se requiere confirmar los derechos comerciales de las imágenes de personajes.</p>'+
    '<details class="change-panel"><summary>🔐 Cambiar contraseña de acceso</summary><p>Indica la clave actual y elige otra de al menos 12 caracteres.</p><form action="'+PREVIEW_PATH+'" method="post"><input type="hidden" name="action" value="change_password"><label for="current_password">Contraseña actual</label><input id="current_password" name="current_password" type="password" required minlength="10" maxlength="128"><label for="new_password">Nueva contraseña</label><input id="new_password" name="new_password" type="password" required minlength="12" maxlength="128"><label for="confirm_password">Confirmar contraseña</label><input id="confirm_password" name="confirm_password" type="password" required minlength="12" maxlength="128"><button class="btn" type="submit">Guardar nueva contraseña</button></form></details>'+ '<form class="logout" action="'+PREVIEW_PATH+'" method="post"><input type="hidden" name="action" value="logout"><button type="submit">Cerrar sesión privada</button></form>';
  return page('12 artículos · Estudio privado',body);
}
function noticePage(message){return page('Seguridad de la tienda','<section class="login"><h1>Seguridad de la tienda</h1><p>'+escapeHtml(message)+'</p><a class="pill" href="'+PREVIEW_PATH+'">Volver a entrar</a></section>')}
function loginPage(error=false){
  return page('Acceso privado a tienda','<section class="login"><span class="eyebrow">Vista previa protegida</span><h1>Solo para el creador</h1><p>La Tienda Oficial está en preparación. Introduce la clave temporal para ver y aprobar los bocetos.</p>'+(error?'<p role="alert" class="error">Clave incorrecta. Revisa los caracteres e inténtalo de nuevo.</p>':'')+'<form action="'+PREVIEW_PATH+'" method="post"><label for="password">Clave temporal</label><input id="password" type="password" name="password" required minlength="10" maxlength="128" autocomplete="off" autofocus><button class="btn" type="submit">Entrar al estudio privado</button></form></section><p class="meta">El público solo verá la página «Próximamente».</p>');
}
function respond(res,code,html){
 res.statusCode=code;res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);
}
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store, max-age=0');
 res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Content-Security-Policy',"default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
 if(!DB_URL.startsWith('https://') || !DB_KEY || SESSION_SECRET.length<48) {
  return respond(res,503,page('Configuración pendiente','<div class="hero"><h1>Estudio temporalmente cerrado</h1><p class="lead">El acceso privado se está configurando.</p></div>'));
 }
 if(req.method==='POST'){
  // Vercel rewrites may set an internal Host differing from the browser Origin.
  // Reject explicit cross-site browser submissions; session cookies remain SameSite=Strict,
  // and a password change independently requires both the session and current password.
  const fetchSite=String(req.headers['sec-fetch-site']||'').toLowerCase();
  if(fetchSite==='cross-site')return respond(res,403,noticePage('Solicitud no autorizada.'));


  const declaredSize=Number(req.headers['content-length']||0);
  if(declaredSize>2048) return respond(res,413,loginPage(true));
  let data='';
  try{
   if(typeof req.body==='string') data=req.body;
   else if(Buffer.isBuffer(req.body)) data=req.body.toString('utf8');
   else if(req.body && typeof req.body==='object') data=new URLSearchParams(req.body).toString();
   else for await (const part of req) {data+=part.toString('utf8');if(data.length>2048)break;}
   if(data.length>2048) return respond(res,413,loginPage(true));
   const p=new URLSearchParams(data);
   if(p.get('action')==='save_product'){
    if(!(await isValidSession(req)))return respond(res,401,noticePage('Debes iniciar sesión.'));
    const sku=p.get('sku')||'',name=p.get('product_name')||'',description=p.get('product_description')||'',raw=p.get('retail_usd')||'';
    const price=raw===''?null:Number(raw);
    if(raw!==''&&!Number.isFinite(price))return respond(res,400,noticePage('Precio inválido.'));
    const ok=await rpc('sdl_store_draft_save',{p_admin_secret:SESSION_SECRET,p_sku:sku,p_name:name,p_description:description,p_retail_usd:price});
    if(!ok)return respond(res,400,noticePage('No fue posible guardar el producto. Revisa los datos.'));
    res.statusCode=303;res.setHeader('Location',PREVIEW_PATH+'#configuracion');return res.end();
   }
   if(p.get('action')==='change_password'){
    if(!(await isValidSession(req)))return respond(res,401,noticePage('La sesión expiró. Inicia sesión.'));
    const current=p.get('current_password')||'',next=p.get('new_password')||'',confirm=p.get('confirm_password')||'';
    if(next!==confirm||next.length<12||next.length>128||next===current)return respond(res,400,noticePage('Revisa las contraseñas.'));
    const ok=await rpc('sdl_store_change',{p_current:current,p_next:next,p_rate_key:rateKey(req)});
    if(!ok)return respond(res,401,noticePage('Contraseña actual incorrecta o demasiados intentos.'));
    res.setHeader('Set-Cookie',COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');return respond(res,200,noticePage('Contraseña actualizada. Las sesiones previas fueron invalidadas. Entra con la nueva clave.'));
   }
   if(p.get('action')==='logout'){
    res.setHeader('Set-Cookie',COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    res.statusCode=303;res.setHeader('Location',PREVIEW_PATH);return res.end();
   }
   const pass=p.get('password')||'';
   const check=await rpc('sdl_store_auth',{p_password:pass,p_rate_key:rateKey(req)});
   if(check&&check[0]&&check[0].valid){
    const session=createSession(check[0].credential_version);
    res.setHeader('Set-Cookie',COOKIE+'='+session+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age='+MAX_AGE);
    res.statusCode=303;res.setHeader('Location',PREVIEW_PATH);return res.end();
   }
   return respond(res,401,loginPage(true));
  }catch(e){return respond(res,503,noticePage('Servicio de seguridad temporalmente no disponible.'));}
 }
 if(req.method!=='GET') {res.setHeader('Allow','GET, POST');return respond(res,405,loginPage(false));}
 try{return respond(res,200,(await isValidSession(req))?await catalogPage():loginPage());}catch(e){return respond(res,503,noticePage('Servicio de seguridad temporalmente no disponible.'));}
};
