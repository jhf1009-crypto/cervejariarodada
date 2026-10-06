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

const canData='data:image/webp;base64,UklGRrwLAABXRUJQVlA4ILALAADwMQCdASqXAG4APkkcjEOioaGXWsZoKASEswBnzuiu7yK/RebRZ38J+QeNrPZ3KZOPUr+j/YL51v7eeoT9sfWs9I/+N9Q3+o9TN6Gfl1+y//bMFV/ufbX34+Wf4xKwOL/lv4ris2w/9BwF2YOLDTVY+f+B6sein649g7yzPZwRjTiUKvx9cQJEAT/n9SwNe+zu66JaUysHN/0UfQCjmPhvMnE9EkyaQIPVjzZzS1kiFqYi/gCY+CSRi8TWTGhRWlbQjPEZ/iZXStdn2l2VUMlEeOx706IZN8rgv/bliF4nedPD1JTx085Y/cDGvdBEx1rl5ai3/IMPh+mAKAwhe5nCwKksUEKtWCCoSu3PxjzCnZFxBw4zGCP2LIkCGVljFtLnUNSPskhxi0Atw3G+RL7W029S9TAiOrXNKa+CfbvwIxbEe1jpkJcds8riMOmjzAvym3KbAlEmpI8H13smAxO+jOWsnDTKc8Iz7hf0rRrecJDduAd1mESX1eSwzP/a33CRWY/ADCd1aOQC+TrD0PWHogMynHCr2wAA/lCH7h9+7/RygmrJvIVTMAC1/PPp3F58KrDt8gmu+0xSBwyY8vQb4Z1YC2RTPOgbH6xGJowVLTrGX2/xV4kH1Vh+jn2L7L/Hx5GnzUt4g2F3QZ+bJYniJK+/kb5hCemydP1LpeqZKMVCiI2Ga/zxnXMiiV/u4iJfTbQVSEwzbDubGcht/AB/0Lb7/D9V9taYQ9B4CToEX9t7KE1ARogZdqTClOktLWzH8wfLsMnSCGYYRYbsvhJx6/1Y6lLPnw8s4464bAP+LtP+aWnzsbmZy3URWzfbzr5ihZT6zxJnsnQHEbYjOz45kDyL/jbf1AHVn3IGbsTqvbD6VevIq1iybGLcjiCZCpKOLBL8j0UBmnIRv3NTIR0yZYPWl+L+StGy02gaWpYhpNPmfOAc/GXA119Cs/phQ0ZKEhfkzWomegGEVRKD0yY8jtpeI0yXONoPKOhBvqjDFkYHNjVWan80awX+ZhA/nqc9mN450cCoO70xBC3VPbrf42MQIBDqDS1yuYhn7yziJ5WYSUeMG3hUOBEs4xYK02Rnll+OjO9JiHMK4MK+8349zY56SlN3pU3yxmjj3mY/OlOPsvEQlhzOPbyy2r9MqJN0G51GnzW0uo868uJr+LyVDsrWpLZZIvbPVLDy8IpYqyoYBf7i6CArt1viv6VU8fIlrkUMJpjnotU6Xg+wmT2pvIrDU89n5aDQiwDq7c7EfSUgHHFEGyCZivh8SVCFeyeYrtW0KbCZIqGKfvugF3BghjAvL9j1wySrHxV/wSVhCcB1inA8lTJMbJPxIbWZ1iju9O3pnnbBGgifJyYoFXlcr5OBCwr5D+OpCHjJi/Pdy2JXgmXpMs/6jEC/+4V3fIlh36vPzBzMsCKleRD3Y9Ij+k0s4zP5PSQHM8Dw+AZOMIKPjYWjNBy/YZsSxlNWR4oM1QwEY6uaPMBKURUoid/zG9P08MZ2W8LVMr4iunsfR15is2UN5ub0snt8WepXJ7P+MAza8panbrloDUvDRl/6nlg5Gp9Eu42OHiwK0Q1cHo44K4NDhUU0Y+25lRkvc5suf1t69MnSNbb/cCdKRGyGKuKdMqdAjbalS7RFyIrWw9f0wAFMW/tbOIq7B3EA2/Q7eKbnWGFxQWFfDLAdeCdkozS3doPUQYLuUnHWpbPf3pZLEO5xHoQvbFd1pkqLkm1N4gBMJPOqG3iffFEUkeaHqTiBNqriIYMbm/JFoDO9rcfSKkYbHWMhUHVnBxC5Lv1sDKcHOq8/PrzkWnVzY5wfxJz4YkugclfB+2C9wehio2QcDN8BdVAnhFWL8ge1KUl3NhQ4X5Zr5U0HGu7WKjuCTiaYeexO3zOnobPVVdFzn/q8ooomcbA3NdEpSqVzIIvpaTCP9X+ZuLIJYxquU4UodsiThRGhM9JPWz92amhzXw+fdr7Wj9VPTQsVzffiV5/KW9b9MKVainfsuMUOZ96N9jnYqzeF8fefPjL9763XQsAlPNIu9LQD8zhfeMjyDXwwzwBBautnBpiGFLJ89atIpUnMMuUJprRSVLa4t7atFc86VQ4CGZmsFENcp21JSCiUSnusTF7JfS3dDVgeMC0nfugMEM+ZnFC7/3bhUptcZvrD7lCRC2lpny/p91Z6GUZdtsx7w6ksXIVjLbp4F+D0A2ylA7lPqsH8w/XeaF/fXjvvBB8tTAxx4ndXmQDZOuGZKC6alMF1KnGZ6juB6HazeizM6dzA9U5ADmdGVkAxiNeruzscAajaDBsVS1A9+amCkJYSraYm/xNTGLAOluKuQ3q8RaHkvEUVkJS/WtdqDzr5hIYbVakq6Jx6v4h0xQ5zlZM08agyhIVC+0qv2GnJ7S/GcqvjsISyO7O/G/akG1PHjjeP0OBSIU4mMCg3Di/MXEU8Kwauv0aIsmI8kQhIFol9iCsYf+PMHd3xMZOFMTxHY+X6gcQBoZY5EeLBVvvh477Uv+BGGPUGjDZtpQXHarMq4uc+KCD3Wz2Tg1xC28WmWCFDtJu12MM96tElQ1ZaePPRiW3XtSa+sQwyycv2CyCxmkrSu5v3RdhilB9rBTxi0jwvm/KM4FeuZDYRTxR+3pgzSGvkTGjhkp63MnVGgIBq7xPOdUzQ043lfKAeugM1zbC48+iAbZrDyfyNvR/r+/xdRjl1vFYlchzw7cufwmhDDKZa0sTteo7B9g1uT8CR/UiqUfWYIIo4GaxP+4D70rX4mLQ5tIMYt+aFBwKmSPHtDvD6+a6FU0fnveHaho2cCAGh/MfMsncTBO2zSLHex7gH/d3yP2mWzbniLnVv/3qdtEe9P+CoUYONktTiBzYQjxmK3IUOwLFZ2UIVmnJjFnEzy6aC4SUp3lDDnUtmmwT6G9v3LKy4zSwqOxz/TjR22fQ4dcCEBW/Xthm2369ir2WFGD/BrvqmIyr3IlgJk4r21h9fDv4xYDcK0NNIaPe0iyGDHhSCkvbLZKvFrlvkJcwvvusq6JubyAxmW4WiYCUxHOTt/1MAvl3exi73o3B5YdnKIybmql0imBe3pgmLU5Wqv3mnmZbe9qFpR7QeOaI/dWh+2iV8OzvfMJ6IYrwKWPakDJ+SCZ2IYvQz1zpg3xCKONjT97zHfV2rSuUn//RUbTFr2yXVdIdFBKzkIqsjoRa2EtAzotfKyC6hirYscUaL3G19fjXmqZP4qQN1D6s2RXBHfgbJwvMe8Cu5FO545AZ+f4GGvYrxQPskIEZH5R5ay3GdzXm/V6/782DE3gosYKkJtcRBkRvVT3BkKGq/pJ8dOMMvPDyQUm2quqovyk4ePiIm6va7iLSJBnmauFFrzZL2juwBLMctI/xGsGbABsw6XYDuyRLlFj8Hzu7/cODQLCi22nBqAALwjZU8SUEjFaAW1P2j6L8xbidHk2cMZpOhoJ4/6Z8sB2NRLurbFdHygZgz3v4yOqHRT7LTK8DttTFoVY7cPQPy/usor+BOiz789C/9xm246hv414g50c4rhsGv2itmooGg46FNavkB89GN2L4HB14ggaA4+8WuLXNsLOCNkdOO2jTlSfL8it6ySc1ZWTuxKOG/X8SCgZbF0dArkt6O84diYRvv7xqguipUIB49biVAxSaKvD/O1EJaNwTvxj228Dh0Hf9MVK1LXHLiZYfFJOfFTJL91SYqYJm14wT5ZAbXPYR+GwdT0yI3ARs1keMRSBOOfsyweTR4qc0x0t4oLbTCNJTBTyrLi+sRaei12eoP9O5qysmUc1fbr5ViK+I8BX1X9SsfU3QfQQAAAhJOoHWJ/+lTCPgZe1kBWV7WpCFsWOdSMXjWhBNBHvZeKt+McwCkzPv37uFi4FTC11OYfcZn6guB8y49cSfqw0IELzcfV9oX1PfbO9DLzeFJnXuPiYL8HcuVJJT7Gc1HlrJ0nM0tyWTKq6wFsvLY7/6icQZMJNjLx1IXxSxIKKVuVED/A2AAAAAA';

