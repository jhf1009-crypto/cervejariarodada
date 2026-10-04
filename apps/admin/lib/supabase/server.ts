import {cookies} from 'next/headers';
import {createServerClient} from '@supabase/ssr';

export async function createClient(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw new Error('Supabase não configurado no admin.');
 const store=await cookies();
 return createServerClient(url,key,{cookies:{
  getAll(){return store.getAll();},
  setAll(values){try{values.forEach(({name,value,options})=>store.set(name,value,options));}catch{}}
 }});
}
