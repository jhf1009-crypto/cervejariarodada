import type { Metadata,Viewport } from 'next';
import {Barlow_Condensed,Manrope} from 'next/font/google';
import '@/styles/globals.css';

const displayFont=Barlow_Condensed({subsets:['latin'],weight:['600','700','800','900'],variable:'--font-display',display:'swap'});
const bodyFont=Manrope({subsets:['latin'],weight:['400','500','600','700','800'],variable:'--font-body',display:'swap'});

const site='https://www.cervejariarodada.com.br';

export const metadata:Metadata={
 metadataBase:new URL(site),
 title:{default:'Cervejaria Rodada | Chopps, cervejas e eventos em Luís Eduardo Magalhães',template:'%s | Cervejaria Rodada'},
 description:'Chopps Lager, Pilsen e Session IPA, cervejas Rodada e estrutura com barris e chopeiras para festas e eventos em Luís Eduardo Magalhães, Bahia.',
 alternates:{canonical:'/'},
 openGraph:{
  title:'Cervejaria Rodada | Chopps, cervejas e eventos',
  description:'Conheça os chopps Rodada, a linha de cervejas e a estrutura para festas e eventos no Oeste da Bahia.',
  url:site,
  siteName:'Cervejaria Rodada',
  locale:'pt_BR',
  type:'website'
 },
 twitter:{card:'summary_large_image',title:'Cervejaria Rodada',description:'Chopps, cervejas e estrutura para eventos no Oeste da Bahia.'},
 robots:{index:true,follow:true},
 icons:{icon:'/icon.svg'}
};

export const viewport:Viewport={themeColor:'#031a30',width:'device-width',initialScale:1};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable}`}><body>{children}</body></html>
}
