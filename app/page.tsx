import RodadaSite from '@/components/rodada-site';
import {getPublicSiteData} from '@/lib/site-data';

export const revalidate=60;

export default async function Page(){
  const data=await getPublicSiteData();
  const site=process.env.NEXT_PUBLIC_SITE_URL||'https://www.cervejariarodada.com.br';
  const settings=data.settings;
  const organization={
    '@type':'Organization',
    '@id':site+'/#organization',
    name:settings.legalName||'Cervejaria Rodada',
    url:site,
    ...(settings.phone?{telephone:settings.phone}:{}),
    ...(settings.email?{email:settings.email}:{}),
    ...(settings.socialLinks?{sameAs:Object.values(settings.socialLinks).filter(Boolean)}:{})
  };
  const brewery={
    '@type':['Brewery','LocalBusiness'],
    '@id':site+'/#brewery',
    name:settings.legalName||'Cervejaria Rodada',
    url:site,
    ...(settings.phone?{telephone:settings.phone}:{}),
    ...(settings.email?{email:settings.email}:{}),
    ...(settings.address?{address:{'@type':'PostalAddress',streetAddress:settings.address}}:{}),
    ...(settings.latitude!=null&&settings.longitude!=null?{geo:{'@type':'GeoCoordinates',latitude:settings.latitude,longitude:settings.longitude}}:{})
  };
  const graph:any[]=[organization,brewery];
  if(data.faqs.length){
    graph.push({'@type':'FAQPage','@id':site+'/#faq',mainEntity:data.faqs.map(item=>({
      '@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}
    }))});
  }
  const jsonLd={'@context':'https://schema.org','@graph':graph};

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
    <RodadaSite data={data}/>
  </>;
}
