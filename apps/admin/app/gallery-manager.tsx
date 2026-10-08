'use client';

import {FormEvent,useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase/client';

type GalleryItem={
 id:string;
 title:string|null;
 event_date:string|null;
 city:string|null;
 event_type:string|null;
 image_path:string|null;
 published:boolean;
 sort_order:number;
};

type Testimonial={
 id:string;
 name:string|null;
 city:string|null;
 body:string;
 rating:number|null;
 source_url:string|null;
 approved:boolean;
};

const emptyGallery={title:'',event_date:'',city:'',event_type:'',published:false,sort_order:'0'};
const emptyTestimonial={name:'',city:'',body:'',rating:'5',source_url:'',approved:false};

export default function GalleryManager(){
 const supabase=useMemo(()=>createClient(),[]);
 const [gallery,setGallery]=useState<GalleryItem[]>([]);
 const [testimonials,setTestimonials]=useState<Testimonial[]>([]);
 const [galleryForm,setGalleryForm]=useState<any>(emptyGallery);
 const [testimonialForm,setTestimonialForm]=useState<any>(emptyTestimonial);
 const [galleryEditId,setGalleryEditId]=useState<string|null>(null);
 const [testimonialEditId,setTestimonialEditId]=useState<string|null>(null);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [galleryPhoto,setGalleryPhoto]=useState<File|null>(null);

 async function load(){
  setMessage('');
  const [g,t]=await Promise.all([
   supabase.from('events_gallery').select('id,title,event_date,city,event_type,image_path,published,sort_order').order('sort_order'),
   supabase.from('testimonials').select('id,name,city,body,rating,source_url,approved').order('created_at',{ascending:false})
  ]);
  if(g.error||t.error){setMessage((g.error||t.error)?.message||'Erro ao carregar dados.');return}
  setGallery((g.data||[]) as GalleryItem[]);
  setTestimonials((t.data||[]) as Testimonial[]);
 }

 useEffect(()=>{void load()},[]);

 async function saveGallery(e:FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  try{
   let imagePath=galleryEditId?gallery.find(g=>g.id===galleryEditId)?.image_path||null:null;
   if(galleryPhoto){
    if(!['image/jpeg','image/png','image/webp'].includes(galleryPhoto.type))throw new Error('Use JPG, PNG ou WebP.');
    if(galleryPhoto.size>8*1024*1024)throw new Error('A imagem deve ter até 8 MB.');
    const ext=galleryPhoto.type==='image/png'?'png':galleryPhoto.type==='image/webp'?'webp':'jpg';
    imagePath='events/'+crypto.randomUUID()+'.'+ext;
    const uploaded=await supabase.storage.from('public-media').upload(imagePath,galleryPhoto,{contentType:galleryPhoto.type,upsert:false});
    if(uploaded.error)throw uploaded.error;
   }
   const payload={title:galleryForm.title.trim()||null,event_date:galleryForm.event_date||null,city:galleryForm.city.trim()||null,event_type:galleryForm.event_type.trim()||null,image_path:imagePath,published:!!galleryForm.published,sort_order:Number(galleryForm.sort_order)||0,updated_at:new Date().toISOString()};
   const result=galleryEditId?await supabase.from('events_gallery').update(payload).eq('id',galleryEditId):await supabase.from('events_gallery').insert(payload);
   if(result.error)throw result.error;
   setGalleryEditId(null);setGalleryForm(emptyGallery);setGalleryPhoto(null);setMessage('Item da galeria salvo.');await load();
  }catch(error){setMessage(error instanceof Error?error.message:'Erro ao salvar galeria.');}
  finally{setBusy(false)}
 }

 async function saveTestimonial(e:FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  const payload={
   name:testimonialForm.name.trim()||null,
   city:testimonialForm.city.trim()||null,
   body:testimonialForm.body.trim(),
   rating:testimonialForm.rating?Number(testimonialForm.rating):null,
   source_url:testimonialForm.source_url.trim()||null,
   approved:!!testimonialForm.approved,
   updated_at:new Date().toISOString()
  };
  const result=testimonialEditId
   ?await supabase.from('testimonials').update(payload).eq('id',testimonialEditId)
   :await supabase.from('testimonials').insert(payload);
  setBusy(false);
  if(result.error){setMessage(result.error.message);return}
  setTestimonialEditId(null);setTestimonialForm(emptyTestimonial);setMessage('Depoimento salvo.');await load();
 }

 function editGallery(item:GalleryItem){
  setGalleryEditId(item.id);
  setGalleryForm({...item,event_date:item.event_date||'',title:item.title||'',city:item.city||'',event_type:item.event_type||''});setGalleryPhoto(null);
 }
 function editTestimonial(item:Testimonial){
  setTestimonialEditId(item.id);
  setTestimonialForm({...item,name:item.name||'',city:item.city||'',rating:item.rating??'',source_url:item.source_url||''});
 }

 async function removeGallery(item:GalleryItem){
  if(!confirm('Excluir este item da galeria?'))return;
  const {error}=await supabase.from('events_gallery').delete().eq('id',item.id);
  if(error)setMessage(error.message);else await load();
 }
 async function removeTestimonial(item:Testimonial){
  if(!confirm('Excluir este depoimento?'))return;
  const {error}=await supabase.from('testimonials').delete().eq('id',item.id);
  if(error)setMessage(error.message);else await load();
 }

 async function toggleGallery(item:GalleryItem){
  const {error}=await supabase.from('events_gallery').update({published:!item.published,updated_at:new Date().toISOString()}).eq('id',item.id);
  if(error)setMessage(error.message);else await load();
 }
 async function toggleTestimonial(item:Testimonial){
  const {error}=await supabase.from('testimonials').update({approved:!item.approved,updated_at:new Date().toISOString()}).eq('id',item.id);
  if(error)setMessage(error.message);else await load();
 }

 return <div className="stackAdmin galleryManager">
  {message&&<div className="adminMessage">{message}</div>}

  <div className="productAdmin">
   <form className="adminForm" onSubmit={saveGallery}>
    <div className="formTitle"><h3>{galleryEditId?'Editar item da galeria':'Novo item da galeria'}</h3>{galleryEditId&&<button type="button" onClick={()=>{setGalleryEditId(null);setGalleryForm(emptyGallery)}}>Cancelar edição</button>}</div>
    <label className="wide">Foto do evento (JPG, PNG ou WebP, até 8 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setGalleryPhoto(e.target.files?.[0]||null)}/></label>
    {galleryPhoto&&<p>Foto selecionada: {galleryPhoto.name}</p>}
    <label>Título<input value={galleryForm.title} onChange={e=>setGalleryForm({...galleryForm,title:e.target.value})}/></label>
    <label>Tipo de evento<input value={galleryForm.event_type} onChange={e=>setGalleryForm({...galleryForm,event_type:e.target.value})} placeholder="Casamento, aniversário, festival..."/></label>
    <label>Cidade<input value={galleryForm.city} onChange={e=>setGalleryForm({...galleryForm,city:e.target.value})}/></label>
    <label>Data<input type="date" value={galleryForm.event_date} onChange={e=>setGalleryForm({...galleryForm,event_date:e.target.value})}/></label>
    <label>Ordem<input type="number" value={galleryForm.sort_order} onChange={e=>setGalleryForm({...galleryForm,sort_order:e.target.value})}/></label>
    <label className="check"><input type="checkbox" checked={!!galleryForm.published} onChange={e=>setGalleryForm({...galleryForm,published:e.target.checked})}/> Publicar no site</label>
    <button className="saveButton" disabled={busy}>{busy?'Salvando...':galleryEditId?'Salvar alterações':'Adicionar à galeria'}</button>
   </form>

   <div className="productList">
    <div className="listHead"><h3>Galeria de eventos</h3><span>{gallery.length} itens</span></div>
    {gallery.length===0?<p>Nenhum item cadastrado.</p>:gallery.map(item=><article className="productRow" key={item.id}>
     <div><b>{item.title||item.event_type||'Evento Rodada'}</b><small>{item.city||'Cidade não informada'}{item.event_date?' · '+new Date(item.event_date+'T12:00:00').toLocaleDateString('pt-BR'):''}</small></div>
     <div className="productMeta"><span className={item.published?'statusOn':'statusOff'}>{item.published?'Publicado':'Oculto'}</span></div>
     <div className="rowActions"><button onClick={()=>editGallery(item)}>Editar</button><button onClick={()=>toggleGallery(item)}>{item.published?'Ocultar':'Publicar'}</button><button className="danger" onClick={()=>removeGallery(item)}>Excluir</button></div>
    </article>)}
   </div>
  </div>

  <div className="productAdmin">
   <form className="adminForm" onSubmit={saveTestimonial}>
    <div className="formTitle"><h3>{testimonialEditId?'Editar depoimento':'Novo depoimento'}</h3>{testimonialEditId&&<button type="button" onClick={()=>{setTestimonialEditId(null);setTestimonialForm(emptyTestimonial)}}>Cancelar edição</button>}</div>
    <label>Nome<input value={testimonialForm.name} onChange={e=>setTestimonialForm({...testimonialForm,name:e.target.value})}/></label>
    <label>Cidade<input value={testimonialForm.city} onChange={e=>setTestimonialForm({...testimonialForm,city:e.target.value})}/></label>
    <label>Avaliação<select value={testimonialForm.rating} onChange={e=>setTestimonialForm({...testimonialForm,rating:e.target.value})}><option value="5">5 estrelas</option><option value="4">4 estrelas</option><option value="3">3 estrelas</option><option value="2">2 estrelas</option><option value="1">1 estrela</option></select></label>
    <label>Fonte / link<input type="url" value={testimonialForm.source_url} onChange={e=>setTestimonialForm({...testimonialForm,source_url:e.target.value})} placeholder="Opcional"/></label>
    <label className="wide">Depoimento<textarea required rows={5} value={testimonialForm.body} onChange={e=>setTestimonialForm({...testimonialForm,body:e.target.value})}/></label>
    <label className="check"><input type="checkbox" checked={!!testimonialForm.approved} onChange={e=>setTestimonialForm({...testimonialForm,approved:e.target.checked})}/> Aprovado para o site</label>
    <button className="saveButton" disabled={busy}>{busy?'Salvando...':testimonialEditId?'Salvar alterações':'Adicionar depoimento'}</button>
   </form>

   <div className="productList">
    <div className="listHead"><h3>Depoimentos</h3><span>{testimonials.length} registros</span></div>
    {testimonials.length===0?<p>Nenhum depoimento cadastrado.</p>:testimonials.map(item=><article className="testimonialAdminRow" key={item.id}>
     <div className="testimonialAdminHead"><div><b>{item.name||'Cliente Rodada'}</b><small>{item.city||'Cidade não informada'} · {'★'.repeat(item.rating||5)}</small></div><span className={item.approved?'statusOn':'statusOff'}>{item.approved?'Aprovado':'Pendente'}</span></div>
     <p>{item.body}</p>
     <div className="rowActions"><button onClick={()=>editTestimonial(item)}>Editar</button><button onClick={()=>toggleTestimonial(item)}>{item.approved?'Ocultar':'Aprovar'}</button><button className="danger" onClick={()=>removeTestimonial(item)}>Excluir</button></div>
    </article>)}
   </div>
  </div>
 </div>;
}