// Imagens demonstrativas temporárias: substituir pelos arquivos oficiais quando forem disponibilizados.
const choppProducts=[
 {name:'Chopp Lager',size:'1,5 L',meta:'PET 1,5 L',flavor:'LAGER',image:'/events/image.png',tone:'lager',photo:true},
 {name:'Chopp Pilsen',size:'1,5 L',meta:'PET 1,5 L',flavor:'PILSEN',image:'/events/Garrafa%20Gelada%20de%20Cervejaria%20Rodada.png',tone:'pilsen',photo:true},
 {name:'Chopp Session IPA',size:'1,5 L',meta:'PET 1,5 L',flavor:'SESSION IPA',image:'/events/imagem%20generica%20chopp%201%2C5L.jpg',tone:'ipa',photo:true},
 {name:'Chopp Lager',size:'700 ml',meta:'PET 700 ML',flavor:'LAGER',image:'/events/image.png',tone:'lager',photo:true},
 {name:'Chopp Pilsen',size:'700 ml',meta:'PET 700 ML',flavor:'PILSEN',image:'/events/imagem%20generica%20chopp%20700ml.jpg',tone:'pilsen',photo:true},
 {name:'Chopp Session IPA',size:'700 ml',meta:'PET 700 ML',flavor:'SESSION IPA',image:'/events/imagem%20generica%20chopp%20700ml.jpg',tone:'ipa',photo:true}
];

