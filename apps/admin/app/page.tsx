import Link from 'next/link';
import {logoutAction} from './actions/auth';
import {requireAdmin} from '../lib/auth';

const modules=[
  'Dashboard','Produtos','Barris e eventos','Leads e orçamentos','Galeria e depoimentos',
  'Equipe','FAQ','Configurações','Páginas legais','Log de auditoria'
];

export default async function AdminHome(){
  const {user,profile}=await requireAdmin();
  return <main className="shell">
    <header>
      <div><small>CERVEJARIA RODADA</small><h1>Painel administrativo</h1><p>{profile.display_name||user.email} · {profile.role}</p></div>
      <div className="headerActions">
        {profile.role==='owner'&&<Link href="/users">Usuários e permissões</Link>}
        <form action={logoutAction}><button>Sair</button></form>
      </div>
    </header>
    <section className="grid" aria-label="Módulos do painel">
      {modules.map((module,index)=><article key={module}><span>{String(index+1).padStart(2,'0')}</span><h2>{module}</h2><p>Este módulo será entregue nas próximas fatias do painel.</p></article>)}
    </section>
  </main>;
}
