ALTER TABLE public.items DROP CONSTRAINT items_status_check;
ALTER TABLE public.items ADD CONSTRAINT items_status_check CHECK (status IN ('active', 'inactive', 'sold', 'pending', 'rejected'));