'use client';

import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion,useScroll,useSpring,useTransform} from 'framer-motion';

const img={
 barril:'https://static.wixstatic.com/media/e65861_9902f8972f124cc99b1297a5fc9f6834~mv2.png',
 chopeira:'https://static.wixstatic.com/media/e65861_59be33e4eb2d4667934007c12dac8bb8~mv2.png',
 copo:'https://static.wixstatic.com/media/e65861_0a067da5ca374260bd7d3f63c42d6169~mv2.png',
 pilsen:'https://static.wixstatic.com/media/e65861_73ba84d3d64d4edfbaa88396fd0d36af~mv2.png',
 gold:'https://static.wixstatic.com/media/e65861_1fc2670a30b842c88522c016dff4ce1d~mv2.png',
 people:'https://static.wixstatic.com/media/e65861_8a0413f6b6da41e9893375e88c4b05d8~mv2.png'
};

const canData='data:image/webp;base64,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';

const choppProducts=[
 {name:'Chopp Lager',size:'1,5 L',meta:'PET 1,5 L',flavor:'LAGER',image:img.pilsen,tone:'lager'},
 {name:'Chopp Pilsen',size:'1,5 L',meta:'PET 1,5 L',flavor:'PILSEN',image:img.pilsen,tone:'pilsen'},
 {name:'Chopp Session IPA',size:'1,5 L',meta:'PET 1,5 L',flavor:'SESSION IPA',image:img.gold,tone:'ipa'},
 {name:'Chopp Lager',size:'700 ml',meta:'PET 700 ML',flavor:'LAGER',image:img.pilsen,tone:'lager'},
 {name:'Chopp Pilsen',size:'700 ml',meta:'PET 700 ML',flavor:'PILSEN',image:img.pilsen,tone:'pilsen'},
 {name:'Chopp Session IPA',size:'700 ml',meta:'PET 700 ML',flavor:'SESSION IPA',image:img.gold,tone:'ipa'}
];

const beerProducts=[
 {name:'Cerveja Rodada Long Neck',meta:'LONG NECK',image:canData,tone:'beer-pilsen'},
 {name:'Cerveja Rodada Lata',meta:'LATA',image:canData,tone:'beer-lager'}
];

const WHATSAPP='557798140440';
const wa=(message:string)=>'https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(message);

function Arrow(){return <span aria-hidden>↗</span>}
function Reveal({children,className='',...props}:React.HTMLAttributes<HTMLDivElement>){return <div data-reveal className={className} {...props}>{children}</div>}

function useIsMobile(){
 const [mobile,setMobile]=useState(false);
 useEffect(()=>{
  const mq=window.matchMedia('(max-width: 760px)');
  const update=()=>setMobile(mq.matches);
  update();
  mq.addEventListener('change',update);
  return()=>mq.removeEventListener('change',update);
 },[]);
 return mobile;
}

