export type ProductCategory='chope'|'cerveja';

export type PublicProductImage={
  url:string;
  alt:string;
  width:number|null;
  height:number|null;
  sortOrder:number;
};

export type PublicProduct={
  id:string;
  slug:string;
  name:string;
  category:ProductCategory;
  style:string|null;
  packaging:string|null;
  volumeMl:number|null;
  shortDescription:string|null;
  longDescription:string|null;
  abv:number|null;
  ibu:number|null;
  colorDescription:string|null;
  tastingNotes:string|null;
  aromaNotes:string|null;
  ingredients:string|null;
  servingTemperature:string|null;
  pairing:string|null;
  price:number|null;
  promotionalPrice:number|null;
  priceRange:string|null;
  availabilityStatus:string|null;
  featured:boolean;
  images:PublicProductImage[];
};

export type PublicSiteSettings={
  legalName:string|null;
  cnpj:string|null;
  mapaRegistration:string|null;
  address:string|null;
  latitude:number|null;
  longitude:number|null;
  openingHours:Record<string,unknown>|null;
  phone:string|null;
  whatsapp:string|null;
  email:string|null;
  socialLinks:Record<string,string>|null;
  deliveryArea:string|null;
  leadTimes:string|null;
  fees:string|null;
  paymentMethods:string|null;
  story:string|null;
  seo:Record<string,unknown>|null;
};

export type PublicFaq={id:string;question:string;answer:string;category:string|null};
export type PublicTeamMember={id:string;name:string;role:string|null;photoUrl:string|null;photoAlt:string|null};
export type PublicLegalPage={slug:string;title:string;body:string};

export type PublicSiteData={
  source:'database'|'fallback';
  products:PublicProduct[];
  settings:PublicSiteSettings;
  faqs:PublicFaq[];
  team:PublicTeamMember[];
  legalPages:PublicLegalPage[];
};
