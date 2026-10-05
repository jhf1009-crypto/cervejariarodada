import RodadaSite from '@/components/rodada-site';
import {getPublicSiteData} from '@/lib/site-data';

export const revalidate=60;

export default async function Page(){
  const data=await getPublicSiteData();
  return <RodadaSite data={data}/>;
}
