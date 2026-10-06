import Link from 'next/link';
import {createClient} from '@supabase/supabase-js';

export const dynamic='force-dynamic';

function db(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return null;
 return createClient(url,key,{auth:{persistSession:false}});
}

export default async function LegalIndexPage(){
 const supabase=db();
 let pages:Array<{id:string;slug:string;title:string;updated_at:string}>=[];
 if(supabase){
  const {data}=await supabase.from('legal_pages').select('id,slug,title,updated_at').eq('published',true).order('title');
  pages=(data||[]) as typeof pages;
 }

 return <main className="legalPublicPage">
  <div className="legalPublicWrap">
   <Link className="legalBack" href="/">← Voltar para o site</Link>
   <small>CERVEJARIA RODADA</small>
   <h1>Páginas legais</h1>
   <p className="legalIntro">Políticas, termos e informações institucionais publicadas pela Cervejaria Rodada.</p>
   <div className="legalList">
    {pages.length===0?<p>Nenhuma página legal publicada no momento.</p>:pages.map(page=><Link key={page.id} href={'/legal/'+page.slug}>
     <span>{page.title}</span><small>Atualizada em {new Date(page.updated_at).toLocaleDateString('pt-BR')}</small><b>↗</b>
    </Link>)}
   </div>
  </div>
 </main>;
}
