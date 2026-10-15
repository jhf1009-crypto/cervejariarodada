'use client';
import {FormEvent,useEffect,useRef,useState} from 'react';
import {createClient} from '../../lib/supabase/client';
export default function MFAClient(){
 const [factorId,setFactorId]=useState(''),[qr,setQr]=useState(''),[code,setCode]=useState(''),[error,setError]=useState('');
 const [busy,setBusy]=useState(false),[ready,setReady]=useState(false);
 const submitted=useRef(false);
 useEffect(()=>{
  let active=true;
  void (async()=>{
   try{const {data,error}=await createClient().auth.mfa.listFactors();if(error)throw error;if(active)setFactorId(data.totp.find(f=>f.status==='verified')?.id||'')}
   catch{if(active)setError('Não foi possível consultar o autenticador. Recarregue a página.')}
   finally{if(active)setReady(true)}
  })();return()=>{active=false};
 },[]);
 async function enroll(){
  if(submitted.current)return;submitted.current=true;setBusy(true);setError('');
  try{
   const db=createClient();const {data:existing,error:listError}=await db.auth.mfa.listFactors();if(listError)throw listError;
   const verified=existing.totp.find(f=>f.status==='verified');if(verified){setFactorId(verified.id);return}
   // Restart unfinished setup only; never remove a verified authenticator.
   for(const f of existing.all.filter(f=>f.factor_type==='totp'&&f.status==='unverified')){const r=await db.auth.mfa.unenroll({factorId:f.id});if(r.error)throw r.error}
   const {data,error}=await db.auth.mfa.enroll({factorType:'totp',friendlyName:'Cervejaria Rodada Admin'});if(error)throw error;
   setFactorId(data.id);setQr(data.totp.qr_code);
  }catch{setError('Não foi possível iniciar a configuração. Tente novamente.')}
  finally{setBusy(false);submitted.current=false}
 }
 async function verify(e:FormEvent){
  e.preventDefault();if(submitted.current)return;submitted.current=true;setBusy(true);setError('');
  try{const db=createClient();const c=await db.auth.mfa.challenge({factorId});if(c.error)throw c.error;const r=await db.auth.mfa.verify({factorId,challengeId:c.data.id,code});if(r.error)throw r.error;window.location.assign('/')}
  catch{setError('Código inválido ou expirado. Confira o aplicativo e tente novamente.');setCode('')}
  finally{setBusy(false);submitted.current=false}
 }
 return <main className="shell"><section className="notice" style={{maxWidth:560,margin:'8vh auto'}}>
  <small>ACESSO PROTEGIDO</small><h1 style={{fontSize:'2.5rem'}}>Autenticação em duas etapas</h1><p>O painel exige um código do seu aplicativo autenticador, além da senha.</p>
  {!factorId&&<><p>Para o primeiro acesso, abra seu aplicativo autenticador e adicione a conta pelo QR Code.</p><button onClick={enroll} disabled={!ready||busy} style={{padding:14,marginTop:20}}>{busy?'AGUARDE...':'CONFIGURAR AUTENTICADOR'}</button></>}
  {qr&&<img src={qr} alt="QR Code para configurar o autenticador" style={{background:'#fff',padding:12,maxWidth:220,margin:'20px 0'}}/>}
  {factorId&&<form onSubmit={verify} style={{display:'grid',gap:12,marginTop:20}}><label htmlFor="mfa-code">Código de 6 dígitos</label><input id="mfa-code" required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} style={{padding:14}}/><button disabled={busy||code.length!==6} style={{padding:14}}>{busy?'VERIFICANDO...':'VERIFICAR E ENTRAR'}</button></form>}
  {error&&<p role="alert">{error}</p>}
  <button onClick={async()=>{await createClient().auth.signOut();window.location.assign('/login')}} style={{marginTop:20,padding:12}}>Sair</button>
 </section></main>;
}
