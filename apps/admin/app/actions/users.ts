'use server';

import {revalidatePath} from 'next/cache';
import {z} from 'zod';
import {requireOwner,type AdminRole} from '../../lib/auth';
import {createAdminClient} from '../../lib/supabase/admin';

export type UserActionState={ok:boolean;message:string};

const inviteSchema=z.object({
  email:z.string().email().max(254).transform(v=>v.trim().toLowerCase()),
  displayName:z.string().trim().min(2).max(120),
  role:z.enum(['owner','editor','viewer'])
});

const roleSchema=z.object({
  userId:z.string().uuid(),
  role:z.enum(['owner','editor','viewer'])
});

const userSchema=z.object({userId:z.string().uuid()});

async function audit(actor:string,action:string,userId:string,oldValue?:unknown,newValue?:unknown){
  const admin=createAdminClient();
  await admin.from('audit_log').insert({
    actor_user_id:actor,
    action,
    entity_table:'admin_profiles',
    entity_id:userId,
    old_value:oldValue??null,
    new_value:newValue??null
  });
}

export async function inviteUserAction(_:UserActionState,formData:FormData):Promise<UserActionState>{
  const {user}=await requireOwner();
  const parsed=inviteSchema.safeParse({
    email:formData.get('email'),
    displayName:formData.get('displayName'),
    role:formData.get('role')
  });
  if(!parsed.success)return {ok:false,message:'Revise e-mail, nome e papel.'};

  try{
    const admin=createAdminClient();
    const origin=process.env.ADMIN_APP_URL||'https://admin.cervejariarodada.com.br';
    const {data,error}=await admin.auth.admin.inviteUserByEmail(parsed.data.email,{
      redirectTo:origin+'/auth/callback?next=/update-password',
      data:{display_name:parsed.data.displayName}
    });
    if(error||!data.user)throw error||new Error('Convite sem usuário');

    const {error:profileError}=await admin.from('admin_profiles').upsert({
      user_id:data.user.id,
      role:parsed.data.role,
      display_name:parsed.data.displayName,
      active:true
    });
    if(profileError)throw profileError;

    await audit(user.id,'invite_user',data.user.id,null,{role:parsed.data.role,display_name:parsed.data.displayName});
    revalidatePath('/users');
    return {ok:true,message:'Convite enviado com sucesso.'};
  }catch{
    return {ok:false,message:'Não foi possível enviar o convite. Verifique se o e-mail já está cadastrado.'};
  }
}

export async function changeRoleAction(formData:FormData){
  const {user}=await requireOwner();
  const parsed=roleSchema.safeParse({userId:formData.get('userId'),role:formData.get('role')});
  if(!parsed.success)return;
  if(parsed.data.userId===user.id&&parsed.data.role!=='owner')return;

  const admin=createAdminClient();
  const {data:before}=await admin.from('admin_profiles').select('role').eq('user_id',parsed.data.userId).maybeSingle();
  const {error}=await admin.from('admin_profiles').update({role:parsed.data.role}).eq('user_id',parsed.data.userId);
  if(error)throw new Error('Falha ao alterar papel.');
  await audit(user.id,'change_role',parsed.data.userId,before,{role:parsed.data.role});
  revalidatePath('/users');
}

export async function deactivateUserAction(formData:FormData){
  const {user}=await requireOwner();
  const parsed=userSchema.safeParse({userId:formData.get('userId')});
  if(!parsed.success||parsed.data.userId===user.id)return;

  const admin=createAdminClient();
  const {data:before}=await admin.from('admin_profiles').select('role,display_name,active').eq('user_id',parsed.data.userId).maybeSingle();
  const {error}=await admin.from('admin_profiles').update({active:false}).eq('user_id',parsed.data.userId);
  if(error)throw new Error('Falha ao desativar usuário.');
  const {error:authError}=await admin.auth.admin.updateUserById(parsed.data.userId,{ban_duration:'876000h'});
  if(authError)throw new Error('Perfil desativado, mas o bloqueio no Auth falhou.');
  await audit(user.id,'deactivate_user',parsed.data.userId,before,{...before,active:false});
  revalidatePath('/users');
}

export function roleLabel(role:AdminRole){
  return role==='owner'?'Owner':role==='editor'?'Editor':'Viewer';
}
