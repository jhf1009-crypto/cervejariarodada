-- Seed baseado exclusivamente no conteúdo que já existe no site atual.
-- Campos não conhecidos permanecem NULL.

insert into public.beer_styles (name,slug) values
 ('Lager','lager'),('Pilsen','pilsen'),('Session IPA','session-ipa')
on conflict (slug) do nothing;

insert into public.products (name,slug,category,beer_style_id,packaging,volume_ml,short_description,sort_order,published)
select v.name,v.slug,'chope'::public.product_category,s.id,v.packaging,v.volume_ml,null,v.sort_order,true
from (values
 ('Chopp Lager','chopp-lager-15-l','Lager','PET',1500,1),
 ('Chopp Pilsen','chopp-pilsen-15-l','Pilsen','PET',1500,2),
 ('Chopp Session IPA','chopp-session-ipa-15-l','Session IPA','PET',1500,3),
 ('Chopp Lager','chopp-lager-700-ml','Lager','PET',700,4),
 ('Chopp Pilsen','chopp-pilsen-700-ml','Pilsen','PET',700,5),
 ('Chopp Session IPA','chopp-session-ipa-700-ml','Session IPA','PET',700,6)
) as v(name,slug,style,packaging,volume_ml,sort_order)
join public.beer_styles s on s.name=v.style
on conflict (slug) do nothing;

insert into public.products (name,slug,category,packaging,sort_order,published) values
 ('Cerveja Rodada Long Neck','cerveja-rodada-long-neck','cerveja','LONG NECK',7,true),
 ('Cerveja Rodada Lata','cerveja-rodada-lata','cerveja','LATA',8,true)
on conflict (slug) do nothing;

insert into public.keg_sizes (liters,estimated_cups,rental_price,sale_price,active) values
 (30,null,null,null,true),(50,null,null,null,true)
on conflict (liters) do nothing;

insert into public.site_settings (id,phone,whatsapp,email,social_links,story)
values (
 true,
 '(77) 9814-0440',
 '557798140440',
 'contato@cervejariarodada.com.br',
 '{"instagram":"https://www.instagram.com/cervejariarodada/"}'::jsonb,
 null
)
on conflict (id) do update set
 phone=excluded.phone,whatsapp=excluded.whatsapp,email=excluded.email,social_links=excluded.social_links;
