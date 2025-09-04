
-- Create lead_magnets table
CREATE TABLE public.lead_magnets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text,
  type text NOT NULL, -- 'pdf', 'video', 'zip', 'image'
  url text NOT NULL,
  file_path text NOT NULL,
  size_bytes bigint,
  mime_type text,
  page_count integer,
  folder text,
  tags text[],
  usage_count integer DEFAULT 0,
  is_favorite boolean DEFAULT false,
  is_ai_generated boolean DEFAULT false,
  conversion_rate numeric(5, 2) DEFAULT 0.00,
  downloads integer DEFAULT 0,
  status text DEFAULT 'draft' -- 'draft', 'active', 'archived'
);

-- Enable Row Level Security
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;

-- Policies for lead_magnets
CREATE POLICY "Users can view their own lead magnets." ON public.lead_magnets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create lead magnets." ON public.lead_magnets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead magnets." ON public.lead_magnets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead magnets." ON public.lead_magnets
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_lead_magnet_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update the timestamp on each update
CREATE TRIGGER on_lead_magnet_update
  BEFORE UPDATE ON public.lead_magnets
  FOR EACH ROW EXECUTE PROCEDURE public.handle_lead_magnet_update();
