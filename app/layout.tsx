import type { Metadata,Viewport } from 'next';
import '@/styles/globals.css';
export const metadata:Metadata={title:'Cervejaria Rodada | Puro malte do Oeste da Bahia',description:'Cervejaria Rodada — chopp e cerveja puro malte, do Oeste da Bahia para bons encontros.',openGraph:{title:'Cervejaria Rodada',description:'A sua festa. A nossa Rodada.',type:'website',locale:'pt_BR'}};
export const viewport:Viewport={themeColor:'#042443'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
