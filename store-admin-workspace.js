/* Sangre de Luna · Panel de tienda: vistas independientes sin acordeones principales */
(()=>{
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
  if(Object.values(sections).some(x=>!x))return;
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
  const colorEquivalences={blancolunar:['white'],grisplata:['sportgrey','ash','heathergrey'],grisoscuro:['darkheather','charcoal'],azulnocturno:['navy'],verdeoliva:['militarygreen','olive'],doradoarena:['sand']};
  bulkReview.addEventListener('click',async()=>{
    bulkReview.disabled=true;bulkApprove.disabled=true;bulkResults.replaceChildren();proposals=[];
    try{
      const answer=await fetch('/api/tienda-preview?action=gelato_links',{credentials:'same-origin',cache:'no-store'}),listing=await answer.json();
      if(!listing.ok)throw Error('No fue posible leer los productos guardados.');
      const approved=new Set((listing.links||[]).map(l=>l.product_id));
      const items=(listing.items||[]).filter(p=>!approved.has(p.id));
      const catalogs={'Camisetas':'t-shirts','Sudaderas':'sweatshirts','Tazas':'mugs'};
      const cache={};
      for(const type of [...new Set(items.map(p=>catalogs[p.category]).filter(Boolean))]){
        bulkStatus.textContent='Consultando el catálogo de Gelato: '+type+'…';
        try{const response=await fetch('/api/tienda-preview?action=gelato_models&catalog='+type,{credentials:'same-origin',cache:'no-store'});const data=await response.json();cache[type]=data.ok?data.products:[]}catch(e){cache[type]=[]}
      }
      for(const item of items){
        const catalog=catalogs[item.category],colors=item.colors||[];
        let reason='',candidate=null;
        if(!catalog)reason='Categoría pendiente de validación.';
        else if(colors.length!==1)reason=colors.length?'Tiene varios colores: deben configurarse por variante.':'No tiene un color definido.';
        else {
          const wanted=clean(colors[0]);
          candidate=(cache[catalog]||[]).find(p=>{
            const a=p.attributes||{},color=clean(a.GarmentColor);
            return !!p.uid&&String(a.ProductStatus||'').toLowerCase()==='activated'&&String(a.State||'').toLowerCase()==='published'&&String(a.GarmentCut||'').toLowerCase()!=='kids'&&(p.supportedCountries||[]).includes('EC')&&(catalog==='mugs'||color===wanted||(colorEquivalences[wanted]||[]).includes(color));
          });
          if(!candidate)reason='No se encontró un modelo verificable en el primer lote de Gelato.';
        }
        const line=document.createElement('div');line.style.cssText='padding:12px;margin:7px 0;border:1px solid #d1dae3;border-radius:9px';
        const name=document.createElement('strong');name.textContent=item.title+' · '+item.category;line.append(name);
        const detail=document.createElement('p');detail.style.margin='5px 0';detail.textContent=candidate?'Modelo: '+candidate.uid+' · talla: '+(candidate.attributes.GarmentSize||'sin talla'):'Revisión necesaria: '+reason;line.append(detail);
        if(candidate){
          const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=true;checkbox.setAttribute('aria-label','Aprobar recomendación para '+item.title);
          const label=document.createElement('label');label.style.cssText='display:flex;align-items:center;gap:8px';label.append(checkbox,document.createTextNode('Incluir esta recomendación en la aprobación'));line.append(label);
          proposals.push({item,catalog,candidate,checkbox});
        }
        bulkResults.append(line);
      }
      bulkStatus.textContent='Análisis terminado. '+proposals.length+' recomendaciones; '+(items.length-proposals.length)+' fichas requieren revisión. Ninguna aprobación se ha guardado aún.';
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
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
;(()=>{function wire(){const browser=document.querySelector('.sdl-store-collection-browser');if(!browser||browser.dataset.wired)return;browser.dataset.wired='1';const grid=browser.querySelector('.sdl-collection-grid');const screens=[...browser.querySelectorAll('.sdl-col-screen')];const reset=()=>{grid.hidden=false;screens.forEach(x=>{x.hidden=true;x.querySelectorAll('.sdl-category-content').forEach(y=>y.hidden=true);x.querySelectorAll('.sdl-category-tile').forEach(y=>y.hidden=false)})};browser.addEventListener('click',e=>{const open=e.target.closest('[data-sdl-col]');if(open){const index=Number(open.dataset.sdlCol);reset();grid.hidden=true;if(screens[index])screens[index].hidden=false;return}if(e.target.closest('.sdl-col-back')){reset();return}const category=e.target.closest('.sdl-cat-open');if(category){const screen=category.closest('.sdl-col-screen');screen.querySelectorAll('.sdl-category-tile').forEach(x=>x.hidden=true);const tile=category.closest('.sdl-category-tile');tile.hidden=false;tile.querySelector('.sdl-cat-open').hidden=true;tile.querySelector('.sdl-category-content').hidden=false;screen.querySelector('.sdl-category-grid').style.display='block';return}if(e.target.closest('.sdl-cat-back')){const screen=e.target.closest('.sdl-col-screen');screen.querySelectorAll('.sdl-category-tile').forEach(x=>{x.hidden=false;x.querySelector('.sdl-cat-open').hidden=false;x.querySelector('.sdl-category-content').hidden=true});screen.querySelector('.sdl-category-grid').style.display='grid'}})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire()})();
