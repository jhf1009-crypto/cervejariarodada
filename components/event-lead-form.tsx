'use client';
import {FormEvent,useState} from 'react';

const WHATSAPP='557798140440';

export default function EventLeadForm(){
 const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
 const [message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setStatus('sending');setMessage('');
  const form=e.currentTarget; const data=Object.fromEntries(new FormData(form).entries());
  try{
   const res=await fetch('/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
   const body=await res.json().catch(()=>({}));
   if(!res.ok)throw new Error(body.error||'Não foi possível enviar agora.');
   setStatus('success');setMessage('Recebemos seu pedido de orçamento. A equipe Rodada poderá continuar o atendimento pelo WhatsApp.');form.reset();
  }catch(err){
   setStatus('error');setMessage(err instanceof Error?err.message:'Falha ao enviar.');
  }
 }
 function whatsapp(){
  const form=document.getElementById('event-lead-form') as HTMLFormElement|null;
  const fd=form?new FormData(form):null;
  const text=fd?`Olá! Quero orçamento para evento.\nNome: ${fd.get('name')||''}\nCidade: ${fd.get('city')||''}\nData: ${fd.get('event_date')||''}\nTipo: ${fd.get('event_type')||''}\nConvidados: ${fd.get('guest_count')||''}\nObservações: ${fd.get('message')||''}`:'Olá! Quero solicitar um orçamento para evento.';
  window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');
 }
 return <section className="leadFormSection" aria-labelledby="lead-form-title">
  <div className="leadFormIntro"><p className="eyebrow">ORÇAMENTO COMPLETO</p><h3 id="lead-form-title">CONTE SOBRE<br/>SEU EVENTO.</h3><p>Preencha os dados para organizar o atendimento. Nenhum preço ou condição é presumido pelo site; a equipe confirma tudo diretamente com você.</p></div>
  <form id="event-lead-form" className="leadForm" onSubmit={submit}>
   <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
   <label>Nome*<input name="name" required minLength={2} maxLength={120}/></label>
   <label>WhatsApp*<input name="whatsapp" required inputMode="tel" placeholder="(77) 99999-9999"/></label>
   <label>E-mail<input name="email" type="email"/></label>
   <label>Data do evento<input name="event_date" type="date"/></label>
   <label>Cidade<input name="city" maxLength={120}/></label>
   <label>Tipo de evento<select name="event_type" defaultValue=""><option value="">Selecione</option><option>Aniversário</option><option>Casamento</option><option>Confraternização</option><option>Evento empresarial</option><option>Outro</option></select></label>
   <label>Nº de convidados<input name="guest_count" type="number" min="1" max="10000"/></label>
   <label className="wide">Observações<textarea name="message" rows={4} maxLength={1000}/></label>
   <div className="leadFormActions wide"><button className="primary" disabled={status==='sending'}>{status==='sending'?'ENVIANDO...':'ENVIAR ORÇAMENTO ↗'}</button><button type="button" className="secondary" onClick={whatsapp}>PREFIRO WHATSAPP</button></div>
   {message&&<p className={'leadFeedback '+status} role="status">{message}{status==='error'&&<> <button type="button" onClick={whatsapp}>Continuar pelo WhatsApp</button></>}</p>}
  </form>
 </section>;
}
