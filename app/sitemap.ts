import type {MetadataRoute} from 'next';
import {getPublicCatalog} from '@/lib/public-catalog';
import {SITE_URL as base} from '@/lib/site-url';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const {products,legal}=await getPublicCatalog();
 return [{url:base,changeFrequency:'weekly',priority:1},{url:base+'/produtos',changeFrequency:'weekly',priority:.9},
  ...products.map(p=>({url:base+'/produtos/'+p.slug,changeFrequency:'weekly' as const,priority:.8})),
  ...legal.map((p:{slug:string})=>({url:base+'/legal/'+p.slug,changeFrequency:'monthly' as const,priority:.4}))];
}
