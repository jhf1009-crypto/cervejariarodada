import {redirect} from 'next/navigation';

export const metadata={
  title:'Admin | Cervejaria Rodada',
  robots:{index:false,follow:false}
};

export default function AdminEntry(){
  const adminUrl=process.env.NEXT_PUBLIC_ADMIN_URL?.trim();
  if(adminUrl){
    redirect(adminUrl);
  }

  return <main className="productPage">
    <section className="productHeroCopy" style={{maxWidth:780,margin:'12vh auto'}}>
      <p className="eyebrow">ACESSO ADMINISTRATIVO</p>
      <h1>PAINEL<br/>RODADA.</h1>
      <p className="productDescription">
        O painel administrativo foi construído como uma aplicação separada do site público.
        O subdomínio administrativo ainda precisa ser conectado na Vercel.
      </p>
      <div className="productActions">
        <a className="primary" href="/">VOLTAR AO SITE</a>
      </div>
      <p className="productDisclosure">
        Quando a variável NEXT_PUBLIC_ADMIN_URL estiver configurada, /admin redirecionará automaticamente para o painel.
      </p>
    </section>
  </main>;
}
