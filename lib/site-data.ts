import {unstable_cache} from 'next/cache';
import {createClient} from '@supabase/supabase-js';
import {fallbackSiteData} from './fallback-data';
import type {PublicProduct,PublicProductImage,PublicSiteData,PublicSiteSettings,PublicFaq,PublicTeamMember,PublicLegalPage} from './types';

const PLACEHOLDER='/placeholders/rodada-placeholder-960.webp';

function storageUrl(baseUrl:string,path:string){
  if(!path)return PLACEHOLDER;
  if(/^https?:\/\//i.test(path))return path;
  return baseUrl.replace(/\/$/,'')+'/storage/v1/object/public/public-media/'+path.replace(/^\//,'');
}

async function loadFromDatabase():Promise<PublicSiteData>{
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)throw new Error('Supabase Rodada não configurado');

  const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});

  const [productsResult,settingsResult,faqResult,teamResult,legalResult]=await Promise.all([
    supabase.from('products').select(`
      id,slug,name,category,packaging,volume_ml,short_description,long_description,
      abv,ibu,color_description,tasting_notes,aroma_notes,ingredients,serving_temperature,pairing,
      price,promotional_price,price_range,availability_status,featured,sort_order,
      beer_styles(name),
      product_images(storage_path,alt_text,width,height,sort_order,published)
    `).eq('published',true).order('sort_order',{ascending:true}),
    supabase.from('site_settings').select('*').eq('id',true).maybeSingle(),
    supabase.from('faqs').select('id,question,answer,category,sort_order').eq('published',true).order('sort_order',{ascending:true}),
    supabase.from('team_members').select('id,name,role,photo_path,photo_alt,sort_order').eq('active',true).order('sort_order',{ascending:true}),
    supabase.from('legal_pages').select('slug,title,body').eq('published',true).order('slug',{ascending:true})
  ]);

  for(const result of [productsResult,settingsResult,faqResult,teamResult,legalResult]){
    if(result.error)throw result.error;
  }

  const products:PublicProduct[]=(productsResult.data??[]).map((row:any)=>{
    const nestedImages=(row.product_images??[])
      .filter((image:any)=>image.published!==false)
      .sort((a:any,b:any)=>(a.sort_order??0)-(b.sort_order??0));
    const images:PublicProductImage[]=nestedImages.map((image:any)=>({
      url:storageUrl(url,image.storage_path),
      alt:image.alt_text,
      width:image.width??null,
      height:image.height??null,
      sortOrder:image.sort_order??0
    }));
    const style=Array.isArray(row.beer_styles)?row.beer_styles[0]?.name:row.beer_styles?.name;
    return {
      id:row.id,slug:row.slug,name:row.name,category:row.category,style:style??null,packaging:row.packaging??null,
      volumeMl:row.volume_ml??null,shortDescription:row.short_description??null,longDescription:row.long_description??null,
      abv:row.abv==null?null:Number(row.abv),ibu:row.ibu==null?null:Number(row.ibu),colorDescription:row.color_description??null,
      tastingNotes:row.tasting_notes??null,aromaNotes:row.aroma_notes??null,ingredients:row.ingredients??null,
      servingTemperature:row.serving_temperature??null,pairing:row.pairing??null,price:row.price==null?null:Number(row.price),
      promotionalPrice:row.promotional_price==null?null:Number(row.promotional_price),priceRange:row.price_range??null,
      availabilityStatus:row.availability_status??null,featured:Boolean(row.featured),images
    };
  });

  const s:any=settingsResult.data;
  const settings:PublicSiteSettings=s?{
    legalName:s.legal_name??null,cnpj:s.cnpj??null,mapaRegistration:s.mapa_registration??null,address:s.address??null,
    latitude:s.latitude==null?null:Number(s.latitude),longitude:s.longitude==null?null:Number(s.longitude),
    openingHours:s.opening_hours??null,phone:s.phone??null,whatsapp:s.whatsapp??null,email:s.email??null,
    socialLinks:s.social_links??null,deliveryArea:s.delivery_area??null,leadTimes:s.lead_times??null,fees:s.fees??null,
    paymentMethods:s.payment_methods??null,story:s.story??null,seo:s.seo??null
  }:fallbackSiteData.settings;

  const faqs:PublicFaq[]=(faqResult.data??[]).map((row:any)=>({id:row.id,question:row.question,answer:row.answer,category:row.category??null}));
  const team:PublicTeamMember[]=(teamResult.data??[]).map((row:any)=>({
    id:row.id,name:row.name,role:row.role??null,photoUrl:row.photo_path?storageUrl(url,row.photo_path):null,photoAlt:row.photo_alt??null
  }));
  const legalPages:PublicLegalPage[]=(legalResult.data??[]).map((row:any)=>({slug:row.slug,title:row.title,body:row.body}));

  return {
    source:'database',
    products:products.length?products:fallbackSiteData.products,
    settings:{...fallbackSiteData.settings,...settings},
    faqs,team,legalPages
  };
}

const cachedDatabaseLoad=unstable_cache(loadFromDatabase,['rodada-public-site-data'],{
  revalidate:60,
  tags:['rodada-content']
});

export async function getPublicSiteData():Promise<PublicSiteData>{
  try{return await cachedDatabaseLoad();}
  catch(error){
    console.error('[Rodada] Falha ao carregar Supabase; usando fallback estático.',error);
    return fallbackSiteData;
  }
}

export async function getPublicProducts(){return (await getPublicSiteData()).products;}
export async function getPublicProductBySlug(slug:string){
  return (await getPublicSiteData()).products.find(product=>product.slug===slug)??null;
}
export async function getPublicLegalPage(slug:string){
  return (await getPublicSiteData()).legalPages.find(page=>page.slug===slug)??null;
}
