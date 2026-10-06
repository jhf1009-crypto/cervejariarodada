'use client';

import {FormEvent,useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';

type LegalPage={
 id:string;
 slug:string;
 title:string;
 body:string;
 published:boolean;
 updated_at:string;
};

const emptyForm={slug:'',title:'',body:'',published:false};

export default function LegalManager(){
 const supabase=useMemo(()=>createClient(),[]);
 const [pages,setPages]=useState<LegalPage[]>([]);
 const [form,setForm]=useState(emptyForm);
 const [editId,setEditId]=useState<string|null>(null);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');

 function slugify(v:string){
  return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 }

 async function load(){
  setMessage('');
  const {data,error}=await supabase
   .from('legal_pages')
   .select('id,slug,title,body,published,updated_at')
   .order('title');
  if(error){setMessage(error.message);return}
  setPages((data||[]) as LegalPage[]);
 }

 useEffect(()=>{void load()},[]);

 async function save(e:FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  const payload={
   slug:(form.slug||slugify(form.title)).trim(),
   title:form.title.trim(),
   body:form.body.trim(),
   published:form.published,
   updated_at:new Date().toISOString()
  };
  const result=editId
   ?await supabase.from('legal_pages').update(payload).eq('id',editId)
   :await supabase.from('legal_pages').insert(payload);
  setBusy(false);
  if(result.error){setMessage(result.error.message);return}
  setMessage(editId?'Página atualizada.':'Página criada.');
  setEditId(null);setForm(emptyForm);await load();
 }

 function edit(page:LegalPage){
  setEditId(page.id);
  setForm({slug:page.slug,title:page.title,body:page.body,published:page.published});
 }

 async function toggle(page:LegalPage){
  const {error}=await supabase.from('legal_pages').update({published:!page.published,updated_at:new Date().toISOString()}).eq('id',page.id);
  if(error){setMessage(error.message);return}
  await load();
 }

 async function remove(page:LegalPage){
  if(!confirm('Excluir a página "'+page.title+'"?'))return;
  const {error}=await supabase.from('legal_pages').delete().eq('id',page.id);
  if(error){setMessage(error.message);return}
  await load();
 }

 return <div className="productAdmin legalManager">
  <form className="adminForm" onSubmit={save}>
   <div className="formTitle">
    <h3>{editId?'Editar página legal':'Nova página legal'}</h3>
    {editId&&<button type="button" onClick={()=>{setEditId(null);setForm(emptyForm)}}>Cancelar edição</button>}
   </div>
   <label>Título<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value,slug:editId?form.slug:slugify(e.target.value)})} placeholder="Política de Privacidade"/></label>
   <label>Slug<input required value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="politica-de-privacidade"/></label>
   <label className="wide">Conteúdo<textarea required rows={18} value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="Escreva o texto completo da página..."/></label>
   <label className="check"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publicar no site</label>
   <button className="saveButton" disabled={busy}>{busy?'Salvando...':editId?'Salvar alterações':'Criar página'}</button>
   {message&&<div className="adminMessage wide">{message}</div>}
  </form>

  <div className="productList">
   <div className="listHead"><h3>Páginas legais</h3><span>{pages.length} páginas</span></div>
   {pages.length===0?<p>Nenhuma página legal cadastrada.</p>:pages.map(page=><article className="legalAdminRow" key={page.id}>
    <div className="legalAdminHead">
     <div><small>/{page.slug}</small><b>{page.title}</b></div>
     <span className={page.published?'statusOn':'statusOff'}>{page.published?'Publicada':'Rascunho'}</span>
    </div>
    <p>Atualizada em {new Date(page.updated_at).toLocaleString('pt-BR')}</p>
    <div className="rowActions">
     <button onClick={()=>edit(page)}>Editar</button>
     <button onClick={()=>toggle(page)}>{page.published?'Despublicar':'Publicar'}</button>
     {page.published&&<a className="adminPreviewLink" href={'/legal/'+page.slug} target="_blank" rel="noreferrer">Abrir página ↗</a>}
     <button className="danger" onClick={()=>remove(page)}>Excluir</button>
    </div>
   </article>)}
  </div>
 </div>;
}
