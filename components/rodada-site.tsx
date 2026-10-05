'use client';

import {useEffect,useState} from 'react';
import EventLeadForm from './event-lead-form';
import {formatVolume} from '@/lib/fallback-data';
import type {PublicProduct,PublicSiteData} from '@/lib/types';

const placeholder={
 src:'/placeholders/rodada-placeholder-960.webp',
 srcSet:'/placeholders/rodada-placeholder-480.webp 480w, /placeholders/rodada-placeholder-960.webp 960w, /placeholders/rodada-placeholder-1440.webp 1440w'
};

function PlaceholderImage({alt,className='',sizes='(max-width: 760px) 92vw, 50vw',priority=false}:{alt:string;className?:string;sizes?:string;priority?:boolean}){
 return <img src={placeholder.src} srcSet={placeholder.srcSet} sizes={sizes} width={960} height={720} alt={alt} className={className} loading={priority?'eager':'lazy'} decoding="async" fetchPriority={priority?'high':'auto'}/>;
}

// Fotos oficiais ausentes usam placeholder neutro até substituição confirmada.
function Arrow(){return <span aria-hidden>↗</span>}
function Reveal({children,className='',...props}:React.HTMLAttributes<HTMLDivElement>){return <div className={className} {...props}>{children}</div>}

function productTone(product:PublicProduct){
 const key=(product.style||product.name).toLowerCase();
 if(key.includes('pilsen'))return 'pilsen';
 if(key.includes('ipa'))return 'ipa';
 if(key.includes('lager'))return 'lager';
 return product.category==='cerveja'?'beer-lager':'lager';
}

function mediaFor(product:PublicProduct){
 const image=product.images[0];
 return {src:image?.url||placeholder.src,alt:image?.alt||('Foto oficial de '+product.name+' pendente')};
}

function MediaImage({src,alt,className='',sizes='(max-width: 760px) 80vw, 40vw'}:{src:string;alt:string;className?:string;sizes?:string}){
 if(src.startsWith('/placeholders/'))return <PlaceholderImage alt={alt} className={className} sizes={sizes}/>;
 return <img src={src} alt={alt} className={className} loading="lazy" decoding="async"/>;
}