function DesktopCameraJourney(){
 const ref=useRef<HTMLElement>(null);
 const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
 const pilsenX=useTransform(scrollYProgress,[0,.22,.38],[0,-70,-250]);
 const pilsenY=useTransform(scrollYProgress,[0,.22,.38],[0,-18,40]);
 const pilsenScale=useTransform(scrollYProgress,[0,.22,.38],[1.02,1.34,.78]);
 const pilsenRotate=useTransform(scrollYProgress,[0,.38],[-5,-13]);
 const pilsenOpacity=useTransform(scrollYProgress,[0,.28,.42],[1,1,.18]);

 const ipaX=useTransform(scrollYProgress,[.22,.46,.64],[250,35,-215]);
 const ipaY=useTransform(scrollYProgress,[.22,.46,.64],[60,-18,30]);
 const ipaScale=useTransform(scrollYProgress,[.22,.46,.64],[.72,1.34,.76]);
 const ipaRotate=useTransform(scrollYProgress,[.22,.64],[12,3]);
 const ipaOpacity=useTransform(scrollYProgress,[.2,.34,.56,.68],[.12,1,1,.15]);

 const lagerX=useTransform(scrollYProgress,[.52,.74,1],[245,20,0]);
 const lagerY=useTransform(scrollYProgress,[.52,.74,1],[80,-10,0]);
 const lagerScale=useTransform(scrollYProgress,[.52,.74,1],[.7,1.38,.9]);
 const lagerRotate=useTransform(scrollYProgress,[.52,1],[-9,2]);
 const lagerOpacity=useTransform(scrollYProgress,[.5,.64,.88,1],[.12,1,1,.78]);

 const bgX=useTransform(scrollYProgress,[0,1],[-60,60]);
 const ringScale=useTransform(scrollYProgress,[0,1],[.88,1.18]);
 const copy1=useTransform(scrollYProgress,[0,.19,.31],[1,1,0]);
 const copy2=useTransform(scrollYProgress,[.24,.38,.55,.66],[0,1,1,0]);
 const copy3=useTransform(scrollYProgress,[.57,.71,1],[0,1,1]);

 const safe=(v:any,fallback:any)=>reduced?fallback:v;

 return <section className="cameraJourney" ref={ref} aria-label="Experiência em scroll dos sabores Rodada">
   <div className="cameraSticky">
    <motion.div className="cameraGrid" style={{x:safe(bgX,0)}}/>
    <motion.div className="cameraRing cameraRingA" style={{scale:safe(ringScale,1)}}/>
    <div className="cameraTopline"><span>SCROLL EXPERIENCE</span><span>PURO MALTE · OESTE DA BAHIA</span></div>

    <div className="cameraRig" aria-hidden="true">
      <motion.div className="cameraProduct cameraPilsen" style={{x:safe(pilsenX,0),y:safe(pilsenY,0),scale:safe(pilsenScale,1),rotate:safe(pilsenRotate,-5),opacity:safe(pilsenOpacity,1)}}>
        <img src={img.pilsen} alt="" loading="lazy" decoding="async"/>
        <span>PILSEN</span>
      </motion.div>
      <motion.div className="cameraProduct cameraIpa" style={{x:safe(ipaX,70),y:safe(ipaY,0),scale:safe(ipaScale,.82),rotate:safe(ipaRotate,8),opacity:safe(ipaOpacity,.45)}}>
        <img src={img.gold} alt="" loading="lazy" decoding="async"/>
        <span>SESSION IPA</span>
      </motion.div>
      <motion.div className="cameraProduct cameraLager" style={{x:safe(lagerX,-70),y:safe(lagerY,0),scale:safe(lagerScale,.82),rotate:safe(lagerRotate,-4),opacity:safe(lagerOpacity,.45)}}>
        <img src={img.pilsen} alt="" loading="lazy" decoding="async"/>
        <img className="cameraGlass" src={img.copo} alt="" loading="lazy" decoding="async"/>
        <span>LAGER</span>
      </motion.div>
    </div>

    <div className="cameraCopy">
      <motion.div className="cameraChapter" style={{opacity:safe(copy1,1)}}>
        <small>01 / PILSEN</small><h2>LEVEZA QUE<br/><em>PEDE MAIS UMA.</em></h2><p>O clássico da Rodada entra em cena primeiro: fresco, direto e feito para compartilhar.</p>
      </motion.div>
      <motion.div className="cameraChapter" style={{opacity:safe(copy2,0)}}>
        <small>02 / SESSION IPA</small><h2>MAIS AROMA.<br/><em>MAIS PRESENÇA.</em></h2><p>A câmera aproxima a Session IPA para revelar uma Rodada com personalidade e um perfil mais intenso.</p>
      </motion.div>
      <motion.div className="cameraChapter" style={{opacity:safe(copy3,0)}}>
        <small>03 / LAGER</small><h2>GELADA.<br/><em>SEM PRESSA.</em></h2><p>O passeio termina na Lager: uma escolha versátil para acompanhar a mesa do começo ao último brinde.</p>
      </motion.div>
    </div>

    <div className="cameraProgress" aria-hidden="true"><motion.i style={{scaleX:scrollYProgress}}/></div>
    <span className="cameraHint">ROLE PARA DIRIGIR A CÂMERA ↓</span>
   </div>
  </section>
}

