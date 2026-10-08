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
  const imageResponse=await fetch(url+'/rest/v1/product_images?select=product_id,storage_path,sort_order,created_at,products!inner(slug,published)&published=eq.true&products.published=eq.true&order=created_at.desc',{headers:{apikey:key,Authorization:'Bearer '+key},cache:'no-store'});
  if(imageResponse.ok){
   const images=await imageResponse.json();
   const bySlug=new Map();
   for(const img of images){const slug=img.products?.slug;if(slug&&!bySlug.has(slug)&&img.storage_path)bySlug.set(slug,url+'/storage/v1/object/public/public-media/'+img.storage_path.split('/').map(encodeURIComponent).join('/'));}
   for(const product of products)product.image_url=bySlug.get(product.slug)||null;
  }
  const publicTables=[
   ['kegs','keg_sizes','liters,estimated_cups,sale_price,rental_price','active=eq.true','liters.asc'],
   ['packages','event_packages','name,slug,description,included_items,sort_order','active=eq.true','sort_order.asc'],
   ['faqs','faqs','question,answer,category,sort_order','published=eq.true','sort_order.asc'],
   ['testimonials','testimonials','name,city,body,rating','approved=eq.true','created_at.desc'],
   ['gallery','events_gallery','title,event_date,city,event_type,image_path,sort_order','published=eq.true','sort_order.asc'],
   ['legal','legal_pages','slug,title,body','published=eq.true','title.asc'],
   ['settings','site_settings','phone,whatsapp,email,address,story,opening_hours,social_links','id=eq.true','updated_at.desc']
  ];
  const extras:Record<string,unknown>={};
  await Promise.all(publicTables.map(async ([label,table,columns,filter,order])=>{
   try{const res=await fetch(url+'/rest/v1/'+table+'?select='+encodeURIComponent(columns)+'&'+filter+'&order='+order,{headers:{apikey:key,Authorization:'Bearer '+key},cache:'no-store'});if(res.ok)extras[label]=await res.json();else console.error('Public catalog '+table+' HTTP '+res.status)}catch(error){console.error('Public catalog '+table,error)}
  }));
  if(Array.isArray(extras.gallery))extras.gallery=(extras.gallery as Array<{image_path?:string}>).map(g=>({...g,image_url:g.image_path?url+'/storage/v1/object/public/public-media/'+g.image_path.split('/').map(encodeURIComponent).join('/'):null}));
  return NextResponse.json({products,...extras},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Catálogo temporariamente indisponível'},{status:503})}
}
