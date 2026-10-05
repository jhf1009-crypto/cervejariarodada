import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {fallbackSiteData,formatVolume} from '@/lib/fallback-data';
import {getPublicProductBySlug,getPublicSiteData} from '@/lib/site-data';

export const revalidate=60;
export const dynamicParams=true;

export function generateStaticParams(){return fallbackSiteData.products.map(product=>({slug:product.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const product=await getPublicProductBySlug(slug);
 if(!product)return {};
 const volume=formatVolume(product.volumeMl);
 const title=[product.name,volume].filter(Boolean).join(' ');
 const image=product.images[0]?.url;
 return {
  title,
  description:product.shortDescription||product.longDescription||undefined,
  alternates:{canonical:`/produtos/${product.slug}`},
  openGraph:{title,description:product.shortDescription||product.longDescription||undefined,images:image?[image]:undefined}
 };
}

function money(value:number){return value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const [product,data]=await Promise.all([getPublicProductBySlug(slug),getPublicSiteData()]);
 if(!product)notFound();
 const volume=formatVolume(product.volumeMl);
 const whatsapp=(data.settings.whatsapp||'').replace(/\D/g,'');
 const message=encodeURIComponent(`Olá! Quero saber a disponibilidade e os valores de ${product.name}${volume?' '+volume:''}.`);
 const primaryImage=product.images[0];
 const displayPrice=product.promotionalPrice??product.price;
 const jsonLd={
  '@context':'https://schema.org','@graph':[
   {'@type':'Product',name:product.name,description:product.shortDescription||product.longDescription||undefined,category:product.category,image:product.images.map(i=>i.url),brand:{'@type':'Brand',name:'Cervejaria Rodada'},
    ...(displayPrice!=null?{offers:{'@type':'Offer',price:displayPrice,priceCurrency:'BRL',availability:product.availabilityStatus||undefined}}:{})},
   {'@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'Início',item:'https://www.cervejariarodada.com.br/'},
    {'@type':'ListItem',position:2,name:'Produtos',item:'https://www.cervejariarodada.com.br/produtos'},
    {'@type':'ListItem',position:3,name:product.name,item:'https://www.cervejariarodada.com.br/produtos/'+product.slug}
   ]}
  ]
 };
 const facts=[
  ['ESTILO',product.style],['EMBALAGEM',product.packaging],['VOLUME',volume],['ABV',product.abv==null?null:product.abv+'%'],
  ['IBU',product.ibu==null?null:String(product.ibu)],['COR',product.colorDescription],['TEMPERATURA',product.servingTemperature]
 ].filter(([,value])=>Boolean(value));

 return <main className="productPage">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
  <a className="productBack" href="/produtos">← VOLTAR AOS PRODUTOS</a>
  <section className="productHero">
   <div className="productHeroCopy">
    <p className="eyebrow">{product.category==='chope'?'CHOPE':'CERVEJA'} RODADA</p>
    <h1>{product.name}</h1>
    {facts.length>0&&<div className="productFacts">{facts.map(([label,value])=><span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div>}
    {(product.longDescription||product.shortDescription)&&<p className="productDescription">{product.longDescription||product.shortDescription}</p>}
    {(displayPrice!=null||product.priceRange)&&<div className="productPrice"><small>VALOR</small><strong>{displayPrice!=null?money(displayPrice):product.priceRange}</strong>{product.promotionalPrice!=null&&product.price!=null&&<span>de {money(product.price)}</span>}</div>}
    {product.availabilityStatus&&<p className="productAvailability">{product.availabilityStatus}</p>}
    <div className="productActions">
     {whatsapp&&<a className="primary" href={`https://wa.me/${whatsapp}?text=${message}`} target="_blank" rel="noreferrer">PEDIR ESTE PRODUTO ↗</a>}
     <a className="secondary" href="/produtos">VER OUTROS PRODUTOS</a>
    </div>
   </div>
   <div className="productHeroVisual">
    <span aria-hidden>{product.style||product.packaging||'RODADA'}</span>
    {primaryImage?<img src={primaryImage.url} alt={primaryImage.alt} width={primaryImage.width||960} height={primaryImage.height||720}/>:<img src="/placeholders/rodada-placeholder-960.webp" srcSet="/placeholders/rodada-placeholder-480.webp 480w, /placeholders/rodada-placeholder-960.webp 960w, /placeholders/rodada-placeholder-1440.webp 1440w" sizes="(max-width:760px) 88vw, 45vw" alt={'Foto oficial de '+product.name+' pendente'} width="960" height="720"/>}
   </div>
  </section>
  {product.images.length>1&&<section className="productGallery" aria-label={'Galeria de '+product.name}>{product.images.map(image=><img key={image.url} src={image.url} alt={image.alt} width={image.width||960} height={image.height||720} loading="lazy"/>)}</section>}
  {(product.tastingNotes||product.aromaNotes||product.ingredients||product.pairing)&&<section className="productDetails">
    {product.tastingNotes&&<div><small>SABOR</small><p>{product.tastingNotes}</p></div>}
    {product.aromaNotes&&<div><small>AROMA</small><p>{product.aromaNotes}</p></div>}
    {product.ingredients&&<div><small>INGREDIENTES</small><p>{product.ingredients}</p></div>}
    {product.pairing&&<div><small>HARMONIZAÇÃO</small><p>{product.pairing}</p></div>}
  </section>}
  <section className="productResponsible"><strong>+18 · BEBA COM MODERAÇÃO.</strong><p>Consulte a equipe Rodada para confirmar disponibilidade, entrega e condições comerciais.</p></section>
 </main>;
}
