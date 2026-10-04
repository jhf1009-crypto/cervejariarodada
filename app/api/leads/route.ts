import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {z} from 'zod';

const Lead=z.object({
 name:z.string().trim().min(2).max(120),
 whatsapp:z.string().trim().min(10).max(30),
 email:z.union([z.string().trim().email(),z.literal('')]).optional(),
 event_date:z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/),z.literal('')]).optional(),
 city:z.string().trim().max(120).optional(),
 event_type:z.string().trim().max(120).optional(),
 guest_count:z.union([z.coerce.number().int().positive().max(10000),z.literal('')]).optional(),
 message:z.string().trim().max(1000).optional(),
 website:z.string().max(0).optional()
});
const recent=new Map<string,number>();

export async function POST(req:NextRequest){
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const now=Date.now();const last=recent.get(ip)||0;
 if(now-last<15000)return NextResponse.json({error:'Aguarde alguns segundos antes de enviar novamente.'},{status:429});
 let body;try{body=Lead.parse(await req.json())}catch{return NextResponse.json({error:'Confira os campos obrigatórios.'},{status:400})}
 if(body.website)return NextResponse.json({ok:true});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return NextResponse.json({error:'O formulário está temporariamente indisponível. Continue pelo WhatsApp.'},{status:503});
 const supabase=createClient(url,key,{auth:{persistSession:false}});
 const {error}=await supabase.from('leads').insert({
  name:body.name,whatsapp:body.whatsapp,email:body.email||null,event_date:body.event_date||null,
  city:body.city||null,event_type:body.event_type||null,guest_count:body.guest_count===''?null:body.guest_count||null,
  message:body.message||null,source:'site:eventos',utm:null
 });
 if(error)return NextResponse.json({error:'Não foi possível registrar agora. Continue pelo WhatsApp.'},{status:500});
 recent.set(ip,now);
 if(process.env.RESEND_API_KEY&&process.env.LEADS_NOTIFICATION_EMAIL){
  fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:'Bearer '+process.env.RESEND_API_KEY,'content-type':'application/json'},body:JSON.stringify({
   from:process.env.RESEND_FROM_EMAIL||'Rodada Site <onboarding@resend.dev>',to:[process.env.LEADS_NOTIFICATION_EMAIL],
   subject:'Novo pedido de orçamento — Cervejaria Rodada',text:`Novo lead: ${body.name} · ${body.whatsapp} · ${body.city||'cidade não informada'}`
  })}).catch(()=>{});
 }
 return NextResponse.json({ok:true});
}
