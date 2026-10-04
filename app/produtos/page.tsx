import type {Metadata} from 'next';
import {catalog} from '@/lib/catalog';

export const metadata:Metadata={title:'Produtos',description:'Conheça os chopes e cervejas da Cervejaria Rodada.',alternates:{canonical:'/produtos'}};

export default function ProductsPage(){
 return <main className="catalogPage">
  <a className="productBack" href="/">← INÍCIO</a>
  <header><p className="eyebrow">CATÁLOGO RODADA</p><h1>CHOPES E<br/>CERVEJAS.</h1><p>Veja os formatos já apresentados no site e consulte a disponibilidade atual com a Rodada.</p></header>
  <section className="catalogGrid">{catalog.map(product=><a key={product.slug} href={'/produtos/'+product.slug} className="catalogCard"><div><span>{product.category}</span><h2>{product.name}</h2><p>{product.volume||product.packaging}</p></div><img src={product.image} alt=""/><b>VER PRODUTO ↗</b></a>)}</section>
 </main>;
}
