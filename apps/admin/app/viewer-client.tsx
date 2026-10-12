'use client';
import {useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';

const sections=[
 ['Produtos','products','name,slug,packaging,volume_ml,published'],
 ['Barris','keg_sizes','liters,active'],
 ['Pacotes','event_packages','name,description,active'],
 ['Galeria','events_gallery','title,city,event_type,published'],
 ['Depoimentos','testimonials','name,city,body,approved'],
 ['FAQ','faqs','question,answer,published'],
 ['Contato','site_settings','phone,whatsapp,email,address,opening_hours'],
 ['Páginas legais','legal_pages','title,slug,body,published']
] as const;

export default function ViewerClient(){
 const db=useMemo(()=>createClient(),[]);
 const [active,setActive]=useState(0);
 const [rows,setRows]=useState<Record<string,unknown>[]>([]);
 const [error,setError]=useState('');
 useEffect(()=>{
  let current=true;setRows([]);setError('');
  const [,table,columns]=sections[active];
  void db.from(table).select(columns).limit(100).then(({data,error})=>{
   if(!current)return;
   if(error)setError('Não foi possível carregar os registros.');
   else setRows((data||[]) as unknown as Record<string,unknown>[]);
  });
  return()=>{current=false};
 },[active,db]);
 return <main className="shell"><header><div><small>CERVEJARIA RODADA</small><h1>Painel de consulta</h1><p>Consulta do conteúdo público, sem permissão de edição. Orçamentos e dados internos são restritos ao proprietário e aos editores. Até 100 registros por seção.</p></div><button onClick={async()=>{await db.auth.signOut();window.location.href='/login'}}>Sair</button></header>
  <nav className="grid" aria-label="Seções de consulta">{sections.map(([title],index)=><button className="moduleCard" key={title} onClick={()=>setActive(index)} aria-pressed={index===active}>{title}</button>)}</nav>
  <section className="workspace"><h2>{sections[active][0]}</h2>{error&&<p role="alert">{error}</p>}{!rows.length&&!error&&<p>Nenhum registro disponível.</p>}{rows.map((row,index)=><article className="notice" key={index}><dl>{Object.entries(row).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value==null?'—':typeof value==='boolean'?(value?'Sim':'Não'):typeof value==='object'?JSON.stringify(value):String(value)}</dd></div>)}</dl></article>)}</section>
 </main>;
}
