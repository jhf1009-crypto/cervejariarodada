'use client';

import {useEffect,useState} from 'react';
import EventLeadForm from './event-lead-form';

const img={
 barril:'https://static.wixstatic.com/media/e65861_9902f8972f124cc99b1297a5fc9f6834~mv2.png',
 chopeira:'https://static.wixstatic.com/media/e65861_59be33e4eb2d4667934007c12dac8bb8~mv2.png',
 copo:'https://static.wixstatic.com/media/e65861_0a067da5ca374260bd7d3f63c42d6169~mv2.png',
 people:'https://static.wixstatic.com/media/e65861_8a0413f6b6da41e9893375e88c4b05d8~mv2.png',
 lager15:'/products/temp/chopp-15l-user.webp',
 pilsen15:'/products/temp/chopp-15l-user.webp',
 lager700:'/products/temp/chopp-700ml-user.webp',
 pilsen700:'/products/temp/chopp-700ml-user.webp',
};

const heroTapData='data:image/webp;base64,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';

const canData='data:image/webp;base64,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';

// Imagens demonstrativas temporárias: substituir pelos arquivos oficiais quando forem disponibilizados.
const choppProducts=[
 {name:'Chopp Lager',size:'1,5 L',meta:'PET 1,5 L',flavor:'LAGER',image:'',tone:'lager',photo:false},
 {name:'Chopp Pilsen',size:'1,5 L',meta:'PET 1,5 L',flavor:'PILSEN',image:'',tone:'pilsen',photo:false},
 {name:'Chopp Session IPA',size:'1,5 L',meta:'PET 1,5 L',flavor:'SESSION IPA',image:'',tone:'ipa',photo:false},
 {name:'Chopp Lager',size:'700 ml',meta:'PET 700 ML',flavor:'LAGER',image:'',tone:'lager',photo:false},
 {name:'Chopp Pilsen',size:'700 ml',meta:'PET 700 ML',flavor:'PILSEN',image:'',tone:'pilsen',photo:false},
 {name:'Chopp Session IPA',size:'700 ml',meta:'PET 700 ML',flavor:'SESSION IPA',image:'',tone:'ipa',photo:false}
];

