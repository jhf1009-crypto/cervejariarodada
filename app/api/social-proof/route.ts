import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';

export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return NextResponse.json({gallery:[],testimonials:[]},{status:200});

 const supabase=createClient(url,key,{auth:{persistSession:false}});
 const [galleryResult,testimonialsResult]=await Promise.all([
  supabase.from('events_gallery')
   .select('id,title,event_date,city,event_type,sort_order')
   .eq('published',true)
   .order('sort_order')
   .limit(12),
  supabase.from('testimonials')
   .select('id,name,city,body,rating')
   .eq('approved',true)
   .order('created_at',{ascending:false})
   .limit(9)
 ]);

 return NextResponse.json({
  gallery:galleryResult.data||[],
  testimonials:testimonialsResult.data||[]
 });
}
