import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
  "Content-Type":"application/json"
};

function json(data:unknown,status=200){
  return new Response(JSON.stringify(data),{status,headers:corsHeaders});
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:corsHeaders});
  if(req.method!=="POST")return json({error:"Método não permitido."},405);

  const url=Deno.env.get("SUPABASE_URL")||"";
  const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
  if(!url||!serviceKey)return json({error:"Configuração do Supabase indisponível."},500);

  const authHeader=req.headers.get("Authorization")||"";
  const token=authHeader.replace(/^Bearer\s+/i,"");
  if(!token)return json({error:"Não autenticado."},401);

  const admin=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:userData,error:userError}=await admin.auth.getUser(token);
  const actor=userData.user;
  if(userError||!actor)return json({error:"Sessão inválida."},401);

  const {data:claimsData,error:claimsError}=await admin.auth.getClaims(token);
  if(claimsError||claimsData?.claims?.aal!=="aal2")return json({error:"Complete a autenticação em duas etapas para gerenciar usuários."},403);

  const {data:actorProfile,error:profileError}=await admin
    .from("admin_profiles")
    .select("role")
    .eq("user_id",actor.id)
    .maybeSingle();

  if(profileError||actorProfile?.role!=="owner")return json({error:"Apenas proprietários podem gerenciar usuários."},403);

  let body:any={};
  try{body=await req.json()}catch{return json({error:"Requisição inválida."},400)}
  const action=String(body.action||"");

  if(action==="list"){
    const [{data:profiles,error:profilesError},{data:users,error:usersError}]=await Promise.all([
      admin.from("admin_profiles").select("user_id,role,display_name,created_at,updated_at").order("created_at"),
      admin.auth.admin.listUsers({page:1,perPage:1000})
    ]);
    if(profilesError||usersError)return json({error:(profilesError||usersError)?.message||"Falha ao listar usuários."},500);
    const authById=new Map((users.users||[]).map((u:any)=>[u.id,u]));
    return json({users:(profiles||[]).map((p:any)=>{
      const u:any=authById.get(p.user_id);
      return {
        user_id:p.user_id,
        role:p.role,
        display_name:p.display_name,
        email:u?.email||null,
        last_sign_in_at:u?.last_sign_in_at||null,
        created_at:p.created_at,
        is_self:p.user_id===actor.id
      };
    })});
  }

  if(action==="invite"){
    const email=String(body.email||"").trim().toLowerCase();
    const display_name=String(body.display_name||"").trim()||null;
    const role=String(body.role||"viewer");
    if(!email||!email.includes("@"))return json({error:"Informe um e-mail válido."},400);
    if(!["owner","editor","viewer"].includes(role))return json({error:"Permissão inválida."},400);

    const {data,error}=await admin.auth.admin.inviteUserByEmail(email,{data:{display_name:display_name||""}});
    if(error)return json({error:error.message},400);
    if(!data.user)return json({error:"O convite não retornou um usuário."},500);

    const {error:upsertError}=await admin.from("admin_profiles").upsert({
      user_id:data.user.id,role,display_name,updated_at:new Date().toISOString()
    },{onConflict:"user_id"});
    if(upsertError)return json({error:upsertError.message},500);

    await admin.from("audit_log").insert({
      actor_user_id:actor.id,action:"invite_admin",entity_table:"admin_profiles",entity_id:data.user.id,
      new_value:{email,role,display_name}
    });

    return json({ok:true,user_id:data.user.id});
  }

  if(action==="update"){
    const user_id=String(body.user_id||"");
    const role=String(body.role||"");
    const display_name=String(body.display_name||"").trim()||null;
    if(!user_id)return json({error:"Usuário inválido."},400);
    if(!["owner","editor","viewer"].includes(role))return json({error:"Permissão inválida."},400);
    if(user_id===actor.id&&role!=="owner")return json({error:"Você não pode remover sua própria permissão de proprietário."},400);

    const {data:oldProfile}=await admin.from("admin_profiles").select("role,display_name").eq("user_id",user_id).maybeSingle();
    const {error}=await admin.from("admin_profiles").update({role,display_name,updated_at:new Date().toISOString()}).eq("user_id",user_id);
    if(error)return json({error:error.message},500);

    await admin.from("audit_log").insert({
      actor_user_id:actor.id,action:"update_admin",entity_table:"admin_profiles",entity_id:user_id,
      old_value:oldProfile||null,new_value:{role,display_name}
    });
    return json({ok:true});
  }

  if(action==="revoke"){
    const user_id=String(body.user_id||"");
    if(!user_id)return json({error:"Usuário inválido."},400);
    if(user_id===actor.id)return json({error:"Você não pode remover seu próprio acesso."},400);

    const {data:oldProfile}=await admin.from("admin_profiles").select("role,display_name").eq("user_id",user_id).maybeSingle();
    const {error}=await admin.from("admin_profiles").delete().eq("user_id",user_id);
    if(error)return json({error:error.message},500);

    await admin.from("audit_log").insert({
      actor_user_id:actor.id,action:"revoke_admin",entity_table:"admin_profiles",entity_id:user_id,
      old_value:oldProfile||null
    });
    return json({ok:true});
  }

  return json({error:"Ação desconhecida."},400);
});
