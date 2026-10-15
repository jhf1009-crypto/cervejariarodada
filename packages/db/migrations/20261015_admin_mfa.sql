-- Keep own-profile SELECT available for enrollment; sensitive policies require aal2.
CREATE OR REPLACE FUNCTION public.is_admin(required_roles public.admin_role[] DEFAULT ARRAY['owner','editor','viewer']::public.admin_role[])
RETURNS boolean LANGUAGE sql STABLE SET search_path=public AS $$
 SELECT coalesce((SELECT auth.jwt()->>'aal'),'aal1')='aal2'
 AND EXISTS(SELECT 1 FROM public.admin_profiles p WHERE p.user_id=(SELECT auth.uid()) AND p.role=ANY(required_roles));
$$;
CREATE OR REPLACE FUNCTION public.is_owner() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT coalesce((SELECT auth.jwt()->>'aal'),'aal1')='aal2'
 AND EXISTS(SELECT 1 FROM public.admin_profiles WHERE user_id=(SELECT auth.uid()) AND role='owner'::public.admin_role);
$$;
REVOKE EXECUTE ON FUNCTION public.is_owner() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;
