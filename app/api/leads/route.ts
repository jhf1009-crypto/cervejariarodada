import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {Lead} from '@/lib/lead-validation';

const recent=new Map<string,number>();

export async function POST(req:NextRequest){
 const origin=req.headers.get('origin');
 if(origin&&origin!==req.nextUrl.origin)return NextResponse.json({error:'Origem não permitida.'},{status:403});
 if(Number(req.headers.get('content-length')||0)>8192)return NextResponse.json({error:'Dados muito extensos.'},{status:413});
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const now=Date.now();const last=recent.get(ip)||0;
 if(now-last<15000)return NextResponse.json({error:'Aguarde alguns segundos antes de enviar novamente.'},{status:429});
 let body;try{const raw=await req.text();if(raw.length>8192)return NextResponse.json({error:'Dados muito extensos.'},{status:413});body=Lead.parse(JSON.parse(raw))}catch{return NextResponse.json({error:'Confira os campos obrigatórios.'},{status:400})}
 if(body.website)return NextResponse.json({ok:true});
 for(const [address,time] of recent)if(now-time>60000)recent.delete(address);
 if(recent.size>=10000)return NextResponse.json({error:'Tente novamente em alguns instantes.'},{status:429});
 recent.set(ip,now);
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return NextResponse.json({error:'O formulário está temporariamente indisponível. Continue pelo WhatsApp.'},{status:503});
 const supabase=createClient(url,key,{auth:{persistSession:false}});
 const {error}=await supabase.from('leads').insert({
  name:body.name,whatsapp:body.whatsapp,email:body.email||null,event_date:body.event_date||null,
  city:body.city||null,event_type:body.event_type||null,guest_count:body.guest_count===''?null:body.guest_count||null,
  message:body.message||null,source:'site:eventos',utm:null
 });
 if(error?.code==='P0001')return NextResponse.json({error:'Limite de envios atingido. Aguarde alguns minutos ou continue pelo WhatsApp.'},{status:429});
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
