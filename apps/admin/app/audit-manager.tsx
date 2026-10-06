'use client';

import {useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';

type AuditRow={
 id:number;
 actor_user_id:string|null;
 action:string;
 entity_table:string;
 entity_id:string|null;
 old_value:Record<string,unknown>|null;
 new_value:Record<string,unknown>|null;
 created_at:string;
};

type Profile={user_id:string;display_name:string|null;role:string};

const actionLabel:Record<string,string>={
 insert:'Criou',
 update:'Alterou',
 delete:'Excluiu',
 invite_admin:'Convidou usuário',
 update_admin:'Alterou usuário',
 revoke_admin:'Removeu acesso'
};

const tableLabel:Record<string,string>={
 products:'Produto',
 product_images:'Imagem de produto',
 beer_styles:'Estilo de cerveja',
 keg_sizes:'Barril',
 event_packages:'Pacote de evento',
 events_gallery:'Galeria',
 testimonials:'Depoimento',
 faqs:'FAQ',
 leads:'Lead / orçamento',
 site_settings:'Configurações',
 legal_pages:'Página legal',
 admin_profiles:'Usuário administrativo'
};

function summarize(row:AuditRow){
 const value=row.new_value||row.old_value||{};
 const candidates=['name','title','question','legal_name','city','display_name','slug','whatsapp'];
 for(const key of candidates){
  const found=value[key];
  if(typeof found==='string'&&found.trim())return found;
 }
 if(row.entity_id)return row.entity_id;
 return 'Registro';
}

export default function AuditManager(){
 const supabase=useMemo(()=>createClient(),[]);
 const [rows,setRows]=useState<AuditRow[]>([]);
 const [profiles,setProfiles]=useState<Profile[]>([]);
 const [query,setQuery]=useState('');
 const [table,setTable]=useState('todos');
 const [action,setAction]=useState('todos');
 const [openId,setOpenId]=useState<number|null>(null);
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState('');

 async function load(){
  setLoading(true);setMessage('');
  const [logs,admins]=await Promise.all([
   supabase.from('audit_log').select('id,actor_user_id,action,entity_table,entity_id,old_value,new_value,created_at').order('created_at',{ascending:false}).limit(300),
   supabase.from('admin_profiles').select('user_id,display_name,role')
  ]);
  setLoading(false);
  if(logs.error||admins.error){setMessage((logs.error||admins.error)?.message||'Erro ao carregar histórico.');return}
  setRows((logs.data||[]) as AuditRow[]);
  setProfiles((admins.data||[]) as Profile[]);
 }

 useEffect(()=>{void load()},[]);

 const profileMap=useMemo(()=>new Map(profiles.map(p=>[p.user_id,p])),[profiles]);
 const tables=useMemo(()=>Array.from(new Set(rows.map(r=>r.entity_table))).sort(),[rows]);

 const visible=rows.filter(row=>{
  const actor=row.actor_user_id?profileMap.get(row.actor_user_id):null;
  const text=[
   actionLabel[row.action]||row.action,
   tableLabel[row.entity_table]||row.entity_table,
   summarize(row),
   actor?.display_name||'',
   actor?.role||''
  ].join(' ').toLowerCase();

  return (table==='todos'||row.entity_table===table)
   &&(action==='todos'||row.action===action)
   &&(!query.trim()||text.includes(query.toLowerCase().trim()));
 });

 if(loading)return <div className="settingsLoading">Carregando histórico administrativo...</div>;

 return <div className="auditAdmin">
  <div className="auditToolbar">
   <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar alteração, registro ou administrador..."/>
   <select value={table} onChange={e=>setTable(e.target.value)}>
    <option value="todos">Todos os módulos</option>
    {tables.map(item=><option key={item} value={item}>{tableLabel[item]||item}</option>)}
   </select>
   <select value={action} onChange={e=>setAction(e.target.value)}>
    <option value="todos">Todas as ações</option>
    <option value="insert">Criações</option>
    <option value="update">Alterações</option>
    <option value="delete">Exclusões</option>
    <option value="invite_admin">Convites de usuário</option>
    <option value="update_admin">Alterações de usuário</option>
    <option value="revoke_admin">Remoções de acesso</option>
   </select>
   <button onClick={load}>Atualizar</button>
  </div>

  {message&&<div className="adminMessage">{message}</div>}

  <div className="auditSummary">
   <article><span>Registros carregados</span><b>{rows.length}</b></article>
   <article><span>Alterações</span><b>{rows.filter(r=>r.action==='update'||r.action==='update_admin').length}</b></article>
   <article><span>Criações</span><b>{rows.filter(r=>r.action==='insert'||r.action==='invite_admin').length}</b></article>
   <article><span>Exclusões</span><b>{rows.filter(r=>r.action==='delete'||r.action==='revoke_admin').length}</b></article>
  </div>

  <div className="auditList">
   {visible.length===0?<p className="leadEmpty">Nenhum registro encontrado.</p>:visible.map(row=>{
    const actor=row.actor_user_id?profileMap.get(row.actor_user_id):null;
    return <article className="auditRow" key={row.id}>
     <div className="auditMain">
      <div className="auditIcon">{row.action==='delete'||row.action==='revoke_admin'?'−':row.action==='insert'||row.action==='invite_admin'?'+':'↻'}</div>
      <div>
       <small>{new Date(row.created_at).toLocaleString('pt-BR')}</small>
       <h3>{actionLabel[row.action]||row.action} · {tableLabel[row.entity_table]||row.entity_table}</h3>
       <p><strong>{summarize(row)}</strong> por {actor?.display_name||'Administrador'}{actor?.role?' · '+actor.role:''}</p>
      </div>
      <button className="detailsButton" onClick={()=>setOpenId(openId===row.id?null:row.id)}>{openId===row.id?'Fechar':'Ver detalhes'}</button>
     </div>

     {openId===row.id&&<div className="auditDetails">
      {row.old_value&&<div><span>ANTES</span><pre>{JSON.stringify(row.old_value,null,2)}</pre></div>}
      {row.new_value&&<div><span>DEPOIS</span><pre>{JSON.stringify(row.new_value,null,2)}</pre></div>}
      {!row.old_value&&!row.new_value&&<p>Este registro não possui dados adicionais.</p>}
     </div>}
    </article>;
   })}
  </div>
 </div>;
}
