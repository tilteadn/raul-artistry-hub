-- Add sales-related fields to artworks table
ALTER TABLE public.artworks 
ADD COLUMN IF NOT EXISTS for_sale boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS sale_type text DEFAULT 'none' CHECK (sale_type IN ('none', 'original', 'print', 'both')),
ADD COLUMN IF NOT EXISTS original_price decimal(10,2),
ADD COLUMN IF NOT EXISTS print_price decimal(10,2),
ADD COLUMN IF NOT EXISTS original_available boolean DEFAULT true;

-- Create index for store queries
CREATE INDEX IF NOT EXISTS idx_artworks_for_sale ON public.artworks(for_sale);
CREATE INDEX IF NOT EXISTS idx_artworks_sale_type ON public.artworks(sale_type);