'use client';
import {useState} from 'react';
import {createClient} from '../lib/supabase/client';

const modules=[
 ['Dashboard','Visão geral do painel','dashboard'],
 ['Produtos','Cadastre, edite e publique produtos','products'],
 ['Barris e eventos','Gerencie tamanhos e pacotes','kegs'],
 ['Leads e orçamentos','Acompanhe pedidos recebidos','leads'],
 ['Galeria e depoimentos','Fotos e avaliações','gallery'],
 ['Equipe','Membros da equipe','team'],
 ['FAQ','Perguntas frequentes','faq'],
 ['Configurações','Contato e localização','settings'],
 ['Páginas legais','Políticas e textos legais','legal'],
 ['Usuários e permissões','Controle de acesso','users'],
 ['Log de auditoria','Histórico administrativo','audit']
] as const;

export default function AdminClient({name,role,email}:{name:string;role:string;email:string}){
 const [active,setActive]=useState('dashboard');
 const supabase=createClient();
 async function logout(){await supabase.auth.signOut();window.location.href='/login'}
 return <main className="shell">
  <header><div><small>CERVEJARIA RODADA</small><h1>Painel administrativo</h1><p>{name||email} · {role}</p></div><button className="badge buttonBadge" onClick={logout}>Sair</button></header>
  <section className="grid">
   {modules.map(([title,desc,id],i)=><button key={id} className={'moduleCard '+(active===id?'selected':'')} onClick={()=>setActive(id)}><span>{String(i+1).padStart(2,'0')}</span><h2>{title}</h2><p>{desc}</p></button>)}
  </section>
  <section className="workspace">
   <small>MÓDULO ATIVO</small><h2>{modules.find(m=>m[2]===active)?.[0]}</h2>
   {active==='dashboard'&&<p>Selecione um módulo acima para começar a gerenciar o conteúdo da Cervejaria Rodada.</p>}
   {active!=='dashboard'&&<p>Este módulo está conectado ao painel. A próxima etapa é carregar e editar os registros correspondentes do Supabase.</p>}
  </section>
 </main>
}