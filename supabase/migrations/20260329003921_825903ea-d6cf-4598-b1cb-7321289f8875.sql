-- Allow moderators to update items (for approval)
CREATE POLICY "Moderators can update all items"
ON public.items FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'moderator'));

-- Allow admins to read all user_roles
CREATE POLICY "Admins can read all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));