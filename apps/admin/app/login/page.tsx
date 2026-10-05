'use client';
import {FormEvent,useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '../../lib/supabase/client';

export default function Login(){
 const router=useRouter();
 const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setError('');setLoading(true);try{
  const supabase=createClient(); const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error)throw error; router.push('/');
 }catch(err){setError(err instanceof Error?err.message:'Falha ao entrar.');}finally{setLoading(false)}}
 return <main className="shell"><section className="notice" style={{maxWidth:520,margin:'10vh auto'}}><small>ACESSO RESTRITO</small><h1 style={{fontSize:'3rem'}}>Entrar</h1><p>Não há cadastro público. Contas são criadas pelo owner.</p><form onSubmit={submit} style={{display:'grid',gap:12,marginTop:24}}><input required type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:14,borderRadius:10}}/><input required type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:14,borderRadius:10}}/>{error&&<p>{error}</p>}<button disabled={loading} style={{padding:14,borderRadius:10,fontWeight:800}}>{loading?'ENTRANDO...':'ENTRAR'}</button></form></section></main>;
}
