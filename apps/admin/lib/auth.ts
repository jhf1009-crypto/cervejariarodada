import 'server-only';
import {redirect} from 'next/navigation';
import {createClient} from './supabase/server';

export type AdminRole='owner'|'editor'|'viewer';

export async function requireAdmin(options?:{roles?:AdminRole[];requireAal2ForOwner?:boolean}){
  const supabase=await createClient();
  const {data:{user},error}=await supabase.auth.getUser();
  if(error||!user)redirect('/login');

  const {data:profile,error:profileError}=await supabase
    .from('admin_profiles')
    .select('role,display_name,active')
    .eq('user_id',user.id)
    .maybeSingle();

  if(profileError||!profile||profile.active===false)redirect('/login');

  const role=profile.role as AdminRole;
  if(options?.roles&&!options.roles.includes(role))redirect('/forbidden');

  if(options?.requireAal2ForOwner!==false&&role==='owner'){
    const {data:aal}=await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if(aal?.currentLevel!=='aal2')redirect('/mfa');
  }

  return {supabase,user,profile:{...profile,role}};
}

export async function requireOwner(){
  return requireAdmin({roles:['owner']});
}
