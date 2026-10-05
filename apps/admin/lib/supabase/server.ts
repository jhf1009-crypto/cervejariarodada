import {cookies} from 'next/headers';
import {createServerClient} from '@supabase/ssr';

function getEnv(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)throw new Error('Supabase não configurado no admin.');
  return {url,key};
}

export async function createClient(){
  const {url,key}=getEnv();
  const store=await cookies();
  return createServerClient(url,key,{
    cookies:{
      getAll(){return store.getAll();},
      setAll(values){
        try{
          values.forEach(({name,value,options})=>store.set(name,value,{
            ...options,
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'lax',
            path:'/'
          }));
        }catch{
          // Server Components não podem persistir cookies; o proxy faz o refresh.
        }
      }
    }
  });
}
