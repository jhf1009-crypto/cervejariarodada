'use client';

import {FormEvent,useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';

type SettingsRow={
 id:boolean;
 legal_name:string|null;
 cnpj:string|null;
 mapa_registration:string|null;
 address:string|null;
 latitude:number|null;
 longitude:number|null;
 opening_hours:Record<string,string>|null;
 phone:string|null;
 whatsapp:string|null;
 email:string|null;
 social_links:Record<string,string>|null;
 delivery_area:string|null;
 lead_times:string|null;
 fees:string|null;
 payment_methods:string|null;
 story:string|null;
 seo:Record<string,unknown>|null;
 updated_at:string;
};

const empty={
 legal_name:'',cnpj:'',mapa_registration:'',address:'',latitude:'',longitude:'',
 phone:'',whatsapp:'',email:'',delivery_area:'',lead_times:'',fees:'',payment_methods:'',story:'',
 instagram:'',facebook:'',youtube:'',tiktok:'',
 monday:'',tuesday:'',wednesday:'',thursday:'',friday:'',saturday:'',sunday:''
};

const days=[
 ['monday','Segunda-feira'],
 ['tuesday','Terça-feira'],
 ['wednesday','Quarta-feira'],
 ['thursday','Quinta-feira'],
 ['friday','Sexta-feira'],
 ['saturday','Sábado'],
 ['sunday','Domingo']
] as const;

export default function SettingsManager(){
 const supabase=useMemo(()=>createClient(),[]);
 const [form,setForm]=useState<any>(empty);
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [message,setMessage]=useState('');
 const [existingSocial,setExistingSocial]=useState<Record<string,string>>({});
 const [existingHours,setExistingHours]=useState<Record<string,string>>({});

 async function load(){
  setLoading(true);setMessage('');
  const {data,error}=await supabase.from('site_settings').select('*').eq('id',true).maybeSingle();
  setLoading(false);
  if(error){setMessage(error.message);return}
  const row=data as SettingsRow|null;
  if(!row){setForm(empty);return}
  const social=row.social_links||{};
  const hours=row.opening_hours||{};
  setExistingSocial(social);
  setExistingHours(hours);
  setForm({
   legal_name:row.legal_name||'',
   cnpj:row.cnpj||'',
   mapa_registration:row.mapa_registration||'',
   address:row.address||'',
   latitude:row.latitude??'',
   longitude:row.longitude??'',
   phone:row.phone||'',
   whatsapp:row.whatsapp||'',
   email:row.email||'',
   delivery_area:row.delivery_area||'',
   lead_times:row.lead_times||'',
   fees:row.fees||'',
   payment_methods:row.payment_methods||'',
   story:row.story||'',
   instagram:social.instagram||'',
   facebook:social.facebook||'',
   youtube:social.youtube||'',
   tiktok:social.tiktok||'',
   monday:hours.monday||hours.segunda||'',
   tuesday:hours.tuesday||hours.terca||'',
   wednesday:hours.wednesday||hours.quarta||'',
   thursday:hours.thursday||hours.quinta||'',
   friday:hours.friday||hours.sexta||'',
   saturday:hours.saturday||hours.sabado||'',
   sunday:hours.sunday||hours.domingo||''
  });
 }

 useEffect(()=>{load()},[]);

 function set(key:string,value:any){setForm((current:any)=>({...current,[key]:value}))}

 async function save(e:FormEvent){
  e.preventDefault();setSaving(true);setMessage('');
  const social_links={
   ...existingSocial,
   instagram:form.instagram.trim()||undefined,
   facebook:form.facebook.trim()||undefined,
   youtube:form.youtube.trim()||undefined,
   tiktok:form.tiktok.trim()||undefined
  };
  Object.keys(social_links).forEach(key=>social_links[key]===undefined&&delete social_links[key]);

  const opening_hours={
   ...existingHours,
   monday:form.monday.trim(),
   tuesday:form.tuesday.trim(),
   wednesday:form.wednesday.trim(),
   thursday:form.thursday.trim(),
   friday:form.friday.trim(),
   saturday:form.saturday.trim(),
   sunday:form.sunday.trim()
  };

  const payload={
   id:true,
   legal_name:form.legal_name.trim()||null,
   cnpj:form.cnpj.trim()||null,
   mapa_registration:form.mapa_registration.trim()||null,
   address:form.address.trim()||null,
   latitude:form.latitude===''?null:Number(form.latitude),
   longitude:form.longitude===''?null:Number(form.longitude),
   phone:form.phone.trim()||null,
   whatsapp:form.whatsapp.trim()||null,
   email:form.email.trim()||null,
   social_links,
   opening_hours,
   delivery_area:form.delivery_area.trim()||null,
   lead_times:form.lead_times.trim()||null,
   fees:form.fees.trim()||null,
   payment_methods:form.payment_methods.trim()||null,
   story:form.story.trim()||null,
   updated_at:new Date().toISOString()
  };

  const {error}=await supabase.from('site_settings').upsert(payload,{onConflict:'id'});
  setSaving(false);
  if(error){setMessage(error.message);return}
  setMessage('Configurações salvas com sucesso.');
  await load();
 }

 if(loading)return <div className="settingsLoading">Carregando configurações...</div>;

 const mapsUrl=form.latitude!==''&&form.longitude!==''?'https://www.google.com/maps?q='+form.latitude+','+form.longitude:'';

 return <form className="settingsAdmin" onSubmit={save}>
  {message&&<div className="adminMessage">{message}</div>}

  <section className="settingsSection">
   <div className="settingsHeading"><small>EMPRESA</small><h3>Dados da Cervejaria Rodada</h3></div>
   <div className="settingsGrid">
    <label>Razão social<input value={form.legal_name} onChange={e=>set('legal_name',e.target.value)}/></label>
    <label>CNPJ<input value={form.cnpj} onChange={e=>set('cnpj',e.target.value)} placeholder="00.000.000/0000-00"/></label>
    <label>Registro MAPA<input value={form.mapa_registration} onChange={e=>set('mapa_registration',e.target.value)}/></label>
    <label>Telefone<input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="(77) 0000-0000"/></label>
    <label>WhatsApp<input value={form.whatsapp} onChange={e=>set('whatsapp',e.target.value)} placeholder="5577..."/></label>
    <label>E-mail<input type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></label>
   </div>
  </section>

  <section className="settingsSection">
   <div className="settingsHeading"><small>LOCALIZAÇÃO</small><h3>Endereço e coordenadas</h3></div>
   <div className="settingsGrid">
    <label className="span2">Endereço completo<input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Rua, número, bairro, cidade - UF"/></label>
    <label>Latitude<input type="number" step="any" value={form.latitude} onChange={e=>set('latitude',e.target.value)}/></label>
    <label>Longitude<input type="number" step="any" value={form.longitude} onChange={e=>set('longitude',e.target.value)}/></label>
   </div>
   {mapsUrl&&<a className="mapPreview" href={mapsUrl} target="_blank" rel="noreferrer">Conferir coordenadas no Google Maps ↗</a>}
  </section>

  <section className="settingsSection">
   <div className="settingsHeading"><small>ATENDIMENTO</small><h3>Horários</h3></div>
   <div className="hoursGrid">
    {days.map(([key,label])=><label key={key}>{label}<input value={form[key]} onChange={e=>set(key,e.target.value)} placeholder="08:00–18:00 ou Fechado"/></label>)}
   </div>
  </section>

  <section className="settingsSection">
   <div className="settingsHeading"><small>COMERCIAL</small><h3>Entrega, prazos e pagamentos</h3></div>
   <div className="settingsGrid">
    <label className="span2">Área de atendimento<textarea rows={3} value={form.delivery_area} onChange={e=>set('delivery_area',e.target.value)} placeholder="Cidades e regiões atendidas"/></label>
    <label>Prazos<input value={form.lead_times} onChange={e=>set('lead_times',e.target.value)} placeholder="Ex.: pedidos com 48 h de antecedência"/></label>
    <label>Taxas<input value={form.fees} onChange={e=>set('fees',e.target.value)} placeholder="Ex.: consultar frete para outras cidades"/></label>
    <label className="span2">Formas de pagamento<input value={form.payment_methods} onChange={e=>set('payment_methods',e.target.value)} placeholder="Pix, cartão, dinheiro..."/></label>
   </div>
  </section>

  <section className="settingsSection">
   <div className="settingsHeading"><small>REDES SOCIAIS</small><h3>Links oficiais</h3></div>
   <div className="settingsGrid">
    <label>Instagram<input type="url" value={form.instagram} onChange={e=>set('instagram',e.target.value)} placeholder="https://instagram.com/..."/></label>
    <label>Facebook<input type="url" value={form.facebook} onChange={e=>set('facebook',e.target.value)}/></label>
    <label>YouTube<input type="url" value={form.youtube} onChange={e=>set('youtube',e.target.value)}/></label>
    <label>TikTok<input type="url" value={form.tiktok} onChange={e=>set('tiktok',e.target.value)}/></label>
   </div>
  </section>

  <section className="settingsSection">
   <div className="settingsHeading"><small>CONTEÚDO INSTITUCIONAL</small><h3>História / Sobre a Rodada</h3></div>
   <label className="fullLabel">Texto institucional<textarea rows={8} value={form.story} onChange={e=>set('story',e.target.value)} placeholder="Conte a história da Cervejaria Rodada..."/></label>
  </section>

  <div className="settingsSaveBar">
   <span>As alterações são gravadas diretamente no Supabase.</span>
   <button className="saveButton" disabled={saving}>{saving?'Salvando...':'Salvar configurações'}</button>
  </div>
 </form>;
}