function MobileCameraJourney(){
 const ref=useRef<HTMLElement>(null);
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
 const pilsenOpacity=useTransform(scrollYProgress,[0,.24,.37],[1,1,0]);
 const ipaOpacity=useTransform(scrollYProgress,[.28,.42,.6,.7],[0,1,1,0]);
 const lagerOpacity=useTransform(scrollYProgress,[.62,.76,1],[0,1,1]);
 const pilsenScale=useTransform(scrollYProgress,[0,.28,.37],[1.02,1.1,.96]);
 const ipaScale=useTransform(scrollYProgress,[.3,.5,.7],[.97,1.1,.97]);
 const lagerScale=useTransform(scrollYProgress,[.64,.82,1],[.97,1.1,1.02]);

 return <section className="cameraJourney mobileCameraJourney" ref={ref} aria-label="Experiência em scroll dos sabores Rodada">
   <div className="cameraSticky">
    <div className="cameraTopline"><span>SCROLL EXPERIENCE</span><span>PURO MALTE · OESTE DA BAHIA</span></div>
    <div className="cameraRig" aria-hidden="true">
      <motion.div className="cameraProduct cameraPilsen" style={{opacity:pilsenOpacity,scale:pilsenScale}}>
        <img src={img.pilsen} alt="" loading="lazy" decoding="async"/>
        <span>PILSEN</span>
      </motion.div>
      <motion.div className="cameraProduct cameraIpa" style={{opacity:ipaOpacity,scale:ipaScale}}>
        <img src={img.gold} alt="" loading="lazy" decoding="async"/>
        <span>SESSION IPA</span>
      </motion.div>
      <motion.div className="cameraProduct cameraLager" style={{opacity:lagerOpacity,scale:lagerScale}}>
        <img src={img.pilsen} alt="" loading="lazy" decoding="async"/>
        <img className="cameraGlass" src={img.copo} alt="" loading="lazy" decoding="async"/>
        <span>LAGER</span>
      </motion.div>
    </div>
    <div className="cameraCopy">
      <motion.div className="cameraChapter" style={{opacity:pilsenOpacity}}><small>01 / PILSEN</small><h2>LEVEZA QUE<br/><em>PEDE MAIS UMA.</em></h2><p>O clássico da Rodada entra em cena primeiro: fresco, direto e feito para compartilhar.</p></motion.div>
      <motion.div className="cameraChapter" style={{opacity:ipaOpacity}}><small>02 / SESSION IPA</small><h2>MAIS AROMA.<br/><em>MAIS PRESENÇA.</em></h2><p>A câmera aproxima a Session IPA para revelar uma Rodada com personalidade e um perfil mais intenso.</p></motion.div>
      <motion.div className="cameraChapter" style={{opacity:lagerOpacity}}><small>03 / LAGER</small><h2>GELADA.<br/><em>SEM PRESSA.</em></h2><p>O passeio termina na Lager: uma escolha versátil para acompanhar a mesa do começo ao último brinde.</p></motion.div>
    </div>
    <div className="cameraProgress" aria-hidden="true"><motion.i style={{scaleX:scrollYProgress}}/></div>
   </div>
  </section>
}

function CameraJourney({mobile}:{mobile:boolean}){return mobile?<MobileCameraJourney/>:<DesktopCameraJourney/>}

function ScrollPhoto({children,className=''}:{children:React.ReactNode,className?:string}){
 const ref=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
 const y=useTransform(scrollYProgress,[0,1],[38,-38]);
 const scale=useTransform(scrollYProgress,[0,.5,1],[.96,1.035,.98]);
 const rotate=useTransform(scrollYProgress,[0,1],[-.8,.8]);
 return <motion.div ref={ref} className={className} style={reduced?undefined:{y,scale,rotate}}>{children}</motion.div>
}

