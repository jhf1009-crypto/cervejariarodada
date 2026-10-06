import {redirect} from 'next/navigation';
import {createClient} from '../lib/supabase/server';
import AdminClient from './admin-client';

export default async function AdminHome(){
 let supabase;try{supabase=await createClient();}catch{return <main className="shell"><section className="notice"><strong>Supabase não está configurado neste deploy.</strong></section></main>}
 const {data:{user},error}=await supabase.auth.getUser();if(error||!user)redirect('/login');
 const {data:profile,error:profileError}=await supabase.from('admin_profiles').select('role,display_name').eq('user_id',user.id).maybeSingle();
 if(profileError)return <main className="shell"><section className="notice"><strong>Não foi possível ler o perfil administrativo.</strong><p>{profileError.message}</p></section></main>;
 if(!profile||!['owner','editor','admin'].includes(profile.role))return <main className="shell"><section className="notice"><strong>Acesso negado.</strong></section></main>;
 return <AdminClient name={profile.display_name||''} role={profile.role} email={user.email||''}/>;
}