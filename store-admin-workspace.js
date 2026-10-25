/* Sangre de Luna · Panel de tienda: vistas independientes sin acordeones principales */
(()=>{
 const installStableNavigation=()=>{
  const sidebar=document.querySelector('.sdl-admin-sidebar'),main=document.querySelector('.sdl-admin-content');
  if(!sidebar||!main||sidebar.dataset.sdlStableNavigation)return;
  sidebar.dataset.sdlStableNavigation='1';
  const ids=['admin-resumen','colecciones-admin','crear-coleccion','crear-producto','productos-registrados','portadas-categorias','configuracion'];
  const labels={'admin-resumen':'Resumen general','colecciones-admin':'Colecciones y productos','crear-coleccion':'Nueva colección','crear-producto':'Nuevo producto','productos-registrados':'Productos registrados','portadas-categorias':'Portadas de categorías','configuracion':'Configuración avanzada'};
  const style=document.createElement('style');style.id='sdl-stable-nav-css';
  style.textContent=ids.map(id=>'#'+id+'{display:none!important}').join('')+ids.map(id=>'#'+id+'.sdl-v2-visible{display:block!important}').join('');
  document.head.append(style);
  const show=id=>{
   if(!ids.includes(id))id='admin-resumen';
   for(const key of ids){const el=document.getElementById(key);if(!el)continue;el.classList.toggle('sdl-v2-visible',key===id);if(el.tagName==='DETAILS')el.open=key===id}
   const heading=document.querySelector('#sdl-v2-title');if(heading)heading.textContent=labels[id];
   sidebar.querySelectorAll('a[href^="#"]').forEach(a=>a.classList.toggle('sdl-v2-current',a.getAttribute('href')==='#'+id));
  };
  sidebar.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);if(!ids.includes(id))return;e.preventDefault();e.stopImmediatePropagation();history.replaceState(null,'','#'+id);show(id)},true);
  main.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);if(!ids.includes(id))return;e.preventDefault();e.stopImmediatePropagation();history.replaceState(null,'','#'+id);show(id)},true);
  window.addEventListener('hashchange',()=>show(location.hash.slice(1)));
  show(location.hash.slice(1));
 };
 const boot=()=>{
  const main=document.querySelector('.sdl-admin-content'),sidebar=document.querySelector('.sdl-admin-sidebar');
  if(!main||!sidebar||document.getElementById('sdl-store-workspace-v2'))return;
  const sections={
   'admin-resumen':document.getElementById('admin-resumen'),
   'colecciones-admin':document.getElementById('colecciones-admin'),
   'crear-coleccion':document.getElementById('crear-coleccion'),
   'crear-producto':document.getElementById('crear-producto'),
   'productos-registrados':document.getElementById('productos-registrados'),
   'portadas-categorias':document.getElementById('portadas-categorias'),
   'configuracion':document.getElementById('configuracion')
  };
  // Secciones opcionales pueden faltar según la versión del HTML.
  // No cancelar la carga completa del panel de Gelato por un apartado ausente.
  if(!sections['admin-resumen']||!sections['productos-registrados'])return;
  for(const [id,element] of Object.entries(sections)){
    if(element)continue;
    const fallback=document.createElement('section');fallback.id=id;fallback.hidden=true;
    fallback.textContent='Esta sección todavía no está disponible.';
    main.append(fallback);sections[id]=fallback;
  }
  const names={'admin-resumen':'Resumen general','colecciones-admin':'Colecciones y productos','crear-coleccion':'Nueva colección','crear-producto':'Nuevo producto','productos-registrados':'Productos registrados','portadas-categorias':'Portadas de categorías','configuracion':'Configuración avanzada'};
  // Respetar los formularios originales y sus event listeners, sin duplicar contenido.
  const oldWorkspace=document.getElementById('sdl-store-workspace');
  if(oldWorkspace)oldWorkspace.remove();
  const header=document.createElement('div');header.id='sdl-store-workspace-v2';
  header.innerHTML='<div class="sdl-v2-heading"><div><span>TIENDA OFICIAL · CENTRO DE CONTROL</span><h1 id="sdl-v2-title">Resumen general</h1><p id="sdl-v2-subtitle">Administra colecciones, productos y portadas desde pantallas independientes.</p></div><a href="#crear-producto" class="sdl-v2-primary">＋ Nuevo producto</a></div>';
  sections['admin-resumen'].before(header);
  const css=document.createElement('style');css.id='sdl-store-workspace-v2-css';
  css.textContent=`
   .sdl-admin-content .sdl-v2-screen{display:none!important}
   .sdl-admin-content .sdl-v2-screen.sdl-v2-visible{display:block!important}
   .sdl-admin-content .sdl-v2-screen>summary{display:none!important}
   .sdl-admin-content .sdl-v2-screen.sdl-v2-visible{width:100%!important;max-width:1200px!important;margin:0 auto 24px!important;padding:22px!important;border:1px solid #dce4ec!important;border-radius:14px!important;background:#fff!important;box-shadow:0 8px 26px rgba(20,43,69,.06)}
   .sdl-admin-content #admin-resumen.sdl-v2-visible{background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important}
   .sdl-admin-content #admin-resumen>.sdl-admin-heading{display:none!important}
   .sdl-v2-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin:22px auto 22px;max-width:1200px}
   .sdl-v2-heading span{font-size:11px;color:#916d2d;font-weight:800;letter-spacing:.12em}
   .sdl-v2-heading h1{font:700 clamp(25px,3vw,34px) Georgia,serif;color:#102942;margin:7px 0}
   .sdl-v2-heading p{font-size:14px;color:#62738a;margin:0}
   .sdl-v2-primary,.sdl-v2-back{display:inline-flex;align-items:center;justify-content:center;cursor:pointer;text-decoration:none!important;border-radius:9px;border:1px solid #b5904c;background:#09243a;color:#f0d397!important;padding:12px 17px;font-weight:700}
   .sdl-v2-back{background:#eef3f7;color:#16334e!important;border-color:#c6d3df;padding:9px 13px;margin-bottom:18px}
   .sdl-admin-sidebar nav a.sdl-v2-current{background:#bc8f46;color:#071727!important;font-weight:800}
   .sdl-v2-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:18px 0}
   .sdl-v2-tile{display:flex;min-height:145px;flex-direction:column;align-items:flex-start;justify-content:space-between;text-align:left;gap:8px;cursor:pointer;padding:19px;border:1px solid #cfdae5;background:linear-gradient(155deg,#fff,#f3f6f9);border-radius:13px;box-shadow:0 7px 16px #0a274013;color:#112c43}
   .sdl-v2-tile:hover,.sdl-v2-tile:focus-visible{border-color:#bb9355;box-shadow:0 9px 25px #a6873440}
   .sdl-v2-tile strong{font:700 19px Georgia,serif}.sdl-v2-tile small{color:#6b7c8c;font-size:13px}
   .sdl-v2-tile span{color:#a47a3c;font-size:12px;font-weight:800}
   #colecciones-admin.sdl-v2-visible>.section-head{margin:0 0 18px}
   #colecciones-admin .sdl-v2-hidden-detail{display:none!important}
   #colecciones-admin .sdl-v2-focus-detail{display:block!important;margin:0!important;padding:12px!important;background:#fff;border:0!important}
   #colecciones-admin .sdl-v2-focus-detail>summary{display:none!important}
   .sdl-v2-breadcrumb{font-size:13px;color:#61758b;margin-bottom:12px}
   .sdl-v2-inactive-section{display:none!important}
   @media(max-width:900px){.sdl-v2-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
   @media(max-width:620px){.sdl-v2-grid{grid-template-columns:1fr}.sdl-v2-heading{flex-direction:column;align-items:stretch}.sdl-admin-content .sdl-v2-screen.sdl-v2-visible{padding:15px!important}.sdl-v2-tile{min-height:110px}}
  `;
  document.head.append(css);
  Object.values(sections).forEach(el=>el.classList.add('sdl-v2-screen'));
  const collectionView=sections['colecciones-admin'];
  const originalCollections=[...collectionView.querySelectorAll(':scope > details.store-admin-panel')];
  const tiles=document.createElement('div');tiles.className='sdl-v2-grid';tiles.id='sdl-v2-collection-grid';
  originalCollections.forEach((detail,i)=>{
   const title=detail.querySelector(':scope > summary')?.textContent.trim()||'Colección '+(i+1);
   detail.classList.add('sdl-v2-hidden-detail');
   const button=document.createElement('button');button.type='button';button.className='sdl-v2-tile';
   button.innerHTML='<span>COLECCIÓN '+String(i+1).padStart(2,'0')+'</span><strong></strong><small>Ver categorías y productos →</small>';
   button.querySelector('strong').textContent=title.replace(/^Colección\s+/i,'');
   button.onclick=()=>openCollection(detail,title);tiles.append(button);
  });
  const collectionNav=document.createElement('div');collectionNav.id='sdl-v2-collection-nav';collectionNav.hidden=true;
  collectionView.querySelector('.section-head')?.after(tiles,collectionNav);
  function resetCollections(){tiles.hidden=false;collectionNav.hidden=true;originalCollections.forEach(d=>{d.classList.add('sdl-v2-hidden-detail');d.classList.remove('sdl-v2-focus-detail');d.open=false;[...d.querySelectorAll(':scope > details')].forEach(child=>{child.classList.remove('sdl-v2-focus-detail');child.classList.add('sdl-v2-hidden-detail');child.open=false})})}
  function openCollection(detail,title){
   resetCollections();tiles.hidden=true;collectionNav.hidden=false;
   detail.classList.remove('sdl-v2-hidden-detail');detail.classList.add('sdl-v2-focus-detail');detail.open=true;
   collectionNav.replaceChildren();
   const back=document.createElement('button');back.type='button';back.className='sdl-v2-back';back.textContent='← Todas las colecciones';back.onclick=resetCollections;
   const titleEl=document.createElement('h3');titleEl.textContent=title;collectionNav.append(back,titleEl);
   const categories=[...detail.querySelectorAll(':scope > details')];
   let categoryGrid=detail.querySelector(':scope > .sdl-v2-grid');
   if(!categoryGrid){categoryGrid=document.createElement('div');categoryGrid.className='sdl-v2-grid';detail.prepend(categoryGrid);
    categories.forEach(cat=>{cat.classList.add('sdl-v2-hidden-detail');const b=document.createElement('button');b.className='sdl-v2-tile';b.type='button';b.innerHTML='<span>CATEGORÍA</span><strong></strong><small>Administrar artículos →</small>';b.querySelector('strong').textContent=cat.querySelector(':scope > summary')?.textContent.trim()||'Productos';b.onclick=()=>{categories.forEach(c=>{c.classList.add('sdl-v2-hidden-detail');c.classList.remove('sdl-v2-focus-detail');c.open=false});categoryGrid.hidden=true;cat.classList.remove('sdl-v2-hidden-detail');cat.classList.add('sdl-v2-focus-detail');cat.open=true;back.textContent='← Volver a categorías';back.onclick=()=>{categoryGrid.hidden=false;cat.classList.add('sdl-v2-hidden-detail');cat.classList.remove('sdl-v2-focus-detail');cat.open=false;back.textContent='← Todas las colecciones';back.onclick=resetCollections};};categoryGrid.append(b)})}
   categoryGrid.hidden=false;categories.forEach(cat=>{cat.classList.add('sdl-v2-hidden-detail');cat.classList.remove('sdl-v2-focus-detail');cat.open=false});
  }
  // Selector visual de artículos directamente debajo del resumen.
  const types=[
   ['Camisetas','/tienda-privada?action=cover&slug=camisetas'],['Sudaderas','/tienda-privada?action=cover&slug=sudaderas'],['Tazas','/tienda-privada?action=cover&slug=tazas'],
   ['Pósteres','/tienda-privada?action=cover&slug=posteres'],['Gorras','/tienda-privada?action=cover&slug=gorras'],['Libretas','/tienda-privada?action=cover&slug=libretas'],
   ['Stickers','/tienda-privada?action=cover&slug=stickers'],['Llaveros','/tienda-privada?action=cover&slug=llaveros'],['Bolsas Tote','/tienda-privada?action=cover&slug=bolsas']
  ];
  const creation=document.createElement('section');creation.id='sdl-home-product-creation';
  creation.innerHTML='<div class="sdl-home-create-heading"><span>CATÁLOGO OFICIAL</span><h2>Creación de productos</h2><p>Selecciona el tipo de artículo para abrir su ficha de creación.</p></div><div class="sdl-home-product-grid"></div>';
  sections['admin-resumen'].append(creation);
  types.forEach(([name,src],i)=>{const btn=document.createElement('button');btn.type='button';btn.className='sdl-home-product-tile';btn.style.backgroundImage='linear-gradient(0deg,rgba(2,10,20,.88),rgba(2,10,20,.16)),url("'+src+'")';btn.innerHTML='<strong></strong><span>CREAR PRODUCTO →</span>';btn.querySelector('strong').textContent=name;btn.addEventListener('click',()=>{const sel=sections['crear-producto'].querySelector('select[name="category"]');const category=name==='Bolsas Tote'?'Bolsas Tote':name;if(sel){const option=[...sel.options].find(x=>x.value===category||x.textContent===category);if(option){sel.value=option.value;sel.dispatchEvent(new Event('change',{bubbles:true}))}}history.replaceState(null,'','#crear-producto');show('crear-producto')});creation.querySelector('.sdl-home-product-grid').append(btn)});
  const visualCss=document.createElement('style');visualCss.textContent='#sdl-home-product-creation{margin:30px 0 10px}.sdl-home-create-heading{margin-bottom:18px}.sdl-home-create-heading span{font-size:11px;font-weight:800;letter-spacing:.13em;color:#aa813d}.sdl-home-create-heading h2{font:700 30px Georgia,serif;color:#112a43;margin:6px 0}.sdl-home-create-heading p{font-size:13px;color:#697a8c;margin:0}.sdl-home-product-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.sdl-home-product-tile{grid-column:span 2;position:relative;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;min-height:185px;padding:17px;color:#fff;cursor:pointer;border:1px solid #af945f;background-color:#0b2135;background-size:cover;background-position:center;border-radius:8px;text-align:left;box-shadow:0 7px 22px #07182b22}.sdl-home-product-tile:nth-child(n+4){grid-column:span 1;min-height:160px}.sdl-home-product-tile strong{font:700 clamp(14px,1.5vw,22px) Georgia,serif;text-shadow:0 2px 8px #000}.sdl-home-product-tile span{align-self:center;background:#06131de8;border:1px solid #c29d5b;padding:7px 9px;letter-spacing:.06em;font-size:9px;font-weight:800}.sdl-home-product-tile:hover,.sdl-home-product-tile:focus-visible{outline:2px solid #d9bb7b;outline-offset:2px;filter:brightness(1.13)}@media(max-width:1000px){.sdl-home-product-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.sdl-home-product-tile,.sdl-home-product-tile:nth-child(n+4){grid-column:span 1}}@media(max-width:590px){.sdl-home-product-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.sdl-home-product-tile,.sdl-home-product-tile:nth-child(n+4){min-height:140px}}';document.head.append(visualCss);
  // Diagnóstico de Gelato: consulta autenticada de solo lectura, nunca crea pedidos.
  const gelatoPanel=document.createElement('section');
  gelatoPanel.id='sdl-gelato-verification';
  gelatoPanel.style.cssText='margin:20px 0;padding:20px;border:1px solid #d5bb7e;border-radius:12px;background:#f8fafc;color:#102942';
  gelatoPanel.innerHTML='<h3 style="margin:0 0 8px">Proveedor Gelato · Verificación de conexión</h3><p style="margin:0 0 12px">Comprueba la conexión segura en modo consulta. Este botón no publica artículos, no cobra y no crea pedidos.</p><button type="button" id="sdl-verify-gelato" style="padding:11px 17px;border-radius:8px;border:0;background:#09243a;color:#fff;cursor:pointer;font-weight:700">Verificar conexión Gelato</button><p id="sdl-gelato-result" role="status" aria-live="polite" style="margin:12px 0 0">Sin verificar en esta sesión.</p>';
  sections['configuracion'].prepend(gelatoPanel);
  const previewLink=document.createElement('a');
  previewLink.href='/api/tienda-preview?action=private_showcase';
  previewLink.target='_blank';previewLink.rel='noopener';
  previewLink.textContent='👁 Ver tienda completa antes de publicar';
  previewLink.style.cssText='display:inline-flex;margin:14px 0;padding:12px 17px;border-radius:9px;background:#123552;color:#fff;font-weight:700;text-decoration:none';
  sections['configuracion'].prepend(previewLink);

  const catalogButton=document.createElement('button');
  catalogButton.type='button';
  catalogButton.textContent='Consultar catálogos disponibles en Gelato';
  catalogButton.style.cssText='margin-top:12px;padding:10px 15px;border-radius:8px;border:1px solid #b48e4c;background:#fff;color:#102942;cursor:pointer;font-weight:700';
  const catalogStatus=document.createElement('div');
  catalogStatus.setAttribute('role','status');
  catalogStatus.style.cssText='margin-top:12px;white-space:pre-wrap;font-size:14px';
  gelatoPanel.append(catalogButton,catalogStatus);
  catalogButton.addEventListener('click',async()=>{
    catalogButton.disabled=true;catalogStatus.textContent='Consultando catálogo del proveedor…';
    try{
      const response=await fetch('/api/tienda-preview?action=gelato_catalogs',{credentials:'same-origin',cache:'no-store'});
      const data=await response.json();
      if(!data.ok){catalogStatus.textContent='No se pudo consultar Gelato: '+(data.reason||response.status);return;}
      const list=data.catalogs||[];
      catalogStatus.textContent=data.formatRecognized===false?'La API respondió correctamente, pero el formato de la respuesta no coincide con el esperado. Campos recibidos: '+(data.responseFields||[]).join(', ')+'. No se vinculó ningún producto.':data.totalCatalogs===0?'La API respondió correctamente y su lista de catálogos está vacía (0). Revisa la cuenta y permisos de la API con Gelato. No se vinculó ningún producto.':'Gelato devuelve '+data.totalCatalogs+' catálogos (mostrando máximo 80). Falta validar colores, tallas y envíos por producto. No se crearon pedidos.';
      const ul=document.createElement('ul');ul.style.cssText='max-height:220px;overflow:auto;margin:8px 0 0;padding-left:22px';
      list.forEach(item=>{const li=document.createElement('li');li.textContent=item.title+' ('+item.uid+')';ul.append(li)});
      catalogStatus.append(ul);
    }catch(error){catalogStatus.textContent='Error de conexión. Vuelve a intentarlo desde la sesión privada.'}
    finally{catalogButton.disabled=false}
  });

  const modelExplorer=document.createElement('div');
  modelExplorer.style.cssText='margin-top:20px;padding:15px;border:1px solid #d4dce5;border-radius:10px;background:#fff';
  modelExplorer.innerHTML='<h4 style="margin:0 0 8px">Explorar modelos físicos de Gelato</h4><p style="margin:0 0 12px">Selecciona una categoría para consultar los primeros 30 modelos. No cambia productos ni crea pedidos.</p><label for="sdl-gelato-category">Catálogo</label> <select id="sdl-gelato-category" style="padding:8px;max-width:100%"><option value="t-shirts">Camisetas (T-shirts)</option><option value="sweatshirts">Sudaderas (Sweatshirts)</option><option value="mugs">Tazas (Mugs)</option></select> <button id="sdl-gelato-search" type="button" style="padding:9px 14px;background:#09243a;color:white;border:0;border-radius:7px;cursor:pointer">Consultar modelos</button><div id="sdl-gelato-model-results" role="status" aria-live="polite" style="margin-top:12px"></div>';
  gelatoPanel.append(modelExplorer);
  modelExplorer.querySelector('#sdl-gelato-search').addEventListener('click',async()=>{
    const button=modelExplorer.querySelector('#sdl-gelato-search'),out=modelExplorer.querySelector('#sdl-gelato-model-results'),catalog=modelExplorer.querySelector('#sdl-gelato-category').value;
    button.disabled=true;out.textContent='Buscando modelos reales de Gelato…';
    try{
      const response=await fetch('/api/tienda-preview?action=gelato_models&catalog='+encodeURIComponent(catalog),{credentials:'same-origin',cache:'no-store'});
      const data=await response.json();
      if(!data.ok){out.textContent='Consulta no completada: '+(data.reason||response.status)+'. No se cambió ningún producto.';return;}
      out.textContent='Modelos recibidos: '+data.returned+' (primera página). Comprueba colores, tallas y disponibilidad antes de asociarlos.';
      const list=document.createElement('ol');list.style.cssText='max-height:380px;overflow:auto;padding-left:22px';
      (data.products||[]).forEach(p=>{const li=document.createElement('li');li.style.marginBottom='12px';const title=document.createElement('strong');title.textContent=p.uid;li.append(title);const meta=document.createElement('div');meta.textContent=Object.entries(p.attributes||{}).map(([key,value])=>key+': '+value).join(' · ');li.append(meta);list.append(li)});
      out.append(list);
    }catch(e){out.textContent='No se pudo consultar la categoría. Verifica la sesión e inténtalo otra vez.'}
    finally{button.disabled=false}
  });
  // Vinculación persistente: la primera recomendación requiere aprobación explícita.
  const linkPanel=document.createElement('section');
  linkPanel.style.cssText='margin-top:20px;padding:18px;border:1px solid #b5904c;border-radius:12px;background:#f3f6f9';
  linkPanel.innerHTML='<h3 style="margin:0 0 8px">Vincular diseños existentes con Gelato</h3><p>Selecciona un diseño. Se recomienda la primera variante adulta activada con color compatible; debes aprobarla antes de guardarla. No se generan pedidos.</p><select id="sdl-link-item" style="max-width:100%;padding:10px"></select> <button id="sdl-link-find" type="button" style="padding:10px 12px;background:#132d44;color:white;border:0;border-radius:8px">Recomendar modelo</button><div id="sdl-link-output" role="status" style="margin-top:14px"></div>';
  gelatoPanel.append(linkPanel);
  const itemSelect=linkPanel.querySelector('#sdl-link-item'),linkOutput=linkPanel.querySelector('#sdl-link-output');
  let linkItems=[];
  async function loadLinkItems(){
   try{
    const r=await fetch('/api/tienda-preview?action=gelato_links',{credentials:'same-origin',cache:'no-store'}),d=await r.json();
    if(!d.ok)throw Error(d.reason);
    linkItems=d.items||[];itemSelect.replaceChildren();
    linkItems.forEach(p=>{const opt=document.createElement('option');opt.value=p.id;const linked=(d.links||[]).find(l=>l.product_id===p.id);opt.textContent=(linked?'✓ ':'○ ')+p.title+' — '+p.category+(linked?' (vinculado)':'');itemSelect.append(opt)});
    linkOutput.textContent=(d.links||[]).length+' de '+linkItems.length+' productos personalizados con un modelo aprobado. Impresión y envíos siguen pendientes de validación.';
   }catch(e){linkOutput.textContent='No se pudo consultar la vinculación guardada.'}
  }
  loadLinkItems();
  linkPanel.querySelector('#sdl-link-find').addEventListener('click',async()=>{
   const item=linkItems.find(p=>p.id===itemSelect.value),catalog={'Camisetas':'t-shirts','Sudaderas':'sweatshirts','Tazas':'mugs'}[item?.category];
   linkOutput.replaceChildren();
   if(!item||!catalog){linkOutput.textContent='Esta categoría aún requiere revisión manual de modelos.';return;}
   if(item.colors.length!==1){linkOutput.textContent='Para vincular un modelo exacto, el producto debe tener un solo color seleccionado. Colores registrados: '+(item.colors.join(', ')||'ninguno')+'. Conservamos las variantes sin modificarlas.';return;}
   const btn=linkPanel.querySelector('#sdl-link-find');btn.disabled=true;linkOutput.textContent='Buscando variantes compatibles en Gelato…';
   try{
    const response=await fetch('/api/tienda-preview?action=gelato_models&catalog='+encodeURIComponent(catalog),{credentials:'same-origin',cache:'no-store'});
    const data=await response.json();if(!data.ok)throw Error(data.reason);
    const normalize=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]/g,'');
    const aliases={blancolunar:['white'],grisplata:['sportgrey','ash','heathergrey'],grisoscuro:['darkheather','charcoal'],azulnocturno:['navy'],verdeoliva:['militarygreen','olive'],doradoarena:['sand']};
    const wanted=normalize(item.colors[0]);
    const candidate=(data.products||[]).find(p=>{const a=p.attributes||{},color=normalize(a.GarmentColor);return p.uid&&String(a.ProductStatus||'').toLowerCase()==='activated'&&String(a.State||'').toLowerCase()==='published'&&String(a.GarmentCut||'').toLowerCase()!=='kids'&&(catalog==='mugs'||color===wanted||(aliases[wanted]||[]).includes(color))});
    if(!candidate){linkOutput.textContent='No se encontró una variante adulta, activa y de color coincidente en los primeros 30 resultados. No se aprobará ningún producto incorrecto.';return;}
    linkOutput.replaceChildren();
    const description=document.createElement('p');description.textContent='Modelo recomendado: '+candidate.uid+' · color: '+(candidate.attributes.GarmentColor||'no aplica')+' · talla: '+(candidate.attributes.GarmentSize||'no aplica');linkOutput.append(description);
    const approve=document.createElement('button');approve.type='button';approve.textContent='Aprobar y guardar esta vinculación';approve.style.cssText='padding:10px 16px;border-radius:8px;background:#153650;color:white;border:0;cursor:pointer';
    approve.onclick=async()=>{approve.disabled=true;try{const res=await fetch('/api/tienda-preview?action=approve_gelato_link',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:item.id,catalog,uid:candidate.uid})});const result=await res.json();linkOutput.textContent=result.ok?'✓ Identificador de Gelato guardado en Supabase. Impresión, costos y envíos pendientes; compras desactivadas.':'No se aprobó: '+(result.reason||res.status);if(result.ok)await loadLinkItems();}catch(e){linkOutput.textContent='No fue posible guardar la vinculación.'}};
    linkOutput.append(approve);
   }catch(e){linkOutput.textContent='Consulta no completada: '+e.message}
   finally{btn.disabled=false}
  });
  const bulkPanel=document.createElement('section');
  bulkPanel.style.cssText='margin-top:18px;padding:18px;border:1px solid #a78b55;border-radius:12px;background:#f9fafc';
  bulkPanel.innerHTML='<h3 style="margin:0 0 8px">Vinculación masiva asistida con Gelato</h3><p>Revisa todas las fichas de una vez. Solo se recomendarán coincidencias activas, adultas, del color solicitado y con Ecuador en los países admitidos. No se publicarán productos ni se crearán pedidos.</p><button id="sdl-bulk-review" type="button" style="padding:11px 15px;background:#153650;color:#fff;border:0;border-radius:8px;cursor:pointer">Analizar todos los productos</button><div id="sdl-bulk-status" role="status" style="margin:12px 0"></div><div id="sdl-bulk-results"></div><button id="sdl-bulk-approve" type="button" disabled style="padding:11px 15px;border-radius:8px;background:#b18a45;color:white;border:0">Aprobar las coincidencias verificadas</button>';
  gelatoPanel.append(bulkPanel);
  const bulkStatus=bulkPanel.querySelector('#sdl-bulk-status'),bulkResults=bulkPanel.querySelector('#sdl-bulk-results'),bulkApprove=bulkPanel.querySelector('#sdl-bulk-approve'),bulkReview=bulkPanel.querySelector('#sdl-bulk-review');
  let proposals=[];
  const clean=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  const colorEquivalences={blancolunar:['white'],grisplata:['sportgrey','ash','heathergrey'],grisoscuro:['darkheather','charcoal'],azulnocturno:['navy'],verdeoliva:['militarygreen','olive'],doradoarena:['sand'],negrolunar:['black'],negro:['black'],blanco:['white'],gris:['ash','sportgrey'],azul:['navy'],rojo:['red']};
  bulkReview.addEventListener('click',async()=>{
    bulkReview.disabled=true;bulkApprove.disabled=true;bulkResults.replaceChildren();proposals=[];
    try{
      const answer=await fetch('/api/tienda-preview?action=gelato_links',{credentials:'same-origin',cache:'no-store'}),listing=await answer.json();
      if(!listing.ok)throw Error('No fue posible leer los productos guardados.');
      const approved=new Set((listing.links||[]).map(l=>l.product_id));
      const items=(listing.items||[]).filter(p=>!approved.has(p.id));
      const catalogs={'Camisetas':'t-shirts','Sudaderas':'sweatshirts','Tazas':'mugs'};
      const cache={},catalogErrors={};
      for(const type of [...new Set(items.map(p=>catalogs[p.category]).filter(Boolean))]){
        bulkStatus.textContent='Consultando el catálogo de Gelato: '+type+'…';
        try{const pages=await Promise.all([0,100].map(async offset=>{const response=await fetch('/api/tienda-preview?action=gelato_models&catalog='+type+'&adult=1&offset='+offset,{credentials:'same-origin',cache:'no-store'});const data=await response.json();if(!data.ok)throw Error(data.reason||'Error del proveedor');return data.products||[]}));cache[type]=pages.flat();if(!cache[type].length)catalogErrors[type]='Gelato no devolvió modelos para los filtros adultos; se requiere revisar los valores del catálogo.'}catch(e){cache[type]=[];catalogErrors[type]=String(e.message||e)}
      }
      const stats=Object.entries(cache).map(([category,rows])=>{const sample=rows.slice(0,4).map(p=>({uid:p.uid,attributes:p.attributes}));const activated=rows.filter(p=>Object.entries(p.attributes||{}).some(([k,v])=>k.toLowerCase()==='productstatus'&&String(v).toLowerCase()==='activated')).length;const missing=rows.filter(p=>!Object.keys(p.attributes||{}).some(k=>k.toLowerCase()==='productstatus')).length;return {category,total:rows.length,activated,missing,sample}});
      const diagnosticDetails=document.createElement('details');diagnosticDetails.style.cssText='padding:12px;border:1px solid #aab9c7;border-radius:8px;margin:8px 0';
      const heading=document.createElement('summary');heading.textContent='Diagnóstico de datos de Gelato (ver por qué no hay coincidencias)';diagnosticDetails.append(heading);
      stats.forEach(st=>{const line=document.createElement('p');line.textContent=st.category+': '+st.total+' registros; '+st.activated+' marcados como activos; '+st.missing+' sin campo de estado. Ejemplos: '+st.sample.map(p=>p.uid+' | '+JSON.stringify(p.attributes).slice(0,240)).join(' / ');diagnosticDetails.append(line)});
      bulkResults.append(diagnosticDetails);
      for(const item of items){
        const catalog=catalogs[item.category],colors=item.colors||[];
        const available=cache[catalog]||[];
        const getAttr=(p,key)=>{const a=p.attributes||{},k=Object.keys(a).find(k=>k.toLowerCase()===key.toLowerCase());return k?String(a[k]).trim():''};
        const adult=available.filter(p=>p.uid&&getAttr(p,'ProductStatus').toLowerCase()==='activated'&&(!getAttr(p,'State')||getAttr(p,'State').toLowerCase()==='published')&&!['kids','children','youth'].includes(getAttr(p,'GarmentCut').toLowerCase()));
        const wanted=colors.map(clean);
        const matches=adult.filter(p=>catalog==='mugs'||!wanted.length||wanted.some(color=>clean(p.attributes?.GarmentColor)===color||(colorEquivalences[color]||[]).includes(clean(p.attributes?.GarmentColor))));
        const candidate=matches.find(p=>(p.supportedCountries||[]).includes('EC'))||matches[0]||adult.find(p=>(p.supportedCountries||[]).includes('EC'))||adult[0]||null;
        const colorAvailable=colors.map(color=>{const norm=clean(color);return {color,match:adult.find(p=>clean(p.attributes?.GarmentColor)===norm||(colorEquivalences[norm]||[]).includes(clean(p.attributes?.GarmentColor)))}});
        const colorChecked=colors.length===1&&candidate&&(catalog==='mugs'||clean(candidate.attributes?.GarmentColor)===wanted[0]||(colorEquivalences[wanted[0]]||[]).includes(clean(candidate.attributes?.GarmentColor)));
        const ecuadorVerified=!!candidate&&(candidate.supportedCountries||[]).includes('EC');
        const eligible=!!candidate&&colorChecked&&ecuadorVerified;
        let reason=!catalog?'Categoría todavía no compatible con la búsqueda automática.':
          catalogErrors[catalog]?'Error al consultar Gelato: '+catalogErrors[catalog]:
          !available.length?'Gelato no devolvió productos en las páginas consultadas.':
          !adult.length?'Se consultaron '+available.length+' modelos, pero ninguno cumple los filtros de activación y corte adulto.':
          !colors.length?'Falta seleccionar los colores del diseño.':
          colors.length>1?'Tiene varios colores: se deben asociar individualmente.':
          !colorChecked?'No se confirmó coincidencia del color solicitado.':
          !ecuadorVerified?'Falta confirmar el envío a Ecuador para esta variante.':'';
        const line=document.createElement('div');line.style.cssText='padding:12px;margin:7px 0;border:1px solid #d1dae3;border-radius:9px';
        const name=document.createElement('strong');name.textContent=item.title+' · '+item.category;line.append(name);
        const detail=document.createElement('p');detail.style.margin='5px 0';detail.textContent=candidate?'Modelo de referencia: '+candidate.uid+' · color Gelato: '+(candidate.attributes?.GarmentColor||'sin dato')+' · talla: '+(candidate.attributes?.GarmentSize||'sin dato'):'Sin modelo de referencia para esta categoría';line.append(detail);
        if(colors.length>1){const variants=document.createElement('p');variants.style.cssText='font-size:12px;margin:6px 0';variants.textContent='Coincidencias por color en la muestra: '+colorAvailable.map(x=>x.color+' → '+(x.match?x.match.attributes.GarmentColor+' (talla '+x.match.attributes.GarmentSize+')':'sin coincidencia todavía')).join(' · ')+'. Cada color y talla necesita su propio identificador de fabricación.';line.append(variants)}
        const info=document.createElement('p');info.style.margin='5px 0';info.textContent=eligible?'Coincidencia verificada para revisión y aprobación.':'Pendiente: '+reason;line.append(info);
        if(catalog&&adult.length){
          const suggest=document.createElement('p');suggest.style.cssText='font-size:12px;color:#465969;margin:5px 0';
          const observed=[...new Set(adult.map(p=>p.attributes?.GarmentColor).filter(Boolean))].slice(0,20);
          suggest.textContent='Primeros colores encontrados (no son todos los disponibles): '+(observed.join(', ')||'no proporcionados')+'. '+(colors.length?'Colores registrados: '+colors.join(', ')+'.':'Define el color en la ficha antes de aprobar.');
          line.append(suggest);
        }
        if(eligible){
          const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=true;checkbox.setAttribute('aria-label','Aprobar recomendación para '+item.title);
          const label=document.createElement('label');label.style.cssText='display:flex;align-items:center;gap:8px';label.append(checkbox,document.createTextNode('Incluir en la aprobación conjunta'));line.append(label);
          proposals.push({item,catalog,candidate,checkbox});
        }
        bulkResults.append(line);
      }
      bulkStatus.textContent='Consulta Gelato: '+Object.entries(cache).map(([tipo,modelos])=>tipo+' '+modelos.length+' modelos'+(catalogErrors[tipo]?' (error: '+catalogErrors[tipo]+')':'')).join(' · ')+'. Análisis terminado. '+proposals.length+' recomendaciones; '+(items.length-proposals.length)+' fichas requieren revisión. Ninguna aprobación se ha guardado aún.';
      bulkApprove.disabled=proposals.length===0;
    }catch(e){bulkStatus.textContent='No se pudo completar el análisis: '+e.message}
    finally{bulkReview.disabled=false}
  });
  bulkApprove.addEventListener('click',async()=>{
    const selected=proposals.filter(p=>p.checkbox.checked);if(!selected.length){bulkStatus.textContent='No hay recomendaciones seleccionadas.';return;}
    if(!window.confirm('¿Confirmas guardar '+selected.length+' vinculaciones de Gelato? No se realizarán compras ni pedidos.'))return;
    bulkApprove.disabled=true;bulkReview.disabled=true;let saved=0,failed=[];
    for(const p of selected){
      try{
        const response=await fetch('/api/tienda-preview?action=approve_gelato_link',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:p.item.id,catalog:p.catalog,uid:p.candidate.uid})});
        const data=await response.json();
        if(data.ok)saved++;else failed.push(p.item.title+' ('+(data.reason||'sin verificar')+')');
      }catch(e){failed.push(p.item.title+' (sin conexión)')}
    }
    bulkStatus.textContent='Guardadas '+saved+' vinculaciones aprobadas. '+failed.length+' pendientes.'+(failed.length?' Revisar: '+failed.join('; '):'')+' Los pedidos y cobros permanecen desactivados.';
    await loadLinkItems();bulkReview.disabled=false;
  });
  // Asistente simplificado: conserva todas las herramientas antiguas en opciones avanzadas.
  const simplePanel=document.createElement('section');
  simplePanel.id='sdl-preparar-productos';
  simplePanel.style.cssText='margin:12px 0 20px;padding:22px;border:1px solid #c8d6e2;border-radius:15px;background:#fff;color:#142e45';
  const simpleHeading=document.createElement('h2');simpleHeading.textContent='Preparar mis productos para Gelato';simpleHeading.style.cssText='margin:0 0 8px;font-size:24px';
  const simpleIntro=document.createElement('p');simpleIntro.textContent='Tus diseños están guardados. Revisa las recomendaciones con un solo botón y aprueba únicamente las compatibles. No se realizan pedidos ni pagos.';
  const countLine=document.createElement('div');countLine.setAttribute('role','status');countLine.style.cssText='padding:12px;margin:14px 0;background:#eaf1f7;border-radius:9px;font-weight:650';countLine.textContent='Consultando el estado de tus productos…';
  simplePanel.append(simpleHeading,simpleIntro,countLine);
  const simpleSteps=document.createElement('p');simpleSteps.textContent='1. Analizar diseños  →  2. Revisar coincidencias  →  3. Aprobar las correctas';simpleSteps.style.cssText='font-weight:650;margin:12px 0';simplePanel.append(simpleSteps);
  bulkPanel.style.cssText='padding:12px 0;background:transparent;border:0';
  bulkPanel.querySelector('h3').textContent='Revisión de los productos guardados';
  bulkPanel.querySelector('p').textContent='Los productos sin colores, tallas o compatibilidad confirmada quedarán pendientes. No necesitas subirlos de nuevo.';
  bulkReview.textContent='Revisar mis productos automáticamente';
  bulkApprove.textContent='Aprobar las recomendaciones seleccionadas';
  simplePanel.append(bulkPanel);
  const advanced=document.createElement('details');advanced.style.cssText='margin:20px 0;padding:14px;border:1px solid #dce4ea;border-radius:11px';
  const advancedSummary=document.createElement('summary');advancedSummary.textContent='Herramientas técnicas y diagnóstico (opcional)';advancedSummary.style.cssText='font-weight:650;cursor:pointer';advanced.append(advancedSummary,gelatoPanel);
  const sectionSettings=sections['configuracion'];
  sectionSettings.prepend(advanced);
  sectionSettings.prepend(simplePanel);
  const updateCount=async()=>{
    try{
      const response=await fetch('/api/tienda-preview?action=gelato_links',{credentials:'same-origin',cache:'no-store'});
      const data=await response.json();if(!data.ok)throw Error('sin datos');
      const total=(data.items||[]).length,approved=(data.links||[]).length;
      countLine.textContent=data.linksAvailable===false?total+' productos guardados · Estado de las vinculaciones temporalmente no disponible':total+' productos guardados · '+approved+' vinculaciones aprobadas · '+Math.max(0,total-approved)+' pendientes';
    }catch(e){countLine.textContent='Tus diseños siguen guardados. No se pudo consultar su estado en este momento.'}
  };
  updateCount();
  bulkApprove.addEventListener('click',()=>{setTimeout(updateCount,1200)});
  bulkReview.addEventListener('click',()=>{bulkStatus.textContent='Buscando coincidencias seguras. Las fichas sin información suficiente quedarán pendientes.'});
  gelatoPanel.querySelector('#sdl-verify-gelato').addEventListener('click',async()=>{
    const button=gelatoPanel.querySelector('#sdl-verify-gelato'),output=gelatoPanel.querySelector('#sdl-gelato-result');
    button.disabled=true;output.textContent='Consultando a Gelato…';
    try{
      const response=await fetch('/api/tienda-preview?action=gelato_status',{credentials:'same-origin',cache:'no-store',headers:{'Accept':'application/json'}});
      const data=await response.json();
      if(data.connected===true&&data.httpStatus===200)output.textContent='✓ Conexión Gelato verificada (HTTP 200). Solo lectura: pagos y pedidos continúan desactivados.';
      else if(response.status===403)output.textContent='Sesión privada no autorizada. Vuelve a iniciar sesión y repite la prueba.';
      else output.textContent='Conexión no verificada: '+(data.reason||('respuesta HTTP '+(data.httpStatus||response.status)))+'. No se ha generado ningún pedido.';
    }catch(error){output.textContent='No se pudo completar la comprobación. Revisa la conexión y vuelve a intentarlo.'}
    finally{button.disabled=false}
  });
  // Recomendación conservadora: solo variantes con UID y atributos verificables.
  const creationSection=sections['crear-producto'];
  const createForm=creationSection.querySelector('form[action]');
  if(createForm){
    const recommendation=document.createElement('section');
    recommendation.id='sdl-auto-gelato-match';
    recommendation.style.cssText='grid-column:1/-1;padding:18px;border:1px solid #b5904c;border-radius:12px;background:#edf3f8;color:#122942';
    recommendation.innerHTML='<h3 style="margin:0 0 6px">Gelato · recomendación automática</h3><p style="margin:0 0 12px">Elige una categoría, color y talla en la ficha. Se buscan modelos reales de Gelato; la primera recomendación requiere aprobación. No se guarda aún ninguna vinculación comercial ni se generan pedidos.</p><button type="button" id="sdl-auto-find" style="padding:10px 15px;background:#09243a;color:white;border:0;border-radius:7px;cursor:pointer">Buscar modelo compatible</button><div id="sdl-auto-results" role="status" aria-live="polite" style="margin-top:12px"></div>';
    createForm.append(recommendation);
    const categoryMap={'camisetas':'t-shirts','sudaderas':'sweatshirts','tazas':'mugs'};
    const findInputs=()=>({category:createForm.querySelector('[name="category"]')?.value||'',color:createForm.querySelector('[name="color"]')?.value||'',size:createForm.querySelector('[name="size"]')?.value||''});
    const btn=recommendation.querySelector('#sdl-auto-find'),result=recommendation.querySelector('#sdl-auto-results');
    const recommendationState={approved:null};
    createForm.addEventListener('change',()=>{recommendationState.approved=null;result.textContent='La ficha cambió. Comprueba de nuevo la compatibilidad antes de aprobar un modelo.'});
    btn.addEventListener('click',async()=>{
      const info=findInputs(),catalog=categoryMap[String(info.category).toLowerCase()];
      recommendationState.approved=null;
      if(!catalog){result.textContent='Aún no hay búsqueda automática disponible para esta categoría. No se asociará ningún modelo.';return;}
      btn.disabled=true;result.textContent='Consultando modelos en Gelato…';
      try{
        const response=await fetch('/api/tienda-preview?action=gelato_models&catalog='+encodeURIComponent(catalog),{credentials:'same-origin',cache:'no-store'});
        const data=await response.json();
        if(!data.ok){result.textContent='Gelato no pudo verificarse: '+(data.reason||response.status);return;}
        const desired=[info.color,info.size].map(x=>String(x).trim().toLowerCase()).filter(Boolean);
        if(!desired.length){result.textContent='Selecciona primero el color y la talla. No se puede certificar una variante sin esos datos.';return;}
        const candidates=(data.products||[]).filter(p=>p.uid&&desired.every(value=>Object.values(p.attributes||{}).some(attribute=>String(attribute).toLowerCase()===value)));
        if(!candidates.length){result.textContent='Ningún modelo de la primera página coincide exactamente con los atributos elegidos. No se hizo ninguna vinculación. Ajusta la selección o comprueba el catálogo completo.';return;}
        const model=candidates[0];
        result.replaceChildren();
        const title=document.createElement('p');title.textContent='Primera coincidencia exacta (pendiente de revisar impresión y envíos): '+model.uid;result.append(title);
        const details=document.createElement('p');details.textContent=Object.entries(model.attributes||{}).map(([k,v])=>k+': '+v).join(' · ');result.append(details);
        const approve=document.createElement('button');approve.type='button';approve.textContent='Aprobar esta recomendación para revisión';approve.style.cssText='padding:10px 14px;border:1px solid #b5904c;border-radius:7px;background:white;color:#102942;cursor:pointer';
        approve.addEventListener('click',()=>{recommendationState.approved=model.uid;const note=document.createElement('p');note.textContent='✓ Recomendación revisada en esta sesión. Aún NO se guarda como vínculo de producción ni se publica el artículo.';result.append(note);approve.disabled=true});
        result.append(approve);
      }catch(e){result.textContent='No fue posible consultar a Gelato. No se hizo ninguna vinculación.'}
      finally{btn.disabled=false}
    });
  }
  // Opciones del proveedor directamente en Nuevo producto; consulta real y sin pedidos.
  if(createForm){
    const categorySelect=createForm.querySelector('[name="category"]');
    const block=document.createElement('section');block.id='sdl-gelato-product-options';
    block.style.cssText='grid-column:1/-1;padding:18px;border:1px solid #bed0df;border-radius:12px;background:#f4f8fc;color:#16314c';
    block.innerHTML='<h3 style="margin:0 0 8px">Opciones reales de Gelato</h3><p>Elige el color base y las tallas disponibles para el tipo de producto. Los modelos se consultan al proveedor. No se hacen pedidos ni se publica el artículo.</p><label style="display:block;margin:8px 0">Color base de Gelato <select id="sdl-base-gelato-color" style="width:100%;padding:10px;border:1px solid #a6bdcd;border-radius:8px"><option value="">Selecciona la categoría primero</option></select></label><fieldset style="margin:12px 0;padding:12px;border:1px solid #afc5d5;border-radius:9px"><legend>Tallas reales de Gelato para ese color</legend><div id="sdl-real-size-options">Selecciona un color base.</div></fieldset><p id="sdl-gelato-options-state" role="status">Consultando opciones…</p><small>El artículo se guarda como borrador. La vinculación definitiva y los archivos de impresión requieren aprobación posterior.</small>';
    const before=createForm.querySelector('#sdl-auto-gelato-match');
    if(before)createForm.insertBefore(block,before);else createForm.append(block);
    if(before)before.hidden=true;
    const colorSelect=block.querySelector('#sdl-base-gelato-color'),sizes=block.querySelector('#sdl-real-size-options'),message=block.querySelector('#sdl-gelato-options-state');
    const categories={'Camisetas':'t-shirts','Sudaderas':'sweatshirts','Tazas':'mugs'};
    let models=[],requestVersion=0;
    const modelLabel=document.createElement('label');modelLabel.textContent='Modelo de fabricación Gelato ';
    const modelSelect=document.createElement('select');modelSelect.style.cssText='width:100%;padding:10px;border:1px solid #a6bdcd;border-radius:8px';modelLabel.append(modelSelect);colorSelect.parentElement.before(modelLabel);
    const humanModelName=(key,i)=>{
      const a=Object.fromEntries(JSON.parse(key));
      const manufacturer=String(a.ApparelManufacturer||'').trim();
      const brand=manufacturer&&manufacturer!=='none'?manufacturer.toUpperCase():'Marca no indicada';
      const sku=a.ApparelManufacturerSKU&&a.ApparelManufacturerSKU!=='none'?' · Ref. '+a.ApparelManufacturerSKU:'';
      const cut=a.GarmentCut==='unisex'?'Unisex':a.GarmentCut||'';
      const quality=a.GarmentQuality==='classic'?'Clásica':a.GarmentQuality||'';
      const collar=a.GarmentSubcategory==='crewneck'?'Cuello redondo':a.GarmentSubcategory||'';
      const print=String(a.GarmentPrint||'');
      const detail=print.includes('inlbl')?' · Etiqueta interior':print.includes('bk')?' · Incluye espalda':print.includes('shsl')?' · Incluye manga':' · Impresión básica';
      return [brand+sku,cut,quality,collar].filter(Boolean).join(' · ')+detail+' · Variante '+(i+1);
    };
    const destinationPicker=document.createElement('label');destinationPicker.textContent='País donde recibirá el comprador ';
    const countrySelect=document.createElement('select');
    [['EC','Ecuador'],['US','Estados Unidos'],['CA','Canadá'],['ES','España'],['MX','México'],['CO','Colombia'],['PE','Perú'],['CL','Chile'],['GB','Reino Unido']].forEach(([code,name])=>{const option=document.createElement('option');option.value=code;option.textContent=name;countrySelect.append(option)});
    destinationPicker.append(countrySelect);modelLabel.before(destinationPicker);
    const availableInCountry=p=>Array.isArray(p.supportedCountries)&&p.supportedCountries.includes(countrySelect.value);
    const updateCountryColors=()=>{
      const before=colorSelect.value;
      const values=[...new Set(models.filter(availableInCountry).map(p=>p.attributes?.GarmentColor).filter(Boolean))].sort();
      colorSelect.replaceChildren();
      const first=document.createElement('option');first.value='';first.textContent='Selecciona color compatible';colorSelect.append(first);
      for(const v of values){const option=document.createElement('option');option.value=v;option.textContent=v;colorSelect.append(option)}
      colorSelect.value=values.includes(before)?before:'';
      colorSelect.disabled=!values.length;
      refreshPrintOptions();
      colorSelect.dispatchEvent(new Event('change'));
      if(!values.length)message.textContent='No hay variantes compatibles con '+countrySelect.selectedOptions[0].textContent+' en los resultados consultados. Prueba otro modelo o país.';
    };
    countrySelect.addEventListener('change',updateCountryColors);
    const modelKey=p=>JSON.stringify(Object.entries(p.attributes||{}).filter(([k])=>!['GarmentColor','GarmentSize','ProductStatus'].includes(k)).sort(([a],[b])=>a.localeCompare(b)));
    const simplifiedPrintType=key=>{
      const a=Object.fromEntries(JSON.parse(key)),code=String(a.GarmentPrint||'').toLowerCase();
      const inner=code.includes('inlbl'),both=code.startsWith('4-4'),front=code.startsWith('4-0');
      const sleeves=code.includes('shsll')&&code.includes('shslr');
      return inner&&both&&sleeves?'amplia':inner&&both&&!sleeves?'dos_caras':inner&&front&&!sleeves?'frontal':null;
    };
    const simplePrintLabel=(key)=>{
      const type=simplifiedPrintType(key);
      return type==='amplia'?'Frente + espalda + ambas mangas + etiqueta interior':type==='dos_caras'?'Frente + espalda + etiqueta interior':type==='frontal'?'Frente + etiqueta interior':'No disponible';
    };
    const refreshPrintOptions=()=>{
      const prior=modelSelect.value;
      modelSelect.replaceChildren();
      const first=document.createElement('option');first.value='';first.textContent='Elige tipo de impresión';modelSelect.append(first);
      const seen=new Set();
      for(const key of [...new Set(models.filter(qualifies).filter(availableInCountry).map(modelKey))]){
        const type=simplifiedPrintType(key);
        if(!type)continue;
        const a=Object.fromEntries(JSON.parse(key));
        const garment=[a.ApparelManufacturer&&a.ApparelManufacturer!=='none'?String(a.ApparelManufacturer).toUpperCase():'Fabricante no indicado',a.ApparelManufacturerSKU&&a.ApparelManufacturerSKU!=='none'?a.ApparelManufacturerSKU:'',a.GarmentCut||''].filter(Boolean).join(' ');
        const name=type+'|'+garment;
        if(seen.has(name))continue;
        seen.add(name);
        const option=document.createElement('option');option.value=key;option.textContent=simplePrintLabel(key)+' — '+garment;modelSelect.append(option);
      }
      if([...modelSelect.options].some(o=>o.value===prior))modelSelect.value=prior;
    };

    const compatible=p=>p.attributes?.GarmentColor===colorSelect.value&&(!modelSelect.value||modelKey(p)===modelSelect.value);
    const garment=(p)=>p.attributes||{};
    const qualifies=(p)=>Array.isArray(p.supportedCountries)&&p.supportedCountries.includes(countrySelect.value)&&p.uid&&String(garment(p).ProductStatus||'').toLowerCase()==='activated'&&!['kids','youth','children'].includes(String(garment(p).GarmentCut||'').toLowerCase());
    const refreshSizes=()=>{
      sizes.replaceChildren();
      const options=[...new Set(models.filter(compatible).map(p=>String(garment(p).GarmentSize||'')).filter(Boolean))];
      if(!options.length){sizes.textContent='Este artículo no presenta tallas en la selección actual.';return}
      options.sort((a,b)=>['XS','S','M','L','XL','2XL','3XL','4XL','5XL'].indexOf(a)-['XS','S','M','L','XL','2XL','3XL','4XL','5XL'].indexOf(b));
      for(const size of options){const label=document.createElement('label');label.style.cssText='display:inline-flex;gap:6px;align-items:center;margin:5px 12px 5px 0';const input=document.createElement('input');input.type='checkbox';input.value=size;input.name='gelato_size';label.append(input,document.createTextNode(size));sizes.append(label)}
      message.textContent=options.length+' tallas encontradas para el color '+colorSelect.value+'. Verifica el modelo antes de aprobar fabricación.';
    };
    const searchBox=document.createElement('div');
    searchBox.style.cssText='display:flex;flex-direction:column;gap:8px;align-items:stretch;width:100%;max-width:100%;min-width:0;margin:12px 0;box-sizing:border-box;overflow:hidden';
    searchBox.innerHTML='<input type="search" placeholder="Buscar color: navy, azul marino, negro…" aria-label="Buscar color en todo Gelato" style="display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;padding:10px;border:1px solid #a4bed4;border-radius:7px"><button type="button" style="display:block;width:100%;max-width:100%;box-sizing:border-box;white-space:normal;padding:10px 12px;background:#163c58;color:white;border:0;border-radius:7px;cursor:pointer">Buscar en Gelato</button>';
    colorSelect.parentElement.before(searchBox);
    searchBox.querySelector('button').addEventListener('click',async()=>{
      const term=searchBox.querySelector('input').value.trim().toLowerCase();
      const aliases={'azul marino':'navy','azul nocturno':'navy','negro':'black','blanco':'white','gris carbon':'charcoal','gris carbón':'charcoal'};
      const chosen=aliases[term]||term;
      if(chosen.length<2){message.textContent='Escribe un color para buscar.';return}
      const catalogUid=categories[categorySelect?.value];
      if(!catalogUid){message.textContent='Selecciona primero la categoría.';return}
      const index=requestVersion;const btn=searchBox.querySelector('button');btn.disabled=true;message.textContent='Buscando '+chosen+' en Gelato…';
      try{
        const batches=[];
        for(const offset of [0,100,200]){
          const response=await fetch('/api/tienda-preview?action=gelato_models&adult=1&catalog='+encodeURIComponent(catalogUid)+'&color='+encodeURIComponent(chosen)+'&offset='+offset,{credentials:'same-origin',cache:'no-store'});
          const data=await response.json();if(!data.ok)throw Error(data.reason||'Gelato no disponible');
          batches.push(data.products||[]);
          if((data.products||[]).length<100)break;
        }
        if(index!==requestVersion)return;
        const incoming=batches.flat().filter(p=>p.uid);
        const existing=new Set(models.map(p=>p.uid));for(const p of incoming){if(!existing.has(p.uid)){models.push(p);existing.add(p.uid)}}
        const colors=[...new Set(incoming.map(p=>p.attributes?.GarmentColor).filter(Boolean))];
        for(const v of colors){if(!Array.from(colorSelect.options).some(o=>o.value===v)){const o=document.createElement('option');o.value=v;o.textContent=v;colorSelect.append(o)}}
        if(colors.length){colorSelect.disabled=false;colorSelect.value=colors[0];modelSelect.value='';colorSelect.dispatchEvent(new Event('change'));}
        refreshPrintOptions();
        message.textContent=colors.length?'Se encontraron colores: '+colors.join(', ')+'. Selecciona el color y modelo correspondiente.':'No aparece '+chosen+' en los resultados del catálogo consultado.';
      }catch(e){message.textContent='Error al buscar el color en Gelato: '+e.message}finally{btn.disabled=false}
    });
    colorSelect.addEventListener('change',refreshSizes);
    async function refreshGelato(){
      const version=++requestVersion,category=categories[categorySelect?.value];
      models=[];colorSelect.replaceChildren();sizes.textContent='';message.textContent='Consultando el catálogo real de Gelato…';
      const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Selecciona un color base';colorSelect.append(placeholder);
      if(!category){message.textContent='Esta categoría no está enlazada todavía a productos de Gelato. El artículo solo se guardará como borrador.';return}
      try{
        const pages=await Promise.all([0,100].map(async offset=>{
          const response=await fetch('/api/tienda-preview?action=gelato_models&catalog='+category+'&adult=1&offset='+offset,{credentials:'same-origin',cache:'no-store'});
          const data=await response.json();if(!data.ok)throw Error(data.reason||'No se pudo consultar Gelato');return data.products||[];
        }));
        if(version!==requestVersion)return;
        models=pages.flat().filter(qualifies);
        modelSelect.replaceChildren();const choose=document.createElement('option');choose.value='';choose.textContent='Escoge el modelo concreto';modelSelect.append(choose);
        refreshPrintOptions();
        modelSelect.addEventListener('change',refreshSizes);
        const colors=[...new Set(models.map(p=>String(garment(p).GarmentColor||'')).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
        for(const color of colors){const o=document.createElement('option');o.value=color;o.textContent=color;colorSelect.append(o)}
        message.textContent=colors.length?colors.length+' colores base encontrados en Gelato. Elige uno para mostrar sus tallas.':'Gelato no proporcionó colores compatibles en esta consulta. No se asignará un modelo supuesto.';
      }catch(e){if(version===requestVersion)message.textContent='No se pudo consultar Gelato: '+e.message+'. Revisa la conexión; no se seleccionarán variantes inventadas.'}
    }
    categorySelect?.addEventListener('change',refreshGelato);
    refreshGelato();
    createForm.addEventListener('submit',()=>{
      const selected=Array.from(sizes.querySelectorAll('input:checked')).map(i=>i.value);
      createForm.querySelector('[name="gelato_variant_uids"]')?.remove();
      const matched=selected.map(size=>models.filter(m=>compatible(m)&&m.attributes?.GarmentSize===size));
      const exact=matched.filter(c=>c.length===1).map(c=>({size:c[0].attributes.GarmentSize,color:colorSelect.value,uid:c[0].uid}));
      if(exact.length){const hidden=document.createElement('input');hidden.type='hidden';hidden.name='gelato_variant_uids';hidden.value=JSON.stringify(exact);createForm.append(hidden)}
      if(selected.length&&exact.length!==selected.length){message.textContent='Hay variantes con varios modelos posibles o sin coincidencias. Solo se verificarán los identificadores únicos; las demás tallas quedan pendientes de selección de modelo.';}

      const hiddenColors=createForm.querySelector('#sdl-variant-colors');
      const isMultiColor=createForm.querySelector('#sdl-enable-color-variants')?.checked;
      if(hiddenColors&&colorSelect.value&&!isMultiColor)hiddenColors.value=colorSelect.value;

      const internal=createForm.querySelector('#sdl-gelato-draft-details')||document.createElement('input');
      internal.type='hidden';internal.id='sdl-gelato-draft-details';internal.name='gelato_configuration_reference';
      internal.value=JSON.stringify({catalog:categories[categorySelect?.value]||'',color:colorSelect.value,sizes:selected});
      if(!internal.parentNode)createForm.append(internal);
    });
  }
  // Edición de productos registrados: mismos colores y tallas reales de Gelato.
  // Piloto AOP: flujo único y honesto, sin habilitar ventas.
  const pilot=document.createElement('section');
  pilot.id='sdl-aop-pilot';pilot.style.cssText='border:1px solid #b2c7d8;border-radius:12px;padding:16px;background:#f1f6fb;color:#16314c;margin:0 0 18px;max-width:100%;box-sizing:border-box';
  pilot.innerHTML='<h3 style="margin:0 0 6px">Producto de referencia · Origen de la Manada — Azul Nocturno</h3><p style="margin:0 0 10px">Continuaremos con Gelato y sus áreas de impresión verificables. Todos los modelos seleccionables requieren etiqueta interior.</p><ol style="padding-left:22px;margin:0 0 12px"><li><b>Proveedor AOP:</b> por confirmar compatibilidad y envíos a Ecuador</li><li><b>Plantilla de fabricación:</b> pendiente de obtener del proveedor elegido</li><li><b>Arte imprimible:</b> pendiente de preparar sobre esa plantilla; las fotos actuales son mockups</li><li><b>Prueba y costos:</b> pendiente de validar</li></ol><p style="font-weight:700;margin:0 0 9px">Estado: configuración de Gelato pendiente de validación</p><a href="https://www.printful.com/es/print-on-demand" target="_blank" rel="noopener" style="display:inline-block;padding:10px 13px;border-radius:7px;background:#183c58;color:white;text-decoration:none">Consultar proveedor AOP</a><p style="font-size:12px;margin:10px 0 0">Usaremos exclusivamente impresión por zonas de Gelato. La selección no activa pedidos ni cobros. No se crean pedidos ni cobros.</p>';
  sections['productos-registrados'].prepend(pilot);
  const existingForms=Array.from(sections['productos-registrados'].querySelectorAll('form')).filter(form=>form.querySelector('[name="action"][value="edit_registered_product"]'));
  // Modo piloto seguro: las fichas restantes siguen guardadas y accesibles desde el respaldo desplegable.
  const pilotId='SDL-NEW-1791835993474996';
  const pilotForm=existingForms.find(f=>(f.querySelector('[name="ids"]')?.value||'').split(',').includes(pilotId));
  if(pilotForm){
    const backup=document.createElement('details');backup.id='sdl-other-products-backup';
    backup.style.cssText='margin:18px 0;border:1px solid #bfd0dd;border-radius:10px;padding:12px;max-width:100%;box-sizing:border-box';
    const summary=document.createElement('summary');summary.textContent='Otros productos guardados · Mostrar solo cuando los necesite';
    summary.style.cssText='cursor:pointer;font-weight:650;color:#264966';backup.append(summary);
    const nonPilot=existingForms.filter(f=>f!==pilotForm);
    nonPilot.forEach(f=>{const card=f.closest('.sdl-reg-card')||f;backup.append(card)});
    const pilotCard=pilotForm.closest('.sdl-reg-card')||pilotForm;
    pilotCard.before(backup);
    pilotCard.style.border='2px solid #547e9b';
    const badge=document.createElement('p');badge.textContent='PRODUCTO PILOTO · configurar primero este producto';badge.style.cssText='font-weight:750;color:#164362;padding:9px;background:#e6f3fb;border-radius:8px';
    pilotCard.prepend(badge);
  }
  for(const form of existingForms){
    const area=document.createElement('fieldset');area.style.cssText='display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;overflow:hidden;grid-column:1/-1;border:1px solid #abc4d8;border-radius:10px;padding:12px;margin:12px 0';
    area.innerHTML='<legend>Configurar fabricación en Gelato</legend><label>Categoría de Gelato <select data-gelato-catalog><option value="">Elegir categoría</option><option value="t-shirts">Camiseta unisex para adultos (recomendada para Origen)</option><option value="sweatshirts">Sudaderas y hoodies (recomendado para colección sudaderas)</option><option value="mugs">Tazas para personalizar</option></select></label><label>Color base real de Gelato <select data-gelato-color disabled><option value="">Selecciona categoría primero</option></select></label><fieldset style="border:1px solid #d6e0e8;padding:10px;margin-top:10px"><legend>Tallas disponibles para el color</legend><div data-gelato-sizes>Selecciona categoría y color</div></fieldset><p data-gelato-state role="status">La vinculación será guardada como pendiente de verificación, sin activar pedidos.</p>';
    form.append(area);
    const artwork=document.createElement('section');
    artwork.style.cssText='border:1px solid #c1d1df;border-radius:8px;padding:12px;margin-top:12px;box-sizing:border-box;max-width:100%;overflow:hidden';
    const areaNames=[['front','Frente'],['back','Espalda'],['left_sleeve','Manga izquierda'],['right_sleeve','Manga derecha'],['inner_label','Etiqueta interior']];
    const productId=(form.querySelector('[name="ids"]')?.value||'').split(',').filter(Boolean)[0]||'';
    const title=document.createElement('strong');title.textContent='Archivos de fabricación';
    const help=document.createElement('p');help.style.fontSize='12px';help.textContent='Elige un archivo para cada zona que quieras actualizar. Las zonas ya guardadas permanecen intactas si no eliges un nuevo archivo.';
    const existing=document.createElement('p'),uploadMessage=document.createElement('p');
    existing.style.fontSize='12px';uploadMessage.style.fontSize='12px';
    const masterWrap=document.createElement('section');
    masterWrap.style.cssText='border:2px solid #2778a9;border-radius:10px;padding:14px;margin:12px 0;background:#f4f9fe';
    const masterTitle=document.createElement('strong');masterTitle.textContent='PDF maestro de fabricación · hasta 100 MB';
    const masterNote=document.createElement('p');masterNote.style.cssText='font-size:12px';masterNote.textContent='Sube un solo PDF con ficha técnica, diseños, mangas y etiqueta. El archivo se conserva privado; no activa ventas ni se envía al fabricante.';
    const masterPicker=document.createElement('input');masterPicker.type='file';masterPicker.accept='.pdf,application/pdf';masterPicker.style.cssText='display:block;width:100%;max-width:100%;margin:12px 0';
    const masterButton=document.createElement('button');masterButton.type='button';masterButton.textContent='Subir PDF maestro';masterButton.style.cssText='background:#14577b;color:white;padding:11px 18px;border:0;border-radius:7px;cursor:pointer';
    const masterStatus=document.createElement('p');masterStatus.setAttribute('role','status');masterStatus.style.cssText='font-size:12px;color:#23465f';
    masterWrap.append(masterTitle,masterNote,masterPicker,masterButton,masterStatus);
    masterButton.addEventListener('click',async()=>{
      const file=masterPicker.files?.[0];
      if(!file){masterStatus.textContent='Selecciona un PDF.';return}
      if(file.size>104857600||file.size<100||!file.name.toLowerCase().endsWith('.pdf')||file.type&&file.type!=='application/pdf'){masterStatus.textContent='Solo PDF de hasta 100 MB.';return}
      const header=await file.slice(0,5).text();
      if(header!=='%PDF-'){masterStatus.textContent='El archivo no contiene una cabecera PDF válida.';return}
      if(!/^SDL-NEW-[0-9]{8,16}$/.test(productId)){masterStatus.textContent='Guarda primero el producto para asignarle un código válido.';return}
      masterButton.disabled=true;masterStatus.textContent='Solicitando almacenamiento privado...';
      try{
       const init=await fetch('/api/tienda-preview',{method:'POST',credentials:'same-origin',headers:{Accept:'application/json'},body:new URLSearchParams({action:'create_master_pdf_upload',id:productId,size:String(file.size),filename:file.name})});
       const data=await init.json();
       if(!init.ok||!data.ok)throw Error(data.reason||'No se pudo iniciar la subida.');
       masterStatus.textContent='Subiendo documento original ('+(file.size/1048576).toFixed(1)+' MB)...';
       const sent=await fetch(data.uploadUrl,{method:'PUT',headers:{'Content-Type':'application/pdf'},body:file});
       if(!sent.ok)throw Error('El almacenamiento rechazó el archivo ('+sent.status+').');
       masterStatus.textContent='PDF guardado en almacenamiento privado. Pendiente de revisión técnica; no publicado ni enviado a fabricación.';
       masterPicker.value='';
      }catch(e){masterStatus.textContent='No se pudo guardar el PDF: '+String(e.message||e)+'. Los documentos anteriores siguen intactos.';}
      finally{masterButton.disabled=false}
    });
    const legacy=document.createElement('details');legacy.style.cssText='margin-top:12px';
    const legacyTitle=document.createElement('summary');legacyTitle.textContent='Archivos individuales anteriores (respaldo)';legacy.append(legacyTitle);
    const fileInputs=new Map();
    artwork.append(title,help,masterWrap,legacy);
    for(const [key,label] of areaNames){
      const row=document.createElement('label');row.style.cssText='display:block;border-top:1px solid #d5e1e9;padding:9px 0;font-size:12px';
      const name=document.createElement('strong');name.textContent=label;name.style.display='block';
      const picker=document.createElement('input');picker.type='file';picker.accept='image/png,image/jpeg,image/webp';picker.style.cssText='display:block;width:100%;max-width:100%;margin-top:5px;box-sizing:border-box';
      row.append(name,picker);legacy.append(row);fileInputs.set(key,picker);
    }
    legacy.append(existing,uploadMessage);area.append(artwork);
    let uploadedAreas=new Set();
    const updateExisting=()=>{existing.textContent='Guardados: '+(areaNames.filter(([key])=>uploadedAreas.has(key)).map(([,name])=>name).join(', ')||'ninguno')+' · Pendientes de validación técnica'};
    fetch('/api/tienda-preview?action=gelato_print_status',{credentials:'same-origin',cache:'no-store'}).then(r=>r.json()).then(data=>{
      if(!data.ok)return;uploadedAreas=new Set((data.files||[]).filter(f=>f.product_id===productId).map(f=>f.area));updateExisting();
    }).catch(()=>{existing.textContent='No se pudo consultar el estado de archivos guardados.'});
    const uploadSelected=async()=>{
      const selected=areaNames.map(([key,label])=>({key,label,file:fileInputs.get(key)?.files?.[0]})).filter(item=>item.file);
      if(!selected.length){uploadMessage.textContent='Se conservaron los archivos que ya estaban guardados.';return true}
      for(const item of selected){
        if(item.file.size>2000000||!['image/png','image/jpeg','image/webp'].includes(item.file.type)){
          uploadMessage.textContent='Archivo inválido en '+item.label+'. Usa PNG, JPG o WebP de máximo 2 MB.';return false;
        }
      }
      for(let i=0;i<selected.length;i++){
        const {key,label,file}=selected[i];
        uploadMessage.textContent='Guardando '+label+' ('+(i+1)+' de '+selected.length+')…';
        try{
          const image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');reader.onerror=reject;reader.readAsDataURL(file)});
          const response=await fetch('/api/tienda-preview',{method:'POST',credentials:'same-origin',headers:{Accept:'application/json'},body:new URLSearchParams({action:'upload_gelato_print_file',id:productId,area:key,mime:file.type,image})});
          const result=await response.json();if(!response.ok||!result.ok)throw Error(result.reason||'falló el guardado');
          uploadedAreas.add(key);updateExisting();fileInputs.get(key).value='';
        }catch(error){uploadMessage.textContent='No se pudo guardar '+label+': '+error.message+'. Se mantienen los demás archivos.';return false}
      }
      uploadMessage.textContent='Archivos seleccionados guardados. Pendientes de validación técnica con Gelato.';
      return true;
    };
    const saveGelato=document.createElement('button');
    saveGelato.type='button';saveGelato.textContent='Guardar archivos y verificar selección';
    saveGelato.style.cssText='display:block;width:100%;padding:12px;background:#16496a;color:white;font-weight:700;border:0;border-radius:8px;margin-top:12px;cursor:pointer;box-sizing:border-box';
    const saveHint=document.createElement('p');
    saveHint.style.cssText='font-size:12px;margin:7px 0;color:#325470';
    saveHint.textContent='Guarda los archivos seleccionados y comprueba la selección de variantes. No envía archivos a Gelato ni realiza pedidos.';
    area.append(saveGelato,saveHint);
    saveGelato.addEventListener('click',async()=>{
      saveGelato.disabled=true;
      try{if(!(await uploadSelected()))return;}finally{saveGelato.disabled=false;}
      const id=form.querySelector('[name="gelato_target_id"]');
      if(id&&!id.value){const selected=form.querySelector('[name="gelato_store_color"]')?.selectedOptions?.[0];if(selected?.dataset.target)id.value=selected.dataset.target;else{saveHint.textContent='Primero elige el color que quieres configurar.';return}}
      const sel=area.querySelector('[data-gelato-catalog]'),base=area.querySelector('[data-gelato-color]');
      if(!sel?.value||!base?.value){saveHint.textContent='Selecciona la categoría y el color real de Gelato antes de guardar.';return}
      const options=area.querySelectorAll('[data-gelato-sizes] input:checked');
      if(!options.length){saveHint.textContent='Marca al menos una talla para guardar la selección.';return}
      saveHint.textContent='Guardando datos del producto y configuración de Gelato…';
      form.requestSubmit();
    });
    form.style.minWidth='0';form.style.maxWidth='100%';form.style.boxSizing='border-box';
    area.querySelectorAll('select,input').forEach(el=>{el.style.maxWidth='100%';el.style.minWidth='0';el.style.boxSizing='border-box'});
    const ids=(form.querySelector('[name="ids"]')?.value||'').split(',').filter(Boolean);
    if(ids.length>1){
      const row=document.createElement('label');row.textContent='Registro específico del diseño ';
      const selector=document.createElement('select');selector.name='gelato_target_id';selector.required=false;
      const blank=document.createElement('option');blank.value='';blank.textContent='Selecciona un registro para Gelato';selector.append(blank);
      ids.forEach((id,i)=>{const opt=document.createElement('option');opt.value=id;opt.textContent=({ 'SDL-NEW-1791835993474996':'Azul Nocturno', 'SDL-NEW-1791836652799947':'Blanco Lunar, Dorado Arena, Gris Oscuro, Gris Plata y Verde Oliva' }[id]||'Versión '+(i+1));selector.append(opt)});
      row.append(selector);area.insertBefore(row,area.firstChild);
    }
    const colorChoice=document.createElement('label');colorChoice.textContent='Color comercial de esta camiseta ';
    const shirtColor=document.createElement('select');shirtColor.name='gelato_store_color';
    shirtColor.style.cssText='display:block;width:100%;max-width:100%;box-sizing:border-box;padding:7px;margin:5px 0 12px';
    colorChoice.append(shirtColor);
    area.insertBefore(colorChoice,area.querySelector('[data-gelato-catalog]').parentElement);
    const storeColors={
      'SDL-NEW-1791835993474996':['Azul Nocturno'],
      'SDL-NEW-1791836652799947':['Blanco Lunar'],
      'SDL-NEW-1792868400001':['Dorado Arena'],
      'SDL-NEW-1792868400002':['Gris Oscuro'],
      'SDL-NEW-1792868400003':['Gris Plata'],
      'SDL-NEW-1792868400004':['Verde Oliva']
    };
    const targetChoice=form.querySelector('[name="gelato_target_id"]');
    const fillShirtColors=()=>{
      shirtColor.replaceChildren();
      const records=targetChoice?.value?[targetChoice.value]:ids;
      for(const id of records){for(const name of storeColors[id]||[]){
       const opt=document.createElement('option');opt.value=name;opt.textContent=name;opt.dataset.target=id;shirtColor.append(opt);
      }}
      if(!shirtColor.options.length){const opt=document.createElement('option');opt.value='';opt.textContent='Sin colores identificados';shirtColor.append(opt)}
    };
    targetChoice?.addEventListener('change',fillShirtColors);fillShirtColors();
    const statusGrid=document.createElement('div');statusGrid.style.cssText='margin:12px 0;padding:10px;border:1px solid #c5d4df;border-radius:8px;font-size:12px;line-height:1.8';
    statusGrid.textContent='Comprobando el estado de los colores…';area.append(statusGrid);
    fetch('/api/tienda-preview?action=gelato_color_status',{credentials:'same-origin',cache:'no-store'}).then(r=>r.json()).then(data=>{
      if(!data.ok)throw Error('status');
      const config=data.configs||[];statusGrid.replaceChildren();
      for(const id of ids)for(const name of storeColors[id]||[]){
       const match=config.find(c=>c.product_id===id&&c.store_color===name);
       const line=document.createElement('div');
       line.textContent=name+' — '+(match?'Configuración guardada ('+match.gelato_color+', '+(match.sizes||[]).join('/')+'). Pendiente de validación':'Sin configurar');
       statusGrid.append(line);
      }
    }).catch(()=>{statusGrid.textContent='No se pudo cargar el estado. Tus diseños siguen guardados.'});
    form.addEventListener('submit',()=>{
      const field=form.querySelector('[name="gelato_store_color"]');
      if(field&&field.value&&targetChoice){
       const option=field.selectedOptions[0];
       if(option?.dataset.target)targetChoice.value=option.dataset.target;
      }
    });
    const selectedCategory=String(form.closest('.sdl-reg-card')?.querySelector('.sdl-reg-content > p')?.textContent||'');
    const catalog=area.querySelector('[data-gelato-catalog]'),color=area.querySelector('[data-gelato-color]'),sizes=area.querySelector('[data-gelato-sizes]'),status=area.querySelector('[data-gelato-state]');
    if(selectedCategory.includes('Camisetas'))catalog.value='t-shirts';else if(selectedCategory.includes('Sudaderas'))catalog.value='sweatshirts';else if(selectedCategory.includes('Tazas'))catalog.value='mugs';
    let models=[],version=0;
    const modelLabel=document.createElement('label');modelLabel.textContent='Modelo concreto de Gelato ';
    const modelSelect=document.createElement('select');modelLabel.append(modelSelect);area.insertBefore(modelLabel,color.parentElement);
    const humanModelName=(key,i)=>{
      const a=Object.fromEntries(JSON.parse(key));
      const manufacturer=String(a.ApparelManufacturer||'').trim();
      const brand=manufacturer&&manufacturer!=='none'?manufacturer.toUpperCase():'Marca no indicada';
      const sku=a.ApparelManufacturerSKU&&a.ApparelManufacturerSKU!=='none'?' · Ref. '+a.ApparelManufacturerSKU:'';
      const cut=a.GarmentCut==='unisex'?'Unisex':a.GarmentCut||'';
      const quality=a.GarmentQuality==='classic'?'Clásica':a.GarmentQuality||'';
      const collar=a.GarmentSubcategory==='crewneck'?'Cuello redondo':a.GarmentSubcategory||'';
      const print=String(a.GarmentPrint||'');
      const detail=print.includes('inlbl')?' · Etiqueta interior':print.includes('bk')?' · Incluye espalda':print.includes('shsl')?' · Incluye manga':' · Impresión básica';
      return [brand+sku,cut,quality,collar].filter(Boolean).join(' · ')+detail+' · Variante '+(i+1);
    };
    const modelKey=p=>JSON.stringify(Object.entries(p.attributes||{}).filter(([k])=>!['GarmentColor','GarmentSize','ProductStatus'].includes(k)).sort(([a],[b])=>a.localeCompare(b)));
    const simplifiedPrintType=key=>{
      const a=Object.fromEntries(JSON.parse(key)),code=String(a.GarmentPrint||'').toLowerCase();
      const inner=code.includes('inlbl'),both=code.startsWith('4-4'),front=code.startsWith('4-0');
      const sleeves=code.includes('shsll')&&code.includes('shslr');
      return inner&&both&&sleeves?'amplia':inner&&both&&!sleeves?'dos_caras':inner&&front&&!sleeves?'frontal':null;
    };
    const simplePrintLabel=(key)=>{
      const type=simplifiedPrintType(key);
      return type==='amplia'?'Frente + espalda + ambas mangas + etiqueta interior':type==='dos_caras'?'Frente + espalda + etiqueta interior':type==='frontal'?'Frente + etiqueta interior':'No disponible';
    };
    // Solo modelos Gelato que admiten Ecuador, Estados Unidos y al menos un mercado internacional habitual.
    const destinationPicker=document.createElement('label');
    destinationPicker.textContent='País de entrega para comprobar tallas ';
    destinationPicker.style.cssText='display:block;margin:10px 0;font-weight:600';
    const countrySelect=document.createElement('select');
    countrySelect.style.cssText='display:block;width:100%;max-width:430px;padding:8px;margin-top:5px';
    [['EC','Ecuador'],['US','Estados Unidos'],['CA','Canadá'],['ES','España'],['MX','México'],['CO','Colombia'],['PE','Perú'],['CL','Chile'],['GB','Reino Unido'],['FR','Francia'],['DE','Alemania'],['IT','Italia'],['AU','Australia'],['BR','Brasil']].forEach(([code,name])=>{
      const option=document.createElement('option');option.value=code;option.textContent=name;countrySelect.append(option);
    });
    destinationPicker.append(countrySelect);
    area.insertBefore(destinationPicker,area.querySelector('[data-gelato-catalog]')?.parentElement||area.firstChild);
    const requiredDestinations=['EC','US','CA','ES','MX','CO','PE','CL','GB'];
    const extraDestinations=['FR','DE','IT','AU','BR'];
    const servesEcuadorAndAbroad=p=>Array.isArray(p.supportedCountries)&&requiredDestinations.some(c=>p.supportedCountries.includes(c));
    const refreshPrintOptions=()=>{
      const prior=modelSelect.value;
      modelSelect.replaceChildren();
      const first=document.createElement('option');first.value='';first.textContent='Elige tipo de impresión';modelSelect.append(first);
      const seen=new Set();
      for(const key of [...new Set(models.filter(servesEcuadorAndAbroad).sort((a,b)=>extraDestinations.filter(c=>b.supportedCountries.includes(c)).length-extraDestinations.filter(c=>a.supportedCountries.includes(c)).length).map(modelKey))]){
        const type=simplifiedPrintType(key);
        if(!type)continue;
        const a=Object.fromEntries(JSON.parse(key));
        const garment=[a.ApparelManufacturer&&a.ApparelManufacturer!=='none'?String(a.ApparelManufacturer).toUpperCase():'Fabricante no indicado',a.ApparelManufacturerSKU&&a.ApparelManufacturerSKU!=='none'?a.ApparelManufacturerSKU:'',a.GarmentCut||''].filter(Boolean).join(' ');
        const name=type+'|'+garment;
        if(seen.has(name))continue;
        seen.add(name);
        const option=document.createElement('option');option.value=key;option.textContent=simplePrintLabel(key)+' — '+garment;modelSelect.append(option);
      }
      if([...modelSelect.options].some(o=>o.value===prior))modelSelect.value=prior;
    };

    const compatible=p=>Array.isArray(p.supportedCountries)&&p.supportedCountries.includes(countrySelect.value)&&p.attributes?.GarmentColor===color.value&&(!modelSelect.value||modelKey(p)===modelSelect.value);
    modelSelect.addEventListener('change',()=>color.dispatchEvent(new Event('change')));
    countrySelect.addEventListener('change',()=>{modelSelect.value='';refreshPrintOptions();color.dispatchEvent(new Event('change'));});
    catalog.addEventListener('change',async()=>{
      const current=++version;models=[];color.replaceChildren();color.disabled=true;sizes.textContent='Selecciona un color';status.textContent='Consultando Gelato…';
      if(!catalog.value){status.textContent='Elige una categoría.';return}
      try{
        const pages=await Promise.all([0,100].map(async offset=>{const res=await fetch('/api/tienda-preview?action=gelato_models&catalog='+catalog.value+'&adult=1&offset='+offset,{credentials:'same-origin',cache:'no-store'});const data=await res.json();if(!data.ok)throw Error(data.reason);return data.products||[]}));
        if(current!==version)return;
        models=pages.flat().filter(p=>p.uid&&p.attributes?.ProductStatus==='activated'&&!['kids','children','youth'].includes(String(p.attributes?.GarmentCut||'').toLowerCase()));
        modelSelect.replaceChildren();const initial=document.createElement('option');initial.value='';initial.textContent='Selecciona modelo de fabricación';modelSelect.append(initial);
        refreshPrintOptions();
        const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Selecciona color base';color.append(placeholder);
        [...new Set(models.filter(p=>Array.isArray(p.supportedCountries)&&p.supportedCountries.includes(countrySelect.value)).map(p=>p.attributes?.GarmentColor).filter(Boolean))].sort().forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;color.append(o)});
        status.textContent=models.filter(servesEcuadorAndAbroad).length+' variantes que incluyen los 9 destinos exigidos (Ecuador, Estados Unidos, Canadá, España, México, Colombia, Perú, Chile y Reino Unido). '+(models.some(servesEcuadorAndAbroad)?'Se priorizan además Francia, Alemania, Italia, Australia y Brasil cuando estén admitidos.':'No se encontró todavía un modelo que cumpla todos los destinos; no se mostrará un fabricante incompatible.');
      }catch(e){if(current===version)status.textContent='No fue posible consultar Gelato; conserva los datos del producto sin modificar.'}
    });
    const searchBox=document.createElement('div');
    searchBox.style.cssText='display:flex;flex-direction:column;gap:8px;align-items:stretch;width:100%;max-width:100%;min-width:0;margin:12px 0;box-sizing:border-box;overflow:hidden';
    searchBox.innerHTML='<input type="search" placeholder="Buscar color: navy, azul marino, negro…" aria-label="Buscar color en todo Gelato" style="display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;padding:10px;border:1px solid #a4bed4;border-radius:7px"><button type="button" style="display:block;width:100%;max-width:100%;box-sizing:border-box;white-space:normal;padding:10px 12px;background:#163c58;color:white;border:0;border-radius:7px;cursor:pointer">Buscar en Gelato</button>';
    color.parentElement.before(searchBox);
    searchBox.querySelector('button').addEventListener('click',async()=>{
      const term=searchBox.querySelector('input').value.trim().toLowerCase();
      const aliases={'azul marino':'navy','azul nocturno':'navy','negro':'black','blanco':'white','gris carbon':'charcoal','gris carbón':'charcoal'};
      const chosen=aliases[term]||term;
      if(chosen.length<2){status.textContent='Escribe un color para buscar.';return}
      const catalogUid=catalog.value;
      if(!catalogUid){status.textContent='Selecciona primero la categoría.';return}
      const index=version;const btn=searchBox.querySelector('button');btn.disabled=true;status.textContent='Buscando '+chosen+' en Gelato…';
      try{
        const batches=[];
        for(const offset of [0,100,200]){
          const response=await fetch('/api/tienda-preview?action=gelato_models&adult=1&catalog='+encodeURIComponent(catalogUid)+'&color='+encodeURIComponent(chosen)+'&offset='+offset,{credentials:'same-origin',cache:'no-store'});
          const data=await response.json();if(!data.ok)throw Error(data.reason||'Gelato no disponible');
          batches.push(data.products||[]);
          if((data.products||[]).length<100)break;
        }
        if(index!==version)return;
        const incoming=batches.flat().filter(p=>p.uid);
        const existing=new Set(models.map(p=>p.uid));for(const p of incoming){if(!existing.has(p.uid)){models.push(p);existing.add(p.uid)}}
        const colors=[...new Set(incoming.map(p=>p.attributes?.GarmentColor).filter(Boolean))];
        for(const v of colors){if(!Array.from(color.options).some(o=>o.value===v)){const o=document.createElement('option');o.value=v;o.textContent=v;color.append(o)}}
        if(colors.length){color.disabled=false;color.value=colors[0];modelSelect.value='';color.dispatchEvent(new Event('change'));}
        refreshPrintOptions();
        status.textContent=colors.length?'Se encontraron colores: '+colors.join(', ')+'. Selecciona el color y modelo correspondiente.':'No aparece '+chosen+' en los resultados del catálogo consultado.';
      }catch(e){status.textContent='Error al buscar el color en Gelato: '+e.message}finally{btn.disabled=false}
    });
    color.addEventListener('change',()=>{
      sizes.replaceChildren();
      const sameModel=models.filter(p=>p.attributes?.GarmentColor===color.value&&(!modelSelect.value||modelKey(p)===modelSelect.value));
      const values=[...new Set(sameModel.map(p=>p.attributes?.GarmentSize).filter(Boolean))];
      if(!values.length){sizes.textContent='No se encontraron tallas en el modelo consultado. Prueba otro modelo de fabricación.';return}
      const order=['XS','S','M','L','XL','2XL','3XL','4XL','5XL'];
      values.sort((a,b)=>order.indexOf(a)-order.indexOf(b));
      values.forEach(v=>{
        const allowed=sameModel.some(p=>p.attributes?.GarmentSize===v&&Array.isArray(p.supportedCountries)&&p.supportedCountries.includes(countrySelect.value));
        const label=document.createElement('label');label.style.cssText='display:inline-flex;align-items:center;gap:5px;margin:5px 12px 5px 0;opacity:'+(allowed?'1':'.65');
        const input=document.createElement('input');input.type='checkbox';input.value=v;input.disabled=!allowed;
        label.append(input,document.createTextNode(v+(allowed?'':' · No disponible para '+countrySelect.selectedOptions[0].textContent)));sizes.append(label);
      });
      const enabled=values.filter(v=>sameModel.some(p=>p.attributes?.GarmentSize===v&&Array.isArray(p.supportedCountries)&&p.supportedCountries.includes(countrySelect.value)));
      status.textContent='Tallas compatibles con '+countrySelect.selectedOptions[0].textContent+': '+(enabled.join(', ')||'ninguna')+'. Las demás no pueden seleccionarse para este destino.';
    });
    form.addEventListener('submit',()=>{
      for(const name of ['gelato_catalog','gelato_base_color','gelato_sizes','gelato_variant_uids','gelato_selection_problem'])form.querySelector('[name="'+name+'"]')?.remove();
      if(catalog.value&&color.value){
        const selected=Array.from(sizes.querySelectorAll('input:checked')).map(i=>i.value);
        const matched=selected.map(size=>models.filter(m=>compatible(m)&&m.attributes?.GarmentSize===size));
        const exact=matched.filter(candidates=>candidates.length===1).map(candidates=>({size:candidates[0].attributes.GarmentSize,color:color.value,uid:candidates[0].uid}));
        if(exact.length){const h=document.createElement('input');h.type='hidden';h.name='gelato_variant_uids';h.value=JSON.stringify(exact);form.append(h)}
        if(selected.length!==exact.length){
          const reason=!modelSelect.value?'Selecciona un modelo de impresión concreto':!selected.length?'Marca las tallas que deseas verificar':'No existe una coincidencia única entre el modelo, el color y cada talla';
          const h=document.createElement('input');h.type='hidden';h.name='gelato_selection_problem';h.value=reason;form.append(h);
          status.textContent=reason+'. No se inventarán identificadores de fabricación.';
        }
      }

      if(!catalog.value||!color.value)return;
      for(const [name,value] of [['gelato_catalog',catalog.value],['gelato_base_color',color.value],['gelato_sizes',Array.from(sizes.querySelectorAll('input:checked')).map(i=>i.value).join(',')]]){
        const h=document.createElement('input');h.type='hidden';h.name=name;h.value=value;form.append(h);
      }
    });
  }
  // Proveedores complementarios: solo Gelato tiene integración técnica activa.
  // No publicar como disponibles inventarios, precios ni promesas de envío no verificados.
  const providerPanel=document.createElement('section');
  providerPanel.id='sdl-provider-routing';
  providerPanel.style.cssText='border:1px solid #a8c1d3;background:#f5f9fc;border-radius:10px;padding:14px;margin:14px 0;color:#183b53';
  const providerHeading=document.createElement('strong');providerHeading.textContent='Fabricación y entregas · 3 proveedores';
  const providerIntro=document.createElement('p');
  providerIntro.textContent='Una sola ficha de producto para el comprador. Selección interna del proveedor por país, talla, color y técnica de impresión, únicamente después de verificar capacidad de fabricación y envío.';
  providerIntro.style.cssText='font-size:12px;line-height:1.5';
  const providerStatuses=[
    ['Gelato','Conectado al catálogo · verificar variantes, impresión, costo y destino'],
    ['Gooten','Pendiente de credenciales, catálogo y prueba real de envío a Ecuador'],
    ['Infrarojo (Ecuador)','Pendiente de convenio, precios, catálogo, áreas de impresión y logística']
  ];
  const providerList=document.createElement('div');
  for(const [name,state] of providerStatuses){
    const item=document.createElement('p');item.style.cssText='font-size:12px;margin:7px 0';
    const title=document.createElement('strong');title.textContent=name+' — ';
    item.append(title,document.createTextNode(state));providerList.append(item);
  }
  const providerNote=document.createElement('p');
  providerNote.style.cssText='font-size:12px;font-weight:650;margin:10px 0 0';
  providerNote.textContent='Regla de seguridad: si ningún proveedor confirma esa variante y destino, no habilitar compra. Los proveedores pendientes no reciben pedidos automáticamente.';
  providerPanel.append(providerHeading,providerIntro,providerList,providerNote);
  sections['productos-registrados'].prepend(providerPanel);
  const destinationPanel=document.createElement('section');
  destinationPanel.style.cssText='border:1px solid #b5cadb;background:#edf5fa;border-radius:10px;padding:12px;margin:14px 0;color:#12354b';
  const destinationTitle=document.createElement('strong');destinationTitle.textContent='Disponibilidad de compra · Gelato';
  const destinationInfo=document.createElement('p');destinationInfo.style.fontSize='12px';destinationInfo.textContent='Elige país de entrega. Las tallas solo podrán venderse cuando Gelato confirme disponibilidad para ese país y se validen archivos y costos. No activa ventas.';
  const destinationLabel=document.createElement('label');destinationLabel.textContent='País de entrega ';
  const destinationSelect=document.createElement('select');destinationSelect.style.cssText='display:block;max-width:100%;padding:8px;margin:7px 0 12px';
  [['EC','Ecuador'],['US','Estados Unidos'],['CA','Canadá'],['ES','España'],['MX','México'],['CO','Colombia'],['PE','Perú'],['CL','Chile'],['GB','Reino Unido']].forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;destinationSelect.append(option)});
  destinationLabel.append(destinationSelect);
  const destList=document.createElement('div');destList.style.cssText='font-size:12px;line-height:1.7';destList.textContent='Consultando variantes…';
  destinationPanel.append(destinationTitle,destinationInfo,destinationLabel,destList);
  sections['productos-registrados'].prepend(destinationPanel);
  fetch('/api/tienda-preview?action=gelato_destination_status',{credentials:'same-origin',cache:'no-store'}).then(r=>r.json()).then(data=>{
    if(!data.ok){destList.textContent='No se pudo confirmar disponibilidad.';return}
    const pilot=(data.variants||[]).filter(x=>x.product_id==='SDL-NEW-1791835993474996');
    const render=()=>{
      const country=destinationSelect.value;destList.replaceChildren();
      if(!pilot.length){destList.textContent='No hay tallas verificadas. Guarda y verifica la selección de Gelato primero.';return}
      pilot.slice().sort((a,b)=>['S','M','L','XL','2XL'].indexOf(a.size)-['S','M','L','XL','2XL'].indexOf(b.size)).forEach(v=>{
        const allowed=Array.isArray(v.supported_countries)&&v.supported_countries.includes(country);
        const p=document.createElement('p');p.style.margin='4px 0';
        p.textContent='Talla '+v.size+': identificador comprobado · '+(allowed?'País admitido por el catálogo':'No disponible para este país');
        destList.append(p);
      });
      const alert=document.createElement('p');alert.style.cssText='font-weight:700;margin:10px 0 0';
      alert.textContent=pilot.some(v=>!Array.isArray(v.supported_countries)||!v.supported_countries.includes(country))?'Hay tallas no disponibles. No permitir compras sin una alternativa compatible.':'Catálogo compatible en este país para las tallas mostradas; faltan archivos, precio final y prueba de envío antes de vender.';
      destList.append(alert);
    };
    destinationSelect.addEventListener('change',render);render();
  }).catch(()=>{destList.textContent='No se pudo cargar la disponibilidad por país.'});
  // Logo oficial para etiqueta interior: archivo independiente de las fotos del producto.
  const labelLogoPanel=document.createElement('section');
  labelLogoPanel.style.cssText='box-sizing:border-box;max-width:100%;padding:14px;border:1px solid #bed1df;border-radius:10px;margin:14px 0;background:#f5f8fc;color:#16314c;overflow:hidden';
  labelLogoPanel.innerHTML='<h3 style="margin:0 0 8px">Logotipo para etiqueta interior</h3><p style="margin:0 0 8px">Carga el logotipo de Sangre de Luna que irá dentro del cuello. Se conservará como archivo privado para revisar su tamaño y las especificaciones de impresión de Gelato. No se envía todavía a fabricar.</p><label style="display:block">Archivo PNG, JPG o WebP (máximo 2 MB)<input type="file" accept="image/png,image/jpeg,image/webp" data-neck-logo style="display:block;width:100%;max-width:100%;box-sizing:border-box;margin-top:8px"></label><img data-neck-preview alt="Vista previa del logotipo de la etiqueta" style="display:block;max-width:180px;max-height:140px;object-fit:contain;margin-top:12px" hidden><button type="button" data-neck-save style="margin-top:10px;padding:9px 14px;background:#173a56;color:white;border:0;border-radius:7px">Guardar logotipo de etiqueta</button><p data-neck-status role="status" style="font-size:13px">Pendiente de cargar o verificar.</p>';
  const logoFile=labelLogoPanel.querySelector('[data-neck-logo]'),logoPreview=labelLogoPanel.querySelector('[data-neck-preview]'),logoStatus=labelLogoPanel.querySelector('[data-neck-status]');
  logoPreview.src='/api/tienda-preview?action=label_logo';
  logoPreview.onload=()=>{logoPreview.hidden=false;logoStatus.textContent='Logotipo guardado anteriormente. Puedes reemplazarlo.'};
  logoPreview.onerror=()=>{logoPreview.hidden=true};
  labelLogoPanel.querySelector('[data-neck-save]').addEventListener('click',async()=>{
    const file=logoFile.files?.[0];if(!file){logoStatus.textContent='Selecciona primero el archivo del logotipo.';return}
    if(file.size>2000000||!['image/png','image/jpeg','image/webp'].includes(file.type)){logoStatus.textContent='Archivo no válido: utiliza PNG, JPG o WebP de hasta 2 MB.';return}
    const button=labelLogoPanel.querySelector('[data-neck-save]');button.disabled=true;logoStatus.textContent='Guardando el logotipo de forma privada…';
    try{
      const image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');reader.onerror=reject;reader.readAsDataURL(file)});
      const params=new URLSearchParams({action:'upload_label_logo',mime:file.type,image});
      const response=await fetch('/api/tienda-preview',{method:'POST',body:params,credentials:'same-origin',headers:{Accept:'application/json'}});
      const data=await response.json();if(!response.ok||!data.ok)throw Error(data.reason||'No se pudo guardar');
      logoPreview.src='/api/tienda-preview?action=label_logo&v='+Date.now();logoStatus.textContent='Logotipo guardado. Pendiente de validar con Gelato; no se ha enviado a fabricar.';
    }catch(e){logoStatus.textContent='No se pudo guardar: '+e.message}finally{button.disabled=false}
  });
  sections['productos-registrados']?.append(labelLogoPanel);
  function show(id){
   if(!sections[id])id='admin-resumen';
   Object.entries(sections).forEach(([key,el])=>{const visible=key===id;el.classList.toggle('sdl-v2-visible',visible);if(el.tagName==='DETAILS')el.open=visible});
   header.querySelector('h1').textContent=names[id];
   header.querySelector('p').textContent=id==='colecciones-admin'?'Selecciona una colección y después una categoría para editar.':id==='crear-coleccion'?'Diseña una colección. El guardado estará disponible cuando se habilite la función.':id==='crear-producto'?'Completa la ficha del producto y consulta las funciones disponibles.':'Gestiona esta sección sin desplegables adicionales.';
   header.querySelector('.sdl-v2-primary').hidden=id==='crear-producto';
   sidebar.querySelectorAll('nav a[href^="#"]').forEach(a=>a.classList.toggle('sdl-v2-current',a.getAttribute('href')==='#'+id));
   if(id==='colecciones-admin')resetCollections();
   window.scrollTo({top:0,behavior:'instant'});
  }
  sidebar.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);if(sections[id]){e.preventDefault();history.replaceState(null,'','#'+id);show(id)}});
  main.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);if(sections[id]){e.preventDefault();history.replaceState(null,'','#'+id);show(id)}});
  window.addEventListener('hashchange',()=>show(location.hash.slice(1)));
  show(location.hash.slice(1));
 };
 // Restore one visible panel when switching sections; keep all Gelato setup code untouched.
 const safeInit=()=>{
  try{boot()}catch(e){
   console.error('sdl_panel_init_error',e?.stack||e?.message);
   const p=document.getElementById('productos-registrados');
   if(p&&!document.getElementById('sdl-panel-init-warning')){
    const x=document.createElement('p');x.id='sdl-panel-init-warning';
    x.style.cssText='padding:14px;margin:8px 0;background:#fff1d9;color:#5d390e;border:2px solid #c89444;border-radius:10px;font-weight:600';
    x.textContent='La interfaz ampliada de Gelato no pudo iniciar: '+String(e?.message||'error desconocido')+'. Tus productos y archivos están conservados.';
    p.prepend(x);
   }
  }
  try{installStableNavigation()}catch(e){console.error('sdl_navigation_error',e?.message)}
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',safeInit);else safeInit();
})();
;(()=>{function wire(){const browser=document.querySelector('.sdl-store-collection-browser');if(!browser||browser.dataset.wired)return;browser.dataset.wired='1';const grid=browser.querySelector('.sdl-collection-grid');const screens=[...browser.querySelectorAll('.sdl-col-screen')];const reset=()=>{grid.hidden=false;screens.forEach(x=>{x.hidden=true;x.querySelectorAll('.sdl-category-content').forEach(y=>y.hidden=true);x.querySelectorAll('.sdl-category-tile').forEach(y=>y.hidden=false)})};browser.addEventListener('click',e=>{const open=e.target.closest('[data-sdl-col]');if(open){const index=Number(open.dataset.sdlCol);reset();grid.hidden=true;if(screens[index])screens[index].hidden=false;return}if(e.target.closest('.sdl-col-back')){reset();return}const category=e.target.closest('.sdl-cat-open');if(category){const screen=category.closest('.sdl-col-screen');screen.querySelectorAll('.sdl-category-tile').forEach(x=>x.hidden=true);const tile=category.closest('.sdl-category-tile');tile.hidden=false;tile.querySelector('.sdl-cat-open').hidden=true;tile.querySelector('.sdl-category-content').hidden=false;screen.querySelector('.sdl-category-grid').style.display='block';return}if(e.target.closest('.sdl-cat-back')){const screen=e.target.closest('.sdl-col-screen');screen.querySelectorAll('.sdl-category-tile').forEach(x=>{x.hidden=false;x.querySelector('.sdl-cat-open').hidden=false;x.querySelector('.sdl-category-content').hidden=true});screen.querySelector('.sdl-category-grid').style.display='grid'}})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire()})();
