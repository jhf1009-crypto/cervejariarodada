'use client';

import {useEffect,useState} from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const EventLeadForm=dynamic(()=>import('./event-lead-form'),{ssr:false});

const img={
 barril:'https://static.wixstatic.com/media/e65861_9902f8972f124cc99b1297a5fc9f6834~mv2.png',
 chopeira:'https://static.wixstatic.com/media/e65861_59be33e4eb2d4667934007c12dac8bb8~mv2.png'
};

// Imagens demonstrativas temporárias: substituir pelos arquivos oficiais quando forem disponibilizados.
const choppProducts=[
 {name:'Chopp Lager',size:'1,5 L',meta:'PET 1,5 L',flavor:'LAGER',image:'/products/image.png',tone:'lager',photo:true,width:941,height:1672},
 {name:'Chopp Pilsen',size:'1,5 L',meta:'PET 1,5 L',flavor:'PILSEN',image:'/events/chopp 1,5l pilsen.png',tone:'pilsen',photo:true,width:941,height:1672},
 {name:'Chopp Session IPA',size:'1,5 L',meta:'PET 1,5 L',flavor:'SESSION IPA',image:'/events/chopp 1,5l ipa.png',tone:'ipa',photo:true,width:936,height:1680},
 {name:'Chopp Lager',size:'700 ml',meta:'PET 700 ML',flavor:'LAGER',image:'/events/rodada chopp lager 700ml.png',tone:'lager',photo:true,width:1024,height:1536},
 {name:'Chopp Pilsen',size:'700 ml',meta:'PET 700 ML',flavor:'PILSEN',image:'/events/rodada chopp pilsen 700ml.png',tone:'pilsen',photo:true,width:1086,height:1448}
];

const beerProducts=[
 {name:'Cerveja Rodada Lager',meta:'600 ML',style:'LAGER',image:'/events/cerveja rodada lager.png',tone:'beer-lager',width:1650,height:953},
 {name:'Cerveja Rodada Pilsen',meta:'600 ML',style:'PILSEN',image:'/events/cerveja rodada pilsen.png',tone:'beer-pilsen',width:1506,height:1044},
 {name:'Cerveja Rodada Lager',meta:'600 ML',style:'LAGER',badge:'SEM GLÚTEN',image:'/events/cerveja rodada lager sem glúten.png',tone:'beer-gluten-free',width:1419,height:1109}
];

const orderProducts=[
 ...choppProducts.map(item=>({id:item.name+' '+item.size,name:item.name+' '+item.size,meta:item.flavor+' · '+item.size,image:item.image,group:'Chopps'})),
 ...beerProducts.map(item=>({id:item.name+(item.badge?' '+item.badge:''),name:item.name+(item.badge?' · '+item.badge:''),meta:item.style+' · '+item.meta,image:item.image,group:'Cervejas'})),
 {id:'Barril de Chopp Rodada 30 L',name:'Barril de Chopp Rodada 30 L',meta:'BARRIL 30 L',image:img.barril,group:'Barril + Chopeira'},
 {id:'Barril de Chopp Rodada 50 L',name:'Barril de Chopp Rodada 50 L',meta:'BARRIL 50 L',image:img.barril,group:'Barril + Chopeira'},
 {id:'Chopeira Rodada',name:'Chopeira Rodada',meta:'CHOPEIRA PARA EVENTOS',image:img.chopeira,group:'Barril + Chopeira'}
];

const WHATSAPP='557798140440';
const wa=(message:string)=>'https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(message);

function Arrow(){return <span aria-hidden>↗</span>}
function Reveal({children,className='',...props}:React.HTMLAttributes<HTMLDivElement>){return <div className={className} {...props}>{children}</div>}

type PublicGalleryItem={id:string;title:string|null;event_date:string|null;city:string|null;event_type:string|null;sort_order:number};
type PublicTestimonial={id:string;name:string|null;city:string|null;body:string;rating:number|null};
type PublicFaq={id:string;question:string;answer:string;category:string|null;sort_order:number};

