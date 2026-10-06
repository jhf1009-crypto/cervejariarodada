'use client';
import {FormEvent,useEffect,useState} from 'react';
import {createClient} from '../../lib/supabase/client';

export default function Login(){
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 useEffect(()=>{const q=new URLSearchParams(window.location.search);if(q.get('logout')==='1'){createClient().auth.signOut().finally(()=>window.history.replaceState({},'', '/login'));}},[]);
 async function submit(e:FormEvent){e.preventDefault();setError('');setLoading(true);try{
  const supabase=createClient();
  const {data,error:signInError}=await supabase.auth.signInWithPassword({email:email.trim(),password});
  if(signInError)throw signInError;
  if(!data.user||!data.session)throw new Error('O Supabase não retornou uma sessão válida.');
  window.location.assign('/');
 }catch(err){setError(err instanceof Error?err.message:'Falha ao entrar.');setLoading(false)}}
 return <main className="shell"><section className="notice" style={{maxWidth:520,margin:'10vh auto'}}><small>ACESSO RESTRITO</small><h1 style={{fontSize:'3rem'}}>Entrar</h1><p>Use sua conta autorizada da Cervejaria Rodada.</p><form onSubmit={submit} style={{display:'grid',gap:12,marginTop:24}}><input required type="email" autoComplete="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:14,borderRadius:10}}/><input required type="password" autoComplete="current-password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:14,borderRadius:10}}/>{error&&<p style={{color:'#ffb1b1'}}>{error}</p>}<button disabled={loading} style={{padding:14,borderRadius:10,fontWeight:800}}>{loading?'ENTRANDO...':'ENTRAR'}</button></form></section></main>;
}