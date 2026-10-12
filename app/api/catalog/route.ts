import {NextResponse} from 'next/server';
import {getPublicData} from '@/lib/public-data';
export const dynamic='force-dynamic';
export async function GET(){
 try{return NextResponse.json(await getPublicData(),{headers:{'Cache-Control':'no-store'}})}
 catch{return NextResponse.json({error:'Catálogo temporariamente indisponível'},{status:503})}
}
