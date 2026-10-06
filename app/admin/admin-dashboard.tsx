'use client';

import {FormEvent,useEffect,useMemo,useState} from 'react';
import {createBrowserSupabaseClient} from '../../lib/supabase/client';
import styles from './admin.module.css';

type Product={id:string;name:string;slug:string;category:string;packaging:string|null;volume_ml:number|null;price:number|null;promotional_price:number|null;availability_status:string|null;featured:boolean;published:boolean;sort_order:number};
type Lead={id:string;name:string;whatsapp:string;email:string|null;city:string|null;event_type:string|null;event_date:string|null;guest_count:number|null;status:string;message:string|null;internal_notes:string|null;created_at:string};
type Settings={id:boolean;legal_name:string|null;cnpj:string|null;mapa_registration:string|null;address:string|null;latitude:number|null;longitude:number|null;phone:string|null;whatsapp:string|null;email:string|null;delivery_area:string|null;lead_times:string|null;fees:string|null;payment_methods:string|null;story:string|null};
type Tab='dashboard'|'products'|'leads'|'settings';

const blankProduct={name:'',slug:'',category:'chope',packaging:'PET',volume_ml:'',price:'',promotional_price:'',availability_status:'Disponível',featured:false,published:false,sort_order:'0'};

export default function AdminDashboard({displayName,email}:{displayName:string;email:string}){
 const supabase=useMemo(()=>createBrowserSupabaseClient(),[]);
 const [tab,setTab]=useState<Tab>('dashboard');
 const [products,setProducts]=useState<Product[]>([]);
 const [leads,setLeads]=useState<Lead[]>([]);
 const [settings,setSettings]=useState<Settings|null>(null);
 const [productForm,setProductForm]=useState<any>(blankProduct);
 const [editingId,setEditingId]=useState<string|null>(null);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');

 async function load(){
  setMessage('');
  const [p,l,s]=await Promise.all([
   supabase.from('products').select('id,name,slug,category,packaging,volume_ml,price,promotional_price,availability_status,featured,published,sort_order').order('sort_order'),
   supabase.from('leads').select('id,name,whatsapp,email,city,event_type,event_date,guest_count,status,message,internal_notes,created_at').order('created_at',{ascending:false}).limit(100),
   supabase.from('site_settings').select('*').eq('id',true).maybeSingle()
  ]);
  if(p.data)setProducts(p.data as Product[]);
  if(l.data)setLeads(l.data as Lead[]);
  if(s.data)setSettings(s.data as Settings);
  const error=p.error||l.error||s.error;
  if(error)setMessage('Alguns dados não puderam ser carregados: '+error.message);
 }
 useEffect(()=>{load()},[]);

 async function saveProduct(e:FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  const payload={name:productForm.name.trim(),slug:productForm.slug.trim(),category:productForm.category,packaging:productForm.packaging||null,volume_ml:productForm.volume_ml?Number(productForm.volume_ml):null,price:productForm.price?Number(productForm.price):null,promotional_price:productForm.promotional_price?Number(productForm.promotional_price):null,availability_status:productForm.availability_status||null,featured:!!productForm.featured,published:!!productForm.published,sort_order:Number(productForm.sort_order)||0,updated_at:new Date().toISOString()};
  const q=editingId?supabase.from('products').update(payload).eq('id',editingId):supabase.from('products').insert(payload);
  const {error}=await q;
  setBusy(false);
  if(error){setMessage(error.message);return}
  setMessage(editingId?'Produto atualizado.':'Produto criado.');setProductForm(blankProduct);setEditingId(null);await load();
 }
 function editProduct(p:Product){setEditingId(p.id);setProductForm({...p,volume_ml:p.volume_ml??'',price:p.price??'',promotional_price:p.promotional_price??''});setTab('products');window.scrollTo({top:0,behavior:'smooth'})}
 async function removeProduct(id:string){if(!confirm('Excluir este produto?'))return;const {error}=await supabase.from('products').delete().eq('id',id);if(error)setMessage(error.message);else await load()}
 async function updateLead(id:string,status:string){const {error}=await supabase.from('leads').update({status,updated_at:new Date().toISOString()}).eq('id',id);if(error)setMessage(error.message);else await load()}
 async function saveSettings(e:FormEvent){e.preventDefault();if(!settings)return;setBusy(true);const {error}=await supabase.from('site_settings').upsert({...settings,id:true,updated_at:new Date().toISOString()});setBusy(false);setMessage(error?error.message:'Configurações salvas.');if(!error)await load()}
 async function logout(){await supabase.auth.signOut();window.location.href='/admin/login'}

 return <div className={styles.adminApp}>
  <aside className={styles.sidebar}>
   <div className={styles.brand}><b>RODADA</b><span>ADMIN</span></div>
   <nav>
    <button className={tab==='dashboard'?styles.active:''} onClick={()=>setTab('dashboard')}>Visão geral</button>
    <button className={tab==='products'?styles.active:''} onClick={()=>setTab('products')}>Produtos</button>
    <button className={tab==='leads'?styles.active:''} onClick={()=>setTab('leads')}>Leads e orçamentos</button>
    <button className={tab==='settings'?styles.active:''} onClick={()=>setTab('settings')}>Site e localização</button>
   </nav>
   <div className={styles.userBox}><small>ADMINISTRADOR</small><strong>{displayName||email}</strong><button onClick={logout}>Sair</button></div>
  </aside>
  <main className={styles.workspace}>
   <header className={styles.topbar}><div><small>CERVEJARIA RODADA</small><h1>{tab==='dashboard'?'Painel administrativo':tab==='products'?'Produtos':tab==='leads'?'Leads e orçamentos':'Site e localização'}</h1></div><button className={styles.refresh} onClick={load}>Atualizar</button></header>
   {message&&<div className={styles.alert}>{message}</div>}
   {tab==='dashboard'&&<>
    <section className={styles.stats}><article><span>Produtos</span><b>{products.length}</b></article><article><span>Publicados</span><b>{products.filter(x=>x.published).length}</b></article><article><span>Leads</span><b>{leads.length}</b></article><article><span>Novos</span><b>{leads.filter(x=>x.status==='novo').length}</b></article></section>
    <section className={styles.panel}><div className={styles.panelHead}><div><small>CONTROLE CENTRAL</small><h2>Gerencie a Rodada sem editar código</h2></div></div><div className={styles.quickGrid}><button onClick={()=>setTab('products')}><b>Produtos</b><span>Cadastrar, editar, publicar e remover itens.</span></button><button onClick={()=>setTab('leads')}><b>Orçamentos</b><span>Acompanhar contatos recebidos pelo site.</span></button><button onClick={()=>setTab('settings')}><b>Dados da empresa</b><span>Endereço, WhatsApp, e-mail e área de atendimento.</span></button></div></section>
   </>}
   {tab==='products'&&<>
    <section className={styles.panel}><div className={styles.panelHead}><div><small>{editingId?'EDITANDO':'NOVO PRODUTO'}</small><h2>{editingId?'Editar produto':'Cadastrar produto'}</h2></div>{editingId&&<button className={styles.secondary} onClick={()=>{setEditingId(null);setProductForm(blankProduct)}}>Cancelar</button>}</div>
    <form className={styles.formGrid} onSubmit={saveProduct}>
     <label>Nome<input required value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})}/></label>
     <label>Slug<input required value={productForm.slug} onChange={e=>setProductForm({...productForm,slug:e.target.value})}/></label>
     <label>Categoria<select value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})}><option value="chope">Chope</option><option value="cerveja">Cerveja</option></select></label>
     <label>Embalagem<input value={productForm.packaging??''} onChange={e=>setProductForm({...productForm,packaging:e.target.value})}/></label>
     <label>Volume (ml)<input type="number" min="1" value={productForm.volume_ml} onChange={e=>setProductForm({...productForm,volume_ml:e.target.value})}/></label>
     <label>Preço<input type="number" step="0.01" min="0" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})}/></label>
     <label>Preço promocional<input type="number" step="0.01" min="0" value={productForm.promotional_price} onChange={e=>setProductForm({...productForm,promotional_price:e.target.value})}/></label>
     <label>Status<input value={productForm.availability_status??''} onChange={e=>setProductForm({...productForm,availability_status:e.target.value})}/></label>
     <label>Ordem<input type="number" value={productForm.sort_order} onChange={e=>setProductForm({...productForm,sort_order:e.target.value})}/></label>
     <label className={styles.check}><input type="checkbox" checked={!!productForm.featured} onChange={e=>setProductForm({...productForm,featured:e.target.checked})}/> Destaque</label>
     <label className={styles.check}><input type="checkbox" checked={!!productForm.published} onChange={e=>setProductForm({...productForm,published:e.target.checked})}/> Publicado</label>
     <button className={styles.primary} disabled={busy}>{busy?'Salvando...':editingId?'Salvar alterações':'Cadastrar produto'}</button>
    </form></section>
    <section className={styles.panel}><div className={styles.panelHead}><h2>Catálogo</h2><span>{products.length} itens</span></div><div className={styles.tableWrap}><table><thead><tr><th>Produto</th><th>Embalagem</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td><b>{p.name}</b><small>{p.slug}</small></td><td>{p.packaging||'—'} {p.volume_ml?·' '+p.volume_ml+' ml':''}</td><td>{p.price!=null?'R$ '+Number(p.price).toFixed(2).replace('.',','):'—'}</td><td><span className={p.published?styles.live:styles.draft}>{p.published?'Publicado':'Rascunho'}</span></td><td><div className={styles.actions}><button onClick={()=>editProduct(p)}>Editar</button><button onClick={()=>removeProduct(p.id)}>Excluir</button></div></td></tr>)}</tbody></table></div></section>
   </>}
   {tab==='leads'&&<section className={styles.panel}><div className={styles.panelHead}><div><small>CRM</small><h2>Pedidos de orçamento</h2></div><span>{leads.length} registros</span></div><div className={styles.tableWrap}><table><thead><tr><th>Cliente</th><th>Contato</th><th>Evento</th><th>Cidade</th><th>Status</th></tr></thead><tbody>{leads.map(l=><tr key={l.id}><td><b>{l.name}</b><small>{new Date(l.created_at).toLocaleDateString('pt-BR')}</small></td><td>{l.whatsapp}<small>{l.email||''}</small></td><td>{l.event_type||'—'}<small>{l.event_date||''} {l.guest_count?'· '+l.guest_count+' pessoas':''}</small></td><td>{l.city||'—'}</td><td><select value={l.status} onChange={e=>updateLead(l.id,e.target.value)}><option value="novo">Novo</option><option value="contatado">Contatado</option><option value="orcado">Orçado</option><option value="fechado">Fechado</option><option value="perdido">Perdido</option></select></td></tr>)}</tbody></table></div></section>}
   {tab==='settings'&&<section className={styles.panel}><div className={styles.panelHead}><div><small>CONFIGURAÇÕES DO SITE</small><h2>Empresa, contato e localização</h2></div></div>{settings?<form className={styles.formGrid} onSubmit={saveSettings}>
    <label>Razão social<input value={settings.legal_name??''} onChange={e=>setSettings({...settings,legal_name:e.target.value})}/></label><label>CNPJ<input value={settings.cnpj??''} onChange={e=>setSettings({...settings,cnpj:e.target.value})}/></label>
    <label>Registro MAPA<input value={settings.mapa_registration??''} onChange={e=>setSettings({...settings,mapa_registration:e.target.value})}/></label><label>Telefone<input value={settings.phone??''} onChange={e=>setSettings({...settings,phone:e.target.value})}/></label>
    <label>WhatsApp<input value={settings.whatsapp??''} onChange={e=>setSettings({...settings,whatsapp:e.target.value})}/></label><label>E-mail<input type="email" value={settings.email??''} onChange={e=>setSettings({...settings,email:e.target.value})}/></label>
    <label className={styles.wide}>Endereço<input value={settings.address??''} onChange={e=>setSettings({...settings,address:e.target.value})}/></label><label>Latitude<input type="number" step="any" value={settings.latitude??''} onChange={e=>setSettings({...settings,latitude:e.target.value===''?null:Number(e.target.value)})}/></label><label>Longitude<input type="number" step="any" value={settings.longitude??''} onChange={e=>setSettings({...settings,longitude:e.target.value===''?null:Number(e.target.value)})}/></label>
    <label className={styles.wide}>Área de atendimento<textarea value={settings.delivery_area??''} onChange={e=>setSettings({...settings,delivery_area:e.target.value})}/></label><label className={styles.wide}>História / Sobre a Rodada<textarea rows={6} value={settings.story??''} onChange={e=>setSettings({...settings,story:e.target.value})}/></label>
    <label>Prazo de atendimento<input value={settings.lead_times??''} onChange={e=>setSettings({...settings,lead_times:e.target.value})}/></label><label>Taxas<input value={settings.fees??''} onChange={e=>setSettings({...settings,fees:e.target.value})}/></label><label className={styles.wide}>Formas de pagamento<input value={settings.payment_methods??''} onChange={e=>setSettings({...settings,payment_methods:e.target.value})}/></label>
    <button className={styles.primary} disabled={busy}>{busy?'Salvando...':'Salvar configurações'}</button>
   </form>:<p className={styles.muted}>A tabela site_settings ainda não possui registro. Verifique o schema do Supabase.</p>}</section>}
  </main>
 </div>
}