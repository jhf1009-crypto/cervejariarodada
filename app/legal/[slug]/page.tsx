import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getPublicLegalPage} from '@/lib/site-data';

export const revalidate=60;
export const dynamicParams=true;

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const page=await getPublicLegalPage(slug);
 if(!page)return {};
 return {title:page.title,alternates:{canonical:'/legal/'+slug}};
}

export default async function LegalPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const page=await getPublicLegalPage(slug);
 if(!page)notFound();
 const site=process.env.NEXT_PUBLIC_SITE_URL||'https://www.cervejariarodada.com.br';
 const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
  {'@type':'ListItem',position:1,name:'Início',item:site+'/'},
  {'@type':'ListItem',position:2,name:page.title,item:site+'/legal/'+page.slug}
 ]};
 return <main className="legalPage">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/>
  <a className="productBack" href="/">← VOLTAR AO SITE</a>
  <article><p className="eyebrow">CERVEJARIA RODADA</p><h1>{page.title}</h1><div className="legalBody">{page.body.split('\n').map((line,index)=>line.trim()?<p key={index}>{line}</p>:<br key={index}/>)}</div></article>
 </main>;
}
