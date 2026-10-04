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

const showcaseProducts=[
 {name:'Chopp 1,5L Lager',meta:'PET 1,5 L · LAGER',flavor:'LAGER',image:img.pilsen,tone:'lager'},
 {name:'Chopp 1,5L Pilsen',meta:'PET 1,5 L · PILSEN',flavor:'PILSEN',image:img.pilsen,tone:'pilsen'},
 {name:'Chopp 1,5L Session IPA',meta:'PET 1,5 L · SESSION IPA',flavor:'SESSION IPA',image:img.gold,tone:'ipa'},
 {name:'Chopp 700ml Lager',meta:'PET 700 ML · LAGER',flavor:'LAGER',image:img.pilsen,tone:'lager'},
 {name:'Chopp 700ml Pilsen',meta:'PET 700 ML · PILSEN',flavor:'PILSEN',image:img.pilsen,tone:'pilsen'},
 {name:'Chopp 700ml Session IPA',meta:'PET 700 ML · SESSION IPA',flavor:'SESSION IPA',image:img.gold,tone:'ipa'},
 {name:'Cerveja Rodada Pilsen 330ml',meta:'GARRAFA 330 ML · PILSEN',flavor:'PILSEN',image:canData,tone:'beer-pilsen'},
 {name:'Cerveja Rodada Lager 330ml',meta:'GARRAFA 330 ML · LAGER',flavor:'LAGER',image:canData,tone:'beer-lager'}
];

const products=[
 {name:'Barril Rodada',cat:'Chopp para eventos',desc:'A Rodada em escala de festa, pronta para grandes encontros.',image:img.barril,tone:'blue'},
 {name:'Chopeira Rodada',cat:'Experiência completa',desc:'O ritual do chopp tirado na hora com presença de marca.',image:img.chopeira,tone:'steel'},
 {name:'PET Rodada Pilsen',cat:'1,5 L · Puro malte',desc:'Refrescância e praticidade para dividir a Rodada.',image:img.pilsen,tone:'ice'},
 {name:'Rodada Gold',cat:'Session IPA',desc:'Mais personalidade para quem busca uma Rodada diferente.',image:img.gold,tone:'gold'},
 {name:'Chopp Rodada Lager',cat:'PET · Lager',desc:'Leve, gelada e feita para acompanhar a mesa do começo ao fim.',image:img.pilsen,tone:'lager',companion:true},
 {name:'Cerveja Rodada Lata',cat:'355 ml · Pilsen',desc:'A experiência Rodada em uma versão prática para qualquer ocasião.',image:canData,tone:'can'}
];

