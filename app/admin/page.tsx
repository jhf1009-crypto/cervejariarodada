import {redirect} from 'next/navigation';
import {createServerSupabaseClient} from '../../lib/supabase/server';
import AdminDashboard from './admin-dashboard';
import styles from './admin.module.css';

export const metadata={title:'Admin | Cervejaria Rodada',robots:{index:false,follow:false}};

export default async function AdminPage(){
 let supabase;
 try{supabase=await createServerSupabaseClient();}catch(error){return <main className={styles.shell}><section className={styles.notice}><strong>Supabase não configurado neste deploy.</strong><p>{error instanceof Error?error.message:'Verifique as variáveis do Supabase.'}</p></section></main>}
 const {data:{user},error:userError}=await supabase.auth.getUser();
 if(userError||!user)redirect('/admin/login');
 const {data:profile,error:profileError}=await supabase.from('profiles').select('role,display_name').eq('user_id',user.id).maybeSingle();
 if(profileError)return <main className={styles.shell}><section className={styles.notice}><strong>Não foi possível carregar seu perfil.</strong><p>{profileError.message}</p></section></main>;
 if(!profile||profile.role!=='admin')return <main className={styles.shell}><section className={styles.denied}><small>ACESSO RESTRITO</small><h1>Acesso negado</h1><p>Este usuário não possui permissão administrativa.</p><a href="/">Voltar ao site</a></section></main>;
 return <AdminDashboard displayName={profile.display_name||''} email={user.email||''}/>;
}