export default function RodadaSite(){
 const [menu,setMenu]=useState(false);
 const reduced=useReducedMotion();
 const mobile=useIsMobile();
 const {scrollYProgress}=useScroll();
 const progress=useSpring(scrollYProgress,{stiffness:140,damping:30});
 const heroY=useTransform(scrollYProgress,[0,.22],[0,80]);

 useEffect(()=>{
  if(reduced)return;
  const els=[...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>io.observe(el));
  return()=>io.disconnect();
 },[reduced]);


 return <div className="site">
  <a className="skipLink" href="#conteudo">Pular para o conteúdo</a>
  {!reduced&&<motion.div className="progress" style={{scaleX:progress}}/>}
  <header className="nav">
   <a href="#inicio" className="brand" aria-label="Cervejaria Rodada — início"><b>RODADA</b><small>PURO MALTE</small></a>
   <nav id="menu-principal" className={menu?'open':''} aria-label="Navegação principal">
    <a href="#chopes" onClick={()=>setMenu(false)}>Chopes</a><a href="#cervejas" onClick={()=>setMenu(false)}>Cervejas</a><a href="#eventos" onClick={()=>setMenu(false)}>Eventos</a><a href="#equipe" onClick={()=>setMenu(false)}>A Rodada</a><a href="#contato" onClick={()=>setMenu(false)}>Contato</a>
   </nav>
   <a href={wa('Olá! Gostaria de fazer um pedido na Cervejaria Rodada.')} target="_blank" rel="noreferrer" className="navCta">PEDIR PELO WHATSAPP <Arrow/></a>
   <button type="button" className="menu" onClick={()=>setMenu(!menu)} aria-label="Abrir menu" aria-expanded={menu} aria-controls="menu-principal"><i/><i/></button>
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
    <motion.div className="heroStage" style={!reduced&&!mobile?{y:heroY}:undefined}>
      <div className="orbit"/>
      <span className="ghost">PURO<br/>MALTE</span>
      <img src={img.barril} alt="Barril de Chopp Rodada" className="heroKeg" loading="eager" decoding="async" fetchPriority="high"/>
      <img src={img.pilsen} alt="PET Chopp Rodada Pilsen" className="heroPet" loading="eager" decoding="async"/>
      <img src={img.copo} alt="Copo Rodada" className="heroCup" loading="eager" decoding="async"/>
      <div className="seal">DO OESTE<br/><b>DA BAHIA</b></div>
    </motion.div>
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
            <div className="mockBottle">
              <img src={item.image} alt={item.name+' '+item.size} loading="lazy" decoding="async"/>
              <div className="mockLabel"><b>RODADA</b><small>{item.flavor}</small><em>{item.size}</em></div>
            </div>
          </div>
          <div className="variationBottom"><div><h3>{item.name}</h3><p>{item.size} · consulte disponibilidade</p></div><a className="cardAction" href={wa('Olá! Gostaria de saber mais sobre o '+item.name+' '+item.size+'.')} target="_blank" rel="noreferrer" aria-label={'Pedir '+item.name+' '+item.size+' pelo WhatsApp'}>PEDIR <Arrow/></a></div>
        </Reveal>
      ))}
    </div>
   </section>

   <section className="beerSection section" id="cervejas" aria-labelledby="cervejas-title">
    <Reveal className="sectionTitle commerceTitle">
      <div><p className="eyebrow dark">02 / CERVEJAS RODADA</p><h2 id="cervejas-title">A RODADA<br/><em>TAMBÉM EM CERVEJA.</em></h2></div>
      <div className="sectionIntro"><p>A linha de cervejas está preparada para receber novas versões, tamanhos e fotografias oficiais conforme o portfólio evoluir.</p><a href={wa('Olá! Gostaria de saber quais cervejas Rodada estão disponíveis.')} target="_blank" rel="noreferrer">Ver disponibilidade <Arrow/></a></div>
    </Reveal>
    <div className="beerGrid">
      {beerProducts.map((item,index)=>(
        <Reveal key={item.name} className={'beerCard '+item.tone}>
          <div className="beerCopy"><span>0{index+1} / 02 · {item.meta}</span><h3>{item.name}</h3><p>Uma nova forma de levar a identidade Rodada para diferentes momentos.</p><a href={wa('Olá! Gostaria de saber mais sobre a '+item.name+'.')} target="_blank" rel="noreferrer">PEDIR PELO WHATSAPP <Arrow/></a></div>
          <div className="beerVisual"><span aria-hidden="true">{item.meta}</span><img src={item.image} alt={item.name} loading="lazy" decoding="async"/></div>
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
          <img src={img.chopeira} alt="Chopeira Rodada para eventos" loading="lazy" decoding="async"/>
        </div>
        <div className="eventSolutionCopy"><h3>Chopeira Rodada</h3><p>Serviço na temperatura certa, com presença visual da marca e experiência de chopp tirado na hora.</p></div>
      </Reveal>

      <Reveal className="eventSolutionCard">
        <div className="eventSolutionMeta"><span>02</span><span>BARRIL / KEG</span></div>
        <div className="eventSolutionVisual">
          <span className="eventSolutionWord">BARRIL</span>
          <img src={img.barril} alt="Barril de chopp Rodada" loading="lazy" decoding="async"/>
        </div>
        <div className="eventSolutionCopy"><h3>Barris Rodada</h3><p>Volume para encontros maiores, festas e operações que precisam manter a Rodada fluindo por mais tempo.</p></div>
      </Reveal>

      <Reveal className="eventSolutionCard eventSolutionCombo">
        <div className="eventSolutionMeta"><span>03</span><span>SUPORTE NO EVENTO</span></div>
        <div className="eventSolutionVisual">
          <span className="eventSolutionWord">KIT</span>
          <img className="comboMachine" src={img.chopeira} alt="Chopeira Rodada" loading="lazy" decoding="async"/>
          <img className="comboKeg" src={img.barril} alt="Barril Rodada" loading="lazy" decoding="async"/>
        </div>
        <div className="eventSolutionCopy"><h3>Suporte para servir</h3><p>Estrutura preparada para operação, manutenção e troca de barris quando necessário.</p></div>
      </Reveal>

      <Reveal className="eventSolutionCard eventSolutionService">
        <div className="eventSolutionMeta"><span>04</span><span>ATENDIMENTO</span></div>
        <div className="eventSolutionVisual serviceVisual">
          <span className="eventSolutionWord">EVENTO</span>
          <div className="serviceStack" aria-hidden="true">
            <img src={img.barril} alt="" loading="lazy" decoding="async"/>
            <img src={img.barril} alt="" loading="lazy" decoding="async"/>
            <img src={img.chopeira} alt="" loading="lazy" decoding="async"/>
          </div>
        </div>
        <div className="eventSolutionCopy"><h3>Orçamento personalizado</h3><p>Conte o tipo de evento e a necessidade. A Rodada orienta a estrutura adequada e segue o atendimento pelo WhatsApp.</p></div>
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
   </section>

   <CameraJourney mobile={mobile}/>

   <section className="cold section">
    <Reveal><p className="eyebrow">04 / DESTAQUE RODADA</p><h2>GELADA.<br/>DO JEITO<br/><em>CERTO.</em></h2><p className="lead">Chopp gelado, identidade Rodada e formatos para diferentes momentos.</p><a className="coldCta" href="#chopes">VER TODOS OS CHOPES <Arrow/></a></Reveal>
    <Reveal className="coldStage"><span>1,5<small>L</small></span><div className="rings"/><img src={img.pilsen} alt="PET Rodada Pilsen" loading="lazy" decoding="async"/></Reveal>
   </section>

   <section className="lifestyle section">
    <Reveal className="sectionTitle"><div><p className="eyebrow dark">05 / FEITA PARA COMPARTILHAR</p><h2>TODA HISTÓRIA BOA<br/>COMEÇA COM <em>UMA RODADA.</em></h2></div></Reveal>
    <div className="lifeGrid">
      {mobile?<div className="lifeMain scrollPhoto"><strong>BORA<br/>BRINDAR?</strong><img src={img.people} alt="Pessoa brindando com Rodada" loading="lazy" decoding="async"/></div>:<ScrollPhoto className="lifeMain scrollPhoto"><strong>BORA<br/>BRINDAR?</strong><img src={img.people} alt="Pessoa brindando com Rodada" loading="lazy" decoding="async"/></ScrollPhoto>}
      {mobile?<div className="lifeQuote scrollPhoto"><span>MAIS<br/>MUITO</span><p>Mais encontro. Mais conversa. Mais motivo para reunir.</p></div>:<ScrollPhoto className="lifeQuote scrollPhoto"><span>MAIS<br/>MUITO</span><p>Mais encontro. Mais conversa. Mais motivo para reunir.</p></ScrollPhoto>}
      {mobile?<div className="lifeProduct scrollPhoto"><img src={img.copo} alt="Copo Rodada" loading="lazy" decoding="async"/><span>PURO MALTE · PURA RODADA</span></div>:<ScrollPhoto className="lifeProduct scrollPhoto"><img src={img.copo} alt="Copo Rodada" loading="lazy" decoding="async"/><span>PURO MALTE · PURA RODADA</span></ScrollPhoto>}
    </div>
   </section>

   <section className="team section" id="equipe">
     <Reveal className="teamCopy"><p className="eyebrow">06 / QUEM FAZ ACONTECER</p><h2>CONHEÇA<br/>NOSSA <em>EQUIPE.</em></h2><p>Por trás de cada produto Rodada existe uma equipe comprometida com qualidade, dedicação e paixão pelo que faz. Nosso trabalho é levar sabor, experiência e excelência para cada momento especial dos nossos clientes.</p><span className="signature">GENTE BOA FAZENDO UMA RODADA AINDA MELHOR.</span></Reveal>
     <Reveal className="teamPhoto"><div className="teamImageFrame">{/* Imagem demonstrativa temporária — substituir pela foto oficial da equipe quando disponível. */}<img src={img.people} alt="Imagem demonstrativa da equipe e do atendimento Rodada" loading="lazy" decoding="async"/><div><small>GENTE QUE FAZ A RODADA ACONTECER</small><strong>Qualidade, cuidado e presença em cada encontro.</strong></div></div><span>CERVEJARIA RODADA · LUÍS EDUARDO MAGALHÃES · BA</span></Reveal>
   </section>

   <section className="contact section" id="contato">
    <Reveal><p className="eyebrow dark">07 / FALE COM A RODADA</p><h2>BORA TOMAR<br/>UMA <em>RODADA?</em></h2><p>Fale com a Cervejaria Rodada para consultar produtos, barris, eventos e disponibilidade na sua região.</p></Reveal>
    <Reveal className="contactBox"><div><small>COMERCIAL</small><strong>(77) 9814-0440</strong></div><a href={wa('Olá! Gostaria de falar com a Cervejaria Rodada.')} target="_blank" rel="noreferrer">PEDIR PELO WHATSAPP <Arrow/></a><a href="mailto:contato@cervejariarodada.com.br">contato@cervejariarodada.com.br <Arrow/></a></Reveal>
   </section>
  </main>

  <a className="whatsappFloat" href={wa('Olá! Gostaria de fazer um pedido ou tirar uma dúvida sobre a Cervejaria Rodada.')} target="_blank" rel="noreferrer" aria-label="Falar com a Cervejaria Rodada pelo WhatsApp"><span>WhatsApp</span><b>↗</b></a>

  <footer className="footer section">
   <div className="footerTop"><div><div className="brand big"><b>RODADA</b><small>PURO MALTE</small></div><p>Naturalmente brasileira.<br/>Orgulhosamente do Oeste da Bahia.</p></div><div><b>EXPLORE</b><a href="#chopes">Chopes</a><a href="#cervejas">Cervejas</a><a href="#eventos">Eventos</a><a href="#equipe">A Rodada</a></div><div><b>CONTATO</b><a href="mailto:contato@cervejariarodada.com.br">E-mail</a><a href="https://www.instagram.com/cervejariarodada/" target="_blank" rel="noreferrer">Instagram ↗</a></div></div>
   <div className="footerWord">A VIDA PEDE RODADA.</div>
   <div className="footerBottom"><span>© {new Date().getFullYear()} Cervejaria Rodada Ltda.</span><b>BEBA COM MODERAÇÃO.</b><span>Conteúdo destinado a maiores de 18 anos.</span></div>
  </footer>
 </div>
}
