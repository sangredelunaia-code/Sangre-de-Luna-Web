// Sangre de Luna — mobile controls hotfix
// Keeps Music + Lykos compact on phones and prevents inherited fullscreen sizing.
(()=>{
  if(document.getElementById('sdlMobileControlsFix')) return;
  const st=document.createElement('style');
  st.id='sdlMobileControlsFix';
  st.textContent=`
  @media (max-width:768px){
    .audio{
      position:fixed!important;
      top:max(5px,env(safe-area-inset-top))!important;
      right:max(5px,env(safe-area-inset-right))!important;
      bottom:auto!important;
      left:auto!important;
      display:flex!important;
      flex-direction:row!important;
      flex-wrap:nowrap!important;
      align-items:center!important;
      justify-content:flex-end!important;
      gap:4px!important;
      width:auto!important;
      min-width:0!important;
      max-width:calc(100vw - 10px)!important;
      height:32px!important;
      min-height:32px!important;
      max-height:32px!important;
      margin:0!important;
      padding:0!important;
      overflow:visible!important;
      z-index:9999!important;
    }
    .audio button,
    .audio .btn{
      position:relative!important;
      inset:auto!important;
      display:inline-flex!important;
      align-items:center!important;
      justify-content:center!important;
      flex:0 0 auto!important;
      width:auto!important;
      min-width:0!important;
      max-width:78px!important;
      height:30px!important;
      min-height:30px!important;
      max-height:30px!important;
      margin:0!important;
      padding:0 7px!important;
      border-radius:9px!important;
      font-size:9px!important;
      line-height:1!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
      writing-mode:horizontal-tb!important;
      transform:none!important;
    }
    .top{
      min-height:48px!important;
    }
  }

  @media (max-width:430px){
    .audio{
      height:29px!important;
      min-height:29px!important;
      max-height:29px!important;
      gap:3px!important;
      top:max(4px,env(safe-area-inset-top))!important;
      right:max(4px,env(safe-area-inset-right))!important;
    }
    .audio button,
    .audio .btn{
      height:27px!important;
      min-height:27px!important;
      max-height:27px!important;
      max-width:68px!important;
      padding:0 6px!important;
      font-size:8px!important;
      border-radius:8px!important;
    }
  }

  @media (max-width:360px){
    .audio button,
    .audio .btn{
      max-width:60px!important;
      padding:0 5px!important;
      font-size:7.5px!important;
    }
  }
  `;
  document.head.appendChild(st);
})();
