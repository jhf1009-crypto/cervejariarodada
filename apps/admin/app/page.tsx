import {redirect} from 'next/navigation';
import {createClient} from '../lib/supabase/server';

const modules=['Dashboard','Produtos','Barris e eventos','Leads e orçamentos','Galeria e depoimentos','Equipe','FAQ','Configurações','Páginas legais','Usuários e permissões','Log de auditoria'];

export default async function AdminHome(){
 let supabase;
 try{supabase=await createClient();}catch{return <main className="shell"><section className="notice"><strong>Admin preparado, mas Supabase ainda não está configurado.</strong><p>Defina as variáveis do projeto Supabase em produção antes de usar autenticação e CRUD.</p></section></main>}
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect('/login');
 const {data:profile}=await supabase.from('admin_profiles').select('role,display_name').eq('user_id',user.id).maybeSingle();
 if(!profile)redirect('/login');
 if(profile.role==='owner'){
  const aal=await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if(aal.data?.nextLevel==='aal2'&&aal.data.currentLevel!=='aal2')redirect('/mfa');
 }
 return <main className="shell">
  <header><div><small>CERVEJARIA RODADA</small><h1>Painel administrativo</h1><p>{profile.display_name||user.email} · {profile.role}</p></div><span className="badge">acesso restrito</span></header>
  <section className="grid" aria-label="Módulos do painel">{modules.map((module,index)=><article key={module}><span>{String(index+1).padStart(2,'0')}</span><h2>{module}</h2><p>Gerenciamento conectado ao banco com políticas por papel.</p></article>)}</section>
 </main>;
}
