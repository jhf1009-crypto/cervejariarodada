'use client';

import {useActionState,useState} from 'react';
import {
  beginMfaAction,
  loginAction,
  recoverAction,
  updatePasswordAction,
  verifyMfaAction,
  type AuthActionState
} from '../actions/auth';

const initial:AuthActionState={ok:false,message:''};

export function LoginForm(){
  const [state,action,pending]=useActionState(loginAction,initial);
  return <form action={action} className="authForm">
    <label>E-mail<input name="email" required type="email" autoComplete="email"/></label>
    <label>Senha<input name="password" required type="password" autoComplete="current-password" minLength={8}/></label>
    {state.message&&<p className="formMessage" role="status">{state.message}</p>}
    <button disabled={pending}>{pending?'ENTRANDO...':'ENTRAR'}</button>
  </form>;
}

export function RecoverForm(){
  const [state,action,pending]=useActionState(recoverAction,initial);
  return <form action={action} className="authForm">
    <label>E-mail<input name="email" required type="email" autoComplete="email"/></label>
    {state.message&&<p className="formMessage" role="status">{state.message}</p>}
    <button disabled={pending}>{pending?'ENVIANDO...':'ENVIAR LINK'}</button>
  </form>;
}

export function UpdatePasswordForm(){
  const [state,action,pending]=useActionState(updatePasswordAction,initial);
  return <form action={action} className="authForm">
    <label>Nova senha<input name="password" required type="password" autoComplete="new-password" minLength={12}/></label>
    {state.message&&<p className="formMessage" role="status">{state.message}</p>}
    <button disabled={pending}>{pending?'SALVANDO...':'ATUALIZAR SENHA'}</button>
  </form>;
}

export function MfaSetup(){
  const [setup,setSetup]=useState<AuthActionState>(initial);
  const [state,verify,pending]=useActionState(verifyMfaAction,initial);
  const [starting,setStarting]=useState(false);

  async function begin(){
    setStarting(true);
    setSetup(await beginMfaAction());
    setStarting(false);
  }

  return <div className="authForm">
    {!setup.factorId&&<button type="button" onClick={begin} disabled={starting}>{starting?'PREPARANDO...':'CONFIGURAR MFA'}</button>}
    {setup.qr&&<img src={setup.qr} alt="QR Code para configurar autenticação em dois fatores" className="mfaQr"/>}
    {setup.message&&<p className="formMessage" role="status">{setup.message}</p>}
    {setup.factorId&&<form action={verify} className="authForm">
      <input type="hidden" name="factorId" value={setup.factorId}/>
      <label>Código de 6 dígitos<input name="code" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6}/></label>
      {state.message&&<p className="formMessage" role="status">{state.message}</p>}
      <button disabled={pending}>{pending?'VERIFICANDO...':'VERIFICAR'}</button>
    </form>}
  </div>;
}
