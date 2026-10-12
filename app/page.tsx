import RodadaSite from '@/components/rodada-site';
import {getPublicData} from '@/lib/public-data';
export const dynamic='force-dynamic';
export default async function Home(){
 try{return <RodadaSite initialData={await getPublicData()}/>}
 catch{return <main className="legalPublicPage"><h1>Cervejaria Rodada</h1><p>Nosso catálogo está temporariamente indisponível. Tente novamente em alguns instantes.</p><a href="/">Recarregar site</a></main>}
}
