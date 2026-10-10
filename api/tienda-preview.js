const crypto = require('node:crypto');

const COOKIE = '__Host-sdl_store_preview';
const PREVIEW_PATH = '/tienda-privada';
const MAX_AGE = 8 * 60 * 60;
const HASH = process.env.SDL_STORE_PREVIEW_KEY_SHA256 || '';
const SESSION_SECRET = process.env.SDL_STORE_PREVIEW_SESSION_SECRET || '';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
function createSession() {
  const expiry = Date.now() + MAX_AGE * 1000;
  const mac = crypto.createHmac('sha256', SESSION_SECRET).update('sdl-store:' + expiry).digest('hex');
  return expiry + '.' + mac;
}
function isValidSession(req) {
  const pairs = String(req.headers.cookie || '').split(';').map(x => x.trim());
  const raw = pairs.find(p => p.startsWith(COOKIE + '='));
  if (!raw) return false;
  const value = raw.slice(COOKIE.length + 1);
  const m = value.match(/^(\d{13})\.([a-f0-9]{64})$/);
  if (!m || Number(m[1]) < Date.now() || Number(m[1]) > Date.now() + MAX_AGE * 1000) return false;
  const mac = crypto.createHmac('sha256', SESSION_SECRET).update('sdl-store:' + m[1]).digest('hex');
  return safeEqual(mac, m[2]);
}
function page(title, body) {
  return \`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive"><meta name="theme-color" content="#060c15">
<title>\${escapeHtml(title)} | Sangre de Luna</title>
<style>
:root{--bg:#050a12;--ink:#f2f7ff;--muted:#a1b2c7;--line:#2a4057;--lunar:#a8d6f7;--gold:#d5b77a}*{box-sizing:border-box}
body{margin:0;min-height:100svh;background:radial-gradient(ellipse at 78% 12%,#22394d 0,transparent 30%),radial-gradient(ellipse at 8% 95%,#111a30 0,transparent 42%),var(--bg);color:var(--ink);font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
body:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.27;background-image:radial-gradient(1px 1px at 9% 19%,white 99%,transparent),radial-gradient(1px 1px at 43% 12%,white 99%,transparent),radial-gradient(1px 1px at 80% 33%,white 99%,transparent),radial-gradient(1px 1px at 64% 69%,white 99%,transparent)}
a{color:inherit;text-decoration:none}.wrap{width:min(1080px,92%);margin:auto}.top{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0;border-bottom:1px solid #ffffff20}.brand{display:flex;align-items:center;gap:12px;font-weight:800;letter-spacing:.04em}.brand img{width:58px;max-height:52px;object-fit:contain}.tag{font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--lunar)}.pill{border:1px solid #50728c;border-radius:999px;padding:9px 15px;background:#102337a0;font-size:.84rem;white-space:nowrap}
main{position:relative;z-index:1;padding:58px 0 95px}.eyebrow{color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:.23em;font-size:.76rem}.hero{text-align:center;max-width:850px;margin:0 auto 45px}.hero h1{font-size:clamp(2.4rem,7vw,5.1rem);letter-spacing:-.06em;font-family:Georgia,serif;line-height:1.08;font-weight:500;margin:14px 0 22px}.lead{font-size:clamp(1rem,2vw,1.18rem);color:var(--muted);max-width:680px;margin:0 auto}.moon{width:92px;height:92px;border-radius:50%;background:radial-gradient(circle at 32% 30%,#f7fcff,#9ab6cc 55%,#607996);box-shadow:0 0 58px #7cc7fc45;position:relative;margin:0 auto 22px}.moon:after{content:"";position:absolute;inset:0;transform:translate(18px,-5px);border-radius:50%;background:#081321}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.card{border:1px solid var(--line);border-radius:20px;overflow:hidden;background:linear-gradient(135deg,#0b1826,#101c2b);box-shadow:0 18px 40px #0004}.product-art{height:240px;display:grid;place-items:center;position:relative;overflow:hidden;background:radial-gradient(circle at 50% 27%,#273d53,transparent 65%),#0b121c}.product-art:after{content:"";position:absolute;inset:auto 0 0;height:50px;background:linear-gradient(transparent,#0b121c)}.product-art svg{width:68%;max-height:205px;filter:drop-shadow(0 20px 17px #0009)}.product-info{padding:20px 22px}.product-info h2{margin:4px 0 8px;font-size:1.15rem}.product-info p{color:var(--muted);font-size:.91rem;margin:0 0 18px}.badge{display:inline-block;color:#9dd7fe;text-transform:uppercase;font-size:.69rem;font-weight:700;letter-spacing:.13em;border:1px solid #486983;border-radius:99px;padding:5px 10px}.note{margin:34px 0 0;border:1px dashed #456078;padding:18px 22px;border-radius:12px;color:var(--muted);font-size:.9rem}.login{max-width:440px;margin:0 auto;border:1px solid #3b536a;border-radius:22px;background:#0b1725e5;padding:35px;box-shadow:0 20px 70px #0006}.login h1{font:500 2.45rem Georgia,serif;margin:10px 0 16px}.login p{color:var(--muted)}.login label{font-size:.85rem;display:block;margin:22px 0 8px}.login input{width:100%;border:1px solid #4b6984;border-radius:12px;background:#08121c;color:var(--ink);font-size:1rem;padding:13px}.btn{background:linear-gradient(120deg,#aacfea,#d7eaf6);border:0;border-radius:100px;padding:12px 22px;color:#071420;font-size:.94rem;font-weight:800;cursor:pointer}.login .btn{width:100%;margin-top:20px}.error{color:#ffd4d4!important;background:#6c26342f;padding:10px;border-radius:8px}.logout{display:inline-block}.logout button{color:#daeafb;background:#1b3242;border:1px solid #47637c;border-radius:99px;cursor:pointer;padding:8px 14px}.meta{text-align:center;color:#94b0c9;margin:32px auto 0;font-size:.9rem}.foot{border-top:1px solid #ffffff20;padding:22px 0;text-align:center;color:#70869d;font-size:.78rem}
@media(max-width:750px){.grid{grid-template-columns:1fr}.product-art{height:210px}.login{padding:25px}.brand img{width:45px}.top{gap:10px}.tag{font-size:.61rem}}
</style></head><body><div class="wrap"><header class="top"><a class="brand" href="/"><img src="/assets/logo-oficial.png" alt="Logo oficial"><span>SANGRE DE LUNA<br><small class="tag">Laboratorio creativo</small></span></a><span class="pill">Acceso privado</span></header><main>\${body}</main><footer class="foot">© Sangre de Luna · Propuesta en desarrollo, sin ventas activas.</footer></div></body></html>\`;
}
function shirtSvg(){
return '<svg viewBox="0 0 240 220" role="img" aria-label="Boceto de camiseta negra"><path fill="#151d28" stroke="#66839d" stroke-width="2.5" d="M64 28 L91 14 Q120 33 149 14 L176 28 L220 73 L187 111 L170 96 L170 205 L70 205 L70 96 L53 111 L20 73 Z"/><path d="M91 14 Q120 64 149 14" fill="none" stroke="#66839d" stroke-width="2"/><circle cx="120" cy="102" r="24" fill="#a8c2d3"/><circle cx="132" cy="94" r="24" fill="#151d28"/><text x="120" y="149" fill="#dbeaf2" font-family="Georgia" font-size="14" text-anchor="middle">SANGRE DE LUNA</text></svg>';
}
function hoodieSvg(){
return '<svg viewBox="0 0 240 220" role="img" aria-label="Boceto de sudadera azul oscuro"><path fill="#15263c" stroke="#728aa5" stroke-width="2.5" d="M81 31 Q82 5 120 4 Q158 5 159 31 L186 47 L217 178 L186 191 L170 131 L170 209 L70 209 L70 131 L54 191 L23 178 L54 47 Z"/><path fill="#0a1625" stroke="#728aa5" d="M81 31 Q120 78 159 31 Q120 97 81 31Z"/><circle cx="120" cy="116" r="22" fill="#bedef4"/><circle cx="132" cy="110" r="22" fill="#15263c"/><path d="M90 156 H150" stroke="#c7a86a" stroke-width="2"/><text x="120" y="171" fill="#e1ecf8" font-family="Georgia" font-size="12" text-anchor="middle">EL LEGADO</text></svg>';
}
function mugSvg(){
return '<svg viewBox="0 0 240 220" role="img" aria-label="Boceto de taza lunar"><path fill="#d2dce5" stroke="#7890a4" stroke-width="3" d="M44 57 H171 V183 Q103 209 44 183Z"/><path fill="none" stroke="#a8bdce" stroke-width="16" d="M171 78 H188 Q218 78 218 120 Q218 158 177 158"/><path fill="none" stroke="#41576c" stroke-width="2" d="M46 57 H169"/><circle cx="109" cy="111" r="29" fill="#243a50"/><circle cx="123" cy="105" r="29" fill="#d2dce5"/><text x="107" y="166" fill="#243a50" font-family="Georgia" font-size="12" text-anchor="middle">SANGRE DE LUNA</text></svg>';
}
function catalogPage(){
  const products=[
    ['Camiseta · Origen','Línea negra y plata, símbolo lunar y firma de la serie.',shirtSvg()],
    ['Sudadera · El legado','Edición azul noche con composición lunar minimalista.',hoodieSvg()],
    ['Taza · Luna Primera','Propuesta de regalo coleccionable con identidad narrativa.',mugSvg()]
  ];
  const cards=products.map(([name,desc,art])=>'<article class="card"><div class="product-art">'+art+'</div><div class="product-info"><span class="badge">Boceto privado</span><h2>'+name+'</h2><p>'+desc+'</p><span class="tag">Sin precio ni compra activa</span></div></article>').join('');
  const body='<div class="hero"><div class="moon" aria-hidden="true"></div><div class="eyebrow">Etapa 1 · Solo propietario</div><h1>El legado de la luna</h1><p class="lead">Primera vista reservada de la Tienda Oficial de Sangre de Luna. Aquí evaluaremos los conceptos y corregiremos cada producto antes de publicarlo.</p></div><section class="grid" aria-label="Conceptos de producto">'+cards+'</section><p class="note"><b>ESTADO:</b> Son representaciones conceptuales, no archivos de impresión. No hay productos publicados en Fourthwall, precios ni pagos habilitados. En esta etapa no subiremos diseños inéditos al repositorio público.</p><form class="logout" action="'+PREVIEW_PATH+'" method="post"><input type="hidden" name="action" value="logout"><button type="submit">Cerrar sesión privada</button></form>';
  return page('Estudio privado de la tienda',body);
}
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
 if(!/^[a-f0-9]{64}$/.test(HASH) || SESSION_SECRET.length<48) {
  return respond(res,503,page('Configuración pendiente','<div class="hero"><h1>Estudio temporalmente cerrado</h1><p class="lead">El acceso privado se está configurando.</p></div>'));
 }
 if(req.method==='POST'){
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
   if(p.get('action')==='logout'){
    res.setHeader('Set-Cookie',COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    res.statusCode=303;res.setHeader('Location',PREVIEW_PATH);return res.end();
   }
   const pass=p.get('password')||'';
   const digest=crypto.createHash('sha256').update(pass,'utf8').digest('hex');
   if(pass.length>=10 && pass.length<=128 && safeEqual(digest,HASH)){
    const session=createSession();
    res.setHeader('Set-Cookie',COOKIE+'='+session+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age='+MAX_AGE);
    res.statusCode=303;res.setHeader('Location',PREVIEW_PATH);return res.end();
   }
   return respond(res,401,loginPage(true));
  }catch(e){return respond(res,400,loginPage(true));}
 }
 if(req.method!=='GET') {res.setHeader('Allow','GET, POST');return respond(res,405,loginPage(false));}
 return respond(res,200,isValidSession(req)?catalogPage():loginPage());
};
