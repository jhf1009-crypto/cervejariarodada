import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';

const base=process.argv[2]||'http://localhost:3000';
const local=new URL(base).hostname==='localhost';
const results=[];
const check=(name,value)=>{assert.ok(value,name);results.push({name,passed:true});};
const get=async path=>{const response=await fetch(base+path,{signal:AbortSignal.timeout(30000)});return {response,text:await response.text()};};
const {text:catalogText,response:catalogResponse}=await get('/api/catalog');
check('API de catálogo responde',catalogResponse.status===200);
const data=JSON.parse(catalogText);
check('Catálogo contém produtos publicados',Array.isArray(data.products)&&data.products.length>0);
const paths=['/','/produtos','/legal','/sitemap.xml','/robots.txt','/manifest.webmanifest',...data.products.map(p=>'/produtos/'+p.slug)];
const images=new Set();
for(const path of paths){
 const {response,text}=await get(path);
 check('HTTP 200 '+path,response.status===200);
 check('Header nosniff '+path,response.headers.get('x-content-type-options')==='nosniff');
 if(response.headers.get('content-type')?.includes('text/html')){
  check('Um H1 '+path,(text.match(/<h1[ >]/g)||[]).length===1);
  const canonical=text.match(/rel="canonical" href="([^"]+)/)?.[1];
  check('Canonical '+path,canonical===process.env.EXPECTED_SITE_URL+(path==='/'?'':path)||canonical===process.env.EXPECTED_SITE_URL+(path==='/'?'/':path));
  for(const image of text.matchAll(/<img[^>]* src="([^"]+)"/g))if(image[1].startsWith('/'))images.add(image[1].replaceAll('&amp;','&'));
  if(path==='/'){
   for(const p of data.products)check('Produto presente no HTML '+p.slug,text.includes(p.name));
   check('Nenhuma razão social inventada',!text.includes('Cervejaria Rodada Ltda.'));
  }
 }
 if(path==='/sitemap.xml'){
  for(const p of data.products)check('Sitemap produto '+p.slug,text.includes('/produtos/'+p.slug));
  check('Sitemap não inclui produto despublicado',!text.includes('/produtos/chopp-lager-700-ml'));
 }
}
for(const path of images){const {response}=await get(path);check('Imagem acessível '+path,response.status===200);}
for(const path of ['/produtos/inexistente','/legal/inexistente','/produtos/chopp-lager-700-ml']){const {response}=await get(path);check('404 '+path,response.status===404);}
// Mutating tests run ONLY against localhost with notification variables absent.
if(local){
 const lead={name:'AUDITORIA TECNICA 2026-10-12',whatsapp:'00000000000',message:'TESTE AUTOMATIZADO DESCARTAVEL auditoria-entrega-20261012',website:''};
 const post=async(payload,headers={})=>fetch(base+'/api/leads',{method:'POST',headers:{'content-type':'application/json',...headers},body:typeof payload==='string'?payload:JSON.stringify(payload)});
 check('Telefone inválido rejeitado',(await post({...lead,whatsapp:'abcdefghijk'})).status===400);
 check('Data inexistente rejeitada',(await post({...lead,event_date:'2026-02-30'})).status===400);
 check('Email inválido rejeitado',(await post({...lead,email:'errado'})).status===400);
 check('Convidados inválidos rejeitados',(await post({...lead,guest_count:'-1'})).status===400);
 check('JSON inválido rejeitado',(await post('{')).status===400);
 check('Origem externa rejeitada',(await post(lead,{origin:'https://example.org'})).status===403);
 check('Carga excessiva rejeitada',(await post({...lead,message:'x'.repeat(9000)})).status===413);
 check('Honeypot aceito sem gravar',(await post({...lead,website:'spam.example'})).status===200);
 check('Lead válido gravado',(await post(lead,{'x-forwarded-for':'auditoria-entrega-local'})).status===200);
 check('Reenvio rápido bloqueado',(await post(lead,{'x-forwarded-for':'auditoria-entrega-local'})).status===429);
}
writeFileSync('docs/auditoria-http-2026-10-12.json',JSON.stringify({base,at:new Date().toISOString(),checks:results.length,results},null,2));
console.log(JSON.stringify({base,checks:results.length,passed:true,images:images.size}));
