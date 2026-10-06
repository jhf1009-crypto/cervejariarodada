'use client';

import {useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';

type LeadStatus='novo'|'contatado'|'orcado'|'fechado'|'perdido';
type Lead={
 id:string;
 name:string;
 whatsapp:string;
 email:string|null;
 event_date:string|null;
 city:string|null;
 event_type:string|null;
 guest_count:number|null;
 message:string|null;
 source:string|null;
 status:LeadStatus;
 internal_notes:string|null;
 created_at:string;
 updated_at:string;
};

const statusLabels:Record<LeadStatus,string>={
 novo:'Novo',
 contatado:'Contatado',
 orcado:'Orçado',
 fechado:'Fechado',
 perdido:'Perdido'
};

export default function LeadsManager(){
 const supabase=useMemo(()=>createClient(),[]);
 const [leads,setLeads]=useState<Lead[]>([]);
 const [filter,setFilter]=useState<'todos'|LeadStatus>('todos');
 const [query,setQuery]=useState('');
 const [openId,setOpenId]=useState<string|null>(null);
 const [notes,setNotes]=useState<Record<string,string>>({});
 const [busyId,setBusyId]=useState<string|null>(null);
 const [message,setMessage]=useState('');

 async function load(){
  setMessage('');
  const {data,error}=await supabase
   .from('leads')
   .select('id,name,whatsapp,email,event_date,city,event_type,guest_count,message,source,status,internal_notes,created_at,updated_at')
   .order('created_at',{ascending:false});
  if(error){setMessage(error.message);return}
  const rows=(data||[]) as Lead[];
  setLeads(rows);
  setNotes(Object.fromEntries(rows.map(item=>[item.id,item.internal_notes||''])));
 }

 useEffect(()=>{load()},[]);

 async function changeStatus(id:string,status:LeadStatus){
  setBusyId(id);setMessage('');
  const {error}=await supabase.from('leads').update({status,updated_at:new Date().toISOString()}).eq('id',id);
  setBusyId(null);
  if(error){setMessage(error.message);return}
  setLeads(current=>current.map(item=>item.id===id?{...item,status}:item));
  setMessage('Status atualizado.');
 }

 async function saveNotes(id:string){
  setBusyId(id);setMessage('');
  const internal_notes=notes[id]?.trim()||null;
  const {error}=await supabase.from('leads').update({internal_notes,updated_at:new Date().toISOString()}).eq('id',id);
  setBusyId(null);
  if(error){setMessage(error.message);return}
  setLeads(current=>current.map(item=>item.id===id?{...item,internal_notes}:item));
  setMessage('Anotações salvas.');
 }

 const visible=leads.filter(item=>{
  const statusOk=filter==='todos'||item.status===filter;
  const text=(item.name+' '+item.whatsapp+' '+(item.email||'')+' '+(item.city||'')+' '+(item.event_type||'')).toLowerCase();
  const queryOk=!query.trim()||text.includes(query.toLowerCase().trim());
  return statusOk&&queryOk;
 });

 function waLink(value:string){
  const digits=value.replace(/\D/g,'');
  return 'https://wa.me/'+digits;
 }

 return <div className="leadsAdmin">
  <div className="leadStats">
   <article><span>Total</span><b>{leads.length}</b></article>
   <article><span>Novos</span><b>{leads.filter(x=>x.status==='novo').length}</b></article>
   <article><span>Orçados</span><b>{leads.filter(x=>x.status==='orcado').length}</b></article>
   <article><span>Fechados</span><b>{leads.filter(x=>x.status==='fechado').length}</b></article>
  </div>

  <div className="leadToolbar">
   <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar cliente, cidade, WhatsApp..."/>
   <select value={filter} onChange={e=>setFilter(e.target.value as 'todos'|LeadStatus)}>
    <option value="todos">Todos os status</option>
    <option value="novo">Novos</option>
    <option value="contatado">Contatados</option>
    <option value="orcado">Orçados</option>
    <option value="fechado">Fechados</option>
    <option value="perdido">Perdidos</option>
   </select>
   <button onClick={load}>Atualizar</button>
  </div>

  {message&&<div className="adminMessage">{message}</div>}

  <div className="leadList">
   {visible.length===0&&<p className="leadEmpty">Nenhum orçamento encontrado.</p>}
   {visible.map(lead=><article className="leadCard" key={lead.id}>
    <div className="leadCardTop">
     <div>
      <small>{new Date(lead.created_at).toLocaleString('pt-BR')}</small>
      <h3>{lead.name}</h3>
      <p>{lead.city||'Cidade não informada'}{lead.event_type?' · '+lead.event_type:''}</p>
     </div>
     <select disabled={busyId===lead.id} value={lead.status} onChange={e=>changeStatus(lead.id,e.target.value as LeadStatus)}>
      {Object.entries(statusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}
     </select>
    </div>

    <div className="leadSummary">
     <div><span>WhatsApp</span><a href={waLink(lead.whatsapp)} target="_blank" rel="noreferrer">{lead.whatsapp}</a></div>
     <div><span>E-mail</span><b>{lead.email||'—'}</b></div>
     <div><span>Data do evento</span><b>{lead.event_date?new Date(lead.event_date+'T12:00:00').toLocaleDateString('pt-BR'):'—'}</b></div>
     <div><span>Convidados</span><b>{lead.guest_count??'—'}</b></div>
    </div>

    <button className="detailsButton" onClick={()=>setOpenId(openId===lead.id?null:lead.id)}>
     {openId===lead.id?'Fechar detalhes':'Ver detalhes e anotações'}
    </button>

    {openId===lead.id&&<div className="leadDetails">
     <div><span>Mensagem do cliente</span><p>{lead.message||'Nenhuma mensagem adicional.'}</p></div>
     <div><span>Origem</span><p>{lead.source||'Não informada'}</p></div>
     <label>
      Anotações internas
      <textarea rows={5} value={notes[lead.id]??''} onChange={e=>setNotes({...notes,[lead.id]:e.target.value})} placeholder="Registre negociação, valores combinados, retorno, observações..."/>
     </label>
     <button className="saveButton" disabled={busyId===lead.id} onClick={()=>saveNotes(lead.id)}>
      {busyId===lead.id?'Salvando...':'Salvar anotações'}
     </button>
    </div>}
   </article>)}
  </div>
 </div>;
}
