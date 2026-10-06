import Link from 'next/link';
import {notFound} from 'next/navigation';
import {createClient} from '@supabase/supabase-js';

export const dynamic='force-dynamic';

function db(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return null;
 return createClient(url,key,{auth:{persistSession:false}});
}

export default async function LegalPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const supabase=db();
 if(!supabase)notFound();

 const {data}=await supabase
  .from('legal_pages')
  .select('id,slug,title,body,updated_at')
  .eq('slug',slug)
  .eq('published',true)
  .maybeSingle();

 if(!data)notFound();

 return <main className="legalPublicPage">
  <article className="legalPublicWrap legalArticle">
   <Link className="legalBack" href="/legal">← Todas as páginas legais</Link>
   <small>CERVEJARIA RODADA</small>
   <h1>{data.title}</h1>
   <p className="legalUpdated">Última atualização: {new Date(data.updated_at).toLocaleDateString('pt-BR')}</p>
   <div className="legalBody">{String(data.body).split(/\n{2,}/).map((block:string,index:number)=><p key={index}>{block}</p>)}</div>
  </article>
 </main>;
}