function Arrow(){return <span aria-hidden>↗</span>}
function Reveal({children,className=''}:{children:React.ReactNode,className?:string}){return <div data-reveal className={className}>{children}</div>}

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
        <img src={img.pilsen} alt=""/>
        <span>PILSEN</span>
      </motion.div>
      <motion.div className="cameraProduct cameraIpa" style={{x:safe(ipaX,70),y:safe(ipaY,0),scale:safe(ipaScale,.82),rotate:safe(ipaRotate,8),opacity:safe(ipaOpacity,.45)}}>
        <img src={img.gold} alt=""/>
        <span>SESSION IPA</span>
      </motion.div>
      <motion.div className="cameraProduct cameraLager" style={{x:safe(lagerX,-70),y:safe(lagerY,0),scale:safe(lagerScale,.82),rotate:safe(lagerRotate,-4),opacity:safe(lagerOpacity,.45)}}>
        <img src={img.pilsen} alt=""/>
        <img className="cameraGlass" src={img.copo} alt=""/>
        <span>LAGER</span>
      </motion.div>
    </div>

    <div className="cameraCopy">
      <motion.div className="cameraChapter" style={{opacity:safe(copy1,1)}}>
        <small>01 / PILSEN</small><h2>LEVEZA QUE<br/><em>PEDE MAIS UMA.</em></h2><p>O clássico da Rodada entra em cena primeiro: fresco, direto e feito para compartilhar.</p>
      </motion.div>
      <motion.div className="cameraChapter" style={{opacity:safe(copy2,0)}}>
        <small>02 / SESSION IPA</small><h2>MAIS AROMA.<br/><em>MAIS PRESENÇA.</em></h2><p>A câmera aproxima a Gold para revelar uma Rodada com personalidade e um perfil mais intenso.</p>
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
        <img src={img.pilsen} alt=""/>
        <span>PILSEN</span>
      </motion.div>
      <motion.div className="cameraProduct cameraIpa" style={{opacity:ipaOpacity,scale:ipaScale}}>
        <img src={img.gold} alt=""/>
        <span>SESSION IPA</span>
      </motion.div>
      <motion.div className="cameraProduct cameraLager" style={{opacity:lagerOpacity,scale:lagerScale}}>
        <img src={img.pilsen} alt=""/>
        <img className="cameraGlass" src={img.copo} alt=""/>
        <span>LAGER</span>
      </motion.div>
    </div>
    <div className="cameraCopy">
      <motion.div className="cameraChapter" style={{opacity:pilsenOpacity}}><small>01 / PILSEN</small><h2>LEVEZA QUE<br/><em>PEDE MAIS UMA.</em></h2><p>O clássico da Rodada entra em cena primeiro: fresco, direto e feito para compartilhar.</p></motion.div>
      <motion.div className="cameraChapter" style={{opacity:ipaOpacity}}><small>02 / SESSION IPA</small><h2>MAIS AROMA.<br/><em>MAIS PRESENÇA.</em></h2><p>A câmera aproxima a Gold para revelar uma Rodada com personalidade e um perfil mais intenso.</p></motion.div>
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
 const [active,setActive]=useState(0);
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

 const p=products[active];
 const next=()=>setActive(v=>(v+1)%products.length);
 const prev=()=>setActive(v=>(v+products.length-1)%products.length);

 return <div className="site">
  {!reduced&&<motion.div className="progress" style={{scaleX:progress}}/>}
  <header className="nav">
   <a href="#inicio" className="brand" aria-label="Rodada início"><b>RODADA</b><small>PURO MALTE</small></a>
   <nav className={menu?'open':''}>
    <a href="#rodada" onClick={()=>setMenu(false)}>A Rodada</a><a href="#produtos" onClick={()=>setMenu(false)}>Produtos</a><a href="#linha" onClick={()=>setMenu(false)}>Linha completa</a><a href="#equipe" onClick={()=>setMenu(false)}>Equipe</a><a href="#contato" onClick={()=>setMenu(false)}>Contato</a>
   </nav>
   <a href="#contato" className="navCta">PEDIR AGORA <Arrow/></a>
   <button className="menu" onClick={()=>setMenu(!menu)} aria-label="Abrir menu"><i/><i/></button>
  </header>

  <main>
   <section className="hero" id="inicio">
    <div className="heroNoise"/>
    <div className="heroCopy">
     <p className="eyebrow">NATURALMENTE BRASILEIRA</p>
     <h1>A SUA FESTA.<br/>A NOSSA<br/><span>RODADA.</span></h1>
     <p className="lead">Chopp puro malte do Oeste da Bahia, feito para transformar bons encontros em grandes momentos.</p>
     <div className="actions"><a href="#contato" className="primary">GARANTA A SUA RODADA <Arrow/></a><a href="#linha" className="secondary">Conheça a linha completa ↓</a></div>
    </div>
    <motion.div className="heroStage" style={!reduced&&!mobile?{y:heroY}:undefined}>
      <div className="orbit"/>
      <span className="ghost">PURO<br/>MALTE</span>
      <img src={img.barril} alt="Barril de Chopp Rodada" className="heroKeg"/>
      <img src={img.pilsen} alt="PET Chopp Rodada Pilsen" className="heroPet"/>
      <img src={img.copo} alt="Copo Rodada" className="heroCup"/>
      <div className="seal">DO OESTE<br/><b>DA BAHIA</b></div>
    </motion.div>
    <div className="heroFoot"><span>↓ A próxima Rodada começa aqui</span><span>BEBA COM MODERAÇÃO.</span></div>
   </section>

   <section className="event section">
     <Reveal className="eventVisual"><div className="disc"/><img src={img.chopeira} alt="Chopeira Rodada"/><img src={img.barril} alt="Barril Rodada"/></Reveal>
     <Reveal className="eventCopy"><p className="eyebrow">02 / CHOPP PARA CELEBRAR</p><h2>A FESTA COMEÇA<br/>NO PRIMEIRO<br/><em>COPO.</em></h2><p>Você reúne a turma. A gente entra com a Rodada.</p><div className="chips"><span>Churrascos</span><span>Aniversários</span><span>Confraternizações</span><span>Eventos</span></div><a className="primary" href="#contato">GARANTA SEU BARRIL <Arrow/></a></Reveal>
   </section>

   <section className="products section" id="produtos">
    <Reveal className="sectionTitle"><div><p className="eyebrow dark">03 / ENCONTRE SEU SABOR</p><h2>CONHEÇA<br/>A <em>RODADA.</em></h2></div><p>Duas personalidades.<br/>O mesmo convite para brindar.</p></Reveal>
    <div className="variationGrid" aria-label="Variações Rodada">
      {showcaseProducts.map((item,index)=>(
        <Reveal key={item.name} className={'variationCard '+item.tone}>
          <div className="variationTop"><span>{String(index+1).padStart(2,'0')} / 08</span><span>{item.meta}</span></div>
          <div className="variationVisual">
            <span className="variationFlavor" aria-hidden="true">{item.flavor}</span>
            <div className="mockBottle">
              <img src={item.image} alt={'Mockup fictício de '+item.name}/>
              <div className="mockLabel"><b>RODADA</b><small>{item.flavor}</small><em>{item.meta.includes('700')?'700 ML':item.meta.includes('330')?'330 ML':'1,5 L'}</em></div>
            </div>
          </div>
          <div className="variationBottom"><div><h3>{item.name}</h3><p>Mockup conceitual para apresentação da linha.</p></div><Arrow/></div>
        </Reveal>
      ))}
    </div>
   </section>

   <section className="eventSolutions section" id="chopp-eventos">
    <Reveal className="eventSolutionsHead">
      <div>
        <p className="eyebrow">04 / CHOPP PARA EVENTOS</p>
        <h2>ESTRUTURA PARA<br/><em>SERVIR EM GRANDE.</em></h2>
      </div>
      <p>Para festas, confraternizações e eventos, a Rodada também entra com a estrutura certa: barris, chopeiras e soluções completas para servir chopp gelado do começo ao fim.</p>
    </Reveal>

    <div className="eventSolutionsGrid">
      <Reveal className="eventSolutionCard eventSolutionHero">
        <div className="eventSolutionMeta"><span>01</span><span>CHOPEIRA RODADA</span></div>
        <div className="eventSolutionVisual">
          <span className="eventSolutionWord">CHOPEIRA</span>
          <img src={img.chopeira} alt="Chopeira Rodada para eventos"/>
        </div>
        <div className="eventSolutionCopy"><h3>Chopeira Rodada</h3><p>Serviço na temperatura certa, com presença visual da marca e experiência de chopp tirado na hora.</p></div>
      </Reveal>

      <Reveal className="eventSolutionCard">
        <div className="eventSolutionMeta"><span>02</span><span>BARRIL / KEG</span></div>
        <div className="eventSolutionVisual">
          <span className="eventSolutionWord">BARRIL</span>
          <img src={img.barril} alt="Barril de chopp Rodada"/>
        </div>
        <div className="eventSolutionCopy"><h3>Barris Rodada</h3><p>Volume para encontros maiores, festas e operações que precisam manter a Rodada fluindo por mais tempo.</p></div>
      </Reveal>

      <Reveal className="eventSolutionCard eventSolutionCombo">
        <div className="eventSolutionMeta"><span>03</span><span>KIT COMPLETO</span></div>
        <div className="eventSolutionVisual">
          <span className="eventSolutionWord">KIT</span>
          <img className="comboMachine" src={img.chopeira} alt="Chopeira Rodada"/>
          <img className="comboKeg" src={img.barril} alt="Barril Rodada"/>
        </div>
        <div className="eventSolutionCopy"><h3>Chopeira + Barril</h3><p>Conjunto completo para levar a experiência Rodada pronta para servir em festas e confraternizações.</p></div>
      </Reveal>

      <Reveal className="eventSolutionCard eventSolutionService">
        <div className="eventSolutionMeta"><span>04</span><span>GRANDES EVENTOS</span></div>
        <div className="eventSolutionVisual serviceVisual">
          <span className="eventSolutionWord">EVENTO</span>
          <div className="serviceStack" aria-hidden="true">
            <img src={img.barril} alt=""/>
            <img src={img.barril} alt=""/>
            <img src={img.chopeira} alt=""/>
          </div>
        </div>
        <div className="eventSolutionCopy"><h3>Estrutura para eventos</h3><p>Uma solução visual e operacional pensada para eventos maiores, com múltiplos pontos de serviço e mais capacidade.</p></div>
      </Reveal>
    </div>

    <Reveal className="eventSolutionsCta">
      <div><small>VAI FAZER UM EVENTO?</small><strong>Monte a estrutura ideal para a sua Rodada.</strong></div>
      <a href="#contato" className="primary">CONSULTAR DISPONIBILIDADE <Arrow/></a>
    </Reveal>
   </section>

   <CameraJourney mobile={mobile}/>

   <section className="catalog section" id="linha">
    <Reveal className="catalogHead"><div><p className="eyebrow">04 / LINHA COMPLETA</p><h2>TODAS AS<br/>VERSÕES DA <em>RODADA.</em></h2></div><p>Do barril à lata, uma Rodada para cada encontro. Escolha uma versão e descubra o que combina com o seu momento.</p></Reveal>
    <Reveal className="catalogStage">
      <div className={'productStage '+p.tone}>
       <div className="stageMeta"><span>0{active+1} / 06</span><b>{p.cat}</b></div>
       <span className="stageWord">{p.name.split(' ')[1]?.toUpperCase()||'RODADA'}</span>
       <div className="stageProduct">
        <img key={p.image} src={p.image} alt={p.name}/>
        {p.companion&&<img className="companion" src={img.copo} alt="Copo Rodada"/>}
       </div>
      </div>
      <div className="productInfo">
       <div className="counter">0{active+1}<small>/06</small></div>
       <motion.div key={p.name} initial={{opacity:0,y:20,filter:'blur(6px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{duration:.45}}>
        <p className="eyebrow dark">{p.cat}</p><h3>{p.name}</h3><p>{p.desc}</p>
       </motion.div>
       <a href="#contato" className="infoLink">ENCONTRAR MINHA RODADA <Arrow/></a>
       <div className="catalogControls"><button onClick={prev} aria-label="Produto anterior">←</button><div><i style={{width:String(((active+1)/6)*100)+'%'}}/></div><button onClick={next} aria-label="Próximo produto">→</button></div>
      </div>
    </Reveal>
    <Reveal className="tabs">{products.map((x,i)=><button key={x.name} onClick={()=>setActive(i)} className={i===active?'active':''}><span>0{i+1}</span><b>{x.name}</b><small>{x.cat}</small></button>)}</Reveal>
   </section>

   <section className="cold section">
    <Reveal><p className="eyebrow">05 / CHOPP RODADA PILSEN</p><h2>GELADA.<br/>DO JEITO<br/><em>CERTO.</em></h2><p className="lead">1,5 litro de chopp puro malte.<br/>Abra espaço para bons momentos.</p></Reveal>
    <Reveal className="coldStage"><span>1,5<small>L</small></span><div className="rings"/><img src={img.pilsen} alt="PET Rodada Pilsen"/></Reveal>
   </section>

   <section className="lifestyle section">
    <Reveal className="sectionTitle"><div><p className="eyebrow dark">06 / FEITA PARA COMPARTILHAR</p><h2>TODA HISTÓRIA BOA<br/>COMEÇA COM <em>UMA RODADA.</em></h2></div></Reveal>
    <div className="lifeGrid">
      {mobile?<div className="lifeMain scrollPhoto"><strong>BORA<br/>BRINDAR?</strong><img src={img.people} alt="Pessoa brindando com Rodada"/></div>:<ScrollPhoto className="lifeMain scrollPhoto"><strong>BORA<br/>BRINDAR?</strong><img src={img.people} alt="Pessoa brindando com Rodada"/></ScrollPhoto>}
      {mobile?<div className="lifeQuote scrollPhoto"><span>MAIS<br/>MUITO</span><p>Mais encontro. Mais conversa. Mais motivo para reunir.</p></div>:<ScrollPhoto className="lifeQuote scrollPhoto"><span>MAIS<br/>MUITO</span><p>Mais encontro. Mais conversa. Mais motivo para reunir.</p></ScrollPhoto>}
      {mobile?<div className="lifeProduct scrollPhoto"><img src={img.copo} alt="Copo Rodada"/><span>PURO MALTE · PURA RODADA</span></div>:<ScrollPhoto className="lifeProduct scrollPhoto"><img src={img.copo} alt="Copo Rodada"/><span>PURO MALTE · PURA RODADA</span></ScrollPhoto>}
    </div>
   </section>

   <section className="team section" id="equipe">
     <Reveal className="teamCopy"><p className="eyebrow">07 / QUEM FAZ ACONTECER</p><h2>CONHEÇA<br/>NOSSA <em>EQUIPE.</em></h2><p>Por trás de cada produto Rodada existe uma equipe comprometida com qualidade, dedicação e paixão pelo que faz. Nosso trabalho é levar sabor, experiência e excelência para cada momento especial dos nossos clientes.</p><span className="signature">GENTE BOA FAZENDO UMA RODADA AINDA MELHOR.</span></Reveal>
     <Reveal className="teamPhoto"><div className="photoPlaceholder"><div className="photoOrbit"/><b>RODADA</b><strong>FOTO DA EQUIPE</strong><p>Espaço preparado para receber o registro oficial da equipe Rodada.</p><small>IMAGEM HORIZONTAL · 16:10 OU 3:2</small></div><span>CERVEJARIA RODADA · OESTE DA BAHIA</span></Reveal>
   </section>

   <section className="contact section" id="contato">
    <Reveal><p className="eyebrow dark">08 / A PRÓXIMA É COM VOCÊ</p><h2>BORA TOMAR<br/>UMA <em>RODADA?</em></h2><p>Fale com a Cervejaria Rodada para consultar produtos, barris, eventos e disponibilidade na sua região.</p></Reveal>
    <Reveal className="contactBox"><div><small>COMERCIAL</small><strong>(77) 9814-0440</strong></div><a href="https://wa.me/557798140440" target="_blank" rel="noreferrer">CHAMAR NO WHATSAPP <Arrow/></a><a href="mailto:contato@cervejariarodada.com.br">contato@cervejariarodada.com.br <Arrow/></a></Reveal>
   </section>
  </main>

  <footer className="footer section">
   <div className="footerTop"><div><div className="brand big"><b>RODADA</b><small>PURO MALTE</small></div><p>Naturalmente brasileira.<br/>Orgulhosamente do Oeste da Bahia.</p></div><div><b>EXPLORE</b><a href="#rodada">A Rodada</a><a href="#linha">Linha completa</a><a href="#equipe">Equipe</a></div><div><b>CONTATO</b><a href="mailto:contato@cervejariarodada.com.br">E-mail</a><a href="https://www.instagram.com/cervejariarodada/" target="_blank" rel="noreferrer">Instagram ↗</a></div></div>
   <div className="footerWord">A VIDA PEDE RODADA.</div>
   <div className="footerBottom"><span>© {new Date().getFullYear()} Cervejaria Rodada Ltda.</span><b>BEBA COM MODERAÇÃO.</b><span>Conteúdo destinado a maiores de 18 anos.</span></div>
  </footer>
 </div>
}
