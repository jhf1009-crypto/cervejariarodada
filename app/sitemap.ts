import type {MetadataRoute} from 'next';
import {catalog} from '@/lib/catalog';
const base='https://www.cervejariarodada.com.br';
export default function sitemap():MetadataRoute.Sitemap{
 return [
  {url:base,changeFrequency:'weekly',priority:1},
  {url:base+'/produtos',changeFrequency:'weekly',priority:.9},
  ...catalog.map(product=>({url:base+'/produtos/'+product.slug,changeFrequency:'weekly' as const,priority:.8}))
 ];
}
