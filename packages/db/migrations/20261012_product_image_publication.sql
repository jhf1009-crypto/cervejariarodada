-- Applied to production: an unpublished product must not expose its image records.
ALTER POLICY "public published product images" ON public.product_images
USING (published = true AND EXISTS (
 SELECT 1 FROM public.products p WHERE p.id = product_id AND p.published = true
));
