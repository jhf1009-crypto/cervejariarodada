import {catalog,WHATSAPP,type CatalogProduct} from './catalog';
import {getPublicData} from './public-data';
export async function getPublicCatalog(){
 const data=await getPublicData();
 const products:CatalogProduct[]=data.products.map((p:any)=>{
  const fallback=catalog.find(item=>item.slug===p.slug);
  return {slug:p.slug,name:p.name,category:p.category==='chope'?'Chopp':'Cerveja',style:fallback?.style,
   packaging:p.packaging||'',volume:p.volume_ml?(p.volume_ml>=1000?String(p.volume_ml/1000).replace('.',',')+' L':p.volume_ml+' ml'):undefined,
   image:p.image_url||fallback?.image||'/icon.svg',imageWidth:p.image_url?1254:fallback?.imageWidth||512,imageHeight:p.image_url?1254:fallback?.imageHeight||512,
   description:p.short_description||fallback?.description||'Consulte disponibilidade e condições com a equipe Rodada.'};
 });
 const settings=(data as any).settings?.[0];
 return {products,whatsapp:String(settings?.whatsapp||WHATSAPP).replace(/\D/g,''),legal:(data as any).legal||[]};
}
