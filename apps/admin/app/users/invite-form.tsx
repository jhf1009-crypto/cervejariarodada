'use client';

import {useActionState} from 'react';
import {inviteUserAction,type UserActionState} from '../actions/users';

const initial:UserActionState={ok:false,message:''};

export default function InviteForm(){
  const [state,action,pending]=useActionState(inviteUserAction,initial);
  return <form action={action} className="userInviteForm">
    <label>Nome<input name="displayName" required minLength={2} maxLength={120}/></label>
    <label>E-mail<input name="email" required type="email"/></label>
    <label>Papel<select name="role" defaultValue="editor"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select></label>
    <button disabled={pending}>{pending?'ENVIANDO...':'CONVIDAR USUÁRIO'}</button>
    {state.message&&<p role="status">{state.message}</p>}
  </form>;
}
