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
        try{const pages=await Promise.all([0,100,200,300,400].map(async offset=>{const response=await fetch('/api/tienda-preview?action=gelato_models&catalog='+type+'&adult=1&offset='+offset,{credentials:'same-origin',cache:'no-store'});const data=await response.json();if(!data.ok)throw Error(data.reason||'Error del proveedor');return data.products||[]}));cache[type]=pages.flat();if(!cache[type].length)catalogErrors[type]='Gelato no devolvió modelos para los filtros adultos; se requiere revisar los valores del catálogo.'}catch(e){cache[type]=[];catalogErrors[type]=String(e.message||e)}
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
    const garment=(p)=>p.attributes||{};
    const qualifies=(p)=>p.uid&&String(garment(p).ProductStatus||'').toLowerCase()==='activated'&&!['kids','youth','children'].includes(String(garment(p).GarmentCut||'').toLowerCase());
    const refreshSizes=()=>{
      sizes.replaceChildren();
      const options=[...new Set(models.filter(p=>String(garment(p).GarmentColor||'')===colorSelect.value).map(p=>String(garment(p).GarmentSize||'')).filter(Boolean))];
      if(!options.length){sizes.textContent='Este artículo no presenta tallas en la selección actual.';return}
      options.sort((a,b)=>['XS','S','M','L','XL','2XL','3XL','4XL','5XL'].indexOf(a)-['XS','S','M','L','XL','2XL','3XL','4XL','5XL'].indexOf(b));
      for(const size of options){const label=document.createElement('label');label.style.cssText='display:inline-flex;gap:6px;align-items:center;margin:5px 12px 5px 0';const input=document.createElement('input');input.type='checkbox';input.value=size;input.name='gelato_size';label.append(input,document.createTextNode(size));sizes.append(label)}
      message.textContent=options.length+' tallas encontradas para el color '+colorSelect.value+'. Verifica el modelo antes de aprobar fabricación.';
    };
    colorSelect.addEventListener('change',refreshSizes);
    async function refreshGelato(){
      const version=++requestVersion,category=categories[categorySelect?.value];
      models=[];colorSelect.replaceChildren();sizes.textContent='';message.textContent='Consultando el catálogo real de Gelato…';
      const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Selecciona un color base';colorSelect.append(placeholder);
      if(!category){message.textContent='Esta categoría no está enlazada todavía a productos de Gelato. El artículo solo se guardará como borrador.';return}
      try{
        const pages=await Promise.all([0,100,200,300,400].map(async offset=>{
          const response=await fetch('/api/tienda-preview?action=gelato_models&catalog='+category+'&adult=1&offset='+offset,{credentials:'same-origin',cache:'no-store'});
          const data=await response.json();if(!data.ok)throw Error(data.reason||'No se pudo consultar Gelato');return data.products||[];
        }));
        if(version!==requestVersion)return;
        models=pages.flat().filter(qualifies);
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
      const matched=selected.map(size=>models.filter(m=>m.attributes?.GarmentColor===colorSelect.value&&m.attributes?.GarmentSize===size));
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
  const existingForms=Array.from(sections['productos-registrados'].querySelectorAll('form')).filter(form=>form.querySelector('[name="action"][value="edit_registered_product"]'));
  for(const form of existingForms){
    const area=document.createElement('fieldset');area.style.cssText='grid-column:1/-1;border:1px solid #abc4d8;border-radius:10px;padding:14px;margin:12px 0';
    area.innerHTML='<legend>Opciones de Gelato para este producto</legend><label>Categoría de Gelato <select data-gelato-catalog><option value="">Elegir categoría</option><option value="t-shirts">Camisetas</option><option value="sweatshirts">Sudaderas</option><option value="mugs">Tazas</option></select></label><label>Color base real de Gelato <select data-gelato-color disabled><option value="">Selecciona categoría primero</option></select></label><fieldset style="border:1px solid #d6e0e8;padding:10px;margin-top:10px"><legend>Tallas disponibles para el color</legend><div data-gelato-sizes>Selecciona categoría y color</div></fieldset><p data-gelato-state role="status">La vinculación será guardada como pendiente de verificación, sin activar pedidos.</p>';
    form.append(area);
    const ids=(form.querySelector('[name="ids"]')?.value||'').split(',').filter(Boolean);
    if(ids.length>1){
      const row=document.createElement('label');row.textContent='Registro específico del diseño ';
      const selector=document.createElement('select');selector.name='gelato_target_id';selector.required=false;
      const blank=document.createElement('option');blank.value='';blank.textContent='Selecciona un registro para Gelato';selector.append(blank);
      ids.forEach((id,i)=>{const opt=document.createElement('option');opt.value=id;opt.textContent='Versión '+(i+1)+' · '+id;selector.append(opt)});
      row.append(selector);area.insertBefore(row,area.firstChild);
    }
    const catalog=area.querySelector('[data-gelato-catalog]'),color=area.querySelector('[data-gelato-color]'),sizes=area.querySelector('[data-gelato-sizes]'),status=area.querySelector('[data-gelato-state]');
    let models=[],version=0;
    catalog.addEventListener('change',async()=>{
      const current=++version;models=[];color.replaceChildren();color.disabled=true;sizes.textContent='Selecciona un color';status.textContent='Consultando Gelato…';
      if(!catalog.value){status.textContent='Elige una categoría.';return}
      try{
        const pages=await Promise.all([0,100,200,300,400].map(async offset=>{const res=await fetch('/api/tienda-preview?action=gelato_models&catalog='+catalog.value+'&adult=1&offset='+offset,{credentials:'same-origin',cache:'no-store'});const data=await res.json();if(!data.ok)throw Error(data.reason);return data.products||[]}));
        if(current!==version)return;
        models=pages.flat().filter(p=>p.uid&&p.attributes?.ProductStatus==='activated'&&!['kids','children','youth'].includes(String(p.attributes?.GarmentCut||'').toLowerCase()));
        const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Selecciona color base';color.append(placeholder);
        [...new Set(models.map(p=>p.attributes?.GarmentColor).filter(Boolean))].sort().forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;color.append(o)});
        color.disabled=!models.length;status.textContent=models.length+' variantes reales consultadas. Elige el color base y sus tallas.';
      }catch(e){if(current===version)status.textContent='No fue posible consultar Gelato; conserva los datos del producto sin modificar.'}
    });
    color.addEventListener('change',()=>{
      sizes.replaceChildren();
      const values=[...new Set(models.filter(p=>p.attributes?.GarmentColor===color.value).map(p=>p.attributes?.GarmentSize).filter(Boolean))];
      if(!values.length){sizes.textContent='No se encontraron tallas para este color.';return}
      values.forEach(v=>{const label=document.createElement('label');label.style.cssText='display:inline-flex;align-items:center;gap:5px;margin:5px 12px 5px 0';const input=document.createElement('input');input.type='checkbox';input.value=v;label.append(input,document.createTextNode(v));sizes.append(label)});
    });
    form.addEventListener('submit',()=>{
      for(const name of ['gelato_catalog','gelato_base_color','gelato_sizes','gelato_variant_uids'])form.querySelector('[name="'+name+'"]')?.remove();
      if(catalog.value&&color.value){
        const selected=Array.from(sizes.querySelectorAll('input:checked')).map(i=>i.value);
        const matched=selected.map(size=>models.filter(m=>m.attributes?.GarmentColor===color.value&&m.attributes?.GarmentSize===size));
        const exact=matched.filter(candidates=>candidates.length===1).map(candidates=>({size:candidates[0].attributes.GarmentSize,color:color.value,uid:candidates[0].uid}));
        if(exact.length){const h=document.createElement('input');h.type='hidden';h.name='gelato_variant_uids';h.value=JSON.stringify(exact);form.append(h)}
        if(selected.length&&selected.length!==exact.length)status.textContent='Algunas tallas tienen múltiples modelos posibles; esas variantes no se vincularán hasta elegir modelo exacto.';
      }

      if(!catalog.value||!color.value)return;
      for(const [name,value] of [['gelato_catalog',catalog.value],['gelato_base_color',color.value],['gelato_sizes',Array.from(sizes.querySelectorAll('input:checked')).map(i=>i.value).join(',')]]){
        const h=document.createElement('input');h.type='hidden';h.name=name;h.value=value;form.append(h);
      }
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