export default function RodadaSite(){
 const [menu,setMenu]=useState(false);
 const [ageVerified,setAgeVerified]=useState<boolean|null>(null);
 const [cookieChoice,setCookieChoice]=useState<'accepted'|'rejected'|null>(null);
 const [eventGuests,setEventGuests]=useState(50);
 const [eventHours,setEventHours]=useState(4);
 const [eventProfile,setEventProfile]=useState<'leve'|'moderado'|'alto'>('moderado');
 const [eventBeerShare,setEventBeerShare]=useState(70);
 const [orderOpen,setOrderOpen]=useState(false);
 const [selectedOrders,setSelectedOrders]=useState<string[]>([]);
 const [orderQuantities,setOrderQuantities]=useState<Record<string,number>>({});
 const [orderCity,setOrderCity]=useState('');
 const [orderCep,setOrderCep]=useState('');
 const [cepCity,setCepCity]=useState('');
 const [cepStatus,setCepStatus]=useState<'idle'|'loading'|'success'|'error'>('idle');
 const [publicGallery,setPublicGallery]=useState<PublicGalleryItem[]>([]);
 const [publicTestimonials,setPublicTestimonials]=useState<PublicTestimonial[]>([]);
 const [socialProofLoaded,setSocialProofLoaded]=useState(false);
 const [publicFaqs,setPublicFaqs]=useState<PublicFaq[]>([]);
 const [faqLoaded,setFaqLoaded]=useState(false);

 useEffect(()=>{
  const age=window.localStorage.getItem('rodada_age_verified');
  setAgeVerified(age==='yes');
  const cookie=window.localStorage.getItem('rodada_cookie_choice');
  if(cookie==='accepted'||cookie==='rejected')setCookieChoice(cookie);
 },[]);

 useEffect(()=>{
  const timer=window.setTimeout(()=>{
   fetch('/api/social-proof')
    .then(response=>response.ok?response.json():Promise.reject())
    .then(data=>{
     setPublicGallery(Array.isArray(data.gallery)?data.gallery:[]);
     setPublicTestimonials(Array.isArray(data.testimonials)?data.testimonials:[]);
    })
    .catch(()=>{})
    .finally(()=>setSocialProofLoaded(true));

   fetch('/api/faqs')
    .then(response=>response.ok?response.json():Promise.reject())
    .then(data=>setPublicFaqs(Array.isArray(data.faqs)?data.faqs:[]))
    .catch(()=>{})
    .finally(()=>setFaqLoaded(true));
  },700);
  return()=>window.clearTimeout(timer);
 },[]);





 useEffect(()=>{
  if(!orderOpen)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')setOrderOpen(false)};
  window.addEventListener('keydown',onKey);
  return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKey)};
 },[orderOpen]);

 const openOrder=(product='')=>{
  setSelectedOrders(product?[product]:[]);
  setOrderQuantities(product?{[product]:1}:{});
  setOrderOpen(true);
  setMenu(false);
 };
 const toggleOrder=(product:string)=>{
  setSelectedOrders(current=>{
   if(current.includes(product)){
    setOrderQuantities(quantities=>{const next={...quantities};delete next[product];return next});
    return current.filter(item=>item!==product);
   }
   setOrderQuantities(quantities=>({...quantities,[product]:quantities[product]||1}));
   return [...current,product];
  });
 };
 const changeOrderQuantity=(product:string,delta:number)=>{
  setOrderQuantities(current=>({...current,[product]:Math.min(99,Math.max(1,(current[product]||1)+delta))}));
 };
 const isBeerOrder=(product:string)=>beerProducts.some(item=>product.startsWith(item.name));
 const selectCity=(city:string)=>{
  setOrderCity(city);
  if(city!=='Outra cidade'){setOrderCep('');setCepCity('');setCepStatus('idle')}
 };
 const lookupCep=async()=>{
  const cep=orderCep.replace(/\D/g,'');
  if(cep.length!==8){setCepCity('');setCepStatus('error');return}
  setCepStatus('loading');
  try{
   const response=await fetch('https://viacep.com.br/ws/'+cep+'/json/');
   const data=await response.json();
   if(!response.ok||data.erro||!data.localidade||!data.uf)throw new Error('CEP inválido');
   setCepCity(data.localidade+' - '+data.uf);
   setCepStatus('success');
  }catch{
   setCepCity('');
   setCepStatus('error');
  }
 };
 const chosenCity=orderCity==='Outra cidade'?cepCity:orderCity;
 const canContinueOrder=selectedOrders.length>0&&Boolean(chosenCity);
 const profileRate=eventProfile==='leve'?.18:eventProfile==='alto'?.33:.25;
 const effectiveHours=Math.min(eventHours,4)+Math.max(0,Math.min(eventHours,8)-4)*.55+Math.max(0,eventHours-8)*.25;
 const estimatedDrinkers=Math.max(1,Math.round(eventGuests*(eventBeerShare/100)));
 const baseLiters=estimatedDrinkers*profileRate*effectiveHours;
 const estimatedLiters=Math.max(10,Math.ceil(baseLiters/5)*5);
 const kegOptions=(()=>{
   let best:{count:number;capacity:number;k30:number;k50:number}|null=null;
   for(let k30=0;k30<=40;k30++){
     for(let k50=0;k50<=40;k50++){
       const count=k30+k50;
       const capacity=k30*30+k50*50;
       if(!count||capacity<estimatedLiters)continue;
       if(!best||count<best.count||(count===best.count&&capacity<best.capacity))best={count,capacity,k30,k50};
     }
   }
   return best||{count:1,capacity:50,k30:0,k50:1};
 })();
 const suggestedKegs=[kegOptions.k50?((kegOptions.k50)+' '+(kegOptions.k50===1?'barril':'barris')+' de 50 L'):'',kegOptions.k30?((kegOptions.k30)+' '+(kegOptions.k30===1?'barril':'barris')+' de 30 L'):''].filter(Boolean).join(' + ');
 const estimatedWaste=kegOptions.capacity-estimatedLiters;
 const continueOrder=()=>{
  if(!canContinueOrder)return;
  const custom=selectedOrders.includes('Pedido personalizado');
  const products=selectedOrders.filter(item=>item!=='Pedido personalizado');
  const lines=products.length?'\n\nProdutos selecionados:\n'+products.map(product=>{
   const quantity=orderQuantities[product]||1;
   if(isBeerOrder(product)){
    const units=quantity*6;
    return '- '+product+': '+quantity+' '+(quantity===1?'fardo':'fardos')+' de 6 ('+units+' unidades)';
   }
   return '- '+product+': '+quantity+' '+(quantity===1?'unidade':'unidades');
  }).join('\n'):'';
  const customLine=custom?'\n\nTambém quero fazer um pedido personalizado e explicar os detalhes.':'';
  const cityLine='\n\nCidade: '+chosenCity+(orderCity==='Outra cidade'&&orderCep?'\nCEP: '+orderCep:'');
  window.open(wa('Olá! Gostaria de fazer um pedido.'+lines+customLine+cityLine+'\n\nPode me informar disponibilidade e valores?'),'_blank','noopener,noreferrer');
  setOrderOpen(false);
 };


 return <div className="site">
  {ageVerified===false&&<div className="ageGate" role="dialog" aria-modal="true" aria-labelledby="age-title">
    <div className="ageGateCard"><small>CERVEJARIA RODADA · +18</small><h2 id="age-title">VOCÊ TEM<br/>18 ANOS OU MAIS?</h2><p>Este site apresenta bebidas alcoólicas e é destinado a maiores de 18 anos.</p><div><button type="button" className="primary" onClick={()=>{localStorage.setItem('rodada_age_verified','yes');setAgeVerified(true)}}>SIM, TENHO 18+</button><a href="https://www.google.com/" className="secondary">NÃO</a></div><span>BEBA COM MODERAÇÃO.</span></div>
  </div>}
  {ageVerified!==false&&cookieChoice===null&&<div className="cookieBanner" role="region" aria-label="Preferências de cookies">
    <div><strong>Privacidade e cookies</strong><p>Usamos apenas cookies essenciais por padrão. Métricas de navegação só serão ativadas após seu aceite.</p></div>
    <div><button type="button" onClick={()=>{localStorage.setItem('rodada_cookie_choice','rejected');setCookieChoice('rejected')}}>SÓ ESSENCIAIS</button><button type="button" className="primary" onClick={()=>{localStorage.setItem('rodada_cookie_choice','accepted');setCookieChoice('accepted')}}>ACEITAR COOKIES</button></div>
  </div>}
  <a className="skipLink" href="#conteudo">Pular para o conteúdo</a>
  <header className="nav">
   <a href="#inicio" className="brand navBrandLogo" aria-label="Cervejaria Rodada — início"><Image src="/events/CERVEJARIA_RODADA_logo_branca.png" alt="Cervejaria Rodada" width={2610} height={1244} priority sizes="(max-width: 760px) 132px, 156px"/></a>
   <nav id="menu-principal" className={menu?'open':''} aria-label="Navegação principal">
    <a href="#chopes" onClick={()=>setMenu(false)}>Chopps</a><a href="#cervejas" onClick={()=>setMenu(false)}>Cervejas</a><a href="#eventos" onClick={()=>setMenu(false)}>Eventos</a><a href="#contato" onClick={()=>setMenu(false)}>Contato</a>
   </nav>
   <button type="button" className="navCta" onClick={()=>openOrder()}>PEDIR PELO WHATSAPP <Arrow/></button>
   <button type="button" className="menu" onClick={()=>setMenu(!menu)} aria-label={menu?'Fechar menu':'Abrir menu'} aria-expanded={menu} aria-controls="menu-principal"><i/><i/><i/></button>
  </header>

  <main id="conteudo">
   <section className="hero" id="inicio">
    <div className="heroNoise"/>
    <div className="heroCopy">
     <h1 className="heroTitleDesktop">A SUA FESTA.<br/>A NOSSA<br/><span>RODADA.</span></h1>
     <h1 className="heroTitleMobile">A SUA FESTA.<br/><span>A NOSSA RODADA.</span></h1>
     <p className="lead">Chopp do Oeste da Bahia, feito para transformar bons encontros em grandes momentos.</p>
     <div className="heroPioneer" aria-label="Pioneirismo da Cervejaria Rodada">
       <strong>Somos a <em>primeira</em> cervejaria da Bahia a criar uma cerveja <em>sem glúten</em>.</strong>
       <small>Inovação feita na Bahia, com a identidade da Rodada.</small>
     </div>
     <div className="actions heroActions"><a href="#chopes" className="primary">VER CHOPPS <Arrow/></a><a href="#cervejas" className="secondary">Ver cervejas ↓</a><a href="#eventos" className="secondary">Quero chopp para meu evento ↓</a></div>
    </div>
    <div className="heroStage">
      <div className="orbit"/>
      <Image src={img.barril} alt="Barril de Chopp Rodada" className="heroKeg heroKegMobile" width={549} height={605} quality={70} priority sizes="(max-width: 760px) 56vw, 32vw"/>
      <Image src="/events/cerveja rodada lager sem glúten.png" alt="Cerveja Rodada Lager sem glúten" className="desktopFollowBeer" width={1419} height={1109} quality={72} priority sizes="32vw"/>
      <Image src="/events/image.png" alt="Chopeira Rodada" className="heroTap" width={1254} height={1254} quality={65} priority sizes="(max-width: 760px) 30vw, 34vw"/>

      <div className="seal">DO OESTE<br/><b>DA BAHIA</b></div>
    </div>
    <div className="heroFoot"><span>BEBA COM MODERAÇÃO.</span></div>
   </section>

   <section className="products section" id="chopes" aria-labelledby="chopes-title">
    <Reveal className="sectionTitle commerceTitle">
      <div><p className="eyebrow dark">CHOPPS RODADA</p><h2 id="chopes-title">ESCOLHA SEU<br/><em>CHOPP RODADA.</em></h2></div>
      <div className="sectionIntro"><p>Lager, Pilsen e Session IPA em formatos práticos para levar para casa ou reunir a turma.</p><a href={wa('Olá! Gostaria de saber quais chopps Rodada estão disponíveis hoje.')} target="_blank" rel="noreferrer">Consultar disponibilidade <Arrow/></a></div>
    </Reveal>
    <div className="variationGrid" aria-label="Chopps Rodada">
      {choppProducts.map((item,index)=>(
        <Reveal key={item.name+item.size} className={'variationCard '+item.tone}>
          <div className="variationTop"><span>{item.meta}</span></div>
          <div className="variationVisual">
            <span className="variationFlavor" aria-hidden="true">{item.flavor}</span>
            <div className={item.photo?'mockBottle photoAsset':'mockBottle'}>
              {item.image&&<Image src={item.image} alt={item.name+' '+item.size} width={item.width} height={item.height} quality={60} loading="lazy" sizes="(max-width: 700px) 88vw, (max-width: 1100px) 46vw, 30vw"/>}
              {item.photo?null:<div className="mockLabel"><b>RODADA</b><small>{item.flavor}</small><em>{item.size}</em></div>}
            </div>
          </div>
          <div className="variationBottom"><div><h3>{item.name}</h3><p>{item.size} · consulte disponibilidade</p><a className="productDetailLink" href={'/produtos/'+(item.name+'-'+item.size).toLowerCase().replaceAll(' ','-').replaceAll(',','').replaceAll('ó','o')}>VER DETALHES <Arrow/></a></div><button type="button" className="cardAction" onClick={()=>openOrder(item.name+' '+item.size)} aria-label={'Pedir '+item.name+' '+item.size}>PEDIR <Arrow/></button></div>
        </Reveal>
      ))}
    </div>

    <div className="beerLineup" id="cervejas" aria-labelledby="cervejas-title">
      <Reveal className="beerLineupHead">
        <div>
          <p className="eyebrow dark">CERVEJAS RODADA</p>
          <h2 id="cervejas-title">CERVEJAS<br/><em>RODADA 600 ML.</em></h2>
        </div>
        <p>Três versões da Rodada em garrafa de 600 ml. As fotos oficiais serão adicionadas depois, sem usar imagens genéricas.</p>
      </Reveal>
      <div className="beerLineupGrid">
        {beerProducts.map((item,index)=>(
          <Reveal key={item.name+(item.badge||'')} className={'beerLineupCard '+item.tone}>
            <div className="beerLineupTop"><span>{item.meta}</span></div>
            <div className="beerLineupVisual" aria-label={'Foto de '+item.name+(item.badge?' '+item.badge:'')}>
              {item.image?<Image src={item.image} alt={item.name+(item.badge?' '+item.badge:'')} width={item.width} height={item.height} quality={60} loading="lazy" sizes="(max-width: 700px) 88vw, (max-width: 1100px) 46vw, 30vw"/>:<span>FOTO<br/>EM BREVE</span>}
            </div>
            <div className="beerLineupCopy">
              <small>{item.style}</small>
              <h3>{item.name}</h3>
              {item.badge&&<strong className="glutenFreeBadge">{item.badge}</strong>}
              <p>Garrafa 600 ml · consulte disponibilidade</p>
              <div><a className="productDetailLink" href={'/produtos/'+(item.badge?'cerveja-rodada-lager-sem-gluten':item.style==='PILSEN'?'cerveja-rodada-pilsen':'cerveja-rodada-lager')}>VER DETALHES <Arrow/></a><button type="button" className="cardAction" onClick={()=>openOrder(item.name+(item.badge?' '+item.badge:''))}>PEDIR <Arrow/></button></div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
   </section>

   <section className="eventSolutions section" id="eventos" aria-labelledby="eventos-title">
    <div className="eventQuoteFlow">
      <Reveal className="eventSteps" aria-label="Como pedir orçamento para evento">
        <div><span>01</span><strong>Conte sobre o evento</strong><p>Data, cidade, tipo de ocasião e quantidade estimada de pessoas.</p></div>
        <div><span>02</span><strong>A Rodada orienta a estrutura</strong><p>Barris, chopeiras e suporte conforme a necessidade.</p></div>
        <div><span>03</span><strong>Receba o orçamento</strong><p>Converse diretamente com a equipe e alinhe os detalhes.</p></div>
      </Reveal>
      <EventLeadForm/>
    </div>
    <Reveal className="eventSolutionsCta">
      <div><small>VAI FAZER UM EVENTO?</small><strong>Peça seu orçamento sem burocracia.</strong></div>
      <a href={wa('Olá! Gostaria de solicitar um orçamento de chopp para um evento.')} target="_blank" rel="noreferrer" className="primary">SOLICITAR ORÇAMENTO <Arrow/></a>
    </Reveal>
    <Reveal className="eventCalculator" aria-labelledby="calc-title">
      <div className="eventCalcIntro">
        <p className="eyebrow">CALCULADORA DE EVENTO</p>
        <h3 id="calc-title">QUANTOS LITROS<br/>EU PRECISO?</h3>
        <p>Faça uma estimativa inicial. O resultado é apenas uma referência de planejamento; a equipe Rodada confirma a quantidade ideal no orçamento.</p>
      </div>
      <div className="eventCalcControls">
        <label>Convidados <strong>{eventGuests}</strong><input type="range" min="10" max="1000" step="10" value={eventGuests} onChange={e=>setEventGuests(Number(e.target.value))}/></label>
        <label>Duração do evento <strong>{eventHours} h</strong><input type="range" min="2" max="24" step="1" value={eventHours} onChange={e=>setEventHours(Number(e.target.value))}/></label>
        <label>Convidados que vão beber chopp <strong>{eventBeerShare}% · ~{estimatedDrinkers} pessoas</strong><input type="range" min="10" max="100" step="5" value={eventBeerShare} onChange={e=>setEventBeerShare(Number(e.target.value))}/></label>
        <fieldset>
          <legend>Perfil de consumo</legend>
          {([
            ['leve','Leve','~180 ml/h'],
            ['moderado','Moderado','~250 ml/h'],
            ['alto','Alto','~330 ml/h']
          ] as const).map(([profile,label,rate])=><button key={profile} type="button" className={eventProfile===profile?'active':''} onClick={()=>setEventProfile(profile)}><b>{label}</b><small>{rate}</small></button>)}
        </fieldset>
      </div>
      <div className="eventCalcResult">
        <small>ESTIMATIVA MAIS REALISTA</small><strong>{estimatedLiters} L</strong>
        <span>{suggestedKegs}</span>
        <div className="eventCalcBreakdown">
          <b>~{estimatedDrinkers} consumidores de chopp</b>
          <span>{kegOptions.capacity} L de capacidade sugerida{estimatedWaste>0?' · '+estimatedWaste+' L de folga operacional':''}</span>
        </div>
        <p>O cálculo considera apenas quem deve beber chopp e reduz o ritmo de consumo em eventos longos. Assim, a duração não multiplica o consumo de forma linear e evita estimativas exageradas.</p>
        <a className="primary" href={wa('Olá! Usei a calculadora do site para um evento com '+eventGuests+' convidados, duração de '+eventHours+' horas, cerca de '+estimatedDrinkers+' consumidores de chopp, perfil '+eventProfile+' A estimativa foi de '+estimatedLiters+' L, com sugestão de '+suggestedKegs+'. Quero confirmar a quantidade e pedir um orçamento.')} target="_blank" rel="noreferrer">CONFIRMAR COM A RODADA <Arrow/></a>
      </div>
    </Reveal>
   </section>


   <section className="socialProof section" id="galeria" aria-labelledby="social-proof-title">
    <Reveal className="socialProofHead">
     <div><p className="eyebrow dark">MOMENTOS RODADA</p><h2 id="social-proof-title">EVENTOS QUE<br/><em>PEDEM RODADA.</em></h2></div>
     <p>Registros publicados pelo painel administrativo e experiências compartilhadas por clientes da Cervejaria Rodada.</p>
    </Reveal>

    <div className="socialProofGrid">
     <div className="eventGalleryPublic">
      <div className="socialSubhead"><small>GALERIA DE EVENTOS</small><strong>{publicGallery.length?publicGallery.length+' registros publicados':'Novos registros em breve'}</strong></div>
      {publicGallery.length>0?<div className="eventGalleryCards">
       {publicGallery.map((item,index)=><article className="eventGalleryCard" key={item.id}>
        <span>{String(index+1).padStart(2,'0')}</span>
        <div><small>{item.event_type||'EVENTO RODADA'}</small><h3>{item.title||'Momento Rodada'}</h3><p>{item.city||'Oeste da Bahia'}{item.event_date?' · '+new Date(item.event_date+'T12:00:00').toLocaleDateString('pt-BR'):''}</p></div>
       </article>)}
      </div>:socialProofLoaded&&<p className="socialEmpty">Novos eventos e registros da Rodada serão publicados aqui.</p>}
     </div>

     <div className="testimonialsPublic">
      <div className="socialSubhead"><small>DEPOIMENTOS</small><strong>{publicTestimonials.length?publicTestimonials.length+' avaliações aprovadas':'Experiências de clientes'}</strong></div>
      {publicTestimonials.length>0?<div className="testimonialCards">
       {publicTestimonials.map(item=><blockquote className="testimonialCard" key={item.id}>
        <div className="testimonialStars" aria-label={(item.rating||5)+' de 5 estrelas'}>{'★'.repeat(Math.max(1,Math.min(5,item.rating||5)))}</div>
        <p>“{item.body}”</p>
        <footer><strong>{item.name||'Cliente Rodada'}</strong><span>{item.city||'Bahia'}</span></footer>
       </blockquote>)}
      </div>:socialProofLoaded&&<p className="socialEmpty">Os depoimentos aprovados no painel administrativo aparecerão nesta seção.</p>}
     </div>
    </div>
   </section>


   <section className="faqPublic section" id="faq" aria-labelledby="faq-title">
    <Reveal className="faqPublicHead">
     <div><p className="eyebrow dark">DÚVIDAS FREQUENTES</p><h2 id="faq-title">ANTES DA RODADA,<br/><em>TIRE SUAS DÚVIDAS.</em></h2></div>
     <p>As respostas abaixo são controladas pelo painel administrativo e exibem somente as perguntas publicadas.</p>
    </Reveal>
    {publicFaqs.length>0?<div className="faqPublicList">
     {publicFaqs.map(item=><details className="faqPublicItem" key={item.id}>
      <summary><span>{item.category||'GERAL'}</span><strong>{item.question}</strong><i aria-hidden>+</i></summary>
      <div><p>{item.answer}</p></div>
     </details>)}
    </div>:faqLoaded&&<p className="socialEmpty">As perguntas frequentes serão publicadas aqui.</p>}
   </section>


   <section className="contact section" id="contato">
    <Reveal><p className="eyebrow dark">FALE COM A RODADA</p><h2>BORA TOMAR<br/>UMA <em>RODADA?</em></h2><p>Fale com a Cervejaria Rodada para consultar produtos, barris, eventos e disponibilidade na sua região.</p></Reveal>
    <Reveal className="contactBox"><div><small>COMERCIAL</small><strong>(77) 9814-0440</strong></div><button type="button" className="contactOrderButton" onClick={()=>openOrder()}>PEDIR PELO WHATSAPP <Arrow/></button><a href="mailto:contato@cervejariarodada.com.br">contato@cervejariarodada.com.br <Arrow/></a></Reveal>
   </section>
  </main>

  {orderOpen&&<div className="orderOverlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOrderOpen(false)}}>
    <aside className="orderPanel" role="dialog" aria-modal="true" aria-labelledby="order-title">
      <div className="orderPanelTop"><div><small>FAÇA SUA ESCOLHA</small><h2 id="order-title">QUAL DAS NOSSAS<br/><em>RODADAS</em> VOCÊ VAI<br/>LEVAR HOJE?</h2></div><button type="button" className="orderClose" onClick={()=>setOrderOpen(false)} aria-label="Fechar painel">×</button></div>
      <p className="orderIntro">Escolha o produto, defina a quantidade e, em seguida, continuamos o atendimento pelo WhatsApp com sua seleção já preenchida. Cervejas podem ser escolhidas em fardos de 6 unidades.</p>
      <div className="orderOptions">
        {['Chopps','Cervejas','Barril + Chopeira'].map(group=><div className="orderGroup" key={group}>
          <span>{group}</span>
          <div className="orderGrid">
            {orderProducts.filter(product=>product.group===group).map(product=>{
              const selected=selectedOrders.includes(product.id);
              const quantity=orderQuantities[product.id]||1;
              const beer=isBeerOrder(product.id);
              return <div className={'orderProductChoice '+(selected?'selected':'')} key={product.id}>
                <button type="button" className={'orderOption '+(selected?'selected':'')} onClick={()=>toggleOrder(product.id)} aria-pressed={selected}>
                  {product.image&&<span className="orderThumb"><Image src={product.image} alt="" width={120} height={160} quality={50} loading="lazy" sizes="64px"/></span>}
                  <span className="orderOptionCopy"><b>{product.name}</b><small>{product.meta}</small></span>
                  <i aria-hidden>{selected?'✓':'+'}</i>
                </button>
                {selected&&<div className="orderQuantity">
                  <div><small>{beer?'QUANTIDADE DE FARDOS':'QUANTIDADE'}</small><strong>{beer?quantity+' '+(quantity===1?'fardo':'fardos')+' · '+(quantity*6)+' unidades':quantity+' '+(quantity===1?'unidade':'unidades')}</strong></div>
                  <div className="orderQuantityControls" role="group" aria-label={'Quantidade de '+product.name}>
                    <button type="button" onClick={()=>changeOrderQuantity(product.id,-1)} disabled={quantity<=1} aria-label={'Diminuir quantidade de '+product.name}>−</button>
                    <span>{quantity}</span>
                    <button type="button" onClick={()=>changeOrderQuantity(product.id,1)} disabled={quantity>=99} aria-label={'Aumentar quantidade de '+product.name}>+</button>
                  </div>
                </div>}
              </div>
            })}
          </div>
        </div>)}
      </div>
      <div className="orderGroup orderCustom">
        <span>Personalizado</span>
        <button type="button" className={'orderOption '+(selectedOrders.includes('Pedido personalizado')?'selected':'')} onClick={()=>toggleOrder('Pedido personalizado')} aria-pressed={selectedOrders.includes('Pedido personalizado')}>
          <span className="orderOptionCopy"><b>Pedido personalizado</b><small>Conte para a Rodada exatamente o que você precisa.</small></span>
          <i aria-hidden>{selectedOrders.includes('Pedido personalizado')?'✓':'+'}</i>
        </button>
      </div>
      <div className="orderGroup orderCityGroup">
        <span>Onde você está?</span>
        <div className="orderCityGrid" role="group" aria-label="Escolha a cidade de entrega">
          {['Brasília - DF','Taguatinga - TO','Bom Jesus - PI','Dianópolis - TO','Outra cidade'].map(city=><button type="button" key={city} className={'orderCityOption '+(orderCity===city?'selected':'')} onClick={()=>selectCity(city)} aria-pressed={orderCity===city}>{city}</button>)}
        </div>
        {orderCity==='Outra cidade'&&<div className="orderCepBox">
          <label htmlFor="order-cep">Informe seu CEP</label>
          <div className="orderCepRow">
            <input id="order-cep" inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" maxLength={9} value={orderCep} onChange={e=>{
              const digits=e.target.value.replace(/\D/g,'').slice(0,8);
              setOrderCep(digits.length>5?digits.slice(0,5)+'-'+digits.slice(5):digits);
              setCepCity('');
              setCepStatus('idle');
            }} onBlur={()=>{if(orderCep.replace(/\D/g,'').length===8)lookupCep()}}/>
            <button type="button" onClick={lookupCep} disabled={cepStatus==='loading'}>{cepStatus==='loading'?'BUSCANDO...':'BUSCAR CIDADE'}</button>
          </div>
          {cepStatus==='success'&&<p className="cepFeedback success">Cidade encontrada: <strong>{cepCity}</strong></p>}
          {cepStatus==='error'&&<p className="cepFeedback error">Não encontramos esse CEP. Confira os números e tente novamente.</p>}
        </div>}
      </div>
      <div className="orderFooter"><div>{selectedOrders.length?<><small>VOCÊ ESCOLHEU</small><strong>{selectedOrders.length} {selectedOrders.length===1?'item':'itens'}{chosenCity?' · '+chosenCity:''}</strong></>:<><small>ESCOLHA SEUS PRODUTOS</small><strong>Você pode selecionar mais de um.</strong></>}</div><button type="button" className="primary orderContinue" disabled={!canContinueOrder} onClick={continueOrder}>{!orderCity?'ESCOLHA SUA CIDADE':orderCity==='Outra cidade'&&!cepCity?'INFORME SEU CEP':'CONTINUAR NO WHATSAPP'} <Arrow/></button></div>
    </aside>
  </div>}

  <a className="whatsappFloat" href={wa('Olá! Gostaria de fazer um pedido ou tirar uma dúvida sobre a Cervejaria Rodada.')} target="_blank" rel="noreferrer" aria-label="Falar com a Cervejaria Rodada pelo WhatsApp"><span>WhatsApp</span><b>↗</b></a>

  <footer className="footer section">
   <div className="footerTop"><div><div className="brand big"><b>RODADA</b></div><p>Naturalmente baiana.<br/>Orgulhosamente do Oeste da Bahia.</p></div><div><b>EXPLORE</b><a href="#chopes">Chopps</a><a href="#cervejas">Cervejas</a><a href="#eventos">Eventos</a></div><div><b>CONTATO</b><a href="mailto:contato@cervejariarodada.com.br">E-mail</a><a href="https://www.instagram.com/cervejariarodada/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="/legal">Políticas e termos</a></div></div>
   <div className="footerWord">A VIDA PEDE RODADA.</div>
   <div className="footerBottom"><span>© {new Date().getFullYear()} Cervejaria Rodada Ltda.</span><b>BEBA COM MODERAÇÃO.</b><span>Conteúdo destinado a maiores de 18 anos.</span></div>
  </footer>
 </div>
}
