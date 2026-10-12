import {ImageResponse} from 'next/og';
export const alt='Cervejaria Rodada — Chopp, cervejas e eventos';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function OpenGraphImage(){
 return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:80,background:'#031a30',color:'#f4cd62',fontFamily:'sans-serif'}}><div style={{display:'flex',fontSize:24,letterSpacing:6}}>CERVEJARIA RODADA · BAHIA</div><div style={{display:'flex',fontSize:112,fontWeight:800,lineHeight:1.05,marginTop:35}}>A SUA FESTA.<br/>A NOSSA RODADA.</div><div style={{display:'flex',fontSize:26,color:'#ffffff',marginTop:35}}>Chopp, cervejas e bons encontros.</div></div>,size);
}
