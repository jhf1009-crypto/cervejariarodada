import type {MetadataRoute} from 'next';
import {getPublicSiteData} from '@/lib/site-data';

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const base=process.env.NEXT_PUBLIC_SITE_URL||'https://www.cervejariarodada.com.br';
 const data=await getPublicSiteData();
 return [
  {url:base,changeFrequency:'weekly',priority:1},
  {url:base+'/produtos',changeFrequency:'weekly',priority:.9},
  ...data.products.map(product=>({url:base+'/produtos/'+product.slug,changeFrequency:'weekly' as const,priority:.8})),
  ...data.legalPages.map(page=>({url:base+'/legal/'+page.slug,changeFrequency:'monthly' as const,priority:.4}))
 ];
}
