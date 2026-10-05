-- Canonical schema draft. Generate the versioned migration with Supabase CLI after project setup.
create extension if not exists pgcrypto;

create type public.product_category as enum ('chope','cerveja');
create type public.lead_status as enum ('novo','contatado','orcado','fechado','perdido');
create type public.admin_role as enum ('owner','editor','viewer');

create table public.beer_styles (
 id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.products (
 id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
 category public.product_category not null, beer_style_id uuid references public.beer_styles(id) on delete set null,
 packaging text, volume_ml integer check(volume_ml is null or volume_ml>0), short_description text, long_description text,
 abv numeric(5,2), ibu numeric(6,2), color_description text, tasting_notes text, aroma_notes text, ingredients text,
 serving_temperature text, pairing text, price numeric(12,2), promotional_price numeric(12,2), price_range text,
 availability_status text, sort_order integer not null default 0, featured boolean not null default false,
 published boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index products_published_order_idx on public.products(published,sort_order);

create table public.product_images (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 storage_path text not null, alt_text text not null check(length(trim(alt_text))>0), width integer, height integer,
 sort_order integer not null default 0, published boolean not null default false, created_at timestamptz not null default now()
);

create table public.keg_sizes (
 id uuid primary key default gen_random_uuid(), liters integer not null unique check(liters>0), estimated_cups integer,
 rental_price numeric(12,2), sale_price numeric(12,2), active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.event_packages (
 id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, description text,
 included_items jsonb not null default '[]'::jsonb, active boolean not null default true, sort_order integer not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.events_gallery (
 id uuid primary key default gen_random_uuid(), title text, event_date date, city text, event_type text,
 published boolean not null default false, sort_order integer not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.testimonials (
 id uuid primary key default gen_random_uuid(), name text, city text, body text not null,
 rating smallint check(rating between 1 and 5), source_url text, approved boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.team_members (
 id uuid primary key default gen_random_uuid(), name text not null, role text, photo_path text, photo_alt text,
 sort_order integer not null default 0, active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.faqs (
 id uuid primary key default gen_random_uuid(), question text not null, answer text not null, category text,
 sort_order integer not null default 0, published boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.leads (
 id uuid primary key default gen_random_uuid(), name text not null, whatsapp text not null, email text, event_date date,
 city text, event_type text, guest_count integer check(guest_count is null or guest_count>0), message text, source text,
 utm jsonb, status public.lead_status not null default 'novo', internal_notes text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index leads_status_created_idx on public.leads(status,created_at desc);

create table public.site_settings (
 id boolean primary key default true check(id=true), legal_name text, cnpj text, mapa_registration text, address text,
 latitude numeric(10,7), longitude numeric(10,7), opening_hours jsonb, phone text, whatsapp text, email text,
 social_links jsonb, delivery_area text, lead_times text, fees text, payment_methods text, story text, seo jsonb,
 updated_at timestamptz not null default now()
);

create table public.legal_pages (
 id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, body text not null,
 published boolean not null default false, updated_at timestamptz not null default now()
);

create table public.admin_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade, role public.admin_role not null default 'viewer',
 display_name text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.audit_log (
 id bigint generated always as identity primary key, actor_user_id uuid references auth.users(id) on delete set null,
 action text not null, entity_table text not null, entity_id text, old_value jsonb, new_value jsonb,
 created_at timestamptz not null default now()
);

alter table public.beer_styles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.keg_sizes enable row level security;
alter table public.event_packages enable row level security;
alter table public.events_gallery enable row level security;
alter table public.testimonials enable row level security;
alter table public.team_members enable row level security;
alter table public.faqs enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.legal_pages enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.audit_log enable row level security;

revoke all on all tables in schema public from anon,authenticated;
grant select on public.beer_styles,public.products,public.product_images,public.keg_sizes,public.event_packages,public.events_gallery,public.testimonials,public.team_members,public.faqs,public.site_settings,public.legal_pages to anon;
grant insert on public.leads to anon;
grant select,insert,update,delete on all tables in schema public to authenticated;

create policy "public published products" on public.products for select to anon using(published=true);
create policy "public published product images" on public.product_images for select to anon using(published=true);
create policy "public styles" on public.beer_styles for select to anon using(true);
create policy "public active keg sizes" on public.keg_sizes for select to anon using(active=true);
create policy "public active event packages" on public.event_packages for select to anon using(active=true);
create policy "public gallery" on public.events_gallery for select to anon using(published=true);
create policy "public testimonials" on public.testimonials for select to anon using(approved=true);
create policy "public team" on public.team_members for select to anon using(active=true);
create policy "public faqs" on public.faqs for select to anon using(published=true);
create policy "public settings" on public.site_settings for select to anon using(true);
create policy "public legal" on public.legal_pages for select to anon using(published=true);
create policy "public lead insert" on public.leads for insert to anon with check(
 length(trim(name)) between 2 and 120 and length(regexp_replace(whatsapp,'[^0-9]','','g')) between 10 and 15
);

create or replace function public.is_admin(required_roles public.admin_role[] default array['owner','editor','viewer']::public.admin_role[])
returns boolean language sql stable security invoker set search_path=public as $$
 select exists(select 1 from public.admin_profiles p where p.user_id=(select auth.uid()) and p.role=any(required_roles));
$$;

create policy "admins read profiles" on public.admin_profiles for select to authenticated using(public.is_admin());
create policy "owners manage profiles" on public.admin_profiles for all to authenticated
 using(public.is_admin(array['owner']::public.admin_role[]))
 with check(public.is_admin(array['owner']::public.admin_role[]));
create policy "owners read audit" on public.audit_log for select to authenticated
 using(public.is_admin(array['owner']::public.admin_role[]));

create policy "admins manage styles" on public.beer_styles for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage products" on public.products for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage product images" on public.product_images for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage keg sizes" on public.keg_sizes for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage event packages" on public.event_packages for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage gallery" on public.events_gallery for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage testimonials" on public.testimonials for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage team" on public.team_members for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage faqs" on public.faqs for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage leads" on public.leads for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage settings" on public.site_settings for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));
create policy "admins manage legal" on public.legal_pages for all to authenticated using(public.is_admin(array['owner','editor']::public.admin_role[])) with check(public.is_admin(array['owner','editor']::public.admin_role[]));


-- Keep updated_at correct on every mutable row.
create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path=public as $$
begin new.updated_at=now(); return new; end;
$$;

create trigger beer_styles_set_updated_at before update on public.beer_styles for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger keg_sizes_set_updated_at before update on public.keg_sizes for each row execute function public.set_updated_at();
create trigger event_packages_set_updated_at before update on public.event_packages for each row execute function public.set_updated_at();
create trigger events_gallery_set_updated_at before update on public.events_gallery for each row execute function public.set_updated_at();
create trigger testimonials_set_updated_at before update on public.testimonials for each row execute function public.set_updated_at();
create trigger team_members_set_updated_at before update on public.team_members for each row execute function public.set_updated_at();
create trigger faqs_set_updated_at before update on public.faqs for each row execute function public.set_updated_at();
create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
create trigger legal_pages_set_updated_at before update on public.legal_pages for each row execute function public.set_updated_at();
create trigger admin_profiles_set_updated_at before update on public.admin_profiles for each row execute function public.set_updated_at();
