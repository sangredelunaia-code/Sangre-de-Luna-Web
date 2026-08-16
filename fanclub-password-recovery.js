/* SANGRE DE LUNA · RECUPERACIÓN DE CONTRASEÑA DEL FAN CLUB */
(()=>{
  'use strict';
  if(window.__SDL_FAN_PASSWORD_RECOVERY__)return;
  window.__SDL_FAN_PASSWORD_RECOVERY__=true;

  const CFG_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';
  const FN='fanclub-password-recovery';
  const isAdmin=new URLSearchParams(location.search).get('admin')==='1';
  let cfg=null,sb=null,publicInjecting=false;
  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  async function ensureSupabase(){
    if(!window.supabase?.createClient){
      await new Promise((ok,fail)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=ok;s.onerror=fail;document.head.appendChild(s)});
    }
    if(!cfg){const r=await fetch(CFG_URL,{cache:'no-store'});cfg=await r.json()}
    if(!sb)sb=window.supabase.createClient(cfg.url,cfg.key);
    return sb;
  }

  async function invoke(action,payload={},admin=false){
    await ensureSupabase();
    const headers={'Content-Type':'application/json','apikey':cfg.key,'Authorization':`Bearer ${cfg.key}`};
    if(admin){
      const {data}=await sb.auth.getSession();
      const token=data?.session?.access_token;
      if(!token)throw new Error('Tu sesión de administrador expiró. Vuelve a ingresar.');
      headers.Authorization=`Bearer ${token}`;
    }
    const r=await fetch(`${cfg.url}/functions/v1/${FN}`,{method:'POST',headers,body:JSON.stringify({action,...payload})});
    let data={};try{data=await r.json()}catch{}
    if(!r.ok||data.ok===false)throw new Error(data.message||'No se pudo completar la operación.');
    return data;
  }

  function addStyle(){
    if($('#sdl-reset-style'))return;
    const s=document.createElement('style');s.id='sdl-reset-style';s.textContent=`
      .sdl-reset-link{border:0;background:transparent;color:#8ed4ff;padding:8px 0;margin-top:8px;cursor:pointer;font-weight:800;font-size:.78rem;text-decoration:underline;text-underline-offset:4px}
      .sdl-reset-link:hover{color:#fff}.sdl-reset-overlay{position:fixed;inset:0;z-index:25000;display:grid;place-items:center;padding:18px;background:#01050ae8;backdrop-filter:blur(14px)}
      .sdl-reset-box{width:min(520px,95vw);max-height:90svh;overflow:auto;border:1px solid #355a75;border-radius:22px;background:linear-gradient(145deg,#091825,#03090f);box-shadow:0 28px 90px #000c;color:#edf8ff;padding:26px;position:relative}
      .sdl-reset-head{text-align:center}.sdl-reset-head img{width:min(180px,48%);height:auto;object-fit:contain;filter:drop-shadow(0 0 22px #62bfff45)}.sdl-reset-head h2{font:600 2rem Georgia,serif;margin:14px 0 8px}.sdl-reset-head p{color:#9fb3c4;margin:0 0 20px}
      .sdl-reset-close{position:absolute;right:14px;top:14px;width:36px;height:36px;border:1px solid #35536b;border-radius:50%;background:#08131e;color:#fff;cursor:pointer}.sdl-reset-msg{margin:12px 0;padding:11px 13px;border-radius:11px;background:#0a1925;color:#bcd2e2}.sdl-reset-msg.ok{background:#0d281f;color:#b9ffe4}.sdl-reset-msg.err{background:#2b1217;color:#ffd0d5}
      .sdl-reset-field{display:grid;gap:6px;margin:13px 0}.sdl-reset-field label{font-size:.72rem;color:#aec6d8;font-weight:900;letter-spacing:.05em}.sdl-reset-field input{width:100%;padding:12px 13px;border:1px solid #2c4a61;border-radius:12px;background:#040b11;color:#fff;outline:none}.sdl-reset-field input:focus{border-color:#78caff;box-shadow:0 0 0 3px #78caff12}
      .sdl-reset-btn{width:100%;margin-top:12px;padding:13px 17px;border:0;border-radius:999px;background:linear-gradient(135deg,#edf9ff,#8bd5ff 58%,#4ba9e5);color:#05131d;font-weight:900;cursor:pointer}.sdl-reset-btn:disabled{opacity:.55;cursor:wait}
      .sdl-mail-admin{margin:14px 0 18px;padding:16px;border:1px solid #31516a;border-radius:16px;background:#07131d}.sdl-mail-admin h4{margin:0 0 6px;font:600 1.15rem Georgia,serif}.sdl-mail-admin p{margin:5px 0;color:#91a8ba;font-size:.8rem}.sdl-mail-status{display:inline-flex;align-items:center;gap:7px;margin:6px 0 10px;font-size:.72rem;font-weight:900}.sdl-mail-status.ok{color:#88e0bd}.sdl-mail-status.off{color:#f0c57a}.sdl-mail-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.sdl-mail-actions button{padding:8px 11px;border:1px solid #35546c;border-radius:9px;background:#0b1823;color:#d7edfb;cursor:pointer}.sdl-mail-actions button.primary{background:#d9f1ff;color:#07111a;border-color:#d9f1ff;font-weight:900}.sdl-mail-secret{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:10px}.sdl-mail-secret input{min-width:0;padding:10px 11px;border:1px solid #2c4a61;border-radius:10px;background:#040b11;color:#fff}
      @media(max-width:560px){.sdl-mail-secret{grid-template-columns:1fr}.sdl-reset-box{padding:22px 18px}}
    `;document.head.appendChild(s);
  }

  function modal(html){
    $('.sdl-reset-overlay')?.remove();
    const d=document.createElement('div');d.className='sdl-reset-overlay';d.innerHTML=`<div class="sdl-reset-box"><button class="sdl-reset-close" type="button" aria-label="Cerrar">×</button>${html}</div>`;
    document.body.appendChild(d);$('.sdl-reset-close',d).onclick=()=>d.remove();d.addEventListener('click',e=>{if(e.target===d)d.remove()});return d;
  }
  const msg=(host,text,type='')=>{host.innerHTML=`<div class="sdl-reset-msg ${type}">${esc(text)}</div>`};

  async function openForgot(){
    const d=modal(`<div class="sdl-reset-head"><img src="/assets/logo-oficial.png" alt="Sangre de Luna"><h2>Recuperar acceso</h2><p>Escribe el correo con el que te registraste en La Manada.</p></div><form id="sdlForgotForm"><div id="sdlForgotMsg"></div><div class="sdl-reset-field"><label>CORREO</label><input id="sdlForgotEmail" type="email" autocomplete="email" required></div><button class="sdl-reset-btn" type="submit">ENVIAR ENLACE DE RECUPERACIÓN</button></form>`);
    const input=$('#sdlForgotEmail',d),login=$('#fanLoginEmail');if(login?.value)input.value=login.value;
    $('#sdlForgotForm',d).onsubmit=async e=>{e.preventDefault();const b=e.submitter;b.disabled=true;msg($('#sdlForgotMsg',d),'Enviando enlace…');try{const r=await invoke('request',{email:input.value.trim()});msg($('#sdlForgotMsg',d),r.message,'ok');b.remove()}catch(err){msg($('#sdlForgotMsg',d),err.message,'err');b.disabled=false}};
  }

  function openReset(token){
    const d=modal(`<div class="sdl-reset-head"><img src="/assets/logo-oficial.png" alt="Sangre de Luna"><h2>Nueva contraseña</h2><p>Crea una nueva clave para tu acceso a La Manada.</p></div><form id="sdlResetForm"><div id="sdlResetMsg"></div><div class="sdl-reset-field"><label>NUEVA CONTRASEÑA</label><input id="sdlResetPass" type="password" minlength="8" maxlength="72" autocomplete="new-password" required></div><div class="sdl-reset-field"><label>REPETIR CONTRASEÑA</label><input id="sdlResetPass2" type="password" minlength="8" maxlength="72" autocomplete="new-password" required></div><button class="sdl-reset-btn" type="submit">ACTUALIZAR MI CONTRASEÑA</button></form>`);
    $('#sdlResetForm',d).onsubmit=async e=>{e.preventDefault();const a=$('#sdlResetPass',d).value,b=$('#sdlResetPass2',d).value,out=$('#sdlResetMsg',d),btn=e.submitter;if(a.length<8||a.length>72){msg(out,'La contraseña debe tener entre 8 y 72 caracteres.','err');return}if(a!==b){msg(out,'Las contraseñas no coinciden.','err');return}btn.disabled=true;msg(out,'Actualizando contraseña…');try{const r=await invoke('reset',{token,password:a});msg(out,r.message,'ok');btn.remove();const u=new URL(location.href);u.searchParams.delete('restablecer');history.replaceState({},'',u.pathname+u.search+u.hash);setTimeout(()=>{d.remove();$('#fanLoginEmail')?.focus()},2200)}catch(err){msg(out,err.message,'err');btn.disabled=false}};
  }

  async function injectPublic(){
    if(isAdmin)return;
    const form=$('#fanLoginForm');if(!form)return;

    const existing=[...document.querySelectorAll('#sdlForgotButton')];
    if(existing.length){existing.slice(1).forEach(el=>el.remove());return}
    if(publicInjecting)return;

    publicInjecting=true;
    try{
      await ensureSupabase();
      const {data}=await sb.rpc('fanclub_mail_public_status');
      if(!data?.configured)return;
      if($('#sdlForgotButton'))return;
      const b=document.createElement('button');
      b.type='button';
      b.id='sdlForgotButton';
      b.className='sdl-reset-link';
      b.textContent='🔑 ¿Olvidaste tu contraseña?';
      b.onclick=openForgot;
      form.insertAdjacentElement('afterend',b);
    }catch{}finally{publicInjecting=false}
  }

  async function adminStatus(){
    const host=$('#sdlMailAdmin');if(!host)return;
    try{const r=await invoke('admin-status',{},true),c=r.config||{};host.dataset.configured=String(!!c.configured);host.innerHTML=`<h4>🔐 Recuperación de contraseña</h4><div class="sdl-mail-status ${c.configured?'ok':'off'}">${c.configured?'● CORREO CONECTADO':'● FALTA CONECTAR GMAIL'}</div><p>Remitente oficial: <strong>${esc(c.sender_email||'sangredelunaia@gmail.com')}</strong></p><p>Los fans recibirán el correo con el logo oficial, un enlace de un solo uso y vigencia de 30 minutos.</p>${c.configured?'':`<div class="sdl-mail-secret"><input id="sdlGmailAppPass" type="password" autocomplete="off" placeholder="Contraseña de aplicación de Google"><button class="primary" id="sdlSaveGmail" type="button">GUARDAR</button></div><p><strong>No uses tu contraseña normal de Gmail.</strong> Aquí se coloca únicamente una contraseña de aplicación de Google.</p>`}<div id="sdlMailAdminMsg"></div><div class="sdl-mail-actions">${c.configured?'<button id="sdlTestGmail" type="button">ENVIAR CORREO DE PRUEBA</button>':''}</div>`;
      $('#sdlSaveGmail',host)?.addEventListener('click',async()=>{const p=$('#sdlGmailAppPass',host).value.trim(),m=$('#sdlMailAdminMsg',host);if(!p){msg(m,'Escribe la contraseña de aplicación de Google.','err');return}msg(m,'Guardando configuración…');try{await invoke('admin-configure',{app_password:p},true);msg(m,'Correo conectado. Ahora puedes enviar una prueba.','ok');setTimeout(adminStatus,900)}catch(err){msg(m,err.message,'err')}});
      $('#sdlTestGmail',host)?.addEventListener('click',async()=>{const m=$('#sdlMailAdminMsg',host);msg(m,'Enviando prueba…');try{const r=await invoke('admin-test',{},true);msg(m,r.message,'ok')}catch(err){msg(m,err.message,'err')}});
    }catch(err){host.innerHTML=`<h4>🔐 Recuperación de contraseña</h4><div class="sdl-reset-msg err">${esc(err.message)}</div>`}
  }

  function patchMemberButtons(){
    if(!isAdmin)return;
    document.querySelectorAll('[data-fan-member-id]').forEach(base=>{
      const tr=base.closest('tr'),cell=base.parentElement,id=base.dataset.fanMemberId;if(!tr||!cell||!id||cell.querySelector(`[data-sdl-reset-member="${id}"]`))return;
      const b=document.createElement('button');b.className='mini';b.type='button';b.dataset.sdlResetMember=id;b.textContent='Enviar recuperación';b.onclick=async()=>{if(!confirm('¿Enviar un enlace de recuperación de contraseña a este miembro?'))return;b.disabled=true;try{const r=await invoke('admin-send',{member_id:id},true);alert(r.message)}catch(err){alert(err.message)}finally{b.disabled=false}};cell.append(' ',b);
    });
  }

  function injectAdmin(){
    if(!isAdmin)return;
    const table=$('#fanMembersTable');if(!table)return;
    if(!$('#sdlMailAdmin')){const box=document.createElement('div');box.id='sdlMailAdmin';box.className='sdl-mail-admin';table.parentElement.insertBefore(box,table);adminStatus()}
    patchMemberButtons();
  }

  async function init(){
    addStyle();
    const token=new URLSearchParams(location.search).get('restablecer');if(token&&!isAdmin)openReset(token);
    injectPublic();injectAdmin();
    const o=new MutationObserver(()=>{injectPublic();injectAdmin();patchMemberButtons()});o.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>o.disconnect(),30000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();