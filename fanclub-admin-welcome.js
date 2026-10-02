/* SANGRE DE LUNA · REENVÍO MANUAL DE BIENVENIDA DESDE ADMIN */
(()=>{
  'use strict';
  if(window.__SDL_FAN_ADMIN_WELCOME__)return;
  window.__SDL_FAN_ADMIN_WELCOME__=true;

  const isAdmin=new URLSearchParams(location.search).get('admin')==='1';
  if(!isAdmin)return;

  const CFG_URL='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/site-config';
  const FN='fanclub-registration-notify';
  let cfg=null,sb=null;
  const $=(s,r=document)=>r.querySelector(s);

  async function ensureSupabase(){
    if(!window.supabase?.createClient){
      await new Promise((ok,fail)=>{
        const s=document.createElement('script');
        s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        s.onload=ok;s.onerror=fail;document.head.appendChild(s);
      });
    }
    if(!cfg){const r=await fetch(CFG_URL,{cache:'no-store'});cfg=await r.json()}
    if(!sb)sb=window.supabase.createClient(cfg.url,cfg.key);
    return sb;
  }

  async function invoke(memberId){
    await ensureSupabase();
    const {data}=await sb.auth.getSession();
    const token=data?.session?.access_token;
    if(!token)throw new Error('Tu sesión de administrador expiró. Vuelve a ingresar.');
    const r=await fetch(`${cfg.url}/functions/v1/${FN}`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':cfg.key,'Authorization':`Bearer ${token}`},
      body:JSON.stringify({action:'admin-resend',member_id:memberId}),
      cache:'no-store'
    });
    let out={};try{out=await r.json()}catch{}
    if(!r.ok||out.ok===false)throw new Error(out.message||'No se pudo enviar el correo de bienvenida.');
    return out;
  }

  function addStyle(){
    if($('#sdl-welcome-admin-style'))return;
    const s=document.createElement('style');s.id='sdl-welcome-admin-style';s.textContent=`
      .sdl-send-welcome{margin-left:6px!important;border-color:#4d7da0!important;color:#dff4ff!important;background:linear-gradient(180deg,#10283a,#0a1925)!important}
      .sdl-send-welcome:hover{border-color:#86cff8!important;background:#173950!important}.sdl-send-welcome:disabled{opacity:.55;cursor:wait}
    `;document.head.appendChild(s);
  }

  function memberLabel(tr){
    const text=(tr?.innerText||'').trim().split('\n').map(v=>v.trim()).filter(Boolean);
    return text[0]||'este miembro';
  }

  function patchButtons(){
    document.querySelectorAll('[data-fan-member-id]').forEach(base=>{
      const tr=base.closest('tr'),cell=base.parentElement,id=base.dataset.fanMemberId;
      if(!tr||!cell||!id||cell.querySelector(`[data-sdl-welcome-member="${id}"]`))return;
      const b=document.createElement('button');
      b.className='mini sdl-send-welcome';b.type='button';b.dataset.sdlWelcomeMember=id;
      b.textContent='📧 Enviar bienvenida';b.title='Enviar nuevamente el correo oficial de bienvenida a La Manada';
      b.onclick=async()=>{
        const who=memberLabel(tr);
        if(!confirm(`¿Enviar nuevamente el correo oficial de bienvenida a ${who}?`))return;
        const old=b.textContent;b.disabled=true;b.textContent='Enviando…';
        try{
          const r=await invoke(id);
          b.textContent='✓ Bienvenida enviada';
          alert(r.message||'Correo de bienvenida enviado correctamente.');
          setTimeout(()=>{b.textContent='📧 Reenviar bienvenida';b.disabled=false},2500);
        }catch(err){
          alert(err.message||'No se pudo enviar el correo.');
          b.textContent=old;b.disabled=false;
        }
      };
      cell.append(' ',b);
    });
  }

  function init(){
    addStyle();patchButtons();
    const o=new MutationObserver(patchButtons);o.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>o.disconnect(),60000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