const beerProducts=[
 {name:'Cerveja Rodada Lager',meta:'600 ML',style:'LAGER',image:'',tone:'beer-lager'},
 {name:'Cerveja Rodada Pilsen',meta:'600 ML',style:'PILSEN',image:'',tone:'beer-pilsen'},
 {name:'Cerveja Rodada Lager',meta:'600 ML',style:'LAGER',badge:'SEM GLÚTEN',image:'',tone:'beer-gluten-free'}
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
    <div><button type="button" onClick={()=>{localStorage.setItem('rodada_cookie_choice','rejected');setCookieChoice('rejected')}}>SÓ ESSENCIAIS</button><button type="button" className="primary" onClick={()=>{localStorage.setItem('rodada_cookie_choice','accepted');setCookieChoice('accepted')}}>ACEITAR MÉTRICAS</button></div>
  </div>}
  <a className="skipLink" href="#conteudo">Pular para o conteúdo</a>
  <header className="nav">
   <a href="#inicio" className="brand" aria-label="Cervejaria Rodada — início"><b>RODADA</b><small>PURO MALTE</small></a>
   <nav id="menu-principal" className={menu?'open':''} aria-label="Navegação principal">
    <a href="#chopes" onClick={()=>setMenu(false)}>Chopps</a><a href="#cervejas" onClick={()=>setMenu(false)}>Cervejas</a><a href="#eventos" onClick={()=>setMenu(false)}>Eventos</a><a href="#contato" onClick={()=>setMenu(false)}>Contato</a>
   </nav>
   <button type="button" className="navCta" onClick={()=>openOrder()}>PEDIR PELO WHATSAPP <Arrow/></button>
   <button type="button" className="menu" onClick={()=>setMenu(!menu)} aria-label={menu?'Fechar menu':'Abrir menu'} aria-expanded={menu} aria-controls="menu-principal"><i/><i/></button>
  </header>

  <main id="conteudo">
   <section className="hero" id="inicio">
    <div className="heroNoise"/>
    <div className="heroCopy">
     <p className="eyebrow">NATURALMENTE BAIANA</p>
     <h1>A SUA FESTA.<br/>A NOSSA<br/><span>RODADA.</span></h1>
     <p className="lead">Chopp puro malte do Oeste da Bahia, feito para transformar bons encontros em grandes momentos.</p>
     <div className="heroPioneer" aria-label="Pioneirismo da Cervejaria Rodada">
       <span>UM MARCO NA CERVEJA BAIANA</span>
       <strong>Somos a <em>primeira</em> cervejaria baiana a criar uma cerveja <em>sem glúten</em>.</strong>
       <small>Inovação feita na Bahia, com a identidade da Rodada.</small>
     </div>
     <div className="actions heroActions"><a href="#chopes" className="primary">VER CHOPPS <Arrow/></a><a href="#cervejas" className="secondary">Ver cervejas ↓</a><a href="#eventos" className="secondary">Quero chopp para meu evento ↓</a></div>
    </div>
    <div className="heroStage">
      <div className="orbit"/>
      <span className="ghost">PURO<br/>MALTE</span>
      <img src={img.barril} alt="Barril de Chopp Rodada" className="heroKeg" loading="eager" decoding="async" fetchPriority="high"/>
      <img src={heroTapData} alt="Chopeira Rodada" className="heroTap" loading="eager" decoding="async" fetchPriority="high"/>

      <div className="seal">DO OESTE<br/><b>DA BAHIA</b></div>
    </div>
    <div className="heroFoot"><span>BEBA COM MODERAÇÃO.</span></div>
   </section>

   <section className="products section" id="chopes" aria-labelledby="chopes-title">
    <Reveal className="sectionTitle commerceTitle">
      <div><p className="eyebrow dark">01 / CHOPPS RODADA</p><h2 id="chopes-title">ESCOLHA SEU<br/><em>CHOPP RODADA.</em></h2></div>
      <div className="sectionIntro"><p>Lager, Pilsen e Session IPA em formatos práticos para levar para casa ou reunir a turma.</p><a href={wa('Olá! Gostaria de saber quais chopps Rodada estão disponíveis hoje.')} target="_blank" rel="noreferrer">Consultar disponibilidade <Arrow/></a></div>
    </Reveal>
    <div className="variationGrid" aria-label="Chopps Rodada">
      {choppProducts.map((item,index)=>(
        <Reveal key={item.name+item.size} className={'variationCard '+item.tone}>
          <div className="variationTop"><span>{String(index+1).padStart(2,'0')} / 06</span><span>{item.meta}</span></div>
          <div className="variationVisual">
            <span className="variationFlavor" aria-hidden="true">{item.flavor}</span>
            <div className={item.photo?'mockBottle photoAsset':'mockBottle'}>
              {item.image&&<img src={item.image} alt={item.name+' '+item.size} loading="lazy" decoding="async"/>}
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
          <p className="eyebrow dark">02 / CERVEJAS RODADA</p>
          <h2 id="cervejas-title">CERVEJAS<br/><em>RODADA 600 ML.</em></h2>
        </div>
        <p>Três versões da Rodada em garrafa de 600 ml. As fotos oficiais serão adicionadas depois, sem usar imagens genéricas.</p>
      </Reveal>
      <div className="beerLineupGrid">
        {beerProducts.map((item,index)=>(
          <Reveal key={item.name+(item.badge||'')} className={'beerLineupCard '+item.tone}>
            <div className="beerLineupTop"><span>{String(index+1).padStart(2,'0')} / 03</span><span>{item.meta}</span></div>
            <div className="beerLineupVisual" aria-label={'Espaço reservado para foto de '+item.name+(item.badge?' '+item.badge:'')}>
              <span>FOTO<br/>EM BREVE</span>
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


   <section className="contact section" id="contato">
    <Reveal><p className="eyebrow dark">07 / FALE COM A RODADA</p><h2>BORA TOMAR<br/>UMA <em>RODADA?</em></h2><p>Fale com a Cervejaria Rodada para consultar produtos, barris, eventos e disponibilidade na sua região.</p></Reveal>
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
                  {product.image&&<span className="orderThumb"><img src={product.image} alt="" loading="lazy" decoding="async"/></span>}
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
   <div className="footerTop"><div><div className="brand big"><b>RODADA</b><small>PURO MALTE</small></div><p>Naturalmente baiana.<br/>Orgulhosamente do Oeste da Bahia.</p></div><div><b>EXPLORE</b><a href="#chopes">Chopps</a><a href="#cervejas">Cervejas</a><a href="#eventos">Eventos</a></div><div><b>CONTATO</b><a href="mailto:contato@cervejariarodada.com.br">E-mail</a><a href="https://www.instagram.com/cervejariarodada/" target="_blank" rel="noreferrer">Instagram ↗</a></div></div>
   <div className="footerWord">A VIDA PEDE RODADA.</div>
   <div className="footerBottom"><span>© {new Date().getFullYear()} Cervejaria Rodada Ltda.</span><b>BEBA COM MODERAÇÃO.</b><span>Conteúdo destinado a maiores de 18 anos.</span></div>
  </footer>
 </div>
}
