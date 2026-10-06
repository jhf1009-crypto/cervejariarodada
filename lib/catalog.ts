export type CatalogProduct={
 slug:string; name:string; category:'Chope'|'Cerveja'; style?:string; packaging:string; volume?:string; image:string; description:string;
};

export const catalog:CatalogProduct[]=[
 {slug:'chopp-lager-15-l',name:'Chopp Lager',category:'Chope',style:'Lager',packaging:'PET',volume:'1,5 L',image:'/events/image.png',description:'Chopp Lager Rodada em PET de 1,5 L. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-pilsen-15-l',name:'Chopp Pilsen',category:'Chope',style:'Pilsen',packaging:'PET',volume:'1,5 L',image:'/events/Garrafa%20Gelada%20de%20Cervejaria%20Rodada.png',description:'Chopp Pilsen Rodada em PET de 1,5 L. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-session-ipa-15-l',name:'Chopp Session IPA',category:'Chope',style:'Session IPA',packaging:'PET',volume:'1,5 L',image:'/events/imagem%20generica%20chopp%201%2C5L.jpg',description:'Chopp Session IPA Rodada em PET de 1,5 L. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-lager-700-ml',name:'Chopp Lager',category:'Chope',style:'Lager',packaging:'PET',volume:'700 ml',image:'/events/image.png',description:'Chopp Lager Rodada em PET de 700 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-pilsen-700-ml',name:'Chopp Pilsen',category:'Chope',style:'Pilsen',packaging:'PET',volume:'700 ml',image:'/events/imagem%20generica%20chopp%20700ml.jpg',description:'Chopp Pilsen Rodada em PET de 700 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-session-ipa-700-ml',name:'Chopp Session IPA',category:'Chope',style:'Session IPA',packaging:'PET',volume:'700 ml',image:'/events/imagem%20generica%20chopp%20700ml.jpg',description:'Chopp Session IPA Rodada em PET de 700 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'cerveja-rodada-lata',name:'Cerveja Rodada Lata',category:'Cerveja',packaging:'Lata',image:'/events/image.png',description:'Cerveja Rodada em lata. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'cerveja-lager-rodada',name:'Cerveja Lager Rodada',category:'Cerveja',style:'Lager',packaging:'Garrafa',volume:'600 ml',image:'/events/Garrafa%20Gelada%20de%20Cervejaria%20Rodada.png',description:'Cerveja Lager Rodada em garrafa de 600 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'cerveja-pilsen-rodada',name:'Cerveja Pilsen Rodada',category:'Cerveja',style:'Pilsen',packaging:'Garrafa',volume:'600 ml',image:'/events/Garrafa%20de%20Cerveja%20Dourada%20com%20Condensa%C3%A7%C3%A3o.png',description:'Cerveja Pilsen Rodada em garrafa de 600 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'}
];

export const WHATSAPP='557798140440';
