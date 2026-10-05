export type CatalogProduct={
 slug:string; name:string; category:'Chope'|'Cerveja'; style?:string; packaging:string; volume?:string; image:string; description:string;
};

export const catalog:CatalogProduct[]=[
 {slug:'chopp-lager-15-l',name:'Chopp Lager',category:'Chope',style:'Lager',packaging:'PET',volume:'1,5 L',image:'/products/temp/chopp-15l-user.webp',description:'Chopp Lager Rodada em PET de 1,5 L. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-pilsen-15-l',name:'Chopp Pilsen',category:'Chope',style:'Pilsen',packaging:'PET',volume:'1,5 L',image:'/products/temp/chopp-15l-user.webp',description:'Chopp Pilsen Rodada em PET de 1,5 L. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-session-ipa-15-l',name:'Chopp Session IPA',category:'Chope',style:'Session IPA',packaging:'PET',volume:'1,5 L',image:'/placeholders/rodada-placeholder-960.webp',description:'Chopp Session IPA Rodada em PET de 1,5 L. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-lager-700-ml',name:'Chopp Lager',category:'Chope',style:'Lager',packaging:'PET',volume:'700 ml',image:'/placeholders/rodada-placeholder-960.webp',description:'Chopp Lager Rodada em PET de 700 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-pilsen-700-ml',name:'Chopp Pilsen',category:'Chope',style:'Pilsen',packaging:'PET',volume:'700 ml',image:'/placeholders/rodada-placeholder-960.webp',description:'Chopp Pilsen Rodada em PET de 700 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'chopp-session-ipa-700-ml',name:'Chopp Session IPA',category:'Chope',style:'Session IPA',packaging:'PET',volume:'700 ml',image:'/placeholders/rodada-placeholder-960.webp',description:'Chopp Session IPA Rodada em PET de 700 ml. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'cerveja-rodada-long-neck',name:'Cerveja Rodada Long Neck',category:'Cerveja',packaging:'Long neck',image:'/placeholders/rodada-placeholder-960.webp',description:'Cerveja Rodada em formato long neck. Consulte disponibilidade e condições diretamente com a equipe Rodada.'},
 {slug:'cerveja-rodada-lata',name:'Cerveja Rodada Lata',category:'Cerveja',packaging:'Lata',image:'/placeholders/rodada-placeholder-960.webp',description:'Cerveja Rodada em lata. Consulte disponibilidade e condições diretamente com a equipe Rodada.'}
];

export const WHATSAPP='557798140440';
