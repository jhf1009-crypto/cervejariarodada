export type CatalogProduct={
 slug:string; name:string; category:'Chopp'|'Cerveja'; style?:string; packaging:string; volume?:string; image:string; description:string;
};

export const catalog:CatalogProduct[]=[
 {slug:'chopp-lager-15-l',name:'Chopp Lager',category:'Chopp',style:'Lager',packaging:'PET',volume:'1,5 L',image:'/events/image.png',description:'Chopp Lager Rodada em PET de 1,5 L. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-pilsen-15-l',name:'Chopp Pilsen',category:'Chopp',style:'Pilsen',packaging:'PET',volume:'1,5 L',image:'/events/Garrafa%20Gelada%20de%20Cervejaria%20Rodada.png',description:'Chopp Pilsen Rodada em PET de 1,5 L. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-session-ipa-15-l',name:'Chopp Session IPA',category:'Chopp',style:'Session IPA',packaging:'PET',volume:'1,5 L',image:'/events/imagem%20generica%20chopp%201%2C5L.jpg',description:'Chopp Session IPA Rodada em PET de 1,5 L. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-lager-700-ml',name:'Chopp Lager',category:'Chopp',style:'Lager',packaging:'PET',volume:'700 ml',image:'/events/image.png',description:'Chopp Lager Rodada em PET de 700 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-pilsen-700-ml',name:'Chopp Pilsen',category:'Chopp',style:'Pilsen',packaging:'PET',volume:'700 ml',image:'/events/imagem%20generica%20chopp%20700ml.jpg',description:'Chopp Pilsen Rodada em PET de 700 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-session-ipa-700-ml',name:'Chopp Session IPA',category:'Chopp',style:'Session IPA',packaging:'PET',volume:'700 ml',image:'/events/imagem%20generica%20chopp%20700ml.jpg',description:'Chopp Session IPA Rodada em PET de 700 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'cerveja-rodada-lager',name:'Cerveja Rodada Lager',category:'Cerveja',style:'Lager',packaging:'Garrafa',volume:'600 ml',image:'',description:'Cerveja Rodada Lager em garrafa de 600 ml. Foto oficial pendente.'},
 {slug:'cerveja-rodada-pilsen',name:'Cerveja Rodada Pilsen',category:'Cerveja',style:'Pilsen',packaging:'Garrafa',volume:'600 ml',image:'',description:'Cerveja Rodada Pilsen em garrafa de 600 ml. Foto oficial pendente.'},
 {slug:'cerveja-rodada-lager-sem-gluten',name:'Cerveja Rodada Lager Sem Glúten',category:'Cerveja',style:'Lager sem glúten',packaging:'Garrafa',volume:'600 ml',image:'',description:'Cerveja Rodada Lager sem glúten em garrafa de 600 ml. Foto oficial pendente.'}
];

export const WHATSAPP='557798140440';
