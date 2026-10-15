import {redirect} from 'next/navigation';
import {createClient} from '../../lib/supabase/server';
import MFAClient from './mfa-client';
export const dynamic='force-dynamic';
export default async function MFAPage(){
 const db=await createClient();
 const {data:{user},error}=await db.auth.getUser();if(error||!user)redirect('/login');
 const {data:profile}=await db.from('admin_profiles').select('role').eq('user_id',user.id).maybeSingle();
 if(!profile||!['owner','editor','viewer'].includes(profile.role))return <main className="shell"><h1>Acesso negado</h1></main>;
 return <MFAClient/>;
}