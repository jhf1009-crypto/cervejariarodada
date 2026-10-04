'use client';
import {useEffect,useState} from 'react';
import {createClient} from '../../lib/supabase/client';

export default function MFA(){
 const [factorId,setFactorId]=useState(''); const [qr,setQr]=useState(''); const [code,setCode]=useState(''); const [error,setError]=useState('');
 useEffect(()=>{(async()=>{try{const s=createClient();const list=await s.auth.mfa.listFactors();const verified=list.data?.totp?.find(f=>f.status==='verified');if(verified){setFactorId(verified.id);return}const {data,error}=await s.auth.mfa.enroll({factorType:'totp',friendlyName:'Cervejaria Rodada Admin'});if(error)throw error;setFactorId(data.id);setQr(data.totp.qr_code);}catch(e){setError(e instanceof Error?e.message:'Falha no MFA')}})()},[]);
 async function verify(){try{const s=createClient();const challenge=await s.auth.mfa.challenge({factorId});if(challenge.error)throw challenge.error;const result=await s.auth.mfa.verify({factorId,challengeId:challenge.data.id,code});if(result.error)throw result.error;window.location.href='/';}catch(e){setError(e instanceof Error?e.message:'Código inválido')}}
 return <main className="shell"><section className="notice" style={{maxWidth:560,margin:'8vh auto'}}><small>SEGUNDA ETAPA</small><h1 style={{fontSize:'3rem'}}>MFA obrigatório</h1><p>Use um aplicativo autenticador para proteger o acesso administrativo.</p>{qr&&<img src={qr} alt="QR Code para ativar autenticação de dois fatores" style={{background:'white',padding:12,maxWidth:220,margin:'20px 0'}}/>}<div style={{display:'flex',gap:10,marginTop:20}}><input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" placeholder="000000" style={{padding:14,borderRadius:10,flex:1}}/><button onClick={verify} disabled={!factorId||code.length!==6} style={{padding:'14px 20px',borderRadius:10,fontWeight:800}}>VERIFICAR</button></div>{error&&<p>{error}</p>}</section></main>;
}
