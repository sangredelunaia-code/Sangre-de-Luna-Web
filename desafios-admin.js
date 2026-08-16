/* ENTRADA SONORA · AULLIDO DE LA MANADA · WEB AUDIO */
(()=>{
 let entering=false;

 const playHowl=()=>new Promise((resolve,reject)=>{
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx){reject(new Error('Web Audio no disponible'));return;}

  const ctx=new AudioCtx();
  const t=ctx.currentTime+.03;
  const end=t+3.9;

  const master=ctx.createGain();
  master.gain.setValueAtTime(.0001,t);
  master.gain.exponentialRampToValueAtTime(.62,t+.28);
  master.gain.setValueAtTime(.62,t+2.9);
  master.gain.exponentialRampToValueAtTime(.0001,end);
  master.connect(ctx.destination);

  const tone=ctx.createBiquadFilter();
  tone.type='lowpass';
  tone.frequency.setValueAtTime(1450,t);
  tone.Q.setValueAtTime(.75,t);
  tone.connect(master);

  const body=ctx.createOscillator();
  const bodyGain=ctx.createGain();
  body.type='triangle';
  body.frequency.setValueAtTime(165,t);
  body.frequency.exponentialRampToValueAtTime(235,t+.58);
  body.frequency.exponentialRampToValueAtTime(252,t+1.35);
  body.frequency.exponentialRampToValueAtTime(218,t+2.05);
  body.frequency.exponentialRampToValueAtTime(246,t+2.85);
  body.frequency.exponentialRampToValueAtTime(178,end);
  bodyGain.gain.setValueAtTime(.54,t);
  body.connect(bodyGain).connect(tone);

  const voice=ctx.createOscillator();
  const voiceGain=ctx.createGain();
  voice.type='sawtooth';
  voice.frequency.setValueAtTime(330,t);
  voice.frequency.exponentialRampToValueAtTime(470,t+.58);
  voice.frequency.exponentialRampToValueAtTime(504,t+1.35);
  voice.frequency.exponentialRampToValueAtTime(436,t+2.05);
  voice.frequency.exponentialRampToValueAtTime(492,t+2.85);
  voice.frequency.exponentialRampToValueAtTime(356,end);
  voiceGain.gain.setValueAtTime(.075,t);
  voiceGain.gain.exponentialRampToValueAtTime(.035,end);
  voice.connect(voiceGain).connect(tone);

  const vibrato=ctx.createOscillator();
  const vibratoDepth=ctx.createGain();
  vibrato.type='sine';
  vibrato.frequency.setValueAtTime(5.2,t);
  vibratoDepth.gain.setValueAtTime(0,t);
  vibratoDepth.gain.linearRampToValueAtTime(9,t+.65);
  vibratoDepth.gain.setValueAtTime(9,t+3.1);
  vibratoDepth.gain.linearRampToValueAtTime(4,end);
  vibrato.connect(vibratoDepth);
  vibratoDepth.connect(body.frequency);
  vibratoDepth.connect(voice.frequency);

  const breath=ctx.createBufferSource();
  const noise=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*3.9),ctx.sampleRate);
  const data=noise.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.7;
  breath.buffer=noise;
  const breathFilter=ctx.createBiquadFilter();
  breathFilter.type='bandpass';
  breathFilter.frequency.setValueAtTime(780,t);
  breathFilter.Q.setValueAtTime(.9,t);
  const breathGain=ctx.createGain();
  breathGain.gain.setValueAtTime(.0001,t);
  breathGain.gain.exponentialRampToValueAtTime(.075,t+.45);
  breathGain.gain.setValueAtTime(.055,t+2.8);
  breathGain.gain.exponentialRampToValueAtTime(.0001,end);
  breath.connect(breathFilter).connect(breathGain).connect(master);

  body.start(t); voice.start(t); vibrato.start(t); breath.start(t);
  body.stop(end); voice.stop(end); vibrato.stop(end); breath.stop(end);

  let done=false;
  const finish=()=>{
   if(done)return;
   done=true;
   try{ctx.close();}catch(_){ }
   resolve();
  };
  body.onended=finish;
  setTimeout(finish,4200);
  ctx.resume().catch(()=>{});
 });

 document.addEventListener('click',event=>{
  const enter=event.target.closest?.('#enterSite');
  if(!enter)return;

  if(enter.dataset.wolfBypass==='1'){
   delete enter.dataset.wolfBypass;
   return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  if(entering)return;

  entering=true;
  enter.disabled=true;
  const originalText=enter.textContent;
  enter.textContent='LA MANADA DESPIERTA…';

  let finished=false;
  let safetyTimer;
  const proceed=()=>{
   if(finished)return;
   finished=true;
   clearTimeout(safetyTimer);
   enter.dataset.wolfBypass='1';
   enter.disabled=false;
   enter.textContent=originalText||'ENTRAR AL UNIVERSO';
   entering=false;
   enter.click();
  };

  safetyTimer=setTimeout(proceed,4500);
  playHowl().then(proceed).catch(()=>setTimeout(proceed,150));
 },true);
})();

/* CARGA LA NAVEGACION, FAN CLUB Y ADMIN ESTABLES DE LA VERSION ANTERIOR */
(()=>{
 const stable=document.createElement('script');
 stable.src='https://cdn.jsdelivr.net/gh/sangredelunaia-code/Sangre-de-Luna-Web@3b01e9c337d39526842f6800e3957b00f050cc21/desafios-admin.js';
 stable.async=false;
 document.head.appendChild(stable);
})();