export default function RodadaSite({data}:{data:PublicSiteData}){
 const [menu,setMenu]=useState(false);
 const [ageVerified,setAgeVerified]=useState<boolean|null>(null);
 const [cookieChoice,setCookieChoice]=useState<'accepted'|'rejected'|null>(null);
 const [eventGuests,setEventGuests]=useState(50);
 const [eventHours,setEventHours]=useState(4);
 const [eventProfile,setEventProfile]=useState<'leve'|'moderado'|'alto'>('moderado');
 const [orderOpen,setOrderOpen]=useState(false);
 const [selectedOrders,setSelectedOrders]=useState<string[]>([]);
 const [orderQuantities,setOrderQuantities]=useState<Record<string,number>>({});
 const [orderCity,setOrderCity]=useState('');
 const [orderCep,setOrderCep]=useState('');
 const [cepCity,setCepCity]=useState('');
 const [cepStatus,setCepStatus]=useState<'idle'|'loading'|'success'|'error'>('idle');
 const choppProducts=data.products.filter(product=>product.category==='chope').map(product=>{
  const media=mediaFor(product);
  const size=formatVolume(product.volumeMl)||'';
  return {id:product.id,slug:product.slug,name:product.name,size,meta:[product.packaging,size].filter(Boolean).join(' '),flavor:(product.style||'Chope').toUpperCase(),image:media.src,imageAlt:media.alt,tone:productTone(product),photo:true};
 });
 const beerProducts=data.products.filter(product=>product.category==='cerveja').map(product=>{
  const media=mediaFor(product);
  return {id:product.id,slug:product.slug,name:product.name,meta:product.packaging||'CERVEJA',image:media.src,imageAlt:media.alt,tone:'beer-'+productTone(product)};
 });
 const orderProducts=[
  ...choppProducts.map(item=>({id:item.name+' '+item.size,name:item.name+' '+item.size,meta:item.flavor+' · '+item.size,image:item.image,imageAlt:item.imageAlt,group:'Chopes'})),
  ...beerProducts.map(item=>({id:item.name,name:item.name,meta:item.meta,image:item.image,imageAlt:item.imageAlt,group:'Cervejas'})),
  {id:'Barril de Chopp Rodada 30 L',name:'Barril de Chopp Rodada 30 L',meta:'BARRIL 30 L',image:placeholder.src,imageAlt:'Foto oficial do barril Rodada pendente',group:'Barril + Chopeira'},
  {id:'Barril de Chopp Rodada 50 L',name:'Barril de Chopp Rodada 50 L',meta:'BARRIL 50 L',image:placeholder.src,imageAlt:'Foto oficial do barril Rodada pendente',group:'Barril + Chopeira'},
  {id:'Chopeira Rodada',name:'Chopeira Rodada',meta:'CHOPEIRA PARA EVENTOS',image:placeholder.src,imageAlt:'Foto oficial da chopeira Rodada pendente',group:'Barril + Chopeira'}
 ];
 const whatsapp=(data.settings.whatsapp||'').replace(/\D/g,'');
 const wa=(message:string)=>whatsapp?'https://wa.me/'+whatsapp+'?text='+encodeURIComponent(message):'#contato';
 const hasPracticalInfo=Boolean(data.settings.address||data.settings.openingHours||data.settings.deliveryArea||data.settings.leadTimes||data.settings.fees||data.settings.paymentMethods);

 useEffect(()=>{
  const age=window.localStorage.getItem('rodada_age_verified');
  setAgeVerified(age==='yes');
  const cookie=window.localStorage.getItem('rodada_cookie_choice');
  if(cookie==='accepted'||cookie==='rejected')setCookieChoice(cookie);
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
 const isBeerOrder=(product:string)=>beerProducts.some(item=>item.name===product);
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
 const litersPerPersonHour=eventProfile==='leve'?.45:eventProfile==='alto'?.8:.6;
 const estimatedLiters=Math.max(10,Math.ceil((eventGuests*eventHours*litersPerPersonHour)/10)*10);
 const suggestedKegs=estimatedLiters<=30?'1 barril de 30 L':estimatedLiters<=50?'1 barril de 50 L':Math.ceil(estimatedLiters/50)+' barris de 50 L';
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
    <div><button type="button" onClick={()=>{localStorage.setItem('rodada_cookie_choice','rejected');setCookieChoice('rejected')}}>SÓ ESSENCIAIS</button><button type="button" className="primary" onClick={()=>{localStorage.setItem('rodada_cookie_choice','accepted');setCookieChoice('accepted')}}>ACEITAR MÉTRICAS</button></div>
  </div>}
  <a className="skipLink" href="#conteudo">Pular para o conteúdo</a>
  <header className="nav">
   <a href="#inicio" className="brand" aria-label="Cervejaria Rodada — início"><b>RODADA</b><small>PURO MALTE</small></a>
   <nav id="menu-principal" className={menu?'open':''} aria-label="Navegação principal">
    <a href="#chopes" onClick={()=>setMenu(false)}>Chopes</a><a href="#cervejas" onClick={()=>setMenu(false)}>Cervejas</a><a href="#eventos" onClick={()=>setMenu(false)}>Eventos</a>{(data.team.length>0||data.settings.story)&&<a href={data.team.length>0?'#equipe':'#historia'} onClick={()=>setMenu(false)}>A Rodada</a>}<a href="#contato" onClick={()=>setMenu(false)}>Contato</a>
   </nav>
   <button type="button" className="navCta" onClick={()=>openOrder()}>PEDIR PELO WHATSAPP <Arrow/></button>
   <button type="button" className="menu" onClick={()=>setMenu(!menu)} aria-label={menu?'Fechar menu':'Abrir menu'} aria-expanded={menu} aria-controls="menu-principal"><i/><i/></button>
  </header>

  <main id="conteudo">
   <section className="hero" id="inicio">
    <div className="heroNoise"/>
    <div className="heroCopy">
     <p className="eyebrow">NATURALMENTE BRASILEIRA</p>
     <h1>A SUA FESTA.<br/>A NOSSA<br/><span>RODADA.</span></h1>
     <p className="lead">Chopp puro malte do Oeste da Bahia, feito para transformar bons encontros em grandes momentos.</p>
     <div className="actions heroActions"><a href="#chopes" className="primary">VER CHOPES <Arrow/></a><a href="#cervejas" className="secondary">Ver cervejas ↓</a><a href="#eventos" className="secondary">Quero chope para meu evento ↓</a></div>
    </div>
    <div className="heroStage">
      <div className="orbit"/>
      <span className="ghost">PURO<br/>MALTE</span>
      <PlaceholderImage alt="Foto oficial do barril Rodada pendente" className="heroKeg" priority sizes="(max-width: 760px) 72vw, 45vw"/>

      <div className="seal">DO OESTE<br/><b>DA BAHIA</b></div>
    </div>
    <div className="heroFoot"><span>↓ A próxima Rodada começa aqui</span><span>BEBA COM MODERAÇÃO.</span></div>
   </section>

   <section className="products section" id="chopes" aria-labelledby="chopes-title">
    <Reveal className="sectionTitle commerceTitle">
      <div><p className="eyebrow dark">01 / CHOPES RODADA</p><h2 id="chopes-title">ESCOLHA SEU<br/><em>CHOPP RODADA.</em></h2></div>
      <div className="sectionIntro"><p>Lager, Pilsen e Session IPA em formatos práticos para levar para casa ou reunir a turma.</p><a href={wa('Olá! Gostaria de saber quais chopes Rodada estão disponíveis hoje.')} target="_blank" rel="noreferrer">Consultar disponibilidade <Arrow/></a></div>
    </Reveal>
    <div className="variationGrid" aria-label="Chopes Rodada">
      {choppProducts.map((item,index)=>(
        <Reveal key={item.name+item.size} className={'variationCard '+item.tone}>
          <div className="variationTop"><span>{String(index+1).padStart(2,'0')} / 06</span><span>{item.meta}</span></div>
          <div className="variationVisual">
            <span className="variationFlavor" aria-hidden="true">{item.flavor}</span>
            <div className={item.photo?'mockBottle photoAsset':'mockBottle'}>
              <MediaImage src={item.image} alt={item.imageAlt}/>
              {item.photo?null:<div className="mockLabel"><b>RODADA</b><small>{item.flavor}</small><em>{item.size}</em></div>}
            </div>
          </div>
          <div className="variationBottom"><div><h3>{item.name}</h3><p>{item.size} · consulte disponibilidade</p><a className="productDetailLink" href={'/produtos/'+item.slug}>VER DETALHES <Arrow/></a></div><button type="button" className="cardAction" onClick={()=>openOrder(item.name+' '+item.size)} aria-label={'Pedir '+item.name+' '+item.size}>PEDIR <Arrow/></button></div>
        </Reveal>
      ))}
    </div>
   </section>

   <section className="beerSection section" id="cervejas" aria-labelledby="cervejas-title">
    <Reveal className="sectionTitle commerceTitle">
      <div><p className="eyebrow dark">02 / CERVEJAS RODADA</p><h2 id="cervejas-title">A RODADA<br/><em>TAMBÉM EM CERVEJA.</em></h2></div>
      <div className="sectionIntro"><p>Long neck ou lata: escolha o formato e consulte a disponibilidade atual diretamente com a Rodada.</p><a href={wa('Olá! Gostaria de saber quais cervejas Rodada estão disponíveis.')} target="_blank" rel="noreferrer">Ver disponibilidade <Arrow/></a></div>
    </Reveal>
    <div className="beerGrid">
      {beerProducts.map((item,index)=>(
        <Reveal key={item.name} className={'beerCard '+item.tone}>
          <div className="beerCopy"><span>0{index+1} / 02 · {item.meta}</span><h3>{item.name}</h3><p>Uma nova forma de levar a identidade Rodada para diferentes momentos.</p><a className="productDetailLink" href={'/produtos/'+item.slug}>VER DETALHES <Arrow/></a><button type="button" className="beerOrderButton" onClick={()=>openOrder(item.name)}>PEDIR PELO WHATSAPP <Arrow/></button></div>
          <div className="beerVisual"><span aria-hidden="true">{item.meta}</span>{item.image&&<MediaImage src={item.image} alt={item.imageAlt}/>}</div>
        </Reveal>
      ))}
    </div>
   </section>

   <section className="eventSolutions section" id="eventos" aria-labelledby="eventos-title">
    <Reveal className="eventSolutionsHead">
      <div>
        <p className="eyebrow">03 / EVENTOS RODADA</p>
        <h2 id="eventos-title">SEU EVENTO.<br/><em>NOSSA ESTRUTURA.</em></h2>
      </div>
      <p>Para aniversários, casamentos, confraternizações e eventos empresariais, a Rodada oferece barris, chopeiras, suporte e atendimento para manter o chopp fluindo do começo ao fim.</p>
    </Reveal>

    <div className="eventSolutionsGrid">
      <Reveal className="eventSolutionCard eventSolutionHero">
        <div className="eventSolutionMeta"><span>01</span><span>CHOPEIRA RODADA</span></div>
        <div className="eventSolutionVisual">
          <span className="eventSolutionWord">CHOPEIRA</span>
          <PlaceholderImage alt="Foto oficial da chopeira Rodada pendente"/>
        </div>
        <div className="eventSolutionCopy"><h3>Chopeira Rodada</h3><p>Serviço na temperatura certa, com presença visual da marca e experiência de chopp tirado na hora.</p></div>
      </Reveal>

      <Reveal className="eventSolutionCard">
        <div className="eventSolutionMeta"><span>02</span><span>BARRIL / KEG</span></div>
        <div className="eventSolutionVisual">
          <span className="eventSolutionWord">BARRIL</span>
          <PlaceholderImage alt="Foto oficial dos barris Rodada pendente"/>
        </div>
        <div className="eventSolutionCopy"><h3>Barris Rodada</h3><p>Volume para encontros maiores, festas e operações que precisam manter a Rodada fluindo por mais tempo.</p></div>
      </Reveal>

      <Reveal className="eventSolutionCard eventSolutionCombo">
        <div className="eventSolutionMeta"><span>03</span><span>SUPORTE NO EVENTO</span></div>
        <div className="eventSolutionVisual">
          <span className="eventSolutionWord">KIT</span>
          <PlaceholderImage alt="Foto real da equipe em evento pendente"/>
        </div>
        <div className="eventSolutionCopy"><h3>Suporte para servir</h3><p>Equipe Rodada para auxiliar na operação, manutenção e troca de barris quando necessário.</p></div>
      </Reveal>

      <Reveal className="eventSolutionCard eventSolutionService">
        <a className="eventSolutionLink" href={wa('Olá! Eu quero fazer um orçamento personalizado para o meu evento. Pode me ajudar?')} target="_blank" rel="noreferrer" aria-label="Solicitar orçamento personalizado pelo WhatsApp">
          <div className="eventSolutionMeta"><span>04</span><span>ATENDIMENTO</span></div>
          <div className="eventSolutionVisual serviceVisual">
            <span className="eventSolutionWord">EVENTO</span>
            <PlaceholderImage alt="Foto real de planejamento de evento pendente"/>
          </div>
          <div className="eventSolutionCopy"><h3>Orçamento personalizado</h3><p>Conte o tipo de evento e a necessidade. A Rodada orienta a estrutura adequada e segue o atendimento pelo WhatsApp.</p><span className="eventSolutionAction">SOLICITAR ORÇAMENTO <Arrow/></span></div>
        </a>
      </Reveal>
    </div>

    <Reveal className="eventSteps" aria-label="Como pedir orçamento para evento">
      <div><span>01</span><strong>Conte sobre o evento</strong><p>Data, cidade, tipo de ocasião e quantidade estimada de pessoas.</p></div>
      <div><span>02</span><strong>A Rodada orienta a estrutura</strong><p>Barris, chopeiras e suporte conforme a necessidade.</p></div>
      <div><span>03</span><strong>Receba o orçamento</strong><p>Converse diretamente com a equipe e alinhe os detalhes.</p></div>
    </Reveal>
    <Reveal className="eventSolutionsCta">
      <div><small>VAI FAZER UM EVENTO?</small><strong>Peça seu orçamento sem burocracia.</strong></div>
      <a href={wa('Olá! Gostaria de solicitar um orçamento de chope para um evento.')} target="_blank" rel="noreferrer" className="primary">SOLICITAR ORÇAMENTO <Arrow/></a>
    </Reveal>
    <Reveal className="eventCalculator" aria-labelledby="calc-title">
      <div className="eventCalcIntro">
        <p className="eyebrow">CALCULADORA DE EVENTO</p>
        <h3 id="calc-title">QUANTOS LITROS<br/>EU PRECISO?</h3>
        <p>Faça uma estimativa inicial. O resultado é apenas uma referência de planejamento; a equipe Rodada confirma a quantidade ideal no orçamento.</p>
      </div>
      <div className="eventCalcControls">
        <label>Convidados <strong>{eventGuests}</strong><input type="range" min="10" max="300" step="10" value={eventGuests} onChange={e=>setEventGuests(Number(e.target.value))}/></label>
        <label>Duração <strong>{eventHours} h</strong><input type="range" min="2" max="12" step="1" value={eventHours} onChange={e=>setEventHours(Number(e.target.value))}/></label>
        <fieldset><legend>Perfil de consumo</legend>{(['leve','moderado','alto'] as const).map(profile=><button key={profile} type="button" className={eventProfile===profile?'active':''} onClick={()=>setEventProfile(profile)}>{profile}</button>)}</fieldset>
      </div>
      <div className="eventCalcResult">
        <small>ESTIMATIVA</small><strong>{estimatedLiters} L</strong><span>{suggestedKegs}</span>
        <p>Cálculo: convidados × horas × fator de consumo ({litersPerPersonHour.toFixed(2).replace('.',',')} L/pessoa/h), arredondado para cima em blocos de 10 L.</p>
        <a className="primary" href={wa('Olá! Usei a calculadora do site para um evento com '+eventGuests+' convidados por '+eventHours+' horas. A estimativa foi de '+estimatedLiters+' L. Quero confirmar a quantidade e pedir um orçamento.')} target="_blank" rel="noreferrer">CONFIRMAR COM A RODADA <Arrow/></a>
      </div>
    </Reveal>
    <EventLeadForm/>
   </section>

   <section className="cold section">
    <Reveal><p className="eyebrow">04 / DESTAQUE RODADA</p><h2>GELADA.<br/>DO JEITO<br/><em>CERTO.</em></h2><p className="lead">Chopp gelado, identidade Rodada e formatos para diferentes momentos.</p><a className="coldCta" href="#chopes">VER TODOS OS CHOPES <Arrow/></a></Reveal>
    <Reveal className="coldStage"><span>1,5<small>L</small></span><div className="rings"/></Reveal>
   </section>

   <section className="lifestyle section">
    <Reveal className="sectionTitle"><div><p className="eyebrow dark">05 / FEITA PARA COMPARTILHAR</p><h2>TODA HISTÓRIA BOA<br/>COMEÇA COM <em>UMA RODADA.</em></h2></div></Reveal>
    <div className="lifeGrid">
      <div className="lifeMain scrollPhoto"><strong>BORA<br/>BRINDAR?</strong><PlaceholderImage alt="Foto lifestyle oficial da Rodada pendente"/></div>
      <div className="lifeQuote scrollPhoto"><span>MAIS<br/>MUITO</span><p>Mais encontro. Mais conversa. Mais motivo para reunir.</p></div>
      <div className="lifeProduct scrollPhoto"><PlaceholderImage alt="Foto oficial do copo Rodada pendente"/><span>PURO MALTE · PURA RODADA</span></div>
    </div>
   </section>

   {data.settings.story&&<section className="team section" id="historia">
     <Reveal className="teamCopy"><p className="eyebrow">06 / NOSSA HISTÓRIA</p><h2>DO OESTE<br/>PARA A <em>RODADA.</em></h2><p>{data.settings.story}</p></Reveal>
   </section>}
   {data.team.length>0&&<section className="team section" id="equipe">
     <Reveal className="teamCopy"><p className="eyebrow">07 / QUEM FAZ ACONTECER</p><h2>CONHEÇA<br/>NOSSA <em>EQUIPE.</em></h2></Reveal>
     <div className="teamMembers">{data.team.map(member=><article key={member.id} className="teamMember">{member.photoUrl&&<MediaImage src={member.photoUrl} alt={member.photoAlt||('Foto de '+member.name)}/>}<h3>{member.name}</h3>{member.role&&<p>{member.role}</p>}</article>)}</div>
   </section>}

   {hasPracticalInfo&&<section className="practical section" id="informacoes">
    <p className="eyebrow dark">INFORMAÇÕES PRÁTICAS</p><h2>ANTES DA<br/><em>SUA RODADA.</em></h2>
    <div className="practicalGrid">
      {data.settings.address&&<div><small>ONDE ESTAMOS</small><p>{data.settings.address}</p></div>}
      {data.settings.deliveryArea&&<div><small>ÁREA DE ENTREGA</small><p>{data.settings.deliveryArea}</p></div>}
      {data.settings.leadTimes&&<div><small>PRAZOS</small><p>{data.settings.leadTimes}</p></div>}
      {data.settings.fees&&<div><small>TAXAS</small><p>{data.settings.fees}</p></div>}
      {data.settings.paymentMethods&&<div><small>PAGAMENTO</small><p>{data.settings.paymentMethods}</p></div>}
    </div>
   </section>}
   {data.faqs.length>0&&<section className="faq section" id="faq">
    <p className="eyebrow dark">DÚVIDAS FREQUENTES</p><h2>FAQ<br/><em>RODADA.</em></h2>
    <div className="faqList">{data.faqs.map(item=><details key={item.id}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
   </section>}
   <section className="contact section" id="contato">
    <Reveal><p className="eyebrow dark">07 / FALE COM A RODADA</p><h2>BORA TOMAR<br/>UMA <em>RODADA?</em></h2><p>Fale com a Cervejaria Rodada para consultar produtos, barris, eventos e disponibilidade na sua região.</p></Reveal>
    <Reveal className="contactBox">{data.settings.phone&&<div><small>COMERCIAL</small><strong>{data.settings.phone}</strong></div>}<button type="button" className="contactOrderButton" onClick={()=>openOrder()}>PEDIR PELO WHATSAPP <Arrow/></button>{data.settings.email&&<a href={'mailto:'+data.settings.email}>{data.settings.email} <Arrow/></a>}</Reveal>
   </section>
  </main>

  {orderOpen&&<div className="orderOverlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOrderOpen(false)}}>
    <aside className="orderPanel" role="dialog" aria-modal="true" aria-labelledby="order-title">
      <div className="orderPanelTop"><div><small>FAÇA SUA ESCOLHA</small><h2 id="order-title">QUAL DAS NOSSAS<br/><em>RODADAS</em> VOCÊ VAI<br/>LEVAR HOJE?</h2></div><button type="button" className="orderClose" onClick={()=>setOrderOpen(false)} aria-label="Fechar painel">×</button></div>
      <p className="orderIntro">Escolha o produto, defina a quantidade e, em seguida, continuamos o atendimento pelo WhatsApp com sua seleção já preenchida. Cervejas podem ser escolhidas em fardos de 6 unidades.</p>
      <div className="orderOptions">
        {['Chopes','Cervejas','Barril + Chopeira'].map(group=><div className="orderGroup" key={group}>
          <span>{group}</span>
          <div className="orderGrid">
            {orderProducts.filter(product=>product.group===group).map(product=>{
              const selected=selectedOrders.includes(product.id);
              const quantity=orderQuantities[product.id]||1;
              const beer=isBeerOrder(product.id);
              return <div className={'orderProductChoice '+(selected?'selected':'')} key={product.id}>
                <button type="button" className={'orderOption '+(selected?'selected':'')} onClick={()=>toggleOrder(product.id)} aria-pressed={selected}>
                  {product.image&&<span className="orderThumb"><MediaImage src={product.image} alt={product.imageAlt} sizes="72px"/></span>}
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
   <div className="footerTop"><div><div className="brand big"><b>RODADA</b><small>PURO MALTE</small></div><p>Naturalmente brasileira.<br/>Orgulhosamente do Oeste da Bahia.</p></div><div><b>EXPLORE</b><a href="#chopes">Chopes</a><a href="#cervejas">Cervejas</a><a href="#eventos">Eventos</a><a href="#equipe">A Rodada</a></div><div><b>CONTATO</b>{data.settings.email&&<a href={'mailto:'+data.settings.email}>E-mail</a>}{data.settings.socialLinks?.instagram&&<a href={data.settings.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>}{data.legalPages.map(page=><a key={page.slug} href={'/legal/'+page.slug}>{page.title}</a>)}</div></div>
   <div className="footerWord">A VIDA PEDE RODADA.</div>
   <div className="footerBottom"><span>© {new Date().getFullYear()} Cervejaria Rodada Ltda.</span><b>BEBA COM MODERAÇÃO.</b><span>Conteúdo destinado a maiores de 18 anos.</span></div>
  </footer>
 </div>
}
