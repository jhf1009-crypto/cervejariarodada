'use client';
import {FormEvent,useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';

type Product={id:string;name:string;slug:string;category:'chope'|'cerveja';packaging:string|null;volume_ml:number|null;short_description:string|null;price:number|null;promotional_price:number|null;availability_status:string|null;sort_order:number;featured:boolean;published:boolean};
const empty={name:'',slug:'',category:'chope',packaging:'',volume_ml:'',short_description:'',price:'',promotional_price:'',availability_status:'Disponível',sort_order:'0',featured:false,published:false};
const modules=[['Dashboard','Visão geral do painel','dashboard'],['Produtos','Cadastre, edite e publique produtos','products'],['Barris e eventos','Gerencie tamanhos e pacotes','kegs'],['Leads e orçamentos','Acompanhe pedidos recebidos','leads'],['Galeria e depoimentos','Fotos e avaliações','gallery'],['Equipe','Membros da equipe','team'],['FAQ','Perguntas frequentes','faq'],['Configurações','Contato e localização','settings'],['Páginas legais','Políticas e textos legais','legal'],['Usuários e permissões','Controle de acesso','users'],['Log de auditoria','Histórico administrativo','audit']] as const;

export default function AdminClient({name,role,email}:{name:string;role:string;email:string}){
 const supabase=useMemo(()=>createClient(),[]);
 const [active,setActive]=useState('dashboard');const [products,setProducts]=useState<Product[]>([]);const [form,setForm]=useState<any>(empty);const [editId,setEditId]=useState<string|null>(null);const [busy,setBusy]=useState(false);const [msg,setMsg]=useState('');
 async function loadProducts(){const {data,error}=await supabase.from('products').select('id,name,slug,category,packaging,volume_ml,short_description,price,promotional_price,availability_status,sort_order,featured,published').order('sort_order');if(error)setMsg(error.message);else setProducts((data||[]) as Product[])}
 useEffect(()=>{loadProducts()},[]);
 async function logout(){await supabase.auth.signOut();window.location.href='/login'}
 function slugify(v:string){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
 async function save(e:FormEvent){e.preventDefault();setBusy(true);setMsg('');const payload={name:form.name.trim(),slug:(form.slug||slugify(form.name)).trim(),category:form.category,packaging:form.packaging||null,volume_ml:form.volume_ml?Number(form.volume_ml):null,short_description:form.short_description||null,price:form.price?Number(form.price):null,promotional_price:form.promotional_price?Number(form.promotional_price):null,availability_status:form.availability_status||null,sort_order:Number(form.sort_order)||0,featured:!!form.featured,published:!!form.published,updated_at:new Date().toISOString()};const result=editId?await supabase.from('products').update(payload).eq('id',editId):await supabase.from('products').insert(payload);setBusy(false);if(result.error){setMsg(result.error.message);return}setMsg(editId?'Produto atualizado com sucesso.':'Produto cadastrado com sucesso.');setEditId(null);setForm(empty);await loadProducts()}
 function edit(p:Product){setEditId(p.id);setForm({...p,volume_ml:p.volume_ml??'',price:p.price??'',promotional_price:p.promotional_price??''});window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'})}
 async function del(p:Product){if(!confirm('Excluir '+p.name+'?'))return;const {error}=await supabase.from('products').delete().eq('id',p.id);if(error)setMsg(error.message);else{setMsg('Produto excluído.');await loadProducts()}}
 async function toggle(p:Product){const {error}=await supabase.from('products').update({published:!p.published,updated_at:new Date().toISOString()}).eq('id',p.id);if(error)setMsg(error.message);else await loadProducts()}
 return <main className="shell">
  <header><div><small>CERVEJARIA RODADA</small><h1>Painel administrativo</h1><p>{name||email} · {role}</p></div><button className="badge buttonBadge" onClick={logout}>Sair</button></header>
  <section className="grid">{modules.map(([title,desc,id],i)=><button key={id} className={'moduleCard '+(active===id?'selected':'')} onClick={()=>setActive(id)}><span>{String(i+1).padStart(2,'0')}</span><h2>{title}</h2><p>{desc}</p></button>)}</section>
  <section className="workspace"><small>MÓDULO ATIVO</small><h2>{modules.find(m=>m[2]===active)?.[0]}</h2>{msg&&<div className="adminMessage">{msg}</div>}
   {active==='dashboard'&&<div className="stats"><article><span>Produtos cadastrados</span><b>{products.length}</b></article><article><span>Publicados</span><b>{products.filter(p=>p.published).length}</b></article><article><span>Em destaque</span><b>{products.filter(p=>p.featured).length}</b></article></div>}
   {active==='products'&&<div className="productAdmin">
    <form className="adminForm" onSubmit={save}><div className="formTitle"><h3>{editId?'Editar produto':'Novo produto'}</h3>{editId&&<button type="button" onClick={()=>{setEditId(null);setForm(empty)}}>Cancelar edição</button>}</div>
     <label>Nome<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value,slug:editId?form.slug:slugify(e.target.value)})}/></label>
     <label>Slug<input required value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/></label>
     <label>Categoria<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="chope">Chope</option><option value="cerveja">Cerveja</option></select></label>
     <label>Embalagem<input value={form.packaging??''} onChange={e=>setForm({...form,packaging:e.target.value})} placeholder="PET, lata, long neck..."/></label>
     <label>Volume em ml<input type="number" min="1" value={form.volume_ml} onChange={e=>setForm({...form,volume_ml:e.target.value})}/></label>
     <label>Preço<input type="number" min="0" step=".01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label>
     <label>Preço promocional<input type="number" min="0" step=".01" value={form.promotional_price} onChange={e=>setForm({...form,promotional_price:e.target.value})}/></label>
     <label>Status<input value={form.availability_status??''} onChange={e=>setForm({...form,availability_status:e.target.value})}/></label>
     <label>Ordem<input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})}/></label>
     <label className="wide">Descrição<textarea rows={3} value={form.short_description??''} onChange={e=>setForm({...form,short_description:e.target.value})}/></label>
     <label className="check"><input type="checkbox" checked={!!form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Produto em destaque</label>
     <label className="check"><input type="checkbox" checked={!!form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publicado no catálogo</label>
     <button className="saveButton" disabled={busy}>{busy?'Salvando...':editId?'Salvar alterações':'Cadastrar produto'}</button>
    </form>
    <div className="productList"><div className="listHead"><h3>Produtos</h3><span>{products.length} itens</span></div>{products.length===0?<p>Nenhum produto cadastrado.</p>:products.map(p=><article className="productRow" key={p.id}><div><b>{p.name}</b><small>{p.packaging||'Sem embalagem'}{p.volume_ml?' · '+p.volume_ml+' ml':''}</small></div><div className="productMeta"><span className={p.published?'statusOn':'statusOff'}>{p.published?'Publicado':'Rascunho'}</span>{p.price!=null&&<strong>R$ {Number(p.price).toFixed(2).replace('.',',')}</strong>}</div><div className="rowActions"><button onClick={()=>edit(p)}>Editar</button><button onClick={()=>toggle(p)}>{p.published?'Ocultar':'Publicar'}</button><button className="danger" onClick={()=>del(p)}>Excluir</button></div></article>)}</div>
   </div>}
   {active!=='dashboard'&&active!=='products'&&<p>Este módulo será implementado na próxima etapa, sem alterar o que já está funcionando.</p>}
  </section>
 </main>
}