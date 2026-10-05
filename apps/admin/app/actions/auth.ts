'use server';

import {createHash} from 'node:crypto';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {createClient} from '../../lib/supabase/server';
import {createAdminClient} from '../../lib/supabase/admin';

export type AuthActionState={ok:boolean;message:string;qr?:string;factorId?:string};

const loginSchema=z.object({
  email:z.string().email().max(254).transform(v=>v.trim().toLowerCase()),
  password:z.string().min(8).max(200)
});

const passwordSchema=z.object({
  password:z.string().min(12,'Use pelo menos 12 caracteres.').max(200)
});

async function loginIdentityHash(email:string){
  const h=await headers();
  const ip=(h.get('x-forwarded-for')||h.get('x-real-ip')||'unknown').split(',')[0]?.trim()||'unknown';
  return createHash('sha256').update(email+'|'+ip).digest('hex');
}

async function blockedByRateLimit(identityHash:string){
  const admin=createAdminClient();
  const since=new Date(Date.now()-15*60_000).toISOString();
  const {count,error}=await admin
    .from('admin_login_attempts')
    .select('*',{count:'exact',head:true})
    .eq('identity_hash',identityHash)
    .eq('succeeded',false)
    .gte('created_at',since);
  if(error)throw error;
  return (count||0)>=5;
}

async function recordAttempt(identityHash:string,succeeded:boolean){
  const admin=createAdminClient();
  await admin.from('admin_login_attempts').insert({identity_hash:identityHash,succeeded});
  if(succeeded){
    await admin.from('admin_login_attempts').delete().eq('identity_hash',identityHash).eq('succeeded',false);
  }
}

export async function loginAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{
  const parsed=loginSchema.safeParse({
    email:formData.get('email'),
    password:formData.get('password')
  });
  const generic={ok:false,message:'Não foi possível entrar. Verifique seus dados e tente novamente.'};
  if(!parsed.success)return generic;

  let identityHash='';
  try{
    identityHash=await loginIdentityHash(parsed.data.email);
    if(await blockedByRateLimit(identityHash)){
      return {ok:false,message:'Muitas tentativas. Aguarde alguns minutos e tente novamente.'};
    }

    const supabase=await createClient();
    const {data,error}=await supabase.auth.signInWithPassword(parsed.data);
    if(error||!data.user){
      await recordAttempt(identityHash,false);
      return generic;
    }

    const {data:profile}=await supabase
      .from('admin_profiles')
      .select('role,active')
      .eq('user_id',data.user.id)
      .maybeSingle();

    if(!profile||profile.active===false){
      await supabase.auth.signOut({scope:'global'});
      await recordAttempt(identityHash,false);
      return generic;
    }

    await recordAttempt(identityHash,true);
    const admin=createAdminClient();
    await admin.from('audit_log').insert({
      actor_user_id:data.user.id,
      action:'login',
      entity_table:'auth.users',
      entity_id:data.user.id
    });

    if(profile.role==='owner'){
      const {data:aal}=await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if(aal?.currentLevel!=='aal2')redirect('/mfa');
    }
  }catch(error){
    if((error as {digest?:string})?.digest?.startsWith('NEXT_REDIRECT'))throw error;
    return generic;
  }
  redirect('/');
}

export async function logoutAction(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(user){
    try{
      const admin=createAdminClient();
      await admin.from('audit_log').insert({actor_user_id:user.id,action:'logout',entity_table:'auth.users',entity_id:user.id});
    }catch{}
  }
  await supabase.auth.signOut({scope:'global'});
  redirect('/login');
}

export async function recoverAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{
  const email=z.string().email().max(254).safeParse(formData.get('email'));
  const generic={ok:true,message:'Se o e-mail estiver autorizado, você receberá as instruções de recuperação.'};
  if(!email.success)return generic;
  try{
    const supabase=await createClient();
    const origin=process.env.ADMIN_APP_URL||'https://admin.cervejariarodada.com.br';
    await supabase.auth.resetPasswordForEmail(email.data.trim().toLowerCase(),{
      redirectTo:origin+'/auth/callback?next=/update-password'
    });
  }catch{}
  return generic;
}

export async function updatePasswordAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{
  const parsed=passwordSchema.safeParse({password:formData.get('password')});
  if(!parsed.success)return {ok:false,message:parsed.error.issues[0]?.message||'Senha inválida.'};
  try{
    const supabase=await createClient();
    const {error}=await supabase.auth.updateUser({password:parsed.data.password});
    if(error)throw error;
  }catch{
    return {ok:false,message:'Não foi possível atualizar a senha. Solicite um novo link.'};
  }
  return {ok:true,message:'Senha atualizada. Você já pode acessar o painel.'};
}

export async function beginMfaAction():Promise<AuthActionState>{
  try{
    const supabase=await createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return {ok:false,message:'Sessão expirada.'};

    const {data:list}=await supabase.auth.mfa.listFactors();
    const verified=list?.totp?.find(f=>f.status==='verified');
    if(verified)return {ok:true,message:'MFA já configurado.',factorId:verified.id};

    const pending=list?.totp?.find(f=>f.status==='unverified');
    if(pending)await supabase.auth.mfa.unenroll({factorId:pending.id});

    const {data,error}=await supabase.auth.mfa.enroll({
      factorType:'totp',
      friendlyName:'Cervejaria Rodada Admin'
    });
    if(error)throw error;
    return {ok:true,message:'Escaneie o QR Code e informe o código de 6 dígitos.',qr:data.totp.qr_code,factorId:data.id};
  }catch{
    return {ok:false,message:'Não foi possível iniciar a configuração do MFA.'};
  }
}

export async function verifyMfaAction(_:AuthActionState,formData:FormData):Promise<AuthActionState>{
  const factorId=z.string().min(1).safeParse(formData.get('factorId'));
  const code=z.string().regex(/^\d{6}$/).safeParse(formData.get('code'));
  if(!factorId.success||!code.success)return {ok:false,message:'Código inválido.'};
  try{
    const supabase=await createClient();
    const challenge=await supabase.auth.mfa.challenge({factorId:factorId.data});
    if(challenge.error)throw challenge.error;
    const verified=await supabase.auth.mfa.verify({
      factorId:factorId.data,
      challengeId:challenge.data.id,
      code:code.data
    });
    if(verified.error)throw verified.error;
  }catch{
    return {ok:false,message:'Código inválido ou expirado.'};
  }
  redirect('/');
}
