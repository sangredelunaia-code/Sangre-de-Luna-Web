/* SANGRE DE LUNA · NOTIFICACIÓN AUTOMÁTICA DE REGISTRO */
(()=>{
  const ENDPOINT='https://huvramoqtrorcoywipvm.supabase.co/functions/v1/fanclub-registration-notify';
  const form=document.getElementById('fanJoinForm');
  if(!form||window.__SDL_REGISTRATION_EMAIL__)return;
  window.__SDL_REGISTRATION_EMAIL__=true;

  const waitForNewToken=(previousToken)=>new Promise(resolve=>{
    const started=Date.now();
    const timer=setInterval(()=>{
      const current=sessionStorage.getItem('sdl_fanclub_token')||'';
      if(current&&current!==previousToken){clearInterval(timer);resolve(current);return}
      if(Date.now()-started>15000){clearInterval(timer);resolve('')}
    },250);
  });

  async function notifyRegistration(accessToken){
    if(!accessToken)return false;
    for(let attempt=1;attempt<=3;attempt++){
      try{
        const response=await fetch(ENDPOINT,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({access_token:accessToken}),
          cache:'no-store'
        });
        if(response.ok)return true;
      }catch(error){console.warn('Sangre de Luna · correo de bienvenida:',error)}
      await new Promise(r=>setTimeout(r,attempt*900));
    }
    return false;
  }

  form.addEventListener('submit',async()=>{
    const previousToken=sessionStorage.getItem('sdl_fanclub_token')||'';
    const newToken=await waitForNewToken(previousToken);
    if(!newToken)return;
    const sent=await notifyRegistration(newToken);
    if(sent){
      const msg=document.getElementById('fanJoinMsg');
      if(msg&&msg.textContent.includes('Bienvenido')){
        const note=document.createElement('div');
        note.className='msg ok';
        note.textContent='📧 También enviamos a tu correo la bienvenida oficial a La Manada.';
        msg.appendChild(note);
      }
    }
  });
})();
