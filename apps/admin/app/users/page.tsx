import Link from 'next/link';
import {requireOwner} from '../../lib/auth';
import {createAdminClient} from '../../lib/supabase/admin';
import InviteForm from './invite-form';
import {changeRoleAction,deactivateUserAction} from '../actions/users';

export default async function UsersPage(){
  const {user}=await requireOwner();
  const admin=createAdminClient();
  const [{data:profiles,error:profilesError},{data:authUsers,error:usersError}]=await Promise.all([
    admin.from('admin_profiles').select('user_id,role,display_name,active,created_at').order('created_at',{ascending:true}),
    admin.auth.admin.listUsers({page:1,perPage:1000})
  ]);
  if(profilesError||usersError)throw new Error('Não foi possível carregar os usuários.');

  const emailById=new Map((authUsers.users||[]).map(item=>[item.id,item.email||'—']));

  return <main className="shell">
    <header><div><small>CERVEJARIA RODADA</small><h1>Usuários e permissões</h1><p>Somente owners podem acessar esta área.</p></div><Link href="/">Voltar</Link></header>
    <section className="notice">
      <h2>Convidar usuário</h2>
      <p>O convite é enviado pelo Supabase Auth. Não existe cadastro público.</p>
      <InviteForm/>
    </section>
    <section className="userList" aria-label="Usuários do painel">
      {(profiles||[]).map(profile=><article key={profile.user_id} className="userCard">
        <div><strong>{profile.display_name||'Sem nome'}</strong><span>{emailById.get(profile.user_id)||'—'}</span><small>{profile.active?'Ativo':'Desativado'}</small></div>
        <form action={changeRoleAction}>
          <input type="hidden" name="userId" value={profile.user_id}/>
          <select name="role" defaultValue={profile.role} disabled={profile.user_id===user.id}>
            <option value="owner">Owner</option><option value="editor">Editor</option><option value="viewer">Viewer</option>
          </select>
          <button disabled={profile.user_id===user.id}>ALTERAR PAPEL</button>
        </form>
        {profile.user_id!==user.id&&profile.active&&<form action={deactivateUserAction}>
          <input type="hidden" name="userId" value={profile.user_id}/>
          <button className="danger">DESATIVAR</button>
        </form>}
      </article>)}
    </section>
  </main>;
}
