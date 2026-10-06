import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';

export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return NextResponse.json({faqs:[]},{status:200});

 const supabase=createClient(url,key,{auth:{persistSession:false}});
 const {data,error}=await supabase
  .from('faqs')
  .select('id,question,answer,category,sort_order')
  .eq('published',true)
  .order('sort_order')
  .order('created_at');

 if(error)return NextResponse.json({faqs:[]},{status:200});
 return NextResponse.json({faqs:data||[]});
}
