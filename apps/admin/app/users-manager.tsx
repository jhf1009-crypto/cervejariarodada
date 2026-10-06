'use client';

import {FormEvent,useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';

type Role='owner'|'editor'|'viewer';
type AdminUser={
 user_id:string;
 role:Role;
 display_name:string|null;
 email:string|null;
 last_sign_in_at:string|null;
 created_at:string;
 is_self:boolean;
};

const roleLabel:Record<Role,string>={owner:'Proprietário',editor:'Editor',viewer:'Visualizador'};
const roleHelp:Record<Role,string>={
 owner:'Acesso total, incluindo usuários e permissões.',
 editor:'Pode gerenciar conteúdo, produtos, eventos e leads.',
 viewer:'Acesso somente para consulta.'
};

export default function UsersManager(){
 const supabase=useMemo(()=>createClient(),[]);
 const [users,setUsers]=useState<AdminUser[]>([]);
 const [email,setEmail]=useState('');
 const [displayName,setDisplayName]=useState('');
 const [role,setRole]=useState<Role>('editor');
 const [busy,setBusy]=useState(false);
 const [busyId,setBusyId]=useState<string|null>(null);
 const [message,setMessage]=useState('');

 async function call(body:Record<string,unknown>){
  const {data,error}=await supabase.functions.invoke('admin-users',{body});
  if(error)throw new Error(error.message);
  if(data?.error)throw new Error(data.error);
  return data;
 }

 async function load(){
  setMessage('');
  try{
   const data=await call({action:'list'});
   setUsers(Array.isArray(data?.users)?data.users:[]);
  }catch(error){
   setMessage(error instanceof Error?error.message:'Falha ao carregar usuários.');
  }
 }

 useEffect(()=>{void load()},[]);

 async function invite(e:FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  try{
   await call({action:'invite',email:email.trim(),display_name:displayName.trim(),role});
   setEmail('');setDisplayName('');setRole('editor');
   setMessage('Convite enviado e permissão criada.');
   await load();
  }catch(error){
   setMessage(error instanceof Error?error.message:'Falha ao enviar convite.');
  }finally{setBusy(false)}
 }

 async function update(user:AdminUser,nextRole:Role,nextName:string){
  setBusyId(user.user_id);setMessage('');
  try{
   await call({action:'update',user_id:user.user_id,role:nextRole,display_name:nextName});
   setMessage('Permissões atualizadas.');
   await load();
  }catch(error){
   setMessage(error instanceof Error?error.message:'Falha ao atualizar usuário.');
  }finally{setBusyId(null)}
 }

 async function revoke(user:AdminUser){
  if(!confirm('Remover o acesso administrativo de '+(user.email||user.display_name||'este usuário')+'?'))return;
  setBusyId(user.user_id);setMessage('');
  try{
   await call({action:'revoke',user_id:user.user_id});
   setMessage('Acesso administrativo removido.');
   await load();
  }catch(error){
   setMessage(error instanceof Error?error.message:'Falha ao remover acesso.');
  }finally{setBusyId(null)}
 }

 return <div className="usersAdmin">
  <section className="usersIntro">
   <div><small>CONTROLE DE ACESSO</small><h3>Usuários administrativos</h3><p>Convide pessoas e defina exatamente o nível de acesso de cada uma.</p></div>
   <div className="roleLegend">
    {(Object.keys(roleLabel) as Role[]).map(item=><div key={item}><b>{roleLabel[item]}</b><span>{roleHelp[item]}</span></div>)}
   </div>
  </section>

  <form className="inviteForm" onSubmit={invite}>
   <div className="formTitle"><h3>Convidar novo usuário</h3></div>
   <label>Nome<input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Nome para identificação"/></label>
   <label>E-mail<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="usuario@empresa.com"/></label>
   <label>Permissão<select value={role} onChange={e=>setRole(e.target.value as Role)}><option value="owner">Proprietário</option><option value="editor">Editor</option><option value="viewer">Visualizador</option></select></label>
   <button className="saveButton" disabled={busy}>{busy?'Enviando convite...':'Enviar convite'}</button>
  </form>

  {message&&<div className="adminMessage">{message}</div>}

  <section className="usersList">
   <div className="listHead"><h3>Acessos atuais</h3><span>{users.length} usuários</span></div>
   {users.length===0?<p>Nenhum usuário encontrado.</p>:users.map(user=><AdminUserRow key={user.user_id} user={user} busy={busyId===user.user_id} onSave={update} onRevoke={revoke}/>)}
  </section>
 </div>;
}

function AdminUserRow({user,busy,onSave,onRevoke}:{user:AdminUser;busy:boolean;onSave:(user:AdminUser,role:Role,name:string)=>Promise<void>;onRevoke:(user:AdminUser)=>Promise<void>}){
 const [role,setRole]=useState<Role>(user.role);
 const [name,setName]=useState(user.display_name||'');
 useEffect(()=>{setRole(user.role);setName(user.display_name||'')},[user.role,user.display_name]);

 return <article className="adminUserRow">
  <div className="adminUserIdentity">
   <div className="adminAvatar">{(user.display_name||user.email||'A').slice(0,1).toUpperCase()}</div>
   <div><b>{user.display_name||'Sem nome'}</b><span>{user.email||user.user_id}</span>{user.is_self&&<small>VOCÊ</small>}</div>
  </div>
  <div className="adminUserFields">
   <label>Nome<input value={name} onChange={e=>setName(e.target.value)}/></label>
   <label>Permissão<select value={role} disabled={user.is_self} onChange={e=>setRole(e.target.value as Role)}><option value="owner">Proprietário</option><option value="editor">Editor</option><option value="viewer">Visualizador</option></select></label>
  </div>
  <div className="adminUserMeta">
   <span>{user.last_sign_in_at?'Último acesso '+new Date(user.last_sign_in_at).toLocaleString('pt-BR'):'Ainda não acessou'}</span>
   <span>Cadastrado em {new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
  </div>
  <div className="rowActions">
   <button disabled={busy} onClick={()=>onSave(user,role,name)}>{busy?'Salvando...':'Salvar usuário'}</button>
   {!user.is_self&&<button className="danger" disabled={busy} onClick={()=>onRevoke(user)}>Remover acesso</button>}
  </div>
 </article>;
}
