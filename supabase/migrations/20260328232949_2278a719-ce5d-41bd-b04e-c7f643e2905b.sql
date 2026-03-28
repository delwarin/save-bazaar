
-- Drop the trigger first (correct name)
DROP TRIGGER IF EXISTS on_first_admin_assignment ON public.profiles;
-- Now drop the function
DROP FUNCTION IF EXISTS public.handle_first_admin();

-- Ensure triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Allow admins to manage roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin self-registration with secret code
CREATE OR REPLACE FUNCTION public.register_admin(_user_id uuid, _secret text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _secret != 'OPOCHOY-ADMIN-2026' THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
