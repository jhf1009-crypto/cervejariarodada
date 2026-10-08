'use client';
import {FormEvent,useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';
import LeadsManager from './leads-manager';
import SettingsManager from './settings-manager';
import GalleryManager from './gallery-manager';
import FaqManager from './faq-manager';
import LegalManager from './legal-manager';
import UsersManager from './users-manager';
import AuditManager from './audit-manager';

type Product={id:string;name:string;slug:string;category:'chope'|'cerveja';packaging:string|null;volume_ml:number|null;short_description:string|null;price:number|null;promotional_price:number|null;availability_status:string|null;sort_order:number;featured:boolean;published:boolean};
type Keg={id:string;liters:number;estimated_cups:number|null;rental_price:number|null;sale_price:number|null;active:boolean};
type EventPackage={id:string;name:string;slug:string;description:string|null;included_items:any;active:boolean;sort_order:number};

const emptyProduct={name:'',slug:'',category:'chope',packaging:'',volume_ml:'',short_description:'',price:'',promotional_price:'',availability_status:'Disponível',sort_order:'0',featured:false,published:false};
const emptyKeg={liters:'',estimated_cups:'',rental_price:'',sale_price:'',active:true};
const emptyPackage={name:'',slug:'',description:'',included_items:'',active:true,sort_order:'0'};

const modules=[
 ['Dashboard','Visão geral do painel','dashboard'],
 ['Produtos','Cadastre, edite e publique produtos','products'],
 ['Barris e eventos','Gerencie tamanhos e pacotes','kegs'],
 ['Leads e orçamentos','Acompanhe pedidos recebidos','leads'],
 ['Galeria e depoimentos','Fotos e avaliações','gallery'],
 ['FAQ','Perguntas frequentes','faq'],
 ['Configurações','Contato e localização','settings'],
 ['Páginas legais','Políticas e textos legais','legal'],
 ['Usuários e permissões','Controle de acesso','users'],
 ['Log de auditoria','Histórico administrativo','audit']
] as const;

export default function AdminClient({name,role,email}:{name:string;role:string;email:string}){
 const supabase=useMemo(()=>createClient(),[]);
 const [active,setActive]=useState('dashboard');
 const [products,setProducts]=useState<Product[]>([]);
 const [kegs,setKegs]=useState<Keg[]>([]);
 const [packages,setPackages]=useState<EventPackage[]>([]);
 const [productForm,setProductForm]=useState<any>(emptyProduct);
 const [kegForm,setKegForm]=useState<any>(emptyKeg);
 const [packageForm,setPackageForm]=useState<any>(emptyPackage);
 const [editProductId,setEditProductId]=useState<string|null>(null);
 const [editKegId,setEditKegId]=useState<string|null>(null);
 const [editPackageId,setEditPackageId]=useState<string|null>(null);
 const [busy,setBusy]=useState(false);
 const [productPhoto,setProductPhoto]=useState<File|null>(null);
 const [msg,setMsg]=useState('');

 function slugify(v:string){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
 async function loadProducts(){const {data,error}=await supabase.from('products').select('id,name,slug,category,packaging,volume_ml,short_description,price,promotional_price,availability_status,sort_order,featured,published').order('sort_order');if(error)setMsg(error.message);else setProducts((data||[]) as Product[])}
 async function loadKegs(){const {data,error}=await supabase.from('keg_sizes').select('id,liters,estimated_cups,rental_price,sale_price,active').order('liters');if(error)setMsg(error.message);else setKegs((data||[]) as Keg[])}
 async function loadPackages(){const {data,error}=await supabase.from('event_packages').select('id,name,slug,description,included_items,active,sort_order').order('sort_order');if(error)setMsg(error.message);else setPackages((data||[]) as EventPackage[])}
 async function loadAll(){await Promise.all([loadProducts(),loadKegs(),loadPackages()])}
 useEffect(()=>{loadAll()},[]);

 async function logout(){await supabase.auth.signOut();window.location.href='/login'}

 async function saveProduct(e:FormEvent){
  e.preventDefault();setBusy(true);setMsg('');
  try{
   const payload={name:productForm.name.trim(),slug:(productForm.slug||slugify(productForm.name)).trim(),category:productForm.category,packaging:productForm.packaging||null,volume_ml:productForm.volume_ml?Number(productForm.volume_ml):null,short_description:productForm.short_description||null,price:productForm.price?Number(productForm.price):null,promotional_price:productForm.promotional_price?Number(productForm.promotional_price):null,availability_status:productForm.availability_status||null,sort_order:Number(productForm.sort_order)||0,featured:!!productForm.featured,published:!!productForm.published,updated_at:new Date().toISOString()};
   const result=editProductId?await supabase.from('products').update(payload).eq('id',editProductId).select('id').single():await supabase.from('products').insert(payload).select('id').single();
   if(result.error)throw result.error;
   const productId=result.data.id;
   if(productPhoto){
    if(!['image/jpeg','image/png','image/webp'].includes(productPhoto.type))throw new Error('Use JPG, PNG ou WebP.');
    if(productPhoto.size>8*1024*1024)throw new Error('A foto deve ter até 8 MB.');
    const ext=productPhoto.type==='image/png'?'png':productPhoto.type==='image/webp'?'webp':'jpg';
    const path='products/'+productId+'/'+crypto.randomUUID()+'.'+ext;
    const uploaded=await supabase.storage.from('public-media').upload(path,productPhoto,{contentType:productPhoto.type,upsert:false});
    if(uploaded.error)throw uploaded.error;
    const saved=await supabase.from('product_images').insert({product_id:productId,storage_path:path,alt_text:payload.name,sort_order:0,published:true});
    if(saved.error)throw saved.error;
   }
   setMsg('Produto salvo'+(productPhoto?' com foto':'')+'.');setEditProductId(null);setProductForm(emptyProduct);setProductPhoto(null);await loadProducts();
  }catch(error){setMsg(error instanceof Error?error.message:'Não foi possível salvar o produto ou a foto.');}
  finally{setBusy(false)}
 }
 function editProduct(p:Product){setEditProductId(p.id);setProductPhoto(null);setProductForm({...p,volume_ml:p.volume_ml??'',price:p.price??'',promotional_price:p.promotional_price??''});window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})}
 async function deleteProduct(p:Product){if(!confirm('Excluir '+p.name+'?'))return;const {error}=await supabase.from('products').delete().eq('id',p.id);if(error)setMsg(error.message);else{setMsg('Produto excluído.');await loadProducts()}}
 async function toggleProduct(p:Product){const {error}=await supabase.from('products').update({published:!p.published,updated_at:new Date().toISOString()}).eq('id',p.id);if(error)setMsg(error.message);else await loadProducts()}

 async function saveKeg(e:FormEvent){
  e.preventDefault();setBusy(true);setMsg('');
  const payload={liters:Number(kegForm.liters),estimated_cups:kegForm.estimated_cups?Number(kegForm.estimated_cups):null,rental_price:kegForm.rental_price?Number(kegForm.rental_price):null,sale_price:kegForm.sale_price?Number(kegForm.sale_price):null,active:!!kegForm.active,updated_at:new Date().toISOString()};
  const result=editKegId?await supabase.from('keg_sizes').update(payload).eq('id',editKegId):await supabase.from('keg_sizes').insert(payload);
  setBusy(false);if(result.error){setMsg(result.error.message);return}
  setMsg(editKegId?'Barril atualizado.':'Barril cadastrado.');setEditKegId(null);setKegForm(emptyKeg);await loadKegs();
 }
 function editKeg(k:Keg){setEditKegId(k.id);setKegForm({liters:k.liters,estimated_cups:k.estimated_cups??'',rental_price:k.rental_price??'',sale_price:k.sale_price??'',active:k.active})}
 async function deleteKeg(k:Keg){if(!confirm('Excluir barril de '+k.liters+' L?'))return;const {error}=await supabase.from('keg_sizes').delete().eq('id',k.id);if(error)setMsg(error.message);else{setMsg('Barril excluído.');await loadKegs()}}
 async function toggleKeg(k:Keg){const {error}=await supabase.from('keg_sizes').update({active:!k.active,updated_at:new Date().toISOString()}).eq('id',k.id);if(error)setMsg(error.message);else await loadKegs()}

 async function savePackage(e:FormEvent){
  e.preventDefault();setBusy(true);setMsg('');
  const items=String(packageForm.included_items||'').split('\n').map((x:string)=>x.trim()).filter(Boolean);
  const payload={name:packageForm.name.trim(),slug:(packageForm.slug||slugify(packageForm.name)).trim(),description:packageForm.description||null,included_items:items,active:!!packageForm.active,sort_order:Number(packageForm.sort_order)||0,updated_at:new Date().toISOString()};
  const result=editPackageId?await supabase.from('event_packages').update(payload).eq('id',editPackageId):await supabase.from('event_packages').insert(payload);
  setBusy(false);if(result.error){setMsg(result.error.message);return}
  setMsg(editPackageId?'Pacote atualizado.':'Pacote cadastrado.');setEditPackageId(null);setPackageForm(emptyPackage);await loadPackages();
 }
 function editPackage(p:EventPackage){const items=Array.isArray(p.included_items)?p.included_items.join('\n'):'';setEditPackageId(p.id);setPackageForm({...p,included_items:items})}
 async function deletePackage(p:EventPackage){if(!confirm('Excluir pacote '+p.name+'?'))return;const {error}=await supabase.from('event_packages').delete().eq('id',p.id);if(error)setMsg(error.message);else{setMsg('Pacote excluído.');await loadPackages()}}
 async function togglePackage(p:EventPackage){const {error}=await supabase.from('event_packages').update({active:!p.active,updated_at:new Date().toISOString()}).eq('id',p.id);if(error)setMsg(error.message);else await loadPackages()}

 return <main className="shell">
  <header><div><small>CERVEJARIA RODADA</small><h1>Painel administrativo</h1><p>{name||email} · {role}</p></div><button className="badge buttonBadge" onClick={logout}>Sair</button></header>
  <section className="grid">{modules.map(([title,desc,id],i)=><button key={id} className={'moduleCard '+(active===id?'selected':'')} onClick={()=>setActive(id)}><span>{String(i+1).padStart(2,'0')}</span><h2>{title}</h2><p>{desc}</p></button>)}</section>

  <section className="workspace">
   <small>MÓDULO ATIVO</small><h2>{modules.find(m=>m[2]===active)?.[0]}</h2>{msg&&<div className="adminMessage">{msg}</div>}

   {active==='dashboard'&&<div className="stats">
    <article><span>Produtos cadastrados</span><b>{products.length}</b></article>
    <article><span>Publicados</span><b>{products.filter(p=>p.published).length}</b></article>
    <article><span>Barris ativos</span><b>{kegs.filter(k=>k.active).length}</b></article>
    <article><span>Pacotes de evento</span><b>{packages.filter(p=>p.active).length}</b></article>
   </div>}

   {active==='products'&&<div className="productAdmin">
    <form className="adminForm" onSubmit={saveProduct}>
     <div className="formTitle"><h3>{editProductId?'Editar produto':'Novo produto'}</h3>{editProductId&&<button type="button" onClick={()=>{setEditProductId(null);setProductForm(emptyProduct)}}>Cancelar edição</button>}</div>
     <label className="wide">Foto do produto (JPG, PNG ou WebP, até 8 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setProductPhoto(e.target.files?.[0]||null)}/></label>
     {productPhoto&&<p>Foto selecionada: {productPhoto.name}</p>}
     <label>Nome<input required value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value,slug:editProductId?productForm.slug:slugify(e.target.value)})}/></label>
     <label>Slug<input required value={productForm.slug} onChange={e=>setProductForm({...productForm,slug:e.target.value})}/></label>
     <label>Categoria<select value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})}><option value="chope">Chope</option><option value="cerveja">Cerveja</option></select></label>
     <label>Embalagem<input value={productForm.packaging??''} onChange={e=>setProductForm({...productForm,packaging:e.target.value})} placeholder="PET, lata, long neck..."/></label>
     <label>Volume em ml<input type="number" min="1" value={productForm.volume_ml} onChange={e=>setProductForm({...productForm,volume_ml:e.target.value})}/></label>
     <label>Preço<input type="number" min="0" step=".01" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})}/></label>
     <label>Preço promocional<input type="number" min="0" step=".01" value={productForm.promotional_price} onChange={e=>setProductForm({...productForm,promotional_price:e.target.value})}/></label>
     <label>Status<input value={productForm.availability_status??''} onChange={e=>setProductForm({...productForm,availability_status:e.target.value})}/></label>
     <label>Ordem<input type="number" value={productForm.sort_order} onChange={e=>setProductForm({...productForm,sort_order:e.target.value})}/></label>
     <label className="wide">Descrição<textarea rows={3} value={productForm.short_description??''} onChange={e=>setProductForm({...productForm,short_description:e.target.value})}/></label>
     <label className="check"><input type="checkbox" checked={!!productForm.featured} onChange={e=>setProductForm({...productForm,featured:e.target.checked})}/> Produto em destaque</label>
     <label className="check"><input type="checkbox" checked={!!productForm.published} onChange={e=>setProductForm({...productForm,published:e.target.checked})}/> Publicado no catálogo</label>
     <button className="saveButton" disabled={busy}>{busy?'Salvando...':editProductId?'Salvar alterações':'Cadastrar produto'}</button>
    </form>
    <div className="productList"><div className="listHead"><h3>Produtos</h3><span>{products.length} itens</span></div>{products.length===0?<p>Nenhum produto cadastrado.</p>:products.map(p=><article className="productRow" key={p.id}><div><b>{p.name}</b><small>{p.packaging||'Sem embalagem'}{p.volume_ml?' · '+p.volume_ml+' ml':''}</small></div><div className="productMeta"><span className={p.published?'statusOn':'statusOff'}>{p.published?'Publicado':'Rascunho'}</span>{p.price!=null&&<strong>R$ {Number(p.price).toFixed(2).replace('.',',')}</strong>}</div><div className="rowActions"><button onClick={()=>editProduct(p)}>Editar</button><button onClick={()=>toggleProduct(p)}>{p.published?'Ocultar':'Publicar'}</button><button className="danger" onClick={()=>deleteProduct(p)}>Excluir</button></div></article>)}</div>
   </div>}

   {active==='kegs'&&<div className="stackAdmin">
    <div className="productAdmin">
     <form className="adminForm" onSubmit={saveKeg}>
      <div className="formTitle"><h3>{editKegId?'Editar barril':'Novo barril'}</h3>{editKegId&&<button type="button" onClick={()=>{setEditKegId(null);setKegForm(emptyKeg)}}>Cancelar edição</button>}</div>
      <label>Litros<input required type="number" min="1" value={kegForm.liters} onChange={e=>setKegForm({...kegForm,liters:e.target.value})}/></label>
      <label>Copos estimados<input type="number" min="1" value={kegForm.estimated_cups} onChange={e=>setKegForm({...kegForm,estimated_cups:e.target.value})}/></label>
      <label>Preço de aluguel<input type="number" min="0" step=".01" value={kegForm.rental_price} onChange={e=>setKegForm({...kegForm,rental_price:e.target.value})}/></label>
      <label>Preço de venda<input type="number" min="0" step=".01" value={kegForm.sale_price} onChange={e=>setKegForm({...kegForm,sale_price:e.target.value})}/></label>
      <label className="check"><input type="checkbox" checked={!!kegForm.active} onChange={e=>setKegForm({...kegForm,active:e.target.checked})}/> Ativo</label>
      <button className="saveButton" disabled={busy}>{busy?'Salvando...':editKegId?'Salvar alterações':'Cadastrar barril'}</button>
     </form>
     <div className="productList"><div className="listHead"><h3>Barris</h3><span>{kegs.length} tamanhos</span></div>{kegs.length===0?<p>Nenhum barril cadastrado.</p>:kegs.map(k=><article className="productRow" key={k.id}><div><b>{k.liters} litros</b><small>{k.estimated_cups?(k.estimated_cups+' copos estimados'):'Sem estimativa de copos'}</small></div><div className="productMeta"><span className={k.active?'statusOn':'statusOff'}>{k.active?'Ativo':'Inativo'}</span>{k.rental_price!=null&&<strong>R$ {Number(k.rental_price).toFixed(2).replace('.',',')}</strong>}</div><div className="rowActions"><button onClick={()=>editKeg(k)}>Editar</button><button onClick={()=>toggleKeg(k)}>{k.active?'Desativar':'Ativar'}</button><button className="danger" onClick={()=>deleteKeg(k)}>Excluir</button></div></article>)}</div>
    </div>

    <div className="productAdmin">
     <form className="adminForm" onSubmit={savePackage}>
      <div className="formTitle"><h3>{editPackageId?'Editar pacote':'Novo pacote de evento'}</h3>{editPackageId&&<button type="button" onClick={()=>{setEditPackageId(null);setPackageForm(emptyPackage)}}>Cancelar edição</button>}</div>
      <label>Nome<input required value={packageForm.name} onChange={e=>setPackageForm({...packageForm,name:e.target.value,slug:editPackageId?packageForm.slug:slugify(e.target.value)})}/></label>
      <label>Slug<input required value={packageForm.slug} onChange={e=>setPackageForm({...packageForm,slug:e.target.value})}/></label>
      <label>Ordem<input type="number" value={packageForm.sort_order} onChange={e=>setPackageForm({...packageForm,sort_order:e.target.value})}/></label>
      <label className="check"><input type="checkbox" checked={!!packageForm.active} onChange={e=>setPackageForm({...packageForm,active:e.target.checked})}/> Pacote ativo</label>
      <label className="wide">Descrição<textarea rows={3} value={packageForm.description??''} onChange={e=>setPackageForm({...packageForm,description:e.target.value})}/></label>
      <label className="wide">Itens incluídos — um por linha<textarea rows={6} value={packageForm.included_items??''} onChange={e=>setPackageForm({...packageForm,included_items:e.target.value})} placeholder={'Barril 30 L\nChopeira Rodada\nSuporte para servir'}/></label>
      <button className="saveButton" disabled={busy}>{busy?'Salvando...':editPackageId?'Salvar alterações':'Cadastrar pacote'}</button>
     </form>
     <div className="productList"><div className="listHead"><h3>Pacotes de eventos</h3><span>{packages.length} pacotes</span></div>{packages.length===0?<p>Nenhum pacote cadastrado.</p>:packages.map(p=><article className="productRow" key={p.id}><div><b>{p.name}</b><small>{p.description||'Sem descrição'}</small></div><div className="productMeta"><span className={p.active?'statusOn':'statusOff'}>{p.active?'Ativo':'Inativo'}</span></div><div className="rowActions"><button onClick={()=>editPackage(p)}>Editar</button><button onClick={()=>togglePackage(p)}>{p.active?'Desativar':'Ativar'}</button><button className="danger" onClick={()=>deletePackage(p)}>Excluir</button></div></article>)}</div>
    </div>
   </div>}

   {active==='leads'&&<LeadsManager/>}
   {active==='settings'&&<SettingsManager/>}
   {active==='gallery'&&<GalleryManager/>}
   {active==='faq'&&<FaqManager/>}
   {active==='legal'&&<LegalManager/>}
   {active==='users'&&<UsersManager/>}
   {active==='audit'&&<AuditManager/>}
  </section>
 </main>
}