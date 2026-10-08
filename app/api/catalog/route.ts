import {NextResponse} from 'next/server';

export const dynamic='force-dynamic';
export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return NextResponse.json({error:'Catálogo não configurado'},{status:503});
 try{
  const response=await fetch(url+'/rest/v1/products?select=name,slug,category,packaging,volume_ml,short_description,sort_order&published=eq.true&order=sort_order.asc',{headers:{apikey:key,Authorization:'Bearer '+key},cache:'no-store'});
  if(!response.ok)return NextResponse.json({error:'Falha ao consultar produtos'},{status:502});
  const products=await response.json();
  const imageResponse=await fetch(url+'/rest/v1/product_images?select=product_id,storage_path,sort_order,products!inner(slug,published)&published=eq.true&products.published=eq.true&order=sort_order.asc',{headers:{apikey:key,Authorization:'Bearer '+key},cache:'no-store'});
  if(imageResponse.ok){
   const images=await imageResponse.json();
   const bySlug=new Map();
   for(const img of images){const slug=img.products?.slug;if(slug&&!bySlug.has(slug)&&img.storage_path)bySlug.set(slug,url+'/storage/v1/object/public/public-media/'+img.storage_path.split('/').map(encodeURIComponent).join('/'));}
   for(const product of products)product.image_url=bySlug.get(product.slug)||null;
  }
  return NextResponse.json({products},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Catálogo temporariamente indisponível'},{status:503})}
}
