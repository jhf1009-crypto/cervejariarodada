'use client';

import {FormEvent,useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';

type Faq={
 id:string;
 question:string;
 answer:string;
 category:string|null;
 sort_order:number;
 published:boolean;
};

const emptyForm={question:'',answer:'',category:'',sort_order:'0',published:false};

export default function FaqManager(){
 const supabase=useMemo(()=>createClient(),[]);
 const [faqs,setFaqs]=useState<Faq[]>([]);
 const [form,setForm]=useState(emptyForm);
 const [editId,setEditId]=useState<string|null>(null);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');

 async function load(){
  setMessage('');
  const {data,error}=await supabase
   .from('faqs')
   .select('id,question,answer,category,sort_order,published')
   .order('sort_order')
   .order('created_at');
  if(error){setMessage(error.message);return}
  setFaqs((data||[]) as Faq[]);
 }

 useEffect(()=>{void load()},[]);

 async function save(e:FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  const payload={
   question:form.question.trim(),
   answer:form.answer.trim(),
   category:form.category.trim()||null,
   sort_order:Number(form.sort_order)||0,
   published:form.published,
   updated_at:new Date().toISOString()
  };
  const result=editId
   ?await supabase.from('faqs').update(payload).eq('id',editId)
   :await supabase.from('faqs').insert(payload);
  setBusy(false);
  if(result.error){setMessage(result.error.message);return}
  setEditId(null);setForm(emptyForm);setMessage(editId?'Pergunta atualizada.':'Pergunta cadastrada.');await load();
 }

 function edit(item:Faq){
  setEditId(item.id);
  setForm({
   question:item.question,
   answer:item.answer,
   category:item.category||'',
   sort_order:String(item.sort_order),
   published:item.published
  });
 }

 async function toggle(item:Faq){
  const {error}=await supabase.from('faqs').update({published:!item.published,updated_at:new Date().toISOString()}).eq('id',item.id);
  if(error){setMessage(error.message);return}
  await load();
 }

 async function remove(item:Faq){
  if(!confirm('Excluir esta pergunta?'))return;
  const {error}=await supabase.from('faqs').delete().eq('id',item.id);
  if(error){setMessage(error.message);return}
  await load();
 }

 return <div className="productAdmin faqManager">
  <form className="adminForm" onSubmit={save}>
   <div className="formTitle">
    <h3>{editId?'Editar pergunta':'Nova pergunta'}</h3>
    {editId&&<button type="button" onClick={()=>{setEditId(null);setForm(emptyForm)}}>Cancelar edição</button>}
   </div>
   <label className="wide">Pergunta<input required value={form.question} onChange={e=>setForm({...form,question:e.target.value})}/></label>
   <label>Categoria<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Pedidos, eventos, entrega..."/></label>
   <label>Ordem<input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})}/></label>
   <label className="wide">Resposta<textarea required rows={6} value={form.answer} onChange={e=>setForm({...form,answer:e.target.value})}/></label>
   <label className="check"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publicar no site</label>
   <button className="saveButton" disabled={busy}>{busy?'Salvando...':editId?'Salvar alterações':'Cadastrar pergunta'}</button>
   {message&&<div className="adminMessage wide">{message}</div>}
  </form>

  <div className="productList">
   <div className="listHead"><h3>FAQ</h3><span>{faqs.length} perguntas</span></div>
   {faqs.length===0?<p>Nenhuma pergunta cadastrada.</p>:faqs.map(item=><article className="faqAdminRow" key={item.id}>
    <div className="faqAdminHead"><div><small>{item.category||'GERAL'} · ORDEM {item.sort_order}</small><b>{item.question}</b></div><span className={item.published?'statusOn':'statusOff'}>{item.published?'Publicado':'Oculto'}</span></div>
    <p>{item.answer}</p>
    <div className="rowActions"><button onClick={()=>edit(item)}>Editar</button><button onClick={()=>toggle(item)}>{item.published?'Ocultar':'Publicar'}</button><button className="danger" onClick={()=>remove(item)}>Excluir</button></div>
   </article>)}
  </div>
 </div>;
}
