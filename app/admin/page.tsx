import {redirect} from 'next/navigation';
import {createServerSupabaseClient} from '../../lib/supabase/server';
import styles from './admin.module.css';

export const metadata={
  title:'Admin | Cervejaria Rodada',
  robots:{index:false,follow:false}
};

const modules=[
  'Dashboard',
  'Produtos',
  'Barris e eventos',
  'Leads e orçamentos',
  'Galeria e depoimentos',
  'Equipe',
  'FAQ',
  'Configurações',
  'Páginas legais',
  'Usuários e permissões',
  'Log de auditoria'
];

export default async function AdminPage(){
  let supabase;
  try{
    supabase=await createServerSupabaseClient();
  }catch(error){
    return <main className={styles.shell}>
      <section className={styles.notice}>
        <strong>Supabase ainda não está configurado neste deploy.</strong>
        <p>{error instanceof Error?error.message:'Verifique as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'}</p>
      </section>
    </main>;
  }

  const {data:{user},error:userError}=await supabase.auth.getUser();
  if(userError||!user){
    redirect('/admin/login');
  }

  const {data:profile,error:profileError}=await supabase
    .from('profiles')
    .select('role,display_name')
    .eq('user_id',user.id)
    .maybeSingle();

  if(profileError){
    return <main className={styles.shell}>
      <section className={styles.notice}>
        <strong>Não foi possível carregar seu perfil.</strong>
        <p>{profileError.message}</p>
      </section>
    </main>;
  }

  if(!profile||profile.role!=='admin'){
    return <main className={styles.shell}>
      <section className={styles.denied}>
        <small>ACESSO RESTRITO</small>
        <h1>Acesso negado</h1>
        <p>Este usuário está autenticado, mas não possui permissão administrativa.</p>
        <a href="/">Voltar ao site</a>
      </section>
    </main>;
  }

  return <main className={styles.shell}>
    <header className={styles.header}>
      <div>
        <small>CERVEJARIA RODADA</small>
        <h1>Painel administrativo</h1>
        <p>{profile.display_name||user.email} · admin</p>
      </div>
      <div className={styles.headerActions}>
        <span className={styles.badge}>acesso restrito</span>
        <a className={styles.logoutLink} href="/admin/login?logout=1">Sair</a>
      </div>
    </header>

    <section className={styles.grid} aria-label="Módulos do painel">
      {modules.map((module,index)=><article key={module}>
        <span>{String(index+1).padStart(2,'0')}</span>
        <h2>{module}</h2>
        <p>Gerenciamento conectado ao Supabase com acesso protegido por perfil administrativo.</p>
      </article>)}
    </section>
  </main>;
}
