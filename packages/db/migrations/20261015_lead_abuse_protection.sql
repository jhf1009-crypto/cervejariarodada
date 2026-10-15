-- Enforce limits at the database too, including direct anonymous REST inserts.
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS leads_phone_created_idx ON public.leads((regexp_replace(whatsapp,'[^0-9]','','g')),created_at);
CREATE OR REPLACE FUNCTION public.limit_public_leads() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF NEW.source='site:eventos' THEN
  NEW.created_at:=now();
  NEW.updated_at:=now();
  NEW.whatsapp:=regexp_replace(NEW.whatsapp,'[^0-9]','','g');
  PERFORM pg_advisory_xact_lock(hashtext('rodada-public-leads'));
  IF (SELECT count(*) FROM public.leads WHERE source='site:eventos' AND created_at>now()-interval '1 hour')>=500
   OR (SELECT count(*) FROM public.leads WHERE source='site:eventos'
    AND regexp_replace(whatsapp,'[^0-9]','','g')=regexp_replace(NEW.whatsapp,'[^0-9]','','g')
    AND created_at>now()-interval '15 minutes')>=5 THEN
   RAISE EXCEPTION 'lead_rate_limit' USING ERRCODE='P0001';
  END IF;
 END IF;
 RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.limit_public_leads() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER limit_public_leads BEFORE INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.limit_public_leads();
ALTER POLICY "public lead insert" ON public.leads WITH CHECK (
 source='site:eventos' AND status='novo' AND internal_notes IS NULL AND utm IS NULL
 AND length(trim(name)) BETWEEN 2 AND 120
 AND length(regexp_replace(whatsapp,'[^0-9]','','g')) BETWEEN 10 AND 15
 AND length(whatsapp)<=30 AND coalesce(length(email),0)<=254
 AND coalesce(length(city),0)<=120 AND coalesce(length(event_type),0)<=120
 AND coalesce(length(message),0)<=1000
 AND (guest_count IS NULL OR guest_count BETWEEN 1 AND 10000)
);
