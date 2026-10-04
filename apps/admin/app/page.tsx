const modules = ['Dashboard','Produtos','Barris e eventos','Leads e orçamentos','Galeria e depoimentos','Equipe','FAQ','Configurações','Páginas legais','Usuários e permissões','Log de auditoria'];

export default function AdminHome(){
  return <main className="shell">
    <header><div><small>CERVEJARIA RODADA</small><h1>Painel administrativo</h1></div><span className="badge">acesso restrito</span></header>
    <section className="notice"><strong>Base administrativa criada.</strong><p>Os módulos abaixo serão conectados somente a dados reais do Supabase; nenhum conteúdo fictício é publicado.</p></section>
    <section className="grid" aria-label="Módulos do painel">
      {modules.map((module,index)=><article key={module}><span>{String(index+1).padStart(2,'0')}</span><h2>{module}</h2><p>Estrutura preparada para CRUD, permissões e auditoria.</p></article>)}
    </section>
  </main>;
}
