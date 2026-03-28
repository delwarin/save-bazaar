
-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload item images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'item-images');

-- Allow public read
CREATE POLICY "Anyone can view item images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'item-images');

-- Allow owners to delete their images
CREATE POLICY "Users can delete own item images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'item-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Add images array column to items
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';
