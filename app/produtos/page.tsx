import type {Metadata} from 'next';
import Image from 'next/image';
import {catalog} from '@/lib/catalog';

export const metadata:Metadata={title:'Produtos',description:'Conheça os chopps e cervejas da Cervejaria Rodada.',alternates:{canonical:'/produtos'}};

export default function ProductsPage(){
 return <main className="catalogPage">
  <a className="productBack" href="/">← INÍCIO</a>
  <header><p className="eyebrow">CATÁLOGO RODADA</p><h1>CHOPPS E<br/>CERVEJAS.</h1><p>Veja os formatos já apresentados no site e consulte a disponibilidade atual com a Rodada.</p></header>
  <section className="catalogGrid">{catalog.map(product=><a key={product.slug} href={'/produtos/'+product.slug} className="catalogCard"><div><span>{product.category}</span><h2>{product.name}</h2><p>{product.volume||product.packaging}</p></div><Image src={product.image} alt="" width={700} height={900} quality={55} loading="lazy" sizes="(max-width: 760px) 38vw, 260px"/><b>VER PRODUTO ↗</b></a>)}</section>
 </main>;
}
