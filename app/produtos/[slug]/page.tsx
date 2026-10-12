import type {Metadata} from 'next';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {getPublicCatalog} from '@/lib/public-catalog';
import {SITE_URL} from '@/lib/site-url';
export const dynamic='force-dynamic';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const {products,whatsapp}=await getPublicCatalog();
 const product=products.find(item=>item.slug===slug);
 if(!product)return {};
 const title=`${product.name}${product.volume?' '+product.volume:''}`;
 return {
  title,
  description:product.description,
  alternates:{canonical:`/produtos/${product.slug}`},
  openGraph:{title,description:product.description,images:[product.image]}
 };
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const {products,whatsapp}=await getPublicCatalog();
 const product=products.find(item=>item.slug===slug);
 if(!product)notFound();
 const message=encodeURIComponent(`Olá! Quero saber a disponibilidade e os valores de ${product.name}${product.volume?' '+product.volume:''}.`);
 const jsonLd={
  '@context':'https://schema.org','@type':'Product',name:product.name,
  description:product.description,category:product.category,image:[new URL(product.image,SITE_URL).href],
  brand:{'@type':'Brand',name:'Cervejaria Rodada'}
 };
 return <main className="productPage">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,'\\u003c')}}/>
  <a className="productBack" href="/">← VOLTAR PARA A RODADA</a>
  <section className="productHero">
   <div className="productHeroCopy">
    <p className="eyebrow">{product.category} RODADA</p>
    <h1>{product.name}</h1>
    <div className="productFacts">
     {product.style&&<span><small>ESTILO</small><strong>{product.style}</strong></span>}
     <span><small>EMBALAGEM</small><strong>{product.packaging}</strong></span>
     {product.volume&&<span><small>VOLUME</small><strong>{product.volume}</strong></span>}
    </div>
    <p className="productDescription">{product.description}</p>
    <div className="productActions">
     <a className="primary" href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noreferrer">PEDIR ESTE PRODUTO ↗</a>
     <a className="secondary" href="/#chopes">VER OUTROS PRODUTOS</a>
    </div>
    <p className="productDisclosure">Consulte disponibilidade, entrega e condições comerciais com a equipe Rodada.</p>
   </div>
   <div className="productHeroVisual"><span aria-hidden>{product.style||product.packaging}</span><Image src={product.image} alt={`${product.name}${product.volume?' '+product.volume:''}`} width={product.imageWidth} height={product.imageHeight} quality={65} priority sizes="(max-width: 760px) 84vw, 42vw"/></div>
  </section>
  <section className="productResponsible"><strong>+18 · BEBA COM MODERAÇÃO.</strong><p>Consulte a equipe Rodada para confirmar disponibilidade, entrega e condições comerciais.</p></section>
 </main>;
}
