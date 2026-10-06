import {redirect} from 'next/navigation';
import {createClient} from '../lib/supabase/server';

export default async function AdminHome(){
 let supabase;
 try{supabase=await createClient();}catch{return <main className="shell"><section className="notice"><strong>Supabase não está configurado neste deploy.</strong></section></main>}
 const {data:{user},error}=await supabase.auth.getUser();
 if(error||!user)redirect('/login');

 // Consulta direta ao perfil do usuário autenticado.
 // A tabela admin_profiles é a fonte canônica deste painel.
 const {data:profile,error:profileError}=await supabase
  .from('admin_profiles')
  .select('role,display_name')
  .eq('user_id',user.id)
  .maybeSingle();

 if(profileError){
  return <main className="shell"><section className="notice"><strong>Não foi possível ler o perfil administrativo.</strong><p>{profileError.message}</p><p>UID autenticado: {user.id}</p><a href="/login?logout=1">Sair</a></section></main>;
 }
 if(!profile){
  return <main className="shell"><section className="notice"><strong>Usuário autenticado, mas sem perfil administrativo.</strong><p>UID autenticado: {user.id}</p><p>Este UID precisa existir em public.admin_profiles.</p><a href="/login?logout=1">Sair</a></section></main>;
 }

 const allowed=['owner','editor','admin'];
 if(!allowed.includes(profile.role)){
  return <main className="shell"><section className="notice"><strong>Acesso negado.</strong><p>Perfil atual: {profile.role}</p><a href="/login?logout=1">Sair</a></section></main>;
 }

 return <main className="shell">
  <header><div><small>CERVEJARIA RODADA</small><h1>Painel administrativo</h1><p>{profile.display_name||user.email} · {profile.role}</p></div><a className="badge" href="/login?logout=1">Sair</a></header>
  <section className="grid">
   {['Dashboard','Produtos','Barris e eventos','Leads e orçamentos','Galeria e depoimentos','Equipe','FAQ','Configurações','Páginas legais','Usuários e permissões','Log de auditoria'].map((m,i)=><article key={m}><span>{String(i+1).padStart(2,'0')}</span><h2>{m}</h2><p>Gerenciamento conectado ao Supabase.</p></article>)}
  </section>
 </main>;
}
