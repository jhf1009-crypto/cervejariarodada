'use client';

import {FormEvent,useEffect,useState} from 'react';
import {createBrowserSupabaseClient} from '../../../lib/supabase/client';
import styles from '../admin.module.css';

export default function AdminLogin(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.get('logout')!=='1')return;
    const supabase=createBrowserSupabaseClient();
    supabase.auth.signOut().finally(()=>{
      window.history.replaceState({},'', '/admin/login');
    });
  },[]);

  async function submit(event:FormEvent){
    event.preventDefault();
    setError('');
    setLoading(true);

    try{
      const supabase=createBrowserSupabaseClient();
      const {error:signInError}=await supabase.auth.signInWithPassword({email,password});
      if(signInError)throw signInError;
      window.location.href='/admin';
    }catch(err){
      setError(err instanceof Error?err.message:'Falha ao entrar.');
    }finally{
      setLoading(false);
    }
  }

  return <main className={styles.shell}>
    <section className={styles.loginCard}>
      <small>ACESSO ADMINISTRATIVO</small>
      <h1>Entrar</h1>
      <p>Use sua conta autorizada da Cervejaria Rodada.</p>

      <form onSubmit={submit} className={styles.loginForm}>
        <label>
          <span>E-mail</span>
          <input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <label>
          <span>Senha</span>
          <input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        {error&&<p className={styles.error}>{error}</p>}
        <button disabled={loading} type="submit">{loading?'ENTRANDO...':'ENTRAR NO PAINEL'}</button>
      </form>

      <a className={styles.backLink} href="/">← Voltar ao site</a>
    </section>
  </main>;
}
