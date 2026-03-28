
-- Allow buyers to update their own orders (e.g. cancel from cart)
CREATE POLICY "Buyers can update own orders"
ON public.orders FOR UPDATE TO authenticated
USING (auth.uid() = buyer_id)
WITH CHECK (auth.uid() = buyer_id);
