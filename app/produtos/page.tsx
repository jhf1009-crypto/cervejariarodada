import type {Metadata} from 'next';
import ProductCatalog from '@/components/product-catalog';
import {getPublicProducts} from '@/lib/site-data';

export const revalidate=60;
export const metadata:Metadata={title:'Produtos',description:'Conheça os chopes e cervejas da Cervejaria Rodada.',alternates:{canonical:'/produtos'}};

export default async function ProductsPage(){
 const products=await getPublicProducts();
 const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
  {'@type':'ListItem',position:1,name:'Início',item:'https://www.cervejariarodada.com.br/'},
  {'@type':'ListItem',position:2,name:'Produtos',item:'https://www.cervejariarodada.com.br/produtos'}
 ]};
 return <main className="catalogPage">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/>
  <a className="productBack" href="/">← INÍCIO</a>
  <header><p className="eyebrow">CATÁLOGO RODADA</p><h1>CHOPES E<br/>CERVEJAS.</h1><p>Consulte os formatos publicados e filtre por categoria ou volume.</p></header>
  <ProductCatalog products={products}/>
 </main>;
}
