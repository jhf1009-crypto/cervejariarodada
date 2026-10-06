import type {MetadataRoute} from 'next';
export default function manifest():MetadataRoute.Manifest{
 return {name:'Cervejaria Rodada',short_name:'Rodada',description:'Chopps, cervejas e eventos Rodada.',start_url:'/',display:'standalone',background_color:'#031a30',theme_color:'#031a30',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml'}]};
}
