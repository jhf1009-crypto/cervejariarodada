'use client';

import {useMemo,useState} from 'react';
import {formatVolume} from '@/lib/fallback-data';
import type {PublicProduct} from '@/lib/types';

const placeholder='/placeholders/rodada-placeholder-960.webp';
const placeholderSet='/placeholders/rodada-placeholder-480.webp 480w, /placeholders/rodada-placeholder-960.webp 960w, /placeholders/rodada-placeholder-1440.webp 1440w';

export default function ProductCatalog({products}:{products:PublicProduct[]}){
  const [category,setCategory]=useState<'todos'|'chope'|'cerveja'>('todos');
  const [volume,setVolume]=useState<'todos'|number>('todos');

  const volumes=useMemo(()=>Array.from(new Set(products.map(p=>p.volumeMl).filter((v):v is number=>typeof v==='number'))).sort((a,b)=>a-b),[products]);
  const filtered=products.filter(product=>(category==='todos'||product.category===category)&&(volume==='todos'||product.volumeMl===volume));

  return <>
    <div className="catalogFilters" aria-label="Filtros de produtos">
      <fieldset><legend>Categoria</legend>{(['todos','chope','cerveja'] as const).map(value=><button type="button" key={value} className={category===value?'active':''} onClick={()=>setCategory(value)}>{value==='todos'?'Todos':value==='chope'?'Chopes':'Cervejas'}</button>)}</fieldset>
      {volumes.length>0&&<fieldset><legend>Volume</legend><button type="button" className={volume==='todos'?'active':''} onClick={()=>setVolume('todos')}>Todos</button>{volumes.map(value=><button type="button" key={value} className={volume===value?'active':''} onClick={()=>setVolume(value)}>{formatVolume(value)}</button>)}</fieldset>}
    </div>
    <section className="catalogGrid" aria-live="polite">
      {filtered.map(product=>{
        const image=product.images[0];
        const src=image?.url||placeholder;
        const alt=image?.alt||('Foto oficial de '+product.name+' pendente');
        return <a key={product.id} href={'/produtos/'+product.slug} className="catalogCard">
          <div><span>{product.category==='chope'?'Chope':'Cerveja'}</span><h2>{product.name}</h2><p>{formatVolume(product.volumeMl)||product.packaging||''}</p>{product.availabilityStatus&&<small>{product.availabilityStatus}</small>}</div>
          <img src={src} srcSet={src.startsWith('/placeholders/')?placeholderSet:undefined} sizes="(max-width: 760px) 38vw, 260px" alt={alt} loading="lazy" decoding="async"/>
          <b>VER PRODUTO ↗</b>
        </a>;
      })}
    </section>
  </>;
}