const beerProducts=[
 {name:'Cerveja Rodada Lager',meta:'600 ML',style:'LAGER',image:'',tone:'beer-lager'},
 {name:'Cerveja Rodada Pilsen',meta:'600 ML',style:'PILSEN',image:'',tone:'beer-pilsen'},
 {name:'Cerveja Rodada Lager',meta:'600 ML',style:'LAGER',badge:'SEM GLÚTEN',image:'',tone:'beer-gluten-free'}
];

const orderProducts=[
 ...choppProducts.map(item=>({id:item.name+' '+item.size,name:item.name+' '+item.size,meta:item.flavor+' · '+item.size,image:item.image,group:'Chopes'})),
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
    <a href="#chopes" onClick={()=>setMenu(false)}>Chopes</a><a href="#cervejas" onClick={()=>setMenu(false)}>Cervejas</a><a href="#eventos" onClick={()=>setMenu(false)}>Eventos</a><a href="#equipe" onClick={()=>setMenu(false)}>A Rodada</a><a href="#contato" onClick={()=>setMenu(false)}>Contato</a>
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
       <span>PIONEIRISMO BAIANO</span>
       <strong>A primeira cervejaria baiana a criar uma cerveja sem glúten.</strong>
     </div>
     <div className="actions heroActions"><a href="#chopes" className="primary">VER CHOPES <Arrow/></a><a href="#cervejas" className="secondary">Ver cervejas ↓</a><a href="#eventos" className="secondary">Quero chope para meu evento ↓</a></div>
    </div>
    <div className="heroStage">
      <div className="orbit"/>
      <span className="ghost">PURO<br/>MALTE</span>
      <img src={img.barril} alt="Barril de Chopp Rodada" className="heroKeg" loading="eager" decoding="async" fetchPriority="high"/>

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
              <img src={item.image} alt={item.name+' '+item.size} loading="lazy" decoding="async"/>
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
   </section>

   <section className="team section" id="equipe">
     <Reveal className="teamCopy"><p className="eyebrow">06 / QUEM FAZ ACONTECER</p><h2>CONHEÇA<br/>NOSSA <em>EQUIPE.</em></h2><p>Por trás de cada produto Rodada existe uma equipe comprometida com qualidade, dedicação e paixão pelo que faz. Nosso trabalho é levar sabor, experiência e excelência para cada momento especial dos nossos clientes.</p><span className="signature">GENTE BOA FAZENDO UMA RODADA AINDA MELHOR.</span></Reveal>
     <Reveal className="teamPhoto"><div className="teamImageFrame"><img src="/events/image.png" alt="Equipe Rodada reunida" loading="lazy" decoding="async"/><div><small>GENTE QUE FAZ A RODADA ACONTECER</small><strong>Qualidade, cuidado e presença em cada encontro.</strong></div></div><span>CERVEJARIA RODADA · LUÍS EDUARDO MAGALHÃES · BA</span></Reveal>
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
        {['Chopes','Cervejas','Barril + Chopeira'].map(group=><div className="orderGroup" key={group}>
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
   <div className="footerTop"><div><div className="brand big"><b>RODADA</b><small>PURO MALTE</small></div><p>Naturalmente baiana.<br/>Orgulhosamente do Oeste da Bahia.</p></div><div><b>EXPLORE</b><a href="#chopes">Chopes</a><a href="#cervejas">Cervejas</a><a href="#eventos">Eventos</a><a href="#equipe">A Rodada</a></div><div><b>CONTATO</b><a href="mailto:contato@cervejariarodada.com.br">E-mail</a><a href="https://www.instagram.com/cervejariarodada/" target="_blank" rel="noreferrer">Instagram ↗</a></div></div>
   <div className="footerWord">A VIDA PEDE RODADA.</div>
   <div className="footerBottom"><span>© {new Date().getFullYear()} Cervejaria Rodada Ltda.</span><b>BEBA COM MODERAÇÃO.</b><span>Conteúdo destinado a maiores de 18 anos.</span></div>
  </footer>
 </div>
}
