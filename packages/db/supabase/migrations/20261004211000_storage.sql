-- Rodada Storage buckets and RLS. Apply after initial schema migration.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values
 ('public-media','public-media',true,10485760,array['image/jpeg','image/png','image/webp','image/avif']),
 ('originals','originals',false,20971520,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set
 file_size_limit=excluded.file_size_limit,
 allowed_mime_types=excluded.allowed_mime_types;

create policy "public media readable"
on storage.objects for select
to anon, authenticated
using (bucket_id='public-media');

create policy "admins upload public media"
on storage.objects for insert
to authenticated
with check (bucket_id='public-media' and public.is_admin(array['owner','editor']::public.admin_role[]));

create policy "admins update public media"
on storage.objects for update
to authenticated
using (bucket_id='public-media' and public.is_admin(array['owner','editor']::public.admin_role[]))
with check (bucket_id='public-media' and public.is_admin(array['owner','editor']::public.admin_role[]));

create policy "admins delete public media"
on storage.objects for delete
to authenticated
using (bucket_id='public-media' and public.is_admin(array['owner','editor']::public.admin_role[]));

create policy "admins read originals"
on storage.objects for select
to authenticated
using (bucket_id='originals' and public.is_admin(array['owner','editor']::public.admin_role[]));

create policy "admins upload originals"
on storage.objects for insert
to authenticated
with check (bucket_id='originals' and public.is_admin(array['owner','editor']::public.admin_role[]));

create policy "admins update originals"
on storage.objects for update
to authenticated
using (bucket_id='originals' and public.is_admin(array['owner','editor']::public.admin_role[]))
with check (bucket_id='originals' and public.is_admin(array['owner','editor']::public.admin_role[]));

create policy "admins delete originals"
on storage.objects for delete
to authenticated
using (bucket_id='originals' and public.is_admin(array['owner','editor']::public.admin_role[]));